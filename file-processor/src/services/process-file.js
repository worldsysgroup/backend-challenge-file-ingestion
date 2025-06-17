const readline = require('readline');
const { connectDb, closeDb } = require('../db/connection');
const { insertBatch } = require('../db/clientRepository');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

function isValidDate(str) {
  if (!str || str === '0000-00-00' || str === '99/99/9999') return false;
  const date = new Date(str);
  return !isNaN(date.getTime());
}

function isBooleanString(str) {
  return str === 'true' || str === 'false';
}

async function processFileFromS3Batch(batchSize = 500) {
  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: process.env.S3_KEY,
  };

  let rl;
  try {
    const data = await s3.send(new GetObjectCommand(params));
    rl = readline.createInterface({ input: data.Body, crlfDelay: Infinity });
  } catch (err) {
    console.error('Error fetching file from S3:', err);
    return;
  }

  const pool = await connectDb();
  let batch = [];
  let lineCount = 0;
  let corruptLines = 0;

  try {
    for await (const line of rl) {
      const fields = line.split('|');
      lineCount++;

      if (fields.length !== 7 || fields.some(f => f.trim() === '')) {
        corruptLines++;
        continue;
      }

      const [nombre, apellido, dni, estado, fechaIngreso, esPep, esSujetoObligado] = fields;

      if (
        nombre.length > 100 ||
        apellido.length > 100 ||
        !isValidDate(fechaIngreso) ||
        !isBooleanString(esPep) ||
        !isBooleanString(esSujetoObligado)
      ) {
        corruptLines++;
        continue;
      }

      batch.push([nombre, apellido, dni, estado, fechaIngreso, esPep, esSujetoObligado]);

      if (batch.length >= batchSize) {
        await insertBatch(pool, batch);
        batch = [];
      }

      if (lineCount % 10000 === 0) {
        console.log(`Processed ${lineCount} lines so far...`);
      }
    }

    if (batch.length > 0) {
      await insertBatch(pool, batch);
    }

    console.log('S3 batch processing finished.');
    console.log(`Total lines processed: ${lineCount}`);
    console.log(`Corrupt lines found: ${corruptLines}`);
  } catch (err) {
    console.error('Error processing file:', err);
  } finally {
    await closeDb();
  }
}

module.exports = {
  processFileFromS3Batch,
};
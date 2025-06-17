const sql = require('mssql');
const config = require('./sqlConfig');

async function connectDb() {
  console.log('Connecting to SQL Server...');
  try {
    const pool = await sql.connect(config);
    console.log('SQL connection established.');
    return pool;
  } catch (err) {
    console.error('SQL connection error:', err);
    throw err;
  }
}

async function closeDb() {
  try {
    await sql.close();
  } catch (err) {
    console.error('SQL close error:', err);
  }
}

module.exports = {
  connectDb,
  closeDb,
};
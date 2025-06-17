const express = require('express');
const app = express();
const { processFileFromS3Batch } = require('./services/process-file');

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/metrics', (req, res) => {
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();

  res.json({
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`,
    },
    cpu: {
      user: cpu.user,
      system: cpu.system
    }
  });
});

app.post('/process', async (req, res) => {
  try {
    await processFileFromS3Batch(1000);
    res.status(200).send('Process finished successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing file.');
  }
});

module.exports = app;
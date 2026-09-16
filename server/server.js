const app = require('./app');
const { initDatabase } = require('./config/db');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Initialize Database
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 EventHub Backend Server Running on Port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Failed to start EventHub server:', error);
    process.exit(1);
  }
};

startServer();

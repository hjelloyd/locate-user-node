module.exports = (settings) => {
  const defaultSettings = {
    PORT: 3000,
    LOG_FILE_NAME: 'logOutput.log',
    LOGGING_LEVEL: 'debug',
    NODE_ENV: 'development',
  }

  return { ...defaultSettings, ...settings};
};

module.exports = {
  apps: [{
    name: 'AVIER',
    namespace: 'site',
    script: 'server.js',
    log_date_format: 'DD/MM HH:mm:ss',
    restart_delay: 1500,
    exp_backoff_restart_delay: 100,
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: 'postgres://login:password@localhost:5432/avier',
      SECRET_KEY: '',
      AWS_ACCESS_KEY_ID: '',
      AWS_SECRET_ACCESS_KEY: '',
      AWS_BUCKET_NAME: '',
    },
  }],
};

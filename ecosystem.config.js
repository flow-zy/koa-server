module.exports = {
  apps: [
    {
      name: 'rac-admin',
      script: 'dist/app.js',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        MYSQL_DB: 'rac',
        MYSQL_HOST: 'localhost',
        MYSQL_USER: 'root',
        MYSQL_PWD: '123456',
        APP_PORT: 8686,
        JWT_SECRET: 'flow_secret_key',
        AES_KEY: 'secret-key',
        AES_IV: 'iv-key',
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: 'your-redis-password',
        REDIS_DB: 0
      },
      env_production: {
        NODE_ENV: 'production',
        MYSQL_DB: process.env.MYSQL_DB,
        MYSQL_HOST: process.env.MYSQL_HOST,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_PWD: process.env.MYSQL_PWD,
        APP_PORT: process.env.APP_PORT,
        JWT_SECRET: process.env.JWT_SECRET,
        AES_KEY: process.env.AES_KEY,
        AES_IV: process.env.AES_IV,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        REDIS_DB: process.env.REDIS_DB
      }
    }
  ]
}
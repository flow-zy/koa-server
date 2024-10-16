const config = {
  server: {
    port: process.env.SERVER_PORT,
  },
  db: {
    db_host: process.env.DATABASE_HOST,
    db_name: process.env.DATABASE_NAME,
    db_user: process.env.DATABASE_USER,
    db_password: process.env.DATABASE_PASSWORD,
    db_port: process.env.DATABASE_PORT,
  },
};

export default config;
export const swaggerDoc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: `localhost:${process.env.SERVER_PORT}`,
};

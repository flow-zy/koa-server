// const dotenv = require('dotenv');
import dotenv from 'dotenv'

dotenv.config()

// module.exports = process.env;

export default process.env
export const white_list = [
  /^\/static/,
  /^\/login/,
  /^\/register/,
  /^\/upload/,
  /^\/apidocs/,
  /^\/swagger-json/,
]

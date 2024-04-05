const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'medicine',
  password: 'Zarrar123!',
  port: 5432,
});
module.exports = pool;
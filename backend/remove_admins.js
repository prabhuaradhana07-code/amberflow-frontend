require('dotenv').config();
const pool = require('./db');

async function updateRoles() {
  try {
    await pool.query("UPDATE users SET role = 'customer' WHERE email IN ('test_customer2@example.com', 'admin123@gmail.com')");
    console.log('Successfully demoted users to customer.');
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
updateRoles();

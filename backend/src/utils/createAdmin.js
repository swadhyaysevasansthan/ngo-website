import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const createAdmin = async () => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const email    = process.env.ADMIN_EMAIL;

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if admin already exists
    const existing = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);

    if (existing.rows.length > 0) {
      // Update existing admin
      await pool.query(
        'UPDATE admins SET password_hash = $1, email = $2 WHERE username = $3',
        [passwordHash, email, username]
      );
      console.log('✅ Admin account updated!');
    } else {
      // Create new admin
      await pool.query(
        'INSERT INTO admins (username, password_hash, email) VALUES ($1, $2, $3)',
        [username, passwordHash, email]
      );
      console.log('✅ Admin account created!');
    }

    console.log('\nLogin Credentials:');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

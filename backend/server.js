const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 1. Configure your PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'esemenynaplodigit',   // <-- Keep your database name here
  password: 'x', // <-- Keep your password here
  port: 5432,
});

// 2. Connect AND immediately print the "User" table in Command Prompt
pool.connect(async (err, client, release) => {
  if (err) {
    return console.error('Error connecting to PostgreSQL:', err.message);
  }
  console.log('Successfully connected to local PostgreSQL database!\n');

  try {
    const result = await client.query('SELECT * FROM "User"');
    console.log('Query successful! Found ${result.rowCount} rows in "User":');
    
    // Prints a clean visual table directly in cmd
    console.table(result.rows);
    
    // Also prints the full raw objects in case console.table truncates long columns
    console.log(result.rows);
  } catch (queryErr) {
    console.error('Error running query:', queryErr.message);
  } finally {
    release();
  }
});

// 3. Route to view the data in your browser at http://localhost:3000/api/rows
app.get('/api/rows', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "User"');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Database query failed' });
  }
});


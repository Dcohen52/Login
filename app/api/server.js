const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3001;

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT || '5432', 10),
// });

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "login_test_db",
  password: "56041361Dc",
  port: 5432,
});


console.log(process.env.DB_USER, process.env.DB_HOST, process.env.DB_NAME, process.env.DB_PORT);

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Server is working' });
});

app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: `Error fetching data: ${error}` });
  }
});


app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: `Error fetching data: ${error}` });
  }
});

app.post('/register', async (req, res) => {
  console.log(req.body); // Log the request body
  try {
    const { name, username, email, password } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, username, email, password]
    );
    res.status(201).json(rows);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: `Error inserting data: ${error}` });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

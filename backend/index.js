const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // The port where the server lives

// Middleware (Security & Data Parsing)
app.use(cors());
app.use(bodyParser.json());

// 1. A Simple Test Route (GET)
// If you visit http://localhost:3000/ in a browser, this runs.
app.get('/', (req, res) => {
  res.send('Raaibar Server is Running...');
});

// 2. The Login Route (POST)
// The app will send data here.
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log(`Login attempt: ${username}`);

  // DUMMY LOGIC (We will add a Database later)
  if (username === 'Mayank' && password === '123456') {
    // Success Response
    res.status(200).json({ 
      success: true, 
      message: 'Login Successful', 
      user: { name: 'Mayank', role: 'Admin' } 
    });
  } else {
    // Failure Response
    res.status(401).json({ 
      success: false, 
      message: 'Invalid Credentials' 
    });
  }
});

// Start the Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
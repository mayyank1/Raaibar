const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // The port where the server lives

// Middleware (Security & Data Parsing)
app.use(cors());
app.use(bodyParser.json());

//Test Route (GET)
app.get('/', (req, res) => {
  res.send('Raaibar Server is Running...');
});

// Login Route (POST)
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
  } 
  else {
    // Failure Response
    res.status(401).json({ 
      success: false, 
      message: 'Invalid Credentials' 
    });
  }
});

// Receive a message from the phone
app.post('/messages',(req,res) => {
  const {sender,text} = req.body;

  console.log(`NEW MESSAGE from ${sender}: ${text}`);

  //in future we will store this in database
  //for now just say message received
  res.status(201).json({
    success:true,
    message:"Server received it!"
  })
})

// Mock Data (Later this will come from a Database)
const MOCK_MESSAGES = [
  { id: '1', sender: 'Admin', text: 'Welcome to Raaibar Security.', time: '10:00 AM' },
  { id: '2', sender: 'System', text: 'Your account was created successfully.', time: '10:05 AM' },
  { id: '3', sender: 'Rahul', text: 'Hey, are you done with the project?', time: '11:30 AM' },
  { id: '4', sender: 'Papa', text: 'Call me when you are free.', time: '1:00 PM' },
];

// GET Messages Route
app.get('/messages', (req, res) => {
  res.status(200).json(MOCK_MESSAGES);
});



// Start the Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT} --- WITH MESSAGES ROUTE`);
});
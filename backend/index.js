const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // The port where the server lives

// Middleware (Security & Data Parsing)
app.use(cors());
app.use(bodyParser.json());

let GLOBAL_CHAT_HISTORY = [
  {id:'1',sender:'Admin',text:'Welcome to Raaibar Security.',time:'10:00 AM'},
  {id:'2',sender:'Rahul',text:'Are you working on the project?',time:'11:30 AM'},
];

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


//GET Route: Send the whole chat history to the phone
app.get('/messages',(req,res)=>{
  res.status(200).json(GLOBAL_CHAT_HISTORY);
});

// POST Route:Save new message to chat history
app.post('/messages',(req,res)=>{
  const {sender,text} = req.body;

  // Create new message object
  const newMessage = {
    id: Date.now().toString(),
    sender: sender,
    text: text,
    time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
  };

  //Save it to global chat history array
  GLOBAL_CHAT_HISTORY.push(newMessage);

  console.log(`NEW MESSAGE from ${sender}: ${text}`);
  console.log("Updated History Size:", GLOBAL_CHAT_HISTORY.length);

  res.status(201).json({
    success: true,
    message: "Message saved to memory!"
  });
  
})


// Start the Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT} --- WITH MESSAGES ROUTE`);
});
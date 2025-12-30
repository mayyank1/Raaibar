const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000; // The port where the server lives

// Middleware (Security & Data Parsing)
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/raaibarDB')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

//USER schema(stores username & password)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

//create the user model
const User = mongoose.model('User', userSchema);

//Define Message Schema
const messageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  time: String, //store readable time
  createdAt: { type: Date, default: Date.now } //auto-date for sorting
})

//create the message model
const Message = mongoose.model('Message', messageSchema);

//Test Route (GET) 
app.get('/', (req, res) => {
  res.send('Raaibar Server is Running...');
});

app.post('/signup', async(req,res) => {
  const {username,password} = req.body;

  try{
    //check if user already exists
    const existingUser = await User.findOne({username});
    if(existingUser){
      return res.status(400).json({
        success: false,
        message: "Username already taken"
      });
    }

    //create new user
    const newUser = new User({username,password});
    await newUser.save();

    console.log(`NEW USER REGISTERED: ${username}`);
    res.status(201).json({
      success:true,
      message: "User registered successfully"
    });
  }
  catch(error){
    console.error("Signup Error:", error);
    res.status(500).json({
      error: "Signup failed"
    });
  }
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


//GET MESSAGES Route(from Database)
app.get('/messages',async(req,res)=>{
  try{
    //Fetch all messages and sort by time(oldest first)
    const history = await Message.find().sort({createdAt:1});
    res.status(200).json(history);
  }
  catch(error){
    res.status(500).json({
      error: "Failed to fetch messages"
    });
  }
})

// POST MESSAGES Route(Saves messages to Database)
app.post('/messages',async (req,res)=>{
  const {sender,text} = req.body;

  console.log(`Received connection from phone. Processing message from: ${sender}`);

  try{

      // Get readable time (e.g., "10:30 PM")
      const readableTime = new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
      });

      // Create new message object
      const newMessage = new Message({
        sender: sender,
        text: text,
        time: readableTime, //store readable time
        //We don't need to set createdAt, mongoose will handle it
      });
    
      // save it to database
      await newMessage.save();
    
      console.log(`SUCCESS: Message saved to DB: ${text}`);
    
      res.status(201).json({
        success: true,
        message: "Message saved to MongoDB!"
      });
  }
  catch(error){
    console.error("DATABASE ERROR:", error); //log the error if MongoDB operation fails
    res.status(500).json({
      error: "Failed to save message"
    });
  }
});


// Start the Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT} --- WITH MESSAGES ROUTE`);
});
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
const mongoURI = "mongodb+srv://mayyank:Bholebaba123@cluster.lzihkny.mongodb.net/?appName=Cluster"
mongoose.connect(mongoURI)
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
  },
  friends: [{ type: String }],
  friendRequests: [{type: String}]
});

//create the user model
const User = mongoose.model('User', userSchema);

//Define Message Schema
const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  text: String,
  time: String, //store readable time
  createdAt: { type: Date, default: Date.now } //auto-date for sorting
})

// ---------------------------------------------------
// FRIEND SYSTEM ROUTES 
// ---------------------------------------------------

//Send Friend Request
app.post('/send-request' , async(req,res) => {
  const {sender,receiver} = req.body;
  
  if(sender == receiver){
    return res.status(400).json({message: "Cannot add yourself"});
  }
  
  try{
    const targetUser = await User.findOne({username: receiver});
    if(!targetUser) return res.status(404).json({success: false,message: "User not found"});
    
    //Check if already friends or requested
    if(targetUser.friendRequests.includes(sender) || targetUser.friends.includes(sender)){
      return res.status(400).json({success:false,message: "Request already sent or already friends"});
    }
    
    targetUser.friendRequests.push(sender);
    await targetUser.save();
    
    console.log(`Friend request: ${sender}->${receiver}`);
    res.status(200).json({success:true,message: "Request Sent!"});
  }
  catch(error){
    res.status(500).json({error: "Request failed"});
  }
  
});

//Get My Friend Requests
app.get('/my-requests/:username',async(req,res) => {
  try{
    const user = await User.findOne({username: req.params.username});
    res.status(200).json(user ? user.friendRequests : []);
  }
  catch(error){
    res.status(500).json({error: "Fetch Failed"});
  }
});

//Accept Friend Request
app.post('/accept-request',async(req,res) => {
  const{username,friendToAccept} = req.body;
  
  try{
    const user = await User.findOne({username});
    const friend = await User.findOne({username: friendToAccept});
    
    if(!user || !friend) return res.status(404).json({message: "User not found"});
    
    //remove from requests
    user.friendRequests = user.friendRequests.filter(req => req !== friendToAccept);

    //add to friend list (Both sides)
    user.friends.push(friendToAccept);
    friend.friends.push(username);

    await user.save();
    await friend.save();

    console.log(`Friendship created: ${username} <-> ${friendToAccept}`);
    res.status(200).json({success:true,message:"Friend Added!"});
  }
  catch(error){
    res.status(500).json({error: "Accept failed"});
  }
})

//Get My friend list
app.get('/my-friends/:username',async(req,res) => {
  try{
    const user = await User.findOne({username: req.params.username});
    res.status(200).json(user ? user.friends : []);
  }
  catch(error){
    res.status(500).json({error: "Fetch failed"});
  }
});

// ---------------------------------------------------
// END FRIEND ROUTES
// ---------------------------------------------------

//create the message model
const Message = mongoose.model('Message', messageSchema);

//Test Route (GET) 
app.get('/', (req, res) => {
  res.send('Raaibar Server is Running...');
});

// ---------------------------------------------------
// SIGNUP ROUTES
// ---------------------------------------------------

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

// ---------------------------------------------------
// END SIGNUP ROUTES
// ---------------------------------------------------


// ---------------------------------------------------
// AUTHENTICATION ROUTES
// ---------------------------------------------------

// The app will send data here.
app.post('/login', async(req, res) => {
  const { username, password } = req.body;

  console.log(`Login attempt: ${username}`);

  try{
    //check if user exists in MongoDB with matching password
    const user = await User.findOne({username: username, password: password});

    if(user){
      //User FOUND -> Login Success
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {name: user.username, id: user._id}
      });
    }
    else{
      //User NOT FOUND -> Login Failed
      res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }
  }
  catch(error){
    console.error("Login Error:" , error);
    res.status(500).json({
      error: "Internal server Error"
    });
  }
});

// ---------------------------------------------------
// END AUTHENTICATION ROUTES
// ---------------------------------------------------


// ---------------------------------------------------
// MESSAGES ROUTES
// ---------------------------------------------------

//GET PRIVATE MESSAGES(from Database)
app.get('/messages/:user1/:user2',async(req,res)=>{
  const {user1,user2} = req.params;
  
  try{
    //Find messages where:
    //(Sender is Me AND Receiver is Friend) OR (Sender is Friend AND Receiver is Me)
    //Fetch all messages and sort by time(oldest first)
    const history = await Message.find({
      $or:[
        {sender:user1,receiver:user2},
        {sender:user2,receiver:user1}
      ]
    }).sort({createdAt:1});

    res.status(200).json(history);
  }
  catch(error){
    res.status(500).json({
      error: "Failed to fetch"
    });
  }
})

// POST MESSAGES Route(Saves messages to Database)
app.post('/messages',async (req,res)=>{
  const {sender,receiver,text} = req.body;

  console.log(`Message: ${sender} -> ${receiver}: ${text}`);

  try{

      // Get readable time (e.g., "10:30 PM")
      const readableTime = new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
      });

      // Create new message object
      const newMessage = new Message({
        sender: sender,
        receiver: receiver,
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

// ---------------------------------------------------
// END MESSAGES ROUTES
// ---------------------------------------------------


// Start the Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
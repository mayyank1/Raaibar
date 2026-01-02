import React , {useEffect, useRef, useState} from 'react';
import {View , Text , TextInput , TouchableOpacity , FlatList , StyleSheet , KeyboardAvoidingView , Platform, Alert , ActivityIndicator} from 'react-native';
import {io , Socket} from "socket.io-client"
import { SERVER_URL } from '../config';

interface Message {
    _id?: string; // Change 'id' to '_id' (MongoDB format) and ? as new socket messages won't have _id instantly
    sender: string;
    receiver: string;
    text: string;
    time: string;
}

//Helper: Generate a consistent color based on the username
const getAvatarColor = (name:string) => {
  const colors = [
    '#F44336', 
    '#E91E63', 
    '#9C27B0', 
    '#673AB7', 
    '#3F51B5', 
    '#2196F3', 
    '#009688', 
    '#FF5722', 
    '#795548', 
    '#607D8B'
  ];

  let hash = 0;

  for(let i = 0;i<name.length;i++){
    hash = name.charCodeAt(i) + ((hash<<5) - hash);
  }

  const index = Math.abs(hash%colors.length);

  return colors[index];
};

const ChatScreen = ({navigation,route}:any) => {
    // get the names passed from HomeScreen
    const {myName , friendName} = route.params;

    //start with empty messages(we will fetch messages from server)
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText,setInputText] = useState('');
    const [loading,setLoading] = useState(true);

    //ref to hold the socket object so it persists
    const socketRef = useRef<Socket | null>(null);
    //Auto-scroll to bottom when new message arrives
    const flatListRef = useRef<FlatList>(null);


    //fetch message history on load(and every 2 sec to see new messages)
    useEffect(() => {
        //initialize socket connection
        socketRef.current = io(SERVER_URL);

        //join my own "ROOM" so i can receive message
        socketRef.current.emit("join_room",myName);

        //listen for incomming messages
        socketRef.current.on("receive_message" , (data:Message) => {
            console.log("New Message Received:", data);

            //Add new message directly to the list safetly
            setMessages((prevMessages) => [...prevMessages,data]);

            //scroll to bottom
            setTimeout(() => flatListRef.current?.scrollToEnd({animated:true}),100);
            
        });

        //load initial messages from DB only once
        fetchMessages();

        //CLEANUP: disconnect socket when leaving the screen
        return() => {
            socketRef.current?.disconnect();
        };
    },[]);

    const fetchMessages = async() => {
        try{
            //Fetch messages ONLY between me and this friend
            const response = await fetch(`${SERVER_URL}/messages/${myName}/${friendName}`);
            const data = await response.json();
            setMessages(data);
            setLoading(false);
        }
        catch(error){
            console.log('Error fetching chat: ', error);
        }
    };


    // Function to handle sending a message (Connected to server)
    const sendMessage = async () => {
        if(inputText.trim()){
            const messageData = {
                sender: myName,
                receiver: friendName,
                text: inputText,
                time: new Date().toLocaleTimeString([],{hour: '2-digit' , minute: '2-digit'}),
            };

            //update UI by fetchHistory() 
            try{
                //save to MongoDB (persistent storage)
                await fetch(`${SERVER_URL}/messages`,{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(messageData),
                });


                //emit to socket(real time update)
                // we send this to the server  and the server sends it back to us via 'receive_message' route
                //this ensures both ME and MY FRIEND see it instantly
                socketRef.current?.emit("send_message",messageData);

                setInputText('');
            }
            catch(error){
                console.error("Failed to send");
            }
        }
    };


    //RENDER MESSAGES
    const renderMessage = ({ item }: { item: Message }) => {
        const isMyMessage = item.sender === myName;
        
        return (
            <View style={[
                styles.messageContainer, 
                isMyMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }
            ]}>
                
                {/* Show Avatar ONLY for friend's messages */}
                {!isMyMessage && (
                    <View style={[styles.smallAvatar, { backgroundColor: getAvatarColor(friendName) }]}>
                        <Text style={styles.smallAvatarText}>{friendName[0].toUpperCase()}</Text>
                    </View>
                )}

                {/* The Bubble */}
                <View style={[
                    styles.messageBubble, 
                    isMyMessage ? styles.myMessage : styles.theirMessage
                ]}>
                    <Text style={[isMyMessage ? styles.myText : styles.theirText]}>{item.text}</Text>
                    <Text style={[styles.timeText, isMyMessage ? { color: '#E0F2F1' } : { color: '#888' }]}>
                        {item.time}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            {/* header */}
            <View style = {styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIconText}>{"\u2190"}</Text>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode='tail'>
                        {friendName}
                    </Text>
                </View>
            </View>

            {/* Chat List */}
            {loading ? (
                <ActivityIndicator size="large" color="teal" style={{marginTop: 20}}/>
            ):(
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item,index) => item._id || index.toString()}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated:true})}
                />
            )}

            {/* input area */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity 
                    onPress={sendMessage}
                    style={styles.sendButton}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'teal',
        paddingTop: Platform.OS === 'android' ? 40 : 50, 
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    backButton: {
        marginRight: 15,
        padding: 4, 
    },
    backIconText: {
        color: 'white',
        fontSize: 30,
        fontWeight: '300', 
        includeFontPadding: false, 
        height: 34, 
        textAlignVertical: 'center',
    },
    titleContainer: {
        flex: 1, 
        justifyContent: 'center',
    },
    headerTitle:{
        color: 'white',
        fontSize:20,
        fontWeight: '600',
        letterSpacing:0.5,
    },
    listContent:{
        padding:15,
        paddingBottom:20,
    },
    inputContainer:{
        flexDirection: 'row',
        padding:10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    input:{
        flex:1,
        borderWidth:1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal:15,
        paddingVertical:10,
        marginRight:10,
        color: 'black',
    },
    sendButton:{
        backgroundColor: 'teal',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    sendButtonText:{
        color: 'white',
        fontWeight: 'bold',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end', // Aligns avatar to bottom
        marginBottom: 10,
    },
    smallAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 2, 
    },
    smallAvatarText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
        maxWidth: '75%',
        elevation: 1, 
    },
    myMessage: {
        backgroundColor: 'teal',
        borderBottomRightRadius: 2, // The "Tail" effect
        marginLeft: 50, 
    },
    theirMessage: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 2, // The "Tail" effect
    },
    myText: {
        color: 'white',
        fontSize: 15,
    },
    theirText: {
        color: '#333',
        fontSize: 15,
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
});

export default ChatScreen;
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
    createdAt?: string;
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

//Helper: Format date for seperators
const getDateLabel = (dataString?: string) => {
    if(!dataString) return null;
    
    const messageDate = new Date(dataString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    //check if today
    if(messageDate.toDateString() === today.toDateString()){
        return "Today";
    }
    
    //check if yesterday
    if(messageDate.toDateString() === yesterday.toDateString()){
        return "Yesterday";
    }
    
    //otherwise return specific date like "12/05/2026"
    return messageDate.toLocaleDateString();
}

const ChatScreen = ({navigation,route}:any) => {
    
    
    // get the names passed from HomeScreen
    const {myName , friendName} = route.params;
    
    //start with empty messages(we will fetch messages from server)
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText,setInputText] = useState('');
    const [loading,setLoading] = useState(true);
    
    //state for Typing indicator
    const [isFriendTyping , setIsFriendTyping] = useState(false);
    const typingTimeoutRef = useRef<any>(null); //to stop the indicator automatically
    
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

        //LISTERNER: for incomming messages
        socketRef.current.on("receive_message" , (data:Message) => {
            console.log("New Message Received:", data);

            //Add new message directly to the list safetly
            setMessages((prevMessages) => [...prevMessages,data]);

            //scroll to bottom
            setTimeout(() => flatListRef.current?.scrollToEnd({animated:true}),100);
            
        });

        //LISTENER: Friend started typing
        socketRef.current.on("display_typing" , (data:any) => {
            if(data.sender === friendName){
                setIsFriendTyping(true);

                //Safety: hide it automatically after 3 sec(in case we miss the 'stop' signal)
                if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => {
                    setIsFriendTyping(false);
                },3000);
            }
        });

        //LISTENER: Friend stopped typing
        socketRef.current.on("hide_typing" , (data:any) => {
            if(data.sender === friendName){
                setIsFriendTyping(false);
                if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            }
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
                createdAt: new Date().toISOString(), //Fake the data for immediate display
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
    const renderMessage = ({ item,index }: { item: Message,index: number }) => {
        const isMyMessage = item.sender === myName;

        //---LOGIC FOR DATE SEPARATORS---
        const currentLabel = getDateLabel(item.createdAt);
        const previousLabel = index > 0 ? getDateLabel(messages[index-1].createdAt):null;

        //show seperator if it's the first message OR if the date changed from the previous message
        const showDateSeperator = index === 0 || currentLabel !== previousLabel;
        // -----------
        
        return (
            <View>
                {/* DATE HEADER */}
                {showDateSeperator && currentLabel && (
                    <View style={styles.dateSeperator}>
                        <Text style={styles.dateLabel}>{currentLabel}</Text>
                    </View>
                )}
            

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
            </View>
        );
    };


    //ref to track if we already sent the signal (for optimaization)
    const isTypingRef = useRef(false);

    const handleInputChange = (text: string) => {
        setInputText(text);

        //Emit "Typing" signal
        if(text.length > 0){
            //Only emit if we haven't already said we are typing(only one time signal)
            if(!isTypingRef.current){
                socketRef.current?.emit("typing" , {sender: myName,receiver: friendName});
                isTypingRef.current = true;
            }
        }
        else{
            //if text is empty, send "Stop" and reset flag
            socketRef.current?.emit("stop_typing",{sender: myName,receiver: friendName});
            isTypingRef.current = false;
        }
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

                    {/* TYPING INDICATOR */}
                    {isFriendTyping && (
                        <Text style={styles.typingText}>typing...</Text>
                    )}
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
                    onChangeText={handleInputChange}
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
    dateSeperator:{
        alignItems: 'center',
        marginVertical: 15,
        marginBottom: 10,
    },
    dateLabel: {
        backgroundColor: '#e1f5fe',
        color: '#0277bd',
        fontSize: 12,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius:10,
        overflow: 'hidden', // Ensures background fits rounded corners
    },
    typingText: {
        color: '#E0F2F1',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 2,
    }
});

export default ChatScreen;
import React , {useEffect, useRef, useState} from 'react';
import {View , Text , TextInput , TouchableOpacity , FlatList , StyleSheet , KeyboardAvoidingView , Platform, Alert , ActivityIndicator} from 'react-native';

interface Message {
    _id: string; // Change 'id' to '_id' (MongoDB format)
    sender: string;
    receiver: string;
    text: string;
    time: string;
}

const ChatScreen = ({navigation,route}:any) => {
    // get the names passed from HomeScreen
    const {myName , friendName} = route.params;

    //start with empty messages(we will fetch messages from server)
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText,setInputText] = useState('');
    const [loading,setLoading] = useState(true);

    //Auto-scroll to bottom when new message arrives
    const flatListRef = useRef<FlatList>(null);

    //fetch message history on load(and every 2 sec to see new messages)
    useEffect(() => {
        fetchMessages();

        //auto refresh every 2 sec
        const interval = setInterval(fetchMessages,2000);
        return () => clearInterval(interval);
    },[]);

    const fetchMessages = async() => {
        try{
            //Fetch messages ONLY between me and this friend
            const response = await fetch(`https://raaibar.onrender.com/messages/${myName}/${friendName}`);
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
            //update UI by fetchHistory() 
            try{
                await fetch('https://raaibar.onrender.com/messages',{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: myName,
                        receiver: friendName,
                        text: inputText,
                    }),
                });

                setInputText('');
                fetchMessages(); // force refresh messages
            }
            catch(error){
                console.error("Failed to send");
            }
        }
    };

    const renderMessage = ({item}:{item: Message}) => {
        const isMyMessage = item.sender === myName;
        return(
            <View style={[styles.messageBubble , isMyMessage ? styles.myMessage : styles.theirMessage]}> 
                <Text style={[isMyMessage ? styles.myText : styles.theirText]}>{item.text}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
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
                    keyExtractor={item => item._id}
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
    messageBubble:{
        padding:10,
        borderRadius: 10,
        marginBottom:10,
        maxWidth: '80%',
    },
    myMessage:{
        alignSelf: 'flex-end',
        backgroundColor: 'teal',
    },
    theirMessage:{
        alignSelf: 'flex-start',
        backgroundColor: '#e5e5e5',
    },
    myText:{
        color: 'white',
    },
    theirText:{
        color: 'black',
    },
    timeText: { 
        fontSize: 10, 
        marginTop: 5, 
        alignSelf: 'flex-end', 
        opacity: 0.7 
    },
});

export default ChatScreen;
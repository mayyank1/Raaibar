import React , {useEffect, useState} from 'react';
import {View , Text , TextInput , TouchableOpacity , FlatList , StyleSheet , KeyboardAvoidingView , Platform, Alert} from 'react-native';

interface Message {
    id: string;
    sender: string;
    text: string;
    time: string;
}

const ChatScreen = ({route}:any) => {
    // get the username from route params
    const {name} = route.params;

    //start with empty messages(we will fetch messages from server)
    const [messages, setMessages] = useState<Message[]>([]);

    //fetch history on load(and every 2 sec to see new messages)
    useEffect(() => {
        fetchHistory();

        //auto refresh every 2 sec
        const interval = setInterval(fetchHistory,2000);
        return () => clearInterval(interval);
    },[]);

    const fetchHistory = async() => {
        try{
            const response = await fetch('http://10.117.231.148:3000/messages');
            const data = await response.json();
            setMessages(data);
        }
        catch(error){
            console.log('Error fetching history: ', error);
        }
    };

    const [inputText , setInputText] = useState('');

    // Function to handle sending a message (Connected to server)
    const sendMessage = async () => {
        if(inputText.trim()){
            //update UI by fetchHistory() 
            try{
                await fetch('http://10.117.231.148:3000/messages',{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: 'Mayank', //sender is hardcoded for now
                        text: inputText,
                    }),
                });

                setInputText('');
                fetchHistory(); // force refresh messages
            }
            catch(error){
                console.error("Failed to send");
            }
        }
    };

    const renderMessage = ({item}:any) => (
        <View style={[styles.messageBubble,
            item.sender === 'Mayank' ? styles.myMessage : styles.theirMessage
        ]}>
            <Text style= {item.sender === 'Mayank' ? styles.myText : styles.theirText}>
                {item.text}
            </Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : "height"}
            style={styles.container}
        >
            {/* header */}
            <View style = {styles.header}>
                <Text style={styles.headerTitle}>{name}</Text>
            </View>

            {/* messages list */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />

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
    header:{
        padding:20,
        backgroundColor: 'teal',
        elevation:4,
    },
    headerTitle:{
        color: 'white',
        fontSize:20,
        fontWeight: 'bold',
    },
    listContent:{
        padding:15,
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
});

export default ChatScreen;
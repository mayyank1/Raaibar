import React, {useEffect,useState} from "react";
import {View , Text , StyleSheet , TouchableOpacity ,FlatList ,ActivityIndicator} from 'react-native';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
}

const HomeScreen = ({navigation,route}:any) => {
    const {username} = route.params || {username: 'User'};

    //state to hold messages from server
    const [message, setMessage] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    //fetch data from server
    useEffect(() => {
        fetchMessages();
    },[]);

    const fetchMessages = async() => {
        try{
            const response = await fetch('http://10.117.231.29:3000/messages');
            const data = await response.json();
            setMessage(data);
        }
        catch(error){
            console.error("Error fetching chats: ", error);
        }
        finally{
            setLoading(false); //stop  loding spinner
        }
    }

    const handleLogout = () => {
        navigation.replace('Login');
    };

    // row looks
    const renderItem = ({item}:any) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Chat',{name:item.sender})
          }
        >
          <View style={styles.card}>
              <View style={styles.cardHeader}>
                  <Text style={styles.sender}>{item.sender}</Text>
                  <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.messageText}>{item.text}</Text>
          </View>
        </TouchableOpacity>
    )

    return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Raaibar</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>Hello, {username}</Text>

      {/* The List */}
      {loading ? (
        <ActivityIndicator size="large" color="teal" />
      ) : (
        <FlatList
          data={message}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'teal',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4, // Shadow for Android
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  welcomeText: {
    padding: 20,
    fontSize: 18,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2, // Shadow
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
  messageText: {
    color: '#555',
  },
});

export default HomeScreen;
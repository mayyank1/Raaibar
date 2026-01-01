import React, {use, useEffect,useState} from "react";
import {View , Text , StyleSheet , TouchableOpacity ,FlatList ,ActivityIndicator ,Button,Alert , TextInput} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


const HomeScreen = ({navigation,route}:any) => {
    //Get the username of the person logged in
    const {username} = route.params;

    const [friends,setFriends] = useState<string[]>([]);
    const [requests,setRequests] = useState<string[]>([]);
    const [newFriendName,setNewFriendName] = useState('');

    //Load Data when screen loads
    useEffect(() => {
      fetchMyData();
      const interval = setInterval(fetchMyData, 3000); //Refresh every 3 seconds
      return () => clearInterval(interval);
    },[]);

    const fetchMyData = async() => {

      try{
        //Get My Friends
        const friendsRes = await fetch(`https://raaibar.onrender.com/my-friends/${username}`);
        const friendsData = await friendsRes.json();
        setFriends(friendsData);
  
        //Get My Friend Requests
        const reqRes = await fetch(`https://raaibar.onrender.com/my-requests/${username}`);
        const reqData = await reqRes.json();
        setRequests(reqData);
      }
      catch(error){
        console.error('Error fetching data:', error);
      }
    }

    //--BUTTON FUNCTIONS---
    const sendFriendRequest = async() => {
      if(!newFriendName){
        Alert.alert('Please enter a name');
        return;
      }

      try{
        const response = await fetch('https://raaibar.onrender.com/send-request',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sender: username,
            receiver: newFriendName
          })
        });

        const data = await response.json();
        Alert.alert(data.success ? "Success" : "Error", data.message);
        setNewFriendName('');
      }
      catch(error){
        Alert.alert('Error',"Could not send friend request");
      }

    };

    const acceptRequest = async(friendToAccept: string) => {
      try{
        await fetch('https://raaibar.onrender.com/accept-request',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            friendToAccept: friendToAccept
          })
        });
        fetchMyData(); //Refresh data imediately
      }
      catch(error){
        Alert.alert("Error","Could not accept");
      }
    };
    
    const handleLogout = async() => {
        //delete the saved data
        await AsyncStorage.removeItem('username');

        navigation.replace('Login');
    };


    //---RENDER ITEMS---
    const renderFriend = ({item}:any) => (
      <TouchableOpacity
        style= {styles.card}
        onPress={()=> navigation.navigate('Chat',{myName:username,friendName: item})}
      >
        <View style={styles.avatar}><Text style={styles.avatarText}>{item[0].toUpperCase()}</Text></View>
        <Text style={styles.friendName}>{item}</Text>
      </TouchableOpacity>
    );

    const renderRequest = ({item}:any)=>(
      <View style={styles.requestCard}>
        <Text>{item} wants to chat!</Text>
        <Button title="Accept" color="teal" onPress={() => acceptRequest(item)}/>
      </View>
    )

    // row looks

    return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Raaibar</Text>
        <Text style={styles.subTitle}>Logged in as: {username}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Section 1 : Add Friend */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add a Friend</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter username (eg. Rahul)"
            value={newFriendName}
            onChangeText={setNewFriendName}
          />
          <Button title="Add" onPress={sendFriendRequest} color="teal"/>
        </View>
      </View>

      {/* Section 2 : Friend Requests */}
      {requests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          <FlatList data={requests} keyExtractor={item => item} renderItem={renderRequest}/>
        </View>
      )}

      {/* Section 3: My Friends List */}
      <View style={{flex: 1, padding: 20}}>
        <Text style={styles.sectionTitle}>My Chats</Text>
        {friends.length === 0 ? (
          <Text style={{color: '#888' , fontStyle: 'italic'}}>No friends yet. Add someone above!</Text>
          ) : (
          <FlatList 
            data={friends}
            keyExtractor={item => item}
            renderItem={renderFriend}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
    header: { 
      backgroundColor: 'teal', 
      padding: 20, 
      paddingTop: 40 
    },
    title: { 
      color: 'white', 
      fontSize: 24, 
      fontWeight: 'bold' 
    },
    subTitle: { 
      color: '#e0f2f1', 
      fontSize: 14 
    },
    logout: { 
      color: 'white', 
      fontWeight: 'bold', 
      marginTop: 10 
    },
    section: { 
      padding: 20, 
      paddingBottom: 0 
    },
    sectionTitle: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      color: '#333', 
      marginBottom: 10 
    },
    inputRow: { 
      flexDirection: 'row', 
      alignItems: 'center' 
    },
    input: { 
      flex: 1, 
      backgroundColor: 'white', 
      borderWidth: 1, 
      borderColor: '#ddd', 
      padding: 10, 
      borderRadius: 5, 
      marginRight: 10 
    },
    card: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: 'white', 
      padding: 15, 
      borderRadius: 10, 
      marginBottom: 10, 
      elevation: 2 
    },
    friendName: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      marginLeft: 15 },
    avatar: { 
      width: 40, 
      height: 40, 
      borderRadius: 20, 
      backgroundColor: 'teal', 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    avatarText: { 
      color: 'white', 
      fontWeight: 'bold', 
      fontSize: 18 
    },
    requestCard: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      backgroundColor: '#e0f2f1', 
      padding: 10, 
      borderRadius: 5,
      marginBottom: 5 
    },
    reqText: { 
      fontWeight: 'bold', 
      color: 'teal' 
    },
});

export default HomeScreen;
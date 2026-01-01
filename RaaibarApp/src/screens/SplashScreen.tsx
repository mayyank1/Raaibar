import { View, Text, StyleSheet , ActivityIndicator} from 'react-native';
import React,{useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}:any) => {
    useEffect(() => {
        checkLoginStatus();
    },[]);

    const checkLoginStatus = async() => {
      try{
        //check if username saved in phone's storage
        const savedUserName = await AsyncStorage.getItem('username');

        //artificial delay(1s) so the user see my logo
        setTimeout(() => {
          if(savedUserName){
            //User found! skip login
            navigation.replace('Home',{username:savedUserName});
          }
          else{
            //no User found! go to login
            navigation.replace('Login');
          }
        },1000)
      }
      catch(error){
        //if fails , play safe go to login
        navigation.replace('Login');
      }
    };
  
    return(
    <View style = {styles.container}>
      <Text style = {styles.logo}>Raibaar</Text>
      <ActivityIndicator 
        size="large"
        color="white"
        style={{marginTop: 20}}
      />
      <Text style={styles.tagLine}>Secure. Private. Fast.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'teal',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
  tagLine: {
    color: '#e0f2f1',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default SplashScreen;

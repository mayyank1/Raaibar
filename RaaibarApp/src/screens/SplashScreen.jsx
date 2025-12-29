import { View, Text, StyleSheet } from 'react-native';
import React,{useEffect} from 'react';

const SplashScreen = ({navigation}) => {
    useEffect(() => {
        const timer = setTimeout(()=>{
            navigation.replace('Login');
        },3000);

        return () => clearTimeout(timer);
    },[navigation]);
  
    return(
    <View style = {styles.container}>
      <Text style = {styles.text}>Raibaar: Secure Messaging</Text>
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

  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SplashScreen;

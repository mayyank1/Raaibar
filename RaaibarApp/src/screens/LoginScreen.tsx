import {View , Text , StyleSheet} from 'react-native';

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login Screen</Text>
            <button>Start</button>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white'
    },
    text:{
        fontSize:20,
        fontWeight:'bold',
        color:'black'
    }
});

export default LoginScreen;
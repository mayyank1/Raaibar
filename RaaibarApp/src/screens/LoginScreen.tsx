import { useState } from 'react';
import {View , Text , StyleSheet , TextInput, TouchableOpacity, Alert} from 'react-native';

const LoginScreen = ({ navigation }: any) => {
    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');
    
    const handleLogin = () => {
        if(username.length === 0 || password.length === 0){
            Alert.alert('Error', 'Please fill in both fields');
            return;
        }

        // To-Do: "Fake" Authentication Logic
        // Later we will check this against a server. 
        // For now, any non-empty input is success.

        navigation.replace('Home', {username}); // Pass username to HomeScreen
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: 'teal',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
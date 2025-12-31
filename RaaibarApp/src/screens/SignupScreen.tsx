import React, {use, useState} from "react";
import {View , Text, TextInput, TouchableOpacity, StyleSheet, Alert} from "react-native";

const SignupScreen = ({navigation}:any) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //function to handle signup
    const handleSignup = async() => {
        if(!username || !password){
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try{
            //connecting to the signup route of the backend
            const response = await fetch("https://raaibar.onrender.com/signup",{
                method: "POST",
                headers: {
                    "Content-Type" : 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if(data.success){
                Alert.alert("Success" , "Account created! Please Login.");
                navigation.goBack(); //go back to login screen
            }
            else{
                Alert.alert("Error", data.message);  //eg "Username already exists"
            }
        }
        catch(error){
            console.error(error);
            Alert.alert("Error", "Could not connect to server");
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Join Raaibar</Text>
            <TextInput
                style={styles.input}
                placeholder="Choose a Username"
                value = {username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value = {password}
                onChangeText={setPassword}
            />
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleSignup}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={{marginTop: 20}}
            >
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title:{
        fontSize: 28,
        fontWeight: 'bold',
        color: 'teal',
        marginBottom: 30,
        textAlign: 'center',
    },
    input:{
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: '#ddd'
    },
    button:{
        backgroundColor: 'teal', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center'
    },
    buttonText:{
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 16
    },
    linkText:{
        color: 'teal', 
        textAlign: 'center'
    }
});

export default SignupScreen;
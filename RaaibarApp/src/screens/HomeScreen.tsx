import React from "react";
import {View , Text , StyleSheet , TouchableOpacity} from 'react-native';

const HomeScreen = ({navigation,route}:any) => {
    const {username} = route.params || {username: 'User'};

    const handleLogout = () => {
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, {username}</Text>
            <Text style={styles.subtitle}>You are now inside Raibaar.</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle:{
        fontSize: 16,
        color: '#666',
        marginBottom: 50,
    },
    logoutButton:{
        backgroundColor: '#ff4444',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    logoutText:{
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
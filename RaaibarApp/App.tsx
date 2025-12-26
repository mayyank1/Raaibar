import { View, Text, StyleSheet } from 'react-native';

const App = () => {
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

export default App;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectAxios } from '../lib/axios';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async () => {
    const axiosInstance = await connectAxios();

    try {
      const response = await axiosInstance.get('/users', {});
      console.log(response.data);
      const user = response.data.find(
        (user) => user.username === username && user.password === password
      );

      if (!user) {
        setError('Invalid username or password');
        return;
      }
      AsyncStorage.setItem('loggedInUser', 'true');
      AsyncStorage.setItem('username', user.username);
      console.log("Logged in user: " + user.username);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/Netflix.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#00000075',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 60,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  loginButton: {
    backgroundColor: '#E50914',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});


export default Login;
import {React, useState, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MovieDetailScreen from './screens/MovieDetailScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from './screens/Login';
import TabNavigator from './navigation/TabNavigator';
import MovieListScreen from './screens/MovieListScreen';
import Search from './screens/Cart';
import Profile from './screens/Profile';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    const checkLoggedInUser = async () => {
        const loggedInUser = await AsyncStorage.getItem("loggedInUser");
        console.log("LoggedInUser:  " + loggedInUser);
        if (loggedInUser) {
            setUser(loggedInUser);
            navigation.navigate("Home");
        }
    };

    const splashAnimation = async () => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    useEffect(() => {
      splashAnimation();
      checkLoggedInUser();
    }, []);

    if (loading) {
      return (
        <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          style={{
            width: 600,
            height: 300,
            backgroundColor: '#ffffff00',
          }}
          source={require('./assets/NetflixAnimation.json')}
        />
        </View>
      );
    }

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1}}>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
          <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}}/>
          <Stack.Screen name="Movie Details" component={MovieDetailScreen} options={{headerShown: false}} />
          <Stack.Screen name="Movies List" component={MovieListScreen} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
});

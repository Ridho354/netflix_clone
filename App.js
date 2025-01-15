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
import Register from './screens/Register';
import ScreenNavigator from './navigation/TabNavigator';
const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1}}>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
          <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
          <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}}/>
          <Stack.Screen name="Movie Details" component={MovieDetailScreen} options={{headerShown: false}} />
          <Stack.Screen name="Movies List" component={MovieListScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Search" component={Search} options={{headerShown: false}} />
          <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
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

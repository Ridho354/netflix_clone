import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MovieListScreen from '../screens/MovieListScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Search from '../screens/Cart';
import Profile from '../screens/Profile';
import TabNavigator from './TabNavigator';
import Login from '../screens/Login';


const Stack = createStackNavigator();

const ScreenNavigator = () => {
    const navigation = useNavigation();
    
  return (
    <NavigationContainer>
        <Stack.Navigator>
            
            <Stack.Screen name="Movies List" component={MovieListScreen} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Home" component={TabNavigator} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ScreenNavigator;
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MovieListScreen from '../screens/MovieListScreen';
import Search from '../screens/Cart';
import Profile from '../screens/Profile';
import Cart from '../screens/Cart';

const Tab = createBottomTabNavigator();

const ScreenNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
        
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f00',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#000',
        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={MovieListScreen} 
        options={{
            headerShown: false,
            tabBarShowLabel : false,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
            headerShown: false,
            tabBarShowLabel : false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile} 
        options={{
            headerShown: false,
            tabBarShowLabel : false,
        }}
        />
    </Tab.Navigator>
  );
};

export default ScreenNavigator;
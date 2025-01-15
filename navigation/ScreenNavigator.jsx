import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MovieListScreen from '../screens/MovieListScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Search from '../screens/Cart';
import Profile from '../screens/Profile';
import TabNavigator from './TabNavigator';
import Login from '../screens/Login';
import Register from '../screens/Register';

const Stack = createStackNavigator();

const ScreenNavigator = () => {
  const navigation = useNavigation();
    
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    const checkLoggedInUser = async () => {
        const loggedInUser = await AsyncStorage.getItem("loggedInUser");
        console.log("LoggedInUser:  " + loggedInUser);
        if (!loggedInUser) {
            console.log("redirecting to home");
            navigation.navigate("Login");
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
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
          <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
          <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}}/>
          <Stack.Screen name="Movie Details" component={MovieDetailScreen} options={{headerShown: false}} />
          <Stack.Screen name="Movies List" component={MovieListScreen} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ScreenNavigator;
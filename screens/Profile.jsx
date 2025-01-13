import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  const handleLogout = () => {
    AsyncStorage.removeItem('loggedInUser');
    AsyncStorage.removeItem('username');
    navigation.navigate('Login');
  }
  return (
    <View style={styles.content}>
        <View style={styles.profileSection}>
          <Text style={styles.username}>{AsyncStorage.getItem('username')}</Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => {
              Alert.alert(
                'Setting Screen',
                'This is setting screen',
                [{
                  text: 'OK',
                  onPress: () => console.log('OK Pressed'),
                  style: 'cancel',
                }],
                {
                  cancelable: true,
                  onDismiss: () => console.log('alert dismissed'),
                }
              );
            }}
          >
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 25
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 24
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16
  },
  buttonSection: {
    marginTop: 32
  },
  settingsButton: {
    backgroundColor: '#E5E7EB',
    padding: 16,
    borderRadius: 12
  },
  settingsText: {
    fontSize: 18,
    color: '#374151'
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    marginTop: 16
  },
  logoutText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center'
  }
});
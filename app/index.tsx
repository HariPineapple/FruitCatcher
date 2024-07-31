import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkSignUpStatus();
  }, []);

  const checkSignUpStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData.verified) {
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      console.error('Error checking sign-up status:', error);
    }
  };

  const handleSignUp = async () => {
    if (name.trim() === '') {
      alert('Please enter a username');
      return;
    }

    const userData = {
      username: name,
      fruitsCaught: 0,
      fruitsMissed: 0,
      bestScore: 0,
      verified: true
    };

    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.innerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#D81159"
          value={name}
          onChangeText={setName}
        />
        <Pressable style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5AA9E6',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#5AA9E6'
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#D81159',
    borderWidth: 1,
    borderRadius: 30,
    width: '85%',
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#D81159',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    width: '85%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
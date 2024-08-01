import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <Image source={require('../../assets/images/logo.png')} 
        style={styles.image}
      />
      <Text style={styles.welcomeText}>Welcome {userData.username}!</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Your Stats:</Text>
        <Text style={styles.statsItem}>Fruits Caught: {userData.fruitsCaught}</Text>
        <Text style={styles.statsItem}>Fruits Missed: {userData.fruitsMissed}</Text>
        <Text style={styles.statsItem}>Best Score: {userData.bestScore}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5AA9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#D81159',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsText: {
    color: '#D81159',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsItem: {
    color: '#D81159',
    fontSize: 18,
    marginBottom: 5,
  },
  image: {
    width: 300,
    height: 300,
  }
});
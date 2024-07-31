// SignUpScreen.js
import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (name.trim().length === 0) {
      Alert.alert('Name is required');
      return;
    }

    const stats = {
      "Username": name,
      "SignedUp": true,
      "Fruits Caught": 0,
      "Fruits Missed": 0,
      "Best Score": 0,
    };

    const fileUri = FileSystem.documentDirectory + 'stats.json';

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(stats), {
      encoding: FileSystem.EncodingType.UTF8,
    });

    Alert.alert('Sign-up Successful', `Welcome, ${name}!`, [
      { text: 'OK', onPress: () => navigation.navigate('Tabs') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Sign Up" onPress={handleSignUp} color="#D81159" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5AA9E6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#D81159',
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
});

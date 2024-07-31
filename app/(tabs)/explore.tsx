import React from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>This is the Explore Screen!</Text>
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
  text: {
    color: '#D81159',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
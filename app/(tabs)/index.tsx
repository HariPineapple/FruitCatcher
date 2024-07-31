import React from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      
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
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

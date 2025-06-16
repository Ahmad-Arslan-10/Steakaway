import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart } from 'react-native-feather';

export default function EmptyFavorites() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Heart 
          width={40} 
          height={40} 
          stroke="#fff"
          fill="#fff"
        />
      </View>
      <Text style={styles.text}>No favourites found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#ff4d4d',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});
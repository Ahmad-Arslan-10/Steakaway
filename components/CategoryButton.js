import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const categories = [
  'APPETIZERS',
  'STUFFED CHICKEN',
  'STEAKS',
  'PASTA',
  'SMASH BURGERS',
  'THICK BURGERS',
  'MELT BURGERS',
  'CRISPY BURGERS',
  'PREMIUM DRINKS',
  'ICE-CREAM SHAKES',
  'ADD-ONS',
  'DESSERTS',
  'KIDS MENU',
];

const CategoryButtons = forwardRef(({ onPress }, ref) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollViewRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setScrollEnabled: (enabled) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.setNativeProps({ scrollEnabled: enabled });
      }
    }
  }));

  const handlePress = (category) => {
    setSelectedCategory(category);
    onPress(category);
  };

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      style={[styles.button, selectedCategory === category && styles.selectedButton]}
      onPress={() => handlePress(category)}
    >
      <Text
        style={[
          styles.buttonText,
          selectedCategory === category && styles.selectedButtonText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.categorySection}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        contentContainerStyle={styles.scrollView}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {categories.map(renderCategoryButton)}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  categorySection: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  scrollView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: '#000',
  },
  selectedButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#ff4d4d',
  },
  selectedButtonText: {
    fontWeight: 'bold',
    color: '#ff4d4d',
  },
});

export default CategoryButtons;


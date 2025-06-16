import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import ProductDetails from '../components/ProductDetails';
import EmptyFavorites from '../components/EmptyFavorites';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

const FavoriteItem = ({ item, onPress, onAddToCart, onToggleFavorite, isFavorite }) => (
  <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
    <Image source={{ uri: item.image }} style={styles.itemImage} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.itemPrice}>Rs. {item.price.toFixed(2)}</Text>
    </View>
    <TouchableOpacity 
      style={styles.addButton}
      onPress={() => onAddToCart(item)}
    >
      <Text style={styles.addButtonText}>+</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.favoriteButton}
      onPress={() => onToggleFavorite(item)}
    >
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function FavoritesScreen({ navigation }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleToggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favourites</Text>
        <View style={{ width: 40 }} />
      </View>

      {favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <FavoriteItem
              item={item}
              onPress={() => handleProductPress(item)}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={true}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <ProductDetails
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
        isLoggedIn={!!user}
        isFavorite={selectedProduct ? isFavorite(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ff4d4d',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4d4d',
  },
  addButton: {
    backgroundColor: '#800000',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
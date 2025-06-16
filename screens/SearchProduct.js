import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductDetails from '../components/ProductDetails';

const SearchProduct = ({ route, navigation }) => {
  const { categories, isLoggedIn } = route.params || {};
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);
  

  const allProducts = categories.flatMap(category => category.products);

  const filteredProducts = allProducts.filter(product =>
    product.name && product.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const handleToggleFavorite = (product) => {
    if (!isLoggedIn) {
      alert('Please log in to add to favorites.');
      return;
    }

    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === product.id);
      let newFavorites;
      
      if (isFavorite) {
        newFavorites = prevFavorites.filter(fav => fav.id !== product.id);
      } else {
        newFavorites = [...prevFavorites, product];
      }
      
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleAddToCart = (product) => {
    // Implement add to cart functionality
    console.log('Add to cart:', product);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      
      {query ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.productItem}
              onPress={() => handleProductPress(item)}
            >
              <View style={styles.productTextContainer}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.productPrice}>Rs. {item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.productImageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text>Start typing to search products</Text>
        </View>
      )}

      <ProductDetails
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
        isLoggedIn={isLoggedIn}
        isFavorite={selectedProduct ? favorites.some(fav => fav.id === selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4d4d',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  listContainer: {
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4d4d',
  },
  productImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: '#800000',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default SearchProduct;
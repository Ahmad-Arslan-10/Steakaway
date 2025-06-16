import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import ProductDetails from '../components/ProductDetails';
import customizationsData from '../customization.json';

const { width } = Dimensions.get('window');

const Category = ({ 
  categoryName, 
  products, 
  isLoggedIn, 
  favorites, 
  onToggleFavorite,
  onAddButtonClick
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getStartingPrice = (product) => {
    if (!customizationsData[product.id]) return product.price;
    
    // Find minimum price from required options
    let minPrice = product.price;
    const customizations = customizationsData[product.id].customizations;
    
    customizations?.forEach(group => {
      if (group.required && group.type === 'radio') {
        group.options.forEach(option => {
          if (typeof option === 'object' && option.price) {
            minPrice = Math.min(minPrice, option.price);
          }
        });
      }
    });
    
    return minPrice;
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{categoryName}</Text>
      {products.map((product) => (
        <TouchableOpacity 
          key={product.id} 
          onPress={() => openModal(product)} 
          style={styles.productContainer}
        >
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription} numberOfLines={2}>
              {product.description}
            </Text>
            <Text style={styles.productPrice}>
              {customizationsData[product.id] ? 
                `From Rs. ${getStartingPrice(product).toFixed(2)}` : 
                `Rs. ${product.price.toFixed(2)}`
              }
            </Text>
            {customizationsData[product.id] && (
              <Text style={styles.customizationAvailable}>Customizations available</Text>
            )}
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => openModal(product)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      <ProductDetails
        visible={modalVisible}
        onClose={closeModal}
        product={selectedProduct}
        customizations={selectedProduct ? customizationsData[selectedProduct.id] : null}
        isLoggedIn={isLoggedIn}
        isFavorite={selectedProduct ? favorites.some(fav => fav.id === selectedProduct.id) : false}
        onToggleFavorite={onToggleFavorite}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: width,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  customizationAvailable: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  imageContainer: {
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
    right: -10,
    bottom: -10,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Category;
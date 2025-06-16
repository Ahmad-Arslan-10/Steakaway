import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useCart } from '../contexts/CartContext';

const CartScreen = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  const handleIncreaseQuantity = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else {
      removeFromCart(itemId);
    }
  };

  const handleDeleteItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = () => {
    Alert.alert('Success', 'Your order has been processed successfully!');
    clearCart();
  };

  const renderItem = ({ item }) => (
    <View style={styles.productRow}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        {Object.entries(item.customizations).map(([key, value]) => (
          <Text key={key} style={styles.customizationText}>{`${key}: ${value}`}</Text>
        ))}
      </View>
      <View style={styles.productActions}>
        <Text style={styles.productPrice}>Rs. {(item.price * item.quantity).toFixed(2)}</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    const subtotal = getTotalPrice();
    const tax = (subtotal * 0.16).toFixed(2);
    const grandTotal = (subtotal * 1.16).toFixed(2);

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>Rs. {subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>TAX (16.0%)</Text>
          <Text style={styles.summaryValue}>Rs. {tax}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Grand Total</Text>
          <Text style={styles.grandTotal}>Rs. {grandTotal}</Text>
        </View>
      </View>
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cartContainer}
        ListHeaderComponent={<Text style={styles.headerText}>Items</Text>}
        ListFooterComponent={renderFooter}
      />
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cartContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 30,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000',
  },
  customizationText: {
    fontSize: 12,
    color: '#666',
  },
  productActions: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  quantityButton: {
    fontSize: 20,
    color: '#ff4d4d',
    paddingHorizontal: 12,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff4d4d',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
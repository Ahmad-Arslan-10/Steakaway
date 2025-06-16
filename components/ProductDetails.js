import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Animated,
  PanResponder
} from 'react-native';
import { X, Heart, Minus, Plus } from 'react-native-feather';
import { RadioButton } from 'react-native-paper';
import { useCart } from '../contexts/CartContext';

const ProductDetails = ({
  visible,
  onClose,
  product,
  customizations,
  isLoggedIn,
  isFavorite,
  onToggleFavorite
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const { addToCart } = useCart();
  const scrollViewRef = useRef(null);
  const panY = useRef(new Animated.Value(0)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  // Initialize price and options
  useEffect(() => {
    if (!product) return;

    if (customizations) {
      let basePrice = 0;
      const initialOptions = {};
      
      customizations.customizations?.forEach(group => {
        if (group.type === 'radio' && group.required && group.options[0]) {
          const option = group.options[0];
          const optionName = typeof option === 'object' ? option.name : option;
          const optionPrice = typeof option === 'object' ? option.price : 0;
          
          initialOptions[group.name] = optionName;
          basePrice += optionPrice;
        }
      });

      setSelectedOptions(initialOptions);
      setTotalPrice(basePrice * quantity);
    } else {
      setTotalPrice(product.price * quantity);
    }
  }, [product, customizations]);

  // Recalculate price when options or quantity change
  useEffect(() => {
    calculateTotalPrice();
  }, [selectedOptions, quantity]);

  const calculateTotalPrice = () => {
    if (!product) return;

    let total = 0;
    
    if (customizations) {
      Object.entries(selectedOptions).forEach(([category, selection]) => {
        const categoryData = customizations.customizations?.find(c => c.name === category);
        if (!categoryData) return;

        if (Array.isArray(selection)) {
          selection.forEach(selected => {
            const option = categoryData.options.find(opt => 
              typeof opt === 'object' ? opt.name === selected : opt === selected
            );
            if (option && typeof option === 'object' && option.price) {
              total += option.price;
            }
          });
        } else {
          const option = categoryData.options.find(opt => 
            typeof opt === 'object' ? opt.name === selection : opt === selection
          );
          if (option && typeof option === 'object' && option.price) {
            total += option.price;
          }
        }
      });
    } else {
      total = product.price;
    }

    setTotalPrice(total * quantity);
  };

  const handleOptionSelect = (category, option) => {
    setSelectedOptions(prev => {
      const isMultiSelect = category.includes('Ad - On');
      if (isMultiSelect) {
        const currentSelections = prev[category] || [];
        const updatedSelections = currentSelections.includes(option)
          ? currentSelections.filter(item => item !== option)
          : [...currentSelections, option];
        return { ...prev, [category]: updatedSelections };
      } else {
        return { ...prev, [category]: option };
      }
    });
  };

  const handleQuantityChange = (increment) => {
    setQuantity(prev => Math.max(1, prev + increment));
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${JSON.stringify(selectedOptions)}-${quantity}`,
      name: product.name,
      price: totalPrice / quantity,
      image: product.image,
      quantity: quantity,
      customizations: selectedOptions
    };
    addToCart(cartItem);
    onClose();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panY.setOffset(panY._value);
      },
      onPanResponderMove: (_, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        panY.flattenOffset();
        if (gestureState.dy > 50) {
          onClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderCustomizationGroup = (customization) => {
    const isMultiSelect = customization.name.includes('Ad - On');
    const isRequired = !isMultiSelect;
    
    return (
      <View key={customization.name} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{customization.name}</Text>
          {isRequired && <Text style={styles.required}>Required</Text>}
        </View>
        <Text style={styles.sectionSubtitle}>
          {isMultiSelect ? 'You may select multiple options' : 'Please select any one option'}
        </Text>
        
        {customization.options.map((option, index) => {
          const optionName = typeof option === 'object' ? option.name : option;
          const optionPrice = typeof option === 'object' ? option.price : null;
          const isSelected = Array.isArray(selectedOptions[customization.name])
            ? selectedOptions[customization.name]?.includes(optionName)
            : selectedOptions[customization.name] === optionName;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionRow, isSelected && styles.selectedOption]}
              onPress={() => handleOptionSelect(customization.name, optionName)}
            >
              {isMultiSelect ? (
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <View style={styles.checkboxInner} />}
                </View>
              ) : (
                <RadioButton.Android
                  value={optionName}
                  status={isSelected ? 'checked' : 'unchecked'}
                  onPress={() => handleOptionSelect(customization.name, optionName)}
                  color="#ff4d4d"
                />
              )}
              <Text style={styles.optionText}>{optionName}</Text>
              {optionPrice && (
                <Text style={styles.optionPrice}>Rs. {optionPrice.toFixed(2)}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  if (!product) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY }] },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.header}>
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X width={24} height={24} color="#000" />
              </TouchableOpacity>
              {isLoggedIn && (
                <TouchableOpacity
                  onPress={() => onToggleFavorite(product)}
                  style={styles.favoriteButton}
                >
                  <Heart
                    width={24}
                    height={24}
                    stroke={isFavorite ? '#ff4d4d' : '#666'}
                    fill={isFavorite ? '#ff4d4d' : 'none'}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            {product.image && (
              <Image source={{ uri: product.image }} style={styles.productImage} />
            )}

            <View style={styles.contentContainer}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{product.name}</Text>
              </View>

              <Text style={styles.price}>Rs. {totalPrice.toFixed(2)}</Text>
              
              {product.description && (
                <Text style={styles.description}>{product.description}</Text>
              )}

              {customizations?.customizations?.map(renderCustomizationGroup)}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                onPress={() => handleQuantityChange(-1)}
                style={styles.quantityButton}
              >
                <Minus width={20} height={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity 
                onPress={() => handleQuantityChange(1)}
                style={styles.quantityButton}
              >
                <Plus width={20} height={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>
                Add to Cart - Rs. {totalPrice.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'white',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
    marginRight: 16,
  },
  favoriteButton: {
    padding: 10,
    marginLeft: 250
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  price: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  required: {
    color: '#ff4d4d',
    fontSize: 14,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#f5f5f5',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: '#ff4d4d',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#ff4d4d',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#ff4d4d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceBreakdown: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  priceBreakdownText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPriceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4d4d',
  },
});

export default ProductDetails;
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Category from '../components/Category';
import CategoryButtons from '../components/CategoryButton';
import ImageSlider from '../components/Imageslider';
import LoginFlow from '../components/Login';
import MenuDrawer from '../components/MenuDrawer';
import ProductDetails from '../components/ProductDetails';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

const MenuScreen = ({ navigation, route }) => {
  const { addToCart, getTotalItems, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const flatListRef = useRef(null);
  const categoryButtonsRef = useRef(null);

  const images = [
    'https://em-cdn.eatmubarak.pk/55484/web_splash/1718213943.jpg',
    
  ];

  const categoriesWithProducts = require('../products.json');

  useFocusEffect(
    React.useCallback(() => {
      setIsDrawerVisible(false);
    }, [])
  );

  const handleToggleFavorite = (product) => {
    if (!user) {
      setIsLoginVisible(true);
      return;
    }

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const scrollToCategory = (categoryName) => {
    const index = flatListData.findIndex(
      (item) => item.type === 'category' && item.categoryName === categoryName
    );

    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
        viewOffset: 60, 
      });
    }
  };

  const handleAddButtonClick = (productId, price, name, image, customizations = {}) => {
    addToCart({
      id: productId,
      name,
      price,
      image,
      quantity: 1,
      customizations
    });
  };

  const handleLogin = () => {
    setIsDrawerVisible(false);
    setTimeout(() => setIsLoginVisible(true), 100);
  };

  const handleLoginSuccess = (data) => {
    setUserData(data);
    setIsLoginVisible(false);
  };

  const renderItem = ({ item, index }) => {
    switch (item.type) {
      case 'header':
        return <ImageSlider images={images} />;
      case 'categoryButtons':
        return (
          <CategoryButtons
            ref={categoryButtonsRef}
            categories={categoriesWithProducts.map(cat => cat.categoryName)}
            onPress={scrollToCategory}
          />
        );
      case 'category':
        return (
          <Category
            categoryName={item.categoryName}
            products={item.products}
            onAddButtonClick={handleAddButtonClick} 
            isLoggedIn={!!user}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      default:
        return null;
    }
  };

  const flatListData = [
    { type: 'header' },
    { type: 'categoryButtons' },
    ...categoriesWithProducts.map(category => ({
      type: 'category',
      categoryName: category.categoryName,
      products: category.products,
    })),
  ];

  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 0 && categoryButtonsRef.current) {
      categoryButtonsRef.current.setScrollEnabled(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsDrawerVisible(true)}
        >
          <MaterialIcons name="menu" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.locationContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.locationLabel}>
              {route.params?.from === 'pickup' ? 'Pick-Up From' : 'Deliver To'}
            </Text>
            {route.params?.from === 'pickup' ? (
              <>
                <Text style={styles.locationText} numberOfLines={1}>{route.params?.city}</Text>
                <Text style={styles.branchText} numberOfLines={1}>{route.params?.branch}</Text>
              </>
            ) : (
              <>
                <Text style={styles.locationText} numberOfLines={1}>{route.params?.city}</Text>
                <Text style={styles.addressText} numberOfLines={1}>{route.params?.address}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('SearchProduct', { 
            categories: categoriesWithProducts,
            isLoggedIn: !!user,
            handleAddButtonClick,
            favorites,
            onToggleFavorite: handleToggleFavorite
          })}
        >
          <MaterialIcons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        stickyHeaderIndices={[1]}
        contentContainerStyle={styles.container}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      {getTotalItems() > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('CartScreen')}
        >
          <View style={styles.cartButtonContent}>
            <View style={styles.cartLeftContainer}>
              <View style={styles.cartCountContainer}>
                <Text style={styles.cartCountText}>
                  {getTotalItems()}
                </Text>
              </View>
              <Text style={styles.cartButtonText}>View Cart</Text>
            </View>
            <View style={styles.cartRightContainer}>
              <Text style={styles.priceText}>
                Rs. {getTotalPrice().toFixed(2)}
              </Text>
              <Text style={styles.exclusiveTaxText}>Price Exclusive Tax</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}    

      <MenuDrawer
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        isLoggedIn={!!user}
        userData={userData}
        onLogin={handleLogin}
        favorites={favorites}
        onNavigateToFavorites={() => navigation.navigate('FavoritesScreen', { 
          favorites, 
          handleAddButtonClick,
          isLoggedIn: !!user, 
          onToggleFavorite: handleToggleFavorite 
        })}
      />

      <LoginFlow
        visible={isLoginVisible}
        onClose={() => setIsLoginVisible(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ProductDetails
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
        isLoggedIn={!!user}
        isFavorite={selectedProduct ? isFavorite(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={(product) => {
          handleAddButtonClick(product.id, product.price, product.name, product.image, product.customizations);
          setIsModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ff4d4d',
  },
  statusBarUnderlay: {
    height: StatusBar.currentHeight || 24,
    backgroundColor: '#ff4d4d',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ff4d4d',
  },
  menuButton: {
    padding: 10,
  },
  locationContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  locationLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  branchText: {
    color: '#fff',
    fontSize: 14,
  },
  addressText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  searchButton: {
    padding: 10,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cartButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  cartLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartCountContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cartCountText: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartRightContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    color: '#fff',
    fontSize: 14,
  },
  exclusiveTaxText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default MenuScreen;
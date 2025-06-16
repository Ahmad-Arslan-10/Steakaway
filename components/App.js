import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-reanimated';

import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import HomeScreen from './screens/HomeScreen';
import PickupScreen from './screens/PickupScreen';
import DeliveryScreen from './screens/DeliveryScreen';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';
import OrdersScreen from './screens/OrdersScreen'; 
import AddressesScreen from './screens/AddressesScreen';
import SearchProduct from './screens/SearchProduct';
import FavoritesScreen from './screens/FavoritesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Pickup" component={PickupScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Delivery" component={DeliveryScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
              <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'My Cart' }} />
              <Stack.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Addresses" component={AddressesScreen} options={{ headerShown: false }} />  
              <Stack.Screen name="SearchProduct" component={SearchProduct} options={{ headerShown: false }} /> 
              <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{ headerShown: false }} />  
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
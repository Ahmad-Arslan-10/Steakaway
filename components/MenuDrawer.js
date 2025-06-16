import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import SupportCenter from './SupportCenter';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;
const DRAWER_HEIGHT = height;

const MenuDrawer = ({ visible, onClose, favorites }) => {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [showSupport, setShowSupport] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const drawerStyle = {
    transform: [{ translateX }],
  };

  const renderSupportCenter = () => {
    if (!user) {
      return (
        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => {
            closeDrawer();
            setShowSupport(true);
          }}
        >
          <MaterialIcons name="headset-mic" size={24} color="#000" />
          <Text style={styles.drawerItemText}>Support Center</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const closeDrawer = () => {
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLoginSuccess = (userData) => {
    setShowLogin(false);
  };

  const handleLoginPress = () => {
    closeDrawer();
    setShowLogin(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal visible={visible} transparent animationType="none">
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={styles.drawerOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View style={[styles.drawer, drawerStyle]}>
                {user ? (
                  <>
                    <View style={styles.drawerUserInfo}>
                      <View style={styles.drawerAvatar}>
                        <Text style={styles.drawerAvatarText}>{user.email[0].toUpperCase()}</Text>
                      </View>
                      <Text style={styles.drawerUserName}>{user.email}</Text>
                    </View>

                    <View style={styles.drawerWalletContainer}>
                      <MaterialIcons name="account-balance-wallet" size={24} color="#000" />
                      <Text style={styles.drawerWalletText}>My Wallet</Text>
                      <Text style={styles.drawerWalletAmount}>Rs. 0.00</Text>
                    </View>

                    <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Addresses')}>
                      <MaterialIcons name="location-on" size={24} color="#000" />
                      <Text style={styles.drawerItemText}>My Addresses</Text>
                      <MaterialIcons name="chevron-right" size={24} color="#000" style={styles.drawerChevron} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Orders')}>
                      <MaterialIcons name="receipt" size={24} color="#000" />
                      <Text style={styles.drawerItemText}>My Orders</Text>
                      <MaterialIcons name="chevron-right" size={24} color="#000" style={styles.drawerChevron} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('FavoritesScreen', { favorites })}>
                      <MaterialIcons name="favorite" size={24} color="#000" />
                      <Text style={styles.drawerItemText}>My Favourites</Text>
                      <MaterialIcons name="chevron-right" size={24} color="#000" style={styles.drawerChevron} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
                      <MaterialIcons name="logout" size={24} color="#000" />
                      <Text style={styles.drawerItemText}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem} onPress={() => Alert.alert('Account Deletion', 'Are you sure you want to request account deletion?')}>
                      <MaterialIcons name="delete-outline" size={24} color="#000" />
                      <Text style={styles.drawerItemText}>Req Account Deletion</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.drawerTitle}>Hi, Guest</Text>

                    {renderSupportCenter()}

                    <TouchableOpacity style={styles.drawerItem} onPress={handleLoginPress}>
                      <MaterialIcons name="login" size={24} color="#000" />
                      <Text style={styles.drawerItemText}>Login</Text>
                    </TouchableOpacity>
                  </>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
      {/* Support Center Modal */}
      <Modal visible={showSupport} transparent animationType="slide">
        <SupportCenter onClose={() => setShowSupport(false)} />
      </Modal>
      
      {/* Login Modal */}
      <Login
        visible={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ff4d4d',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: DRAWER_WIDTH,
    height: DRAWER_HEIGHT,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
  drawerChevron: {
    marginLeft: 'auto',
  },
  drawerUserInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4d4d',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  drawerAvatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerUserName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerWalletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  drawerWalletText: {
    marginLeft: 15,
    fontSize: 16,
    flex: 1,
  },
  drawerWalletAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4d4d',
  },
});

export default MenuDrawer;
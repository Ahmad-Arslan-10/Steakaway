import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/steak_away.jpg')} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome to Steak Away 👋</Text>
      <Text style={styles.subText}>
        Please select your order type to continue
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Delivery')}>
        <Icon name="truck-delivery-outline" size={24} color="#ff4d4d" />
        <Text style={styles.buttonText}>Delivery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Pickup')}>
        <Icon name="basket-outline" size={24} color="#ff4d4d" />
        <Text style={styles.buttonText}>Pick-Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  logo: {
    width: 250,
    height: 350,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
  subText: {
    fontSize: 16,
    color: '#6b6b6b',
    marginTop: 5,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    width: '80%',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    marginLeft: 10,
  },
});

export default HomeScreen;

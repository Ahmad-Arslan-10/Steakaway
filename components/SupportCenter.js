import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SupportCenter = ({ onClose }) => {
  const navigation = useNavigation();

  const handleEmailPress = () => {
    Linking.openURL('mailto:Cs@steakaway.pk');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:03111222635');
  };

  const handleClose = () => {
    if (onClose) {
      // If onClose prop is provided (when used in modal), use it
      onClose();
    } else {
      // Otherwise, use navigation.goBack() for screen navigation
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Image
        source={require('../assets/images/steak_away.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Support Center</Text>
      <Text style={styles.subtitle}>For queries, Please contact us at:</Text>

      <TouchableOpacity
        style={[styles.button, styles.emailButton]}
        onPress={handleEmailPress}
      >
        <MaterialIcons name="email" size={24} color="#fff" />
        <Text style={styles.buttonText}>Cs@steakaway.pk</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.phoneButton]}
        onPress={handlePhonePress}
      >
        <MaterialIcons name="phone" size={24} color="#000" />
        <Text style={[styles.buttonText, styles.phoneButtonText]}>03111222635</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 10,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  logo: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  emailButton: {
    backgroundColor: '#ff4d4d',
  },
  phoneButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  phoneButtonText: {
    color: '#000',
  },
});

export default SupportCenter;
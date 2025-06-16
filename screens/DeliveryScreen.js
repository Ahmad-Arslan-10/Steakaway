import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { ArrowLeft, Navigation2 } from 'react-native-feather';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function DeliveryScreen({ navigation }) {
  const [location, setLocation] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [userMarker, setUserMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        setAddress("Permission denied. Please enable location services.");
      }
    })();
  }, []);

  const handleLocateMe = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        setIsLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;

      setLocation(prev => ({
        ...prev,
        latitude,
        longitude,
      }));

      setUserMarker({ latitude, longitude });

      animateToRegion({ latitude, longitude });

      try {
        const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
        
        if (addressResponse && addressResponse.length > 0) {
          const addressObj = addressResponse[0];
          const cityName = addressObj.city || addressObj.subregion || addressObj.region || 'Unknown City';
          setCity(cityName);

          const addressParts = [
            addressObj.name,
            addressObj.street,
            addressObj.streetNumber,
            addressObj.district,
            addressObj.subregion,
          ].filter(part => part && part.trim() !== '');

          let formattedAddress = '';
          if (addressParts.length > 0) {
            formattedAddress = addressParts.join(', ');
          } else {
            formattedAddress = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
          }

          setAddress(formattedAddress);
        } else {
          setAddress(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
        }
      } catch (geocodeError) {
        console.error('Reverse geocoding error:', geocodeError);
        setAddress(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
      }
    } catch (locationError) {
      console.error('Location error:', locationError);
      Alert.alert('Error', 'Unable to fetch location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const animateToRegion = (coordinates) => {
    const region = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(region, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft stroke="#000" width={30} height={30} />
            </TouchableOpacity>
          </View>

          <MapView 
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map} 
            initialRegion={location}
          >
            {userMarker && (
              <Marker 
                coordinate={userMarker}
                title="Your Location"
                description="Current location"
                pinColor="red"
              />
            )}
            <Marker 
              coordinate={location} 
              title="Default Location"
              pinColor="blue"
            />
          </MapView>

          <TouchableOpacity
            style={[styles.locateButton, isLoading && styles.locateButtonDisabled]}
            onPress={handleLocateMe}
            disabled={isLoading}
          >
            <Navigation2 stroke="#000" width={24} height={24} />
            <Text style={styles.locateButtonText}>
              {isLoading ? 'Locating...' : 'Locate Me'}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomSheet}>
            <Text style={styles.title}>Please select your location</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City / Region</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Enter city"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Select your delivery address.</Text>
              <TextInput
                style={[styles.input, styles.addressInput]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your delivery address"
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                navigation.navigate('Menu', { 
                  from: 'delivery',
                  city: city,
                  address: address
                });
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20, 
    zIndex: 10,
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addressInput: {
    minHeight: 60,
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locateButton: {
    position: 'absolute',
    right: 20,
    bottom: 350, 
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10, 
  },
  locateButtonDisabled: {
    opacity: 0.6,
  },
  locateButtonText: {
    marginLeft: 8,
    fontWeight: '600',
  },
});
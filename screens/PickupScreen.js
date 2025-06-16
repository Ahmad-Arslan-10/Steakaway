import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, SafeAreaView, FlatList, Alert } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ArrowLeft, Search, Navigation2 } from 'react-native-feather';

const branches = [
  { id: '1', name: 'Steak Away - Pine Avenue', distance: 1, coordinates: { latitude: 31.4697, longitude: 74.2728 } },
  { id: '2', name: 'Steak Away - Gulberg', distance: 18, coordinates: { latitude: 31.5204, longitude: 74.3587 } },
  { id: '3', name: 'Steak Away - DHA Raya', distance: 25, coordinates: { latitude: 31.4697, longitude: 74.4228 } },
];

export default function PickupScreen({ navigation }) {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      }
    })();
  }, []);

  const handleLocateMe = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      
      const nearest = branches.reduce((prev, curr) => {
        const prevDistance = getDistance(location.coords, prev.coordinates);
        const currDistance = getDistance(location.coords, curr.coordinates);
        return prevDistance < currDistance ? prev : curr;
      });

      setSelectedBranch(nearest);
      animateToRegion(nearest.coordinates);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your current location. Please try again.');
    }
  };

  const getDistance = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(coord2.latitude - coord1.latitude);
    const dLon = deg2rad(coord2.longitude - coord1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(coord1.latitude)) * Math.cos(deg2rad(coord2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
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

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#000" width={30} height={30} />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={mapRegion}
      >
        {branches.map((branch) => (
          <Marker
            key={branch.id}
            coordinate={branch.coordinates}
            title={branch.name}
            pinColor={selectedBranch && selectedBranch.id === branch.id ? "red" : "orange"}
          >
            <Callout>
              <View>
                <Text style={styles.calloutTitle}>{branch.name}</Text>
                <Text style={styles.calloutDistance}>{branch.distance} km away</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}
      </MapView>

      <TouchableOpacity
        style={styles.locateButton}
        onPress={handleLocateMe}
      >
        <Navigation2 stroke="#000" width={24} height={24} />
        <Text style={styles.locateButtonText}>Locate Me</Text>
      </TouchableOpacity>

      <View style={styles.bottomSheet}>
        <Text style={styles.title}>Which outlet would you like to pick-up from?</Text>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City / Region</Text>
            <TextInput
              style={styles.input}
              value="Lahore"
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Branch</Text>
            <TouchableOpacity
              style={styles.branchSelector}
              onPress={() => setShowBranchModal(true)}
            >
              <Text style={styles.branchText}>
                {selectedBranch ? selectedBranch.name : 'Select Branch'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, !selectedBranch && styles.disabledButton]}
          onPress={() => {
            if (selectedBranch) {
              navigation.navigate('Menu', { 
                from: 'pickup',
                city: 'Lahore',
                branch: selectedBranch.name
              });
            } else {
              Alert.alert('Error', 'Please select a branch before confirming.');
            }
          }}
          disabled={!selectedBranch}
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showBranchModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.searchContainer}>
              <Search stroke="#666" width={20} height={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity onPress={() => setShowBranchModal(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredBranches}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.branchItem,
                    selectedBranch && selectedBranch.id === item.id && styles.selectedBranchItem
                  ]}
                  onPress={() => {
                    setSelectedBranch(item);
                    setShowBranchModal(false);
                    animateToRegion(item.coordinates);
                  }}
                >
                  <Text style={styles.branchName}>{item.name}</Text>
                  <Text style={styles.distance}>{item.distance} KMs</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    top: 80,
    left: 10, 
    zIndex: 1,
    padding: 10,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10, 
  },
  locateButtonText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    gap: 15,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  branchSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  branchText: {
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  branchItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedBranchItem: {
    backgroundColor: '#f0f0f0',
  },
  branchName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  distance: {
    color: '#777',
    marginTop: 8,
  },
  closeButton: {
    color: '#007BFF',
    fontSize: 16,
    marginLeft: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  calloutDistance: {
    fontSize: 12,
    color: '#666',
  },
});
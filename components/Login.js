import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ visible, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, setUser } = useAuth();

  const handleAuthentication = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
  
    setLoading(true);
    try {
      let result;
  
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
        });
  
        if (result.error) throw result.error;

        const loginResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (loginResult.error) throw loginResult.error;
  
        result = loginResult;
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (result.error) throw result.error;
      }
  
      const { data } = result;
      if (data?.user) {
        const userData = {
          name: data.user.user_metadata?.full_name || 'User',
          email: data.user.email,
        };
        setUser(data.user);
        onLoginSuccess(userData);
      }
  
      resetForm();
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };  

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setIsSignUp(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image source={require('../assets/images/steak_away.jpg')} style={styles.logo} />
          <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create an account to get started' : 'Welcome back! Please login to your account'}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.disabledButton]} 
            onPress={handleAuthentication}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ffb3b3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#ff4d4d',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#888',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
});

export default Login;
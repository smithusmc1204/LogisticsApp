import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

// REPLACE the URL with a local require statement
// Adjust the path to match where you saved your file
const LOCAL_BG = require('../assets/images/loginbackground.png');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    signInWithEmailAndPassword(auth, email.trim(), password)
      .then(() => {
        console.log("User signed in successfully");
      })
      .catch((error) => {
        Alert.alert("Login Failed", "Incorrect email or password.");
      });
  };

  return (
    // Use the local variable here
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
    <ImageBackground source={LOCAL_BG} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to COP 2026!</Text>
          <Text style={styles.subtitle}>Team Access Only</Text>

          <TextInput 
            placeholder="Your Email" 
            style={styles.input} 
            onChangeText={setEmail} 
            value={email}
            autoCapitalize="none"
          />
          
          <TextInput 
            placeholder="Password" 
            style={styles.input} 
            secureTextEntry 
            onChangeText={setPassword} 
            value={password}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 25, 
    backgroundColor: 'rgba(0, 45, 98, 0.4)' 
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    padding: 30,
    borderRadius: 15,
    elevation: 8
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#002D62', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});
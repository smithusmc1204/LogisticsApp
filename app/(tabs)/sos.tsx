import * as SMS from 'expo-sms';
import React from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TEAM_NUMBERS = ['9733626754', '9843351239'];
const BG_TACTICAL = { uri: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=1000&auto=format&fit=crop' };

export default function SOSScreen() {
  const sendHelp = async () => {
    const { result } = await SMS.sendSMSAsync(TEAM_NUMBERS, 'URGENT: Requesting immediate assistance at my current location.');
    if (result === 'sent') Alert.alert('Sent', 'Emergency alert transmitted.');
  };

  return (
    <ImageBackground source={BG_TACTICAL} style={styles.background}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.sosButton} onPress={sendHelp}>
          <Text style={styles.sosText}>TRANSMIT HELP REQUEST</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  sosButton: { backgroundColor: '#dc3545', padding: 30, borderRadius: 10, alignItems: 'center' },
  sosText: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});

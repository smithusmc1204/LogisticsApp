import * as SMS from 'expo-sms';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TEAM_NUMBERS = ['9733626754', '9843351239'];
const BG_TACTICAL = { uri: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=1000&auto=format&fit=crop' };

export default function SuppliesScreen() {
  const [inventory, setInventory] = useState<{ id: string; name: string }[]>([]);
  const [cart, setCart] = useState<{ id: string; name: string }[]>([]);
  const [customItem, setCustomItem] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?gid=1257808001&single=true&output=csv';
      const response = await fetch(SHEET_URL);
      const csvText = await response.text();
      const rows = csvText.split('\n');
      setInventory(rows.slice(1).map((row, i) => ({ id: `item-${i}`, name: row.split(',')[0].trim() })).filter(item => item.name));
    };
    fetchInventory();
  }, []);

  const submitOrder = async () => {
    if (cart.length === 0) return Alert.alert('Empty', 'Add items first.');
    const message = `SUPPLY REQUISITION:\n${cart.map(i => `- ${i.name}`).join('\n')}`;
    const { result } = await SMS.sendSMSAsync(TEAM_NUMBERS, message);
    if (result === 'sent') { Alert.alert('Sent', 'Order transmitted.'); setCart([]); }
  };

  return (
    <ImageBackground source={BG_TACTICAL} style={styles.background}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <FlatList data={inventory} keyExtractor={i => i.id} renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => setCart([...cart, item])} style={styles.addButton}><Text style={styles.btnText}>+ ADD</Text></TouchableOpacity>
          </View>
        )} />
        <TouchableOpacity style={styles.submitBtn} onPress={submitOrder}><Text style={styles.btnText}>Submit ({cart.length} items)</Text></TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 },
  itemText: { fontSize: 16, fontWeight: '500' },
  addButton: { backgroundColor: '#007AFF', padding: 8, borderRadius: 5 },
  submitBtn: { backgroundColor: '#28a745', padding: 20, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
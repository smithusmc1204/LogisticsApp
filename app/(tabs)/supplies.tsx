import * as SMS from 'expo-sms';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const TEAM_NUMBERS = ['9733626754', '9843351239'];
const BG_TACTICAL = { uri: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=1000&auto=format&fit=crop' };
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx-cmz0Aw85yMX_8jn5fJEwZa8SSIIR9w-6rgzwDG0G8x6xRFwKT6VGTe9sA4DyDF0/exec';

export default function SuppliesScreen() {
  const [inventory, setInventory] = useState<{ id: string; name: string }[]>([]);
  const [cart, setCart] = useState<{ id: string; name: string }[]>([]);
  const [customItem, setCustomItem] = useState('');
  const [siteName, setSiteName] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?gid=1257808001&single=true&output=csv';
      try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        const rows = csvText.split('\n');
        setInventory(rows.slice(1).map((row, i) => ({ id: `item-${i}`, name: row.split(',')[0].trim() })).filter(item => item.name));
      } catch (error) {
        Alert.alert('Error', 'Failed to load inventory.');
      }
    };
    fetchInventory();
  }, []);

  const addCustomItem = () => {
    if (customItem.trim().length === 0) return;
    setCart([...cart, { id: `custom-${Date.now()}`, name: customItem.trim() }]);
    setCustomItem('');
  };

  const submitOrder = async () => {
    if (!siteName.trim()) return Alert.alert('Missing Info', 'Please enter a Site Name.');
    if (cart.length === 0) return Alert.alert('Empty', 'Add items first.');
    
    const itemNames = cart.map(i => i.name);
    const smsMessage = `SITE: ${siteName.toUpperCase()}\nSUPPLY REQUISITION:\n${itemNames.map(name => `- ${name}`).join('\n')}`;

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName: siteName.trim(), items: itemNames }),
      });

      const { result } = await SMS.sendSMSAsync(TEAM_NUMBERS, smsMessage);
      
      // Resets the UI state after the SMS action is completed
      if (result === 'sent' || result === 'cancelled') {
        setCart([]);
        setSiteName('');
        Alert.alert('Order Processed', 'Cart has been cleared.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update spreadsheet.');
    }
  };

  return (
    <ImageBackground source={BG_TACTICAL} style={styles.background}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <Text style={styles.header}>Supply Requisition</Text>

        <TextInput 
          style={styles.siteInput}
          placeholder="Enter Site Number (e.g. Site 1)"
          placeholderTextColor="#aaa"
          value={siteName}
          onChangeText={setSiteName}
        />

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.itemInput}
            placeholder="Unlisted item..."
            placeholderTextColor="#999"
            value={customItem}
            onChangeText={setCustomItem}
          />
          <TouchableOpacity onPress={addCustomItem} style={styles.addManualBtn}>
            <Text style={styles.btnText}>+ ADD</Text>
          </TouchableOpacity>
        </View>

        <FlatList 
          data={inventory} 
          keyExtractor={i => i.id} 
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.itemText}>{item.name}</Text>
              <TouchableOpacity onPress={() => setCart([...cart, item])} style={styles.addButton}>
                <Text style={styles.btnText}>+ ADD</Text>
              </TouchableOpacity>
            </View>
          )} 
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearBtn} onPress={() => setCart([])}>
            <Text style={styles.btnText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={submitOrder}>
            <Text style={styles.btnText}>Submit Order ({cart.length})</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', padding: 20 },
  header: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 40, marginBottom: 15, textAlign: 'center' },
  siteInput: { backgroundColor: '#222', color: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 18, borderWidth: 1, borderColor: '#444' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  itemInput: { flex: 1, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, height: 50 },
  addManualBtn: { backgroundColor: '#495057', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 8, marginLeft: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 },
  itemText: { fontSize: 16, fontWeight: '500' },
  addButton: { backgroundColor: '#007AFF', padding: 8, borderRadius: 5 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 },
  clearBtn: { backgroundColor: '#dc3545', padding: 20, borderRadius: 8, flex: 0.3, alignItems: 'center' },
  submitBtn: { backgroundColor: '#28a745', padding: 20, borderRadius: 8, flex: 0.65, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
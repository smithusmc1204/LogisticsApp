import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, ImageBackground, Linking, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LOCAL_CHURCH_BG = require('../../assets/images/churchbackground.png');

export default function ChurchesScreen() {
  const [churches, setChurches] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChurches = async () => {
    try {
      const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?gid=304443399&single=true&output=csv';
      const response = await fetch(SHEET_URL);
      const csvText = await response.text();
      const rows = csvText.split('\n');
      const formattedData = rows.slice(1).map((row, index) => {
        const [name, query] = row.split(','); 
        return { id: `church-${index}`, name: name?.trim() || 'Unknown', query: query?.trim() || '' };
      }).filter(item => item.query !== ''); 
      setChurches(formattedData);
    } catch (error) {
      Alert.alert('Error', 'Could not update churches.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchChurches(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChurches();
  }, []);

  return (
    <ImageBackground source={LOCAL_CHURCH_BG} style={styles.background}>
      <View style={styles.overlayContainer}>
        <FlatList
          data={churches}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(Platform.OS === 'ios' ? `http://maps.apple.com/?q=${item.query}` : `https://www.google.com/maps/search/?api=1&query=${item.query}`)}>
              <Text style={styles.cardText}>⛪ Navigate: {item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlayContainer: { flex: 1, backgroundColor: 'rgba(244, 244, 244, 0.85)', padding: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 15, elevation: 3 },
  cardText: { fontSize: 16, color: '#333', fontWeight: '500' }
});
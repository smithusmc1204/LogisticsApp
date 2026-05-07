import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, ImageBackground, Linking, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BG_MAP = { uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop' };

export default function SitesScreen() {
  const [sites, setSites] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSites = async () => {
    try {
      const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?gid=1539537199&single=true&output=csv';
      const response = await fetch(SHEET_URL);
      const csvText = await response.text();
      const rows = csvText.split('\n');
      const formattedData = rows.slice(1).map((row, index) => {
        const [name, query] = row.split(','); 
        return { id: `site-${index}`, name: name?.trim() || 'Unknown', query: query?.trim() || '' };
      }).filter(item => item.query !== ''); 
      setSites(formattedData);
    } catch (error) {
      Alert.alert('Error', 'Could not update locations.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchSites(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSites();
  }, []);

  const openMaps = (query: string) => {
    const url = Platform.OS === 'ios' ? `http://maps.apple.com/?q=${query}` : `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  return (
    <ImageBackground source={BG_MAP} style={styles.background}>
      <View style={styles.overlayContainer}>
        <FlatList
          data={sites}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => openMaps(item.query)}>
              <Text style={styles.cardText}>📍 Navigate: {item.name}</Text>
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
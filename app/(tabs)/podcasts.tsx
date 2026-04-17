import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ImageBackground, Linking, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BG_TECH = { uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop' };

export default function PodcastsScreen() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPodcasts = async () => {
    try {
      const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?output=csv';
      const response = await fetch(SHEET_URL);
      const csvText = await response.text();
      const rows = csvText.split('\n');
      const formattedData = rows.slice(1).map((row, index) => {
        const [title, url] = row.split(','); 
        return { id: `pod-${index}`, title: title?.trim() || 'Unknown', url: url?.trim() || '' };
      }).filter(item => item.url !== '');
      setPodcasts(formattedData);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchPodcasts(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPodcasts();
  }, []);

  return (
    <ImageBackground source={BG_TECH} style={styles.background}>
      <View style={styles.overlayContainer}>
        <FlatList
          data={podcasts}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.url)}>
              <Text style={styles.cardText}>🎧 Listen: {item.title}</Text>
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
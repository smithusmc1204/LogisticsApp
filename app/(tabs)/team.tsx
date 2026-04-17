import { Ionicons } from '@expo/vector-icons';
import * as SMS from 'expo-sms';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ImageBackground, Linking, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BG_TECH = { uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop' };

export default function TeamScreen() {
  const [teamRoster, setTeamRoster] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeam = async () => {
    try {
      const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?gid=347248155&single=true&output=csv';
      const response = await fetch(SHEET_URL);
      const csvText = await response.text();
      const rows = csvText.split('\n');
      const formattedData = rows.slice(1).map((row, index) => {
        const [name, role, phone] = row.split(','); 
        return { id: `team-${index}`, name: name?.trim() || 'Unknown', role: role?.trim() || 'N/A', phone: phone?.trim() || '' };
      }).filter(item => item.name !== 'Unknown');
      setTeamRoster(formattedData);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTeam();
  }, []);

  return (
    <ImageBackground source={BG_TECH} style={styles.background}>
      <View style={styles.overlayContainer}>
        <FlatList
          data={teamRoster}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
          renderItem={({ item }) => (
            <View style={styles.teamCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.roleText}>{item.role}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
                  <Ionicons name="call" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#34C759' }]} onPress={() => SMS.sendSMSAsync([item.phone], '')}>
                  <Ionicons name="chatbubble" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlayContainer: { flex: 1, backgroundColor: 'rgba(244, 244, 244, 0.85)', padding: 20 },
  teamCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  nameText: { fontSize: 18, fontWeight: 'bold' },
  roleText: { color: '#666' },
  btn: { backgroundColor: '#007AFF', padding: 10, borderRadius: 50 }
});
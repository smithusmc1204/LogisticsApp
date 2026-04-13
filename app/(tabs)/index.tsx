import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SMS from 'expo-sms';
import React, { useState } from 'react';
import { Alert, FlatList, ImageBackground, KeyboardAvoidingView, Linking, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- 1. DATA ---


const TEAM_NUMBERS = ['9733626754', '9843351239'];

// --- BACKGROUND IMAGE URLS ---
const BG_MAP = { uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop' };
const BG_CHURCH = { uri: 'https://images.unsplash.com/photo-1548625361-ec857149bcde?q=80&w=1000&auto=format&fit=crop' }; 
const BG_TECH = { uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop' }; 
const BG_TACTICAL = { uri: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=1000&auto=format&fit=crop' };

// --- 2. SCREEN COMPONENTS ---

function SitesScreen() {
  const [sites, setSites] = useState<{ id: string; name: string; query: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchSites = async () => {
      try {
        // PASTE YOUR NEW "SITES" TAB CSV LINK HERE!
        // Make sure it is the link specific to the Sites tab (check the gid= number at the end)
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?gid=1539537199&single=true&output=csv';
        
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        
        const rows = csvText.split('\n');
        
        const formattedData = rows.slice(1).map((row, index) => {
          const [name, query] = row.split(','); 
          
          return {
            id: `sheet-site-${index}`,
            name: name ? name.trim() : 'Unknown Location',
            query: query ? query.trim() : ''
          };
        }).filter(item => item.query !== ''); 

        setSites(formattedData);
        setIsLoading(false);

      } catch (error) {
        Alert.alert('Network Error', 'Could not fetch locations.');
        setIsLoading(false);
      }
    };

    fetchSites();
  }, []); 

  const openMaps = (query: string) => {
    const url = Platform.OS === 'ios' 
      ? `http://maps.apple.com/?q=${query}` 
      : `https://www.google.com/maps/search/?api=1&query=${query}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else Alert.alert('Error', 'Map application not found.');
    });
  };

  return (
    <ImageBackground source={BG_MAP} style={styles.background}>
      <View style={styles.overlayContainer}>
        {isLoading ? (
          <Text style={[styles.cardTextBold, { textAlign: 'center', marginTop: 20 }]}>
            Updating work site locations...
          </Text>
        ) : (
          <FlatList
            data={sites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => openMaps(item.query)}>
                <Text style={styles.cardText}>📍 Navigate: {item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
}

function ChurchesScreen() {
  const [churches, setChurches] = useState<{ id: string; name: string; query: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchChurches = async () => {
      try {
        // PASTE YOUR NEW "CHURCHES" TAB CSV LINK HERE!
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?gid=304443399&single=true&output=csv';
        
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        
        const rows = csvText.split('\n');
        
        const formattedData = rows.slice(1).map((row, index) => {
          const [name, query] = row.split(','); 
          
          return {
            id: `sheet-church-${index}`,
            name: name ? name.trim() : 'Unknown Location',
            query: query ? query.trim() : ''
          };
        }).filter(item => item.query !== ''); 

        setChurches(formattedData);
        setIsLoading(false);

      } catch (error) {
        Alert.alert('Network Error', 'Could not fetch church locations.');
        setIsLoading(false);
      }
    };

    fetchChurches();
  }, []); 

  const openMaps = (query: string) => {
    const url = Platform.OS === 'ios' 
      ? `http://maps.apple.com/?q=${query}` 
      : `https://www.google.com/maps/search/?api=1&query=${query}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else Alert.alert('Error', 'Map application not found.');
    });
  };

  return (
    <ImageBackground source={BG_CHURCH} style={styles.background}>
      <View style={styles.overlayContainer}>
        {isLoading ? (
          <Text style={[styles.cardTextBold, { textAlign: 'center', marginTop: 20 }]}>
            Updating Dinner locations...
          </Text>
        ) : (
          <FlatList
            data={churches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => openMaps(item.query)}>
                <Text style={styles.cardText}>⛪ Navigate: {item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
}

function PodcastsScreen() {
  // 1. Create a "bucket" to hold the podcasts we download
  const [podcasts, setPodcasts] = useState<{ id: string; title: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. This function runs automatically as soon as the screen loads
  React.useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        // Replace this URL with your published CSV link from Google Sheets!
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?output=csv';
        
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        
        // 3. Convert the raw CSV text into a format the app can read
        // We split the text by new lines to get each row
        const rows = csvText.split('\n');
        
        // We skip the first row (headers) and process the rest
        const formattedData = rows.slice(1).map((row, index) => {
          // Note: Avoid putting commas in your actual podcast titles for now, 
          // as it will confuse this simple comma-splitter!
          const [title, url] = row.split(','); 
          
          return {
            id: `sheet-pod-${index}`,
            title: title ? title.trim() : 'Unknown Title',
            url: url ? url.trim() : ''
          };
        }).filter(item => item.url !== ''); // Only keep rows that actually have a URL

        setPodcasts(formattedData);
        setIsLoading(false);

      } catch (error) {
        Alert.alert('Network Error', 'Could not fetch daily podcasts.');
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []); // The empty brackets mean "only run this once when the screen opens"

  const openMedia = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else Alert.alert('Error', 'Cannot open link on this device.');
    });
  };

  return (
    <ImageBackground source={BG_TECH} style={styles.background}>
      <View style={styles.overlayContainer}>
        {isLoading ? (
          <Text style={[styles.cardTextBold, { textAlign: 'center', marginTop: 20 }]}>
            Fetching latest podcasts...
          </Text>
        ) : (
          <FlatList
            data={podcasts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => openMedia(item.url)}>
                <Text style={styles.cardText}>🎧 Listen: {item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
}
// --- UPDATED SUPPLIES SCREEN ---
function SuppliesScreen() {
  const [inventory, setInventory] = useState<{ id: string; name: string; price: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cart, setCart] = useState<{ id: string; name: string; price: string }[]>([]);
  const [customItemText, setCustomItemText] = useState('');

  React.useEffect(() => {
    const fetchInventory = async () => {
      try {
        // PASTE YOUR NEW "SUPPLIES" TAB CSV LINK HERE!
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?gid=1257808001&single=true&output=csv';
        
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        const rows = csvText.split('\n');
        
        const formattedData = rows.slice(1).map((row, index) => {
          const [name, price] = row.split(','); 
          return {
            id: `sheet-item-${index}`,
            name: name ? name.trim() : 'Unknown Item',
            price: price ? price.trim() : 'TBD'
          };
        }).filter(item => item.name !== 'Unknown Item' && item.name !== ''); 

        setInventory(formattedData);
        setIsLoading(false);
      } catch (error) {
        Alert.alert('Network Error', 'Could not fetch inventory.');
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const addToOrder = (item: { id: string; name: string; price: string }) => {
    setCart([...cart, item]);
    Alert.alert('Added', `${item.name} added to your request.`);
  };

  const addCustomItem = () => {
    if (customItemText.trim() === '') {
      Alert.alert('Error', 'Please type an item name first.');
      return;
    }
    const newItem = { id: `custom-${Date.now()}`, name: customItemText.trim(), price: 'TBD' };
    setCart([...cart, newItem]);
    Alert.alert('Added', `${newItem.name} added to your request.`);
    setCustomItemText(''); 
  };

  const submitOrder = async () => {
    if (cart.length === 0) return Alert.alert('Empty', 'Please add items before ordering.');
    const orderDetails = cart.map(item => `- ${item.name}`).join('\n');
    const messageBody = `SUPPLY REQUISITION:\n${orderDetails}`;

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(TEAM_NUMBERS, messageBody);
      if (result === 'sent') {
        Alert.alert('Order Sent', 'Requisition transmitted to team.');
        setCart([]); 
      }
    } else Alert.alert('Error', 'SMS is not available on this device.');
  };

  return (
    <ImageBackground source={BG_TACTICAL} style={styles.background}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.overlayContainer}>
          {isLoading ? (
            <Text style={[styles.cardTextBold, { textAlign: 'center', color: '#fff', marginTop: 20 }]}>
              Syncing manifest...
            </Text>
          ) : (
            <FlatList
              data={inventory} // We now use the dynamic 'inventory' bucket here!
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.rowCard}>
                  <Text style={styles.cardText}>{item.name}</Text>
                  <TouchableOpacity style={styles.addButton} onPress={() => addToOrder(item)}>
                    <Text style={styles.addButtonText}>+ ADD</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <View style={styles.customInputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Other: Type custom item..."
              value={customItemText}
              onChangeText={setCustomItemText}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCustomItem}>
              <Text style={styles.addButtonText}>+ ADD</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={submitOrder}>
            <Text style={styles.submitButtonText}>Submit Order ({cart.length} items)</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// --- UPDATED TEAM SCREEN ---
function TeamScreen() {
  const [teamRoster, setTeamRoster] = useState<{ id: string; name: string; role: string; phone: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchTeam = async () => {
      try {
        // PASTE YOUR NEW "TEAM" TAB CSV LINK HERE!
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQS0vkOdvbMIgrRUo1MxsKJPaDIdac3ndqmlyshfxyD3gylUPliC-w7OAgUZxEJXINSPGCCoHyBCpX8/pub?gid=347248155&single=true&output=csv';
        
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        const rows = csvText.split('\n');
        
        const formattedData = rows.slice(1).map((row, index) => {
          // Notice we are grabbing 3 columns here instead of 2!
          const [name, role, phone] = row.split(','); 
          
          return {
            id: `sheet-team-${index}`,
            name: name ? name.trim() : 'Unknown Member',
            role: role ? role.trim() : 'N/A',
            phone: phone ? phone.trim() : ''
          };
        }).filter(item => item.name !== 'Unknown Member' && item.name !== ''); 

        setTeamRoster(formattedData);
        setIsLoading(false);
      } catch (error) {
        Alert.alert('Network Error', 'Could not fetch team roster.');
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('Error', 'Unable to open dialer.'));
  };

  const handleText = async (phone: string) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync([phone], '');
    } else {
      Linking.openURL(`sms:${phone}`).catch(() => Alert.alert('Error', 'Unable to open messenger.'));
    }
  };

  return (
    <ImageBackground source={BG_TECH} style={styles.background}>
      <View style={styles.overlayContainer}>
        {isLoading ? (
          <Text style={[styles.cardTextBold, { textAlign: 'center', marginTop: 20 }]}>
            Downloading comms roster...
          </Text>
        ) : (
          <FlatList
            data={teamRoster} // We now use the dynamic 'teamRoster' bucket here!
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.teamCard}>
                <View style={styles.teamInfo}>
                  <Text style={styles.cardTextBold}>{item.name}</Text>
                  <Text style={styles.subtitleText}>{item.role}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleCall(item.phone)}>
                    <Ionicons name="call" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#34C759' }]} onPress={() => handleText(item.phone)}>
                    <Ionicons name="chatbubble" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
}
function SOSScreen() {
  const sendHelpRequest = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(TEAM_NUMBERS, 'URGENT: Requesting immediate assistance at my current location.');
      if (result === 'sent') Alert.alert('Sent', 'Message transmitted to team.');
    } else Alert.alert('Error', 'SMS is not available on this device.');
  };

  return (
    <ImageBackground source={BG_TACTICAL} style={styles.background}>
      <View style={styles.sosOverlayContainer}>
        <TouchableOpacity style={styles.sosButton} onPress={sendHelpRequest}>
          <Text style={styles.sosText}>TRANSMIT HELP REQUEST</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// --- 3. MAIN APP ROUTER ---
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === 'Sites') iconName = 'map';
          else if (route.name === 'Churches') iconName = 'book';
          else if (route.name === 'Podcasts') iconName = 'headset';
          else if (route.name === 'Supplies') iconName = 'cart';
          else if (route.name === 'Team') iconName = 'people';
          else if (route.name === 'SOS') iconName = 'warning';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarLabelStyle: { fontSize: 10 },
      })}
    >
      <Tab.Screen name="Sites" component={SitesScreen} />
      <Tab.Screen name="Churches" component={ChurchesScreen} />
      <Tab.Screen name="Podcasts" component={PodcastsScreen} />
      <Tab.Screen name="Supplies" component={SuppliesScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
      <Tab.Screen name="SOS" component={SOSScreen} options={{ title: 'Emergency' }} />
    </Tab.Navigator>
  );
}

// --- 4. STYLES ---
const styles = StyleSheet.create({
  // Background Styles
  background: { flex: 1, resizeMode: 'cover' },
  overlayContainer: { flex: 1, backgroundColor: 'rgba(244, 244, 244, 0.85)', padding: 20 },
  sosOverlayContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 20, justifyContent: 'center' },
  
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5, elevation: 3 },
  rowCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  teamCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  
  cardText: { fontSize: 16, color: '#333', fontWeight: '500', flex: 1 },
  cardTextBold: { fontSize: 18, color: '#333', fontWeight: 'bold' },
  subtitleText: { fontSize: 14, color: '#666', marginTop: 4 },
  
  teamInfo: { flex: 1 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  
  addButton: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6, marginLeft: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  customInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  textInput: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', fontSize: 16 },
  
  submitButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center', shadowColor: '#28a745', shadowOpacity: 0.3, shadowRadius: 5, elevation: 3 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  sosButton: { backgroundColor: '#dc3545', padding: 25, borderRadius: 8, alignItems: 'center', shadowColor: '#dc3545', shadowOpacity: 0.6, shadowRadius: 15, elevation: 8 },
  sosText: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
});
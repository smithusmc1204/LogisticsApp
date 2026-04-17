import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sites',
          tabBarIcon: ({ color }) => <Ionicons name="map" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="churches"
        options={{
          title: 'churches',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="podcasts"
        options={{
          title: 'podcasts',
          tabBarIcon: ({ color }) => <Ionicons name="mic" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="supplies"
        options={{
          title: 'supplies',
          tabBarIcon: ({ color }) => <Ionicons name="basket" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: 'Team',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'sos',
          tabBarIcon: ({ color }) => <Ionicons name="alert" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Centralized tab configuration for Admin interface
const ADMIN_TAB_ITEMS = [
  { name: 'index', title: 'Instructor', icon: 'school-outline' },
  { name: 'camp-schedule', title: 'Schedule', icon: 'calendar' },
  { name: 'records', title: 'Records', icon: 'people-outline' },
  { name: 'profile', title: 'Profile', icon: 'person' },
];

export default function AdminTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: '#999999',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e9ecef',
            height: 70,
            paddingBottom: 14,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 4,
          },
        }}
      >
        {ADMIN_TAB_ITEMS.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color }) => (
                <Ionicons name={tab.icon as any} size={22} color={color} />
              ),
            }}
          />
        ))}
      </Tabs>
    </SafeAreaView>
  );
}

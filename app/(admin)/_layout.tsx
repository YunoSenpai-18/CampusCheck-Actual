import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Centralized tab configuration for Admin interface
const ADMIN_TAB_ITEMS = [
  { name: 'index', title: 'Instructor', icon: 'school-outline' },
  { name: 'scanner', title: 'Scanner', icon: 'camera' },
  { name: 'records', title: 'Records', icon: 'people-outline' },
  { name: 'camp-schedule', title: 'Schedule', icon: 'calendar' },
  { name: 'profile', title: 'Profile', icon: 'person' },
];

export default function AdminTabLayout() {
  const colorScheme = useColorScheme();

  return (
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
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
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
              <Ionicons name={tab.icon as any} size={24} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

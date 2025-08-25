import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showProfile?: boolean;
  onProfilePress?: () => void;
}

export default function Header({ 
  title, 
  subtitle, 
  showProfile = true, 
  onProfilePress 
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={require('../../assets/images/logo-Photoroom.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>CampusCheck</Text>
          <Text style={styles.pageSubtitle}>{title}</Text>
          {subtitle && <Text style={styles.pageSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      {showProfile && (
        <TouchableOpacity style={styles.profileContainer} onPress={onProfilePress}>
          <View style={styles.profilePhoto}>
            <Ionicons name="person" size={24} color="#666666" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  pageTitleContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  profileContainer: {
    marginLeft: 16,
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 
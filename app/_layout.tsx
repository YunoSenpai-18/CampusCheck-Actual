import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        {/* Auth group (login, register, etc.) */}
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />

        {/* Main tabs group */}
        <Stack.Screen
          name="(admin)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(checker)"
          options={{ headerShown: false }}
        />

        {/* Not found page */}
        <Stack.Screen 
          name="+not-found"
          options={{ headerShown: false }}
        />

        {/* Create page */}
        <Stack.Screen
          name="create-instructors"
          options={{ headerShown: false }}
        />
        
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

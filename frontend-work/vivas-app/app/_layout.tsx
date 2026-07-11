import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { I18nProvider } from '../src/i18n/context';

// Suppress web-specific style array warnings (harmless in production)
LogBox.ignoreLogs(['expo-router']);

export default function RootLayout() {
  return (
    <I18nProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0A0A0A' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0A0A0A' },
          animation: 'fade',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Vivas Nos Queremos',
            headerShown: false,
          }}
        />
        <Stack.Screen name="profile" options={{ title: 'Mi Perfil', presentation: 'modal' }} />
        <Stack.Screen name="emergency" options={{ title: '🆘 Emergencia', presentation: 'modal' }} />
        <Stack.Screen name="checkin" options={{ title: 'Check-In', presentation: 'modal' }} />
        <Stack.Screen name="blacklist" options={{ title: 'Blacklist', presentation: 'modal' }} />
        <Stack.Screen name="chat" options={{ title: 'Acompañante IA', presentation: 'modal' }} />
        <Stack.Screen name="telegram" options={{ title: 'Telegram', headerShown: false }} />
        <Stack.Screen name="travel" options={{ title: '✈️ Travel Plan', presentation: 'modal' }} />
        <Stack.Screen name="substances" options={{ title: '💊 Info Sustancias', presentation: 'modal' }} />
      </Stack>
    </I18nProvider>
  );
}

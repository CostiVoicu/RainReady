import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './app/navigation';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
  );
}

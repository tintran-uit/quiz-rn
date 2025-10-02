
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LocaleProvider } from './src/i18n/LocaleProvider';

export default function App() {
  return (
    <LocaleProvider>
      <StatusBar style="light" backgroundColor="#2196F3" />
      <AppNavigator />
    </LocaleProvider>
  );
}

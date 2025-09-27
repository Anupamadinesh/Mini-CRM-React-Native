// App.js (Final, Stable Code)
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, Provider as PaperProvider, ActivityIndicator } from 'react-native-paper'; 
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import { store } from 'src/store/store'; // Final path verified
import AppNavigator from 'src/navigation/AppNavigator'; // Final path verified

const theme = {
  // ... (theme definition is correct)
};

// Simplified component structure (renamed from InitialLoader to Main)
const Main = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial async operations needed before rendering the UI
    async function loadResourcesAndDataAsync() {
      try {
        // (Optional: You can add code here to retrieve persisted user token)
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false); // Tell the app it's safe to render the navigator
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
      <ActivityIndicator animating={true} size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
      <StatusBar style="auto" />
    </PaperProvider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
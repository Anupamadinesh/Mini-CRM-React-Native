// App.js (Full code update for token persistence check)
import React, { useEffect, useState } from 'react'; // ADD useState
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, Provider as PaperProvider, ActivityIndicator } from 'react-native-paper'; // ADD ActivityIndicator
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ADD AsyncStorage
import { store } from 'src/store/store';
import AppNavigator from 'src/navigation/AppNavigator';

const theme = {
  // ... (theme definition is correct)
};

// Component to handle initial loading and token check
const InitialLoader = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Simulate an async check (e.g., getting a persisted token)
    async function prepare() {
      try {
        // Here you would check AsyncStorage for the token
        const token = await AsyncStorage.getItem('userToken');
        // If token exists, dispatch a setToken action here, but for now, we just wait.
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the app to render the main navigator
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
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
      {/* Use the new loader component */}
      <InitialLoader />
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
// DELETE the old 'const Main' component as it's replaced by InitialLoader.
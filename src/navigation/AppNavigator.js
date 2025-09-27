// src/navigation/AppNavigator.js (updated)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import CustomerFormScreen from '../screens/CustomerFormScreen';
import CustomerDetailsScreen from '../screens/CustomerDetailsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LeadFormScreen from '../screens/LeadFormScreen'; // Import the new screen

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const CustomerStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CustomerList"
      component={CustomerListScreen}
      options={{ title: 'Customers' }}
    />
    <Stack.Screen
      name="CustomerForm"
      component={CustomerFormScreen}
      options={{ title: 'Customer' }}
    />
    <Stack.Screen
      name="CustomerDetails"
      component={CustomerDetailsScreen}
      options={{ title: 'Customer Details' }}
    />
    <Stack.Screen
      name="LeadForm" // Add the new screen
      component={LeadFormScreen}
      options={{ title: 'Lead Form' }}
    />
  </Stack.Navigator>
);

const MainAppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Customers') {
          iconName = 'account-group';
        } else if (route.name === 'Dashboard') {
          iconName = 'view-dashboard';
        }
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Customers" component={CustomerStack} />
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="MainAppTabs" component={MainAppTabs} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
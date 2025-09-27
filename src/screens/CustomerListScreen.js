// src/screens/CustomerListScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, deleteCustomer } from '../features/customers/customersSlice'; // Import deleteCustomer
import { Text, ActivityIndicator, List, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const CustomerListScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // Get the navigation object
  const { customers, status, error } = useSelector((state) => state.customers);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCustomers());
    }
  }, [status, dispatch]);

  const handleAddCustomer = () => {
    navigation.navigate('CustomerForm');
  };

  const renderCustomerItem = ({ item }) => (
    <List.Item
      title={item.name}
      description={item.email}
      left={() => <List.Icon icon="account" />}
      onPress={() => {
        // Navigate to Customer Details screen (we'll do this next)
        navigation.navigate('CustomerDetails', { customerId: item.id });
      }}
      right={() => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon="pencil"
            onPress={() => navigation.navigate('CustomerForm', { customer: item })}
          />
          <IconButton
            icon="delete"
            color="#FF0000"
            onPress={() => {
              Alert.alert(
                "Delete Customer",
                `Are you sure you want to delete ${item.name}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", onPress: () => dispatch(deleteCustomer(item.id)) }
                ]
              );
            }}
          />
        </View>
      )}
    />
  );

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.center}>
        <Text>Failed to load customers: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCustomerItem}
        contentContainerStyle={styles.list}
      />
      <IconButton
        icon="plus-circle"
        size={60}
        color="#6200EE"
        onPress={handleAddCustomer}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CustomerListScreen;
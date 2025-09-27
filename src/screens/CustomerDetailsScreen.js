// src/screens/CustomerDetailsScreen.js (updated)
import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';
import { Text, Title, Subheading, Divider, List, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeadsByCustomer, deleteLead } from '../features/leads/leadsSlice';

const CustomerDetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { customerId } = route.params;

  const customer = useSelector(
    (state) => state.customers.customers.find((cust) => cust.id === customerId)
  );

  const { leadsByCustomer, status, error } = useSelector((state) => state.leads);

  useEffect(() => {
    if (customer) {
      navigation.setOptions({ title: customer.name });
      dispatch(fetchLeadsByCustomer(customerId));
    }
  }, [customer, navigation, customerId, dispatch]);

  const renderLeadItem = ({ item }) => (
    <List.Item
      title={item.title}
      description={`Status: ${item.status} | Value: $${item.value}`}
      right={() => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon="pencil"
            onPress={() => navigation.navigate('LeadForm', { lead: item, customerId: customer.id })}
          />
          <IconButton
            icon="delete"
            color="#FF0000"
            onPress={() => {
              Alert.alert("Delete Lead", `Are you sure you want to delete this lead?`, [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => dispatch(deleteLead(item.id)) }
              ]);
            }}
          />
        </View>
      )}
    />
  );

  if (!customer) {
    return <View style={styles.center}><Text>Customer not found.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Title style={styles.title}>{customer.name}</Title>
        <Subheading>{customer.company}</Subheading>
        <Divider style={styles.divider} />
        <View style={styles.detailsRow}>
          <List.Icon icon="email" />
          <Text style={styles.detailText}>{customer.email}</Text>
        </View>
        <View style={styles.detailsRow}>
          <List.Icon icon="phone" />
          <Text style={styles.detailText}>{customer.phone}</Text>
        </View>
      </View>

      <View style={styles.leadsSection}>
        <View style={styles.leadsHeader}>
          <Title>Leads/Opportunities</Title>
          <IconButton 
            icon="plus-circle"
            size={30}
            color="#6200EE"
            onPress={() => navigation.navigate('LeadForm', { customerId: customer.id })}
          />
        </View>

        {status === 'loading' ? (
          <ActivityIndicator animating={true} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={leadsByCustomer}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderLeadItem}
            ListEmptyComponent={() => <Text style={{ textAlign: 'center', marginTop: 20 }}>No leads found.</Text>}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: 20, margin: 10, borderRadius: 8, elevation: 2 },
  title: { fontSize: 24 },
  divider: { marginVertical: 10 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailText: { fontSize: 16, marginLeft: 8 },
  leadsSection: { padding: 10 },
  leadsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default CustomerDetailsScreen;
// src/screens/DashboardScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, Title, ActivityIndicator } from 'react-native-paper';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLeads } from '../features/leads/leadsSlice';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const { allLeads, status, error } = useSelector((state) => state.leads);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllLeads());
    }
  }, [status, dispatch]);

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
        <Text>Failed to load dashboard data: {error.message}</Text>
      </View>
    );
  }

  const getLeadsByStatusData = () => {
    const statusCounts = allLeads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      New: '#FF6384',
      Contacted: '#36A2EB',
      Converted: '#FFCE56',
      Lost: '#E7E9ED',
    };

    return Object.keys(statusCounts).map((status) => ({
      name: status,
      count: statusCounts[status],
      color: colors[status] || '#000',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));
  };

  const getTotalValueData = () => {
    const totalValue = allLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    return {
      labels: ['Total Value'],
      datasets: [
        {
          data: [totalValue],
          colors: [(opacity = 1) => `rgba(98, 0, 238, ${opacity})`],
        },
      ],
    };
  };

  const pieChartData = getLeadsByStatusData();
  const barChartData = getTotalValueData();

  const totalLeadsValue = allLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.chartTitle}>Leads by Status</Title>
      {allLeads.length > 0 ? (
        <PieChart
          data={pieChartData}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.noDataText}>No leads data to display.</Text>
      )}

      <Title style={styles.chartTitle}>Total Value of Leads</Title>
      <Text style={styles.totalValueText}>${totalLeadsValue.toLocaleString()}</Text>

      {allLeads.length > 0 ? (
        <BarChart
          data={barChartData}
          width={screenWidth - 20}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          style={styles.barChart}
        />
      ) : (
         <Text style={styles.noDataText}>No value data to display.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  totalValueText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200EE',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
  },
  barChart: {
    marginVertical: 8,
  },
});

export default DashboardScreen;
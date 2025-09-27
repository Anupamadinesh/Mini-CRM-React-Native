// src/screens/CustomerFormScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { createCustomer, updateCustomer } from '../features/customers/customersSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';

const CustomerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required.'),
  email: Yup.string().email('Invalid email address.').required('Email is required.'),
  phone: Yup.string().matches(/^[0-9-()]*$/, 'Invalid phone number.').optional(),
  company: Yup.string().optional(),
});

const CustomerFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { customer } = route.params || {};
  const isEditing = !!customer;

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Customer' : 'Add New Customer',
    });
  }, [isEditing, navigation]);

  const handleSubmit = (values) => {
    if (isEditing) {
      dispatch(updateCustomer({ id: customer.id, ...values }));
    } else {
      dispatch(createCustomer(values));
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{isEditing ? 'Edit Customer' : 'New Customer'}</Title>

      <Formik
        initialValues={{
          name: customer?.name || '',
          email: customer?.email || '',
          phone: customer?.phone || '',
          company: customer?.company || '',
        }}
        validationSchema={CustomerSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              label="Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              style={styles.input}
              error={errors.name && touched.name}
            />
            {errors.name && touched.name && <HelperText type="error" visible={true}>{errors.name}</HelperText>}

            <TextInput
              label="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email && touched.email}
            />
            {errors.email && touched.email && <HelperText type="error" visible={true}>{errors.email}</HelperText>}

            <TextInput
              label="Phone"
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              value={values.phone}
              style={styles.input}
              keyboardType="phone-pad"
              error={errors.phone && touched.phone}
            />
            {errors.phone && touched.phone && <HelperText type="error" visible={true}>{errors.phone}</HelperText>}

            <TextInput
              label="Company"
              onChangeText={handleChange('company')}
              onBlur={handleBlur('company')}
              value={values.company}
              style={styles.input}
              error={errors.company && touched.company}
            />
            {errors.company && touched.company && <HelperText type="error" visible={true}>{errors.company}</HelperText>}

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              {isEditing ? 'Save Changes' : 'Create Customer'}
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
  input: { marginBottom: 4 },
  button: { marginTop: 16 },
});

export default CustomerFormScreen;
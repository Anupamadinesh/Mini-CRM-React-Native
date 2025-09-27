// src/screens/LeadFormScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Title, Subheading, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { createLead, updateLead } from '../features/leads/leadsSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LeadSchema = Yup.object().shape({
  title: Yup.string().required('Title is required.'),
  description: Yup.string().optional(),
  status: Yup.string().oneOf(['New', 'Contacted', 'Converted', 'Lost']).required('Status is required.'),
  value: Yup.number().typeError('Value must be a number.').min(0, 'Value must be positive.').required('Value is required.'),
});

const LeadFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { lead, customerId } = route.params || {};
  const isEditing = !!lead;

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Edit Lead' : 'Add New Lead' });
  }, [isEditing, navigation]);

  const handleSubmit = (values) => {
    const leadData = {
      ...values,
      customerId: customerId,
    };
    
    if (isEditing) {
      dispatch(updateLead({ id: lead.id, ...leadData }));
    } else {
      dispatch(createLead(leadData));
    }
    
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{isEditing ? 'Edit Lead' : 'New Lead'}</Title>

      <Formik
        initialValues={{
          title: lead?.title || '',
          description: lead?.description || '',
          status: lead?.status || 'New',
          value: lead?.value?.toString() || '',
        }}
        validationSchema={LeadSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View>
            <TextInput
              label="Title"
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
              style={styles.input}
              error={errors.title && touched.title}
            />
            {errors.title && touched.title && <HelperText type="error" visible={true}>{errors.title}</HelperText>}
            
            <TextInput
              label="Description"
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              style={styles.input}
              multiline
            />
            
            <Subheading style={styles.pickerLabel}>Status</Subheading>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={values.status}
                onValueChange={(itemValue) => setFieldValue('status', itemValue)}
              >
                <Picker.Item label="New" value="New" />
                <Picker.Item label="Contacted" value="Contacted" />
                <Picker.Item label="Converted" value="Converted" />
                <Picker.Item label="Lost" value="Lost" />
              </Picker>
            </View>

            <TextInput
              label="Value"
              onChangeText={handleChange('value')}
              onBlur={handleBlur('value')}
              value={values.value}
              style={styles.input}
              keyboardType="numeric"
              error={errors.value && touched.value}
            />
            {errors.value && touched.value && <HelperText type="error" visible={true}>{errors.value}</HelperText>}
            <HelperText type="info">In currency (e.g., USD)</HelperText>

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              {isEditing ? 'Save Changes' : 'Create Lead'}
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
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginBottom: 16 },
  pickerLabel: { fontSize: 16, color: '#6200EE', paddingLeft: 10, marginTop: 16 },
});

export default LeadFormScreen;
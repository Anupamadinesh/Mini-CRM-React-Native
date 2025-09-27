// src/screens/RegisterScreen.js
import React from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Title, Subheading, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// IMPORTANT: Using your successful API URL
const API_URL = 'http://192.168.31.238:3000'; 

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required.'),
  email: Yup.string().email('Invalid email').required('Email is required.'),
  password: Yup.string().min(6, 'Password is too short - min 6 chars.').required('Password is required.'),
});

// The component receives the navigation prop
const RegisterScreen = ({ navigation }) => {
  // DELETE the unnecessary const [loading, setLoading] = React.useState(false);

  // CRITICAL FIX: The function now receives 'actions' and uses setSubmitting
  const handleRegister = async (values, { setSubmitting }) => { 
    // setSubmitting(true) is handled automatically by Formik's onSubmit wrapper

    try {
      // Send data to the mock users endpoint.
      await axios.post(`${API_URL}/users`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // SUCCESS PATH
      Alert.alert(
        "Success!", 
        "Account created successfully. Please log in.",
        [{ text: "OK", onPress: () => navigation.navigate('Login') }]
      );
      
      // We don't need setSubmitting(false) here, as Formik does it when the promise resolves.

    } catch (error) {
      // ERROR PATH
      const errorMessage = error.response?.data?.message || 'Network error or internal server issue. Please try again.';
      Alert.alert("Registration Failed", errorMessage);
      
      // Ensure submitting is turned off after failure
      setSubmitting(false); // Manually set false on error to stop spinner
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Title style={styles.title}>Dev Innovations Labs</Title>
        <Subheading style={styles.subtitle}>Create Mini CRM Account</Subheading>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={RegisterSchema}
          // CRITICAL FIX: Pass the action object to the handler
          onSubmit={handleRegister} 
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => ( // <--- USE isSubmitting
            <View>
              {/* ... (Input fields) ... */}
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
                label="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                style={styles.input}
                secureTextEntry
                error={errors.password && touched.password}
              />
              {errors.password && touched.password && <HelperText type="error" visible={true}>{errors.password}</HelperText>}
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={isSubmitting} // <--- USE Formik's isSubmitting prop
                style={styles.button}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </View>
          )}
        </Formik>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        >
          Already have an account? Log In
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 4 },
  button: { marginTop: 16 },
  loginButton: { marginTop: 16 },
});

export default RegisterScreen;
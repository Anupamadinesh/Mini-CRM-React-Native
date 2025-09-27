// src/screens/LoginScreen.js (FINAL CORRECTED VERSION)
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Subheading, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';

// NOTE: Removed the unused 'useNavigation' import, as we are receiving it as a prop.

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password is too short').required('Required'),
});

// CRITICAL FIX: Receive 'navigation' as a prop
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  // NOTE: Deleted 'const navigation = useNavigation();' to prevent conflict.
  const { status } = useSelector((state) => state.auth);

  const handleLogin = (values) => {
    dispatch(loginUser(values));
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Dev Innovations Labs</Title>
      <Subheading style={styles.subtitle}>Mini CRM</Subheading>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
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
              loading={status === 'loading'}
              style={styles.button}
            >
              {status === 'loading' ? 'Logging in...' : 'Login'}
            </Button>
          </View>
        )}
      </Formik>

      {/* Navigation is now correctly accessed via the prop */}
      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        style={styles.registerButton}
      >
        Don't have an account? Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 4 },
  button: { marginTop: 16 },
  registerButton: { marginTop: 16 },
});

export default LoginScreen;
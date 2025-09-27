import 'react-native';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginScreen from '../LoginScreen';
import { loginUser } from '../../features/auth/authSlice';

const mockStore = configureStore([]);

test('login button displays loading spinner on press', async () => {
  const store = mockStore({
    auth: { token: null, status: 'idle', error: null },
  });
  store.dispatch = jest.fn();

  const { getByText } = render(
    <Provider store={store}>
      <LoginScreen />
    </Provider>
  );

  fireEvent.press(getByText('Login'));

  expect(store.dispatch).toHaveBeenCalledWith(loginUser({ email: '', password: '' }));

  // Test the loading state
  const loadingStore = mockStore({ auth: { status: 'loading' } });
  const { getByText: getByTextLoading } = render(
    <Provider store={loadingStore}>
      <LoginScreen />
    </Provider>
  );
  expect(getByTextLoading('Logging in...')).toBeTruthy();
});
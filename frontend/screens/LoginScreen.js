import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import app from '../../database/config';

const auth = getAuth(app);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter email and password.');
      setHasError(true);
      return;
    }

    setErrorMessage('');
    setHasError(false);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      navigation.replace('Main');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMessage('Email or password is incorrect.');
      } else {
        setErrorMessage(error.message || 'Unable to log in. Please try again.');
      }
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#F8FAFC', '#E0F2FE']} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
        </View>
        <View style={styles.headerBox}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your safety plan.</Text>
        </View>

        <TextInput
          placeholder="Enter Email"
          style={[styles.input, hasError && styles.inputError]}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errorMessage) {
              setErrorMessage('');
              setHasError(false);
            }
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="login-email-input"
          testID="login-email-input"
        />

        <View style={[styles.passwordContainer, hasError && styles.inputError]}>
          <TextInput
            placeholder="Enter Password"
            style={[styles.passwordInput, hasError && styles.inputError]}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMessage) {
                setErrorMessage('');
                setHasError(false);
              }
            }}
            secureTextEntry={!showPassword}
            accessibilityLabel="login-password-input"
            testID="login-password-input"
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          accessibilityLabel="login-submit-button"
          testID="login-submit-button"
        >
          <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} accessibilityLabel="register-link" testID="register-link">
          <Text style={styles.link}>Don’t have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputError: {
    borderColor: '#F87171',
    backgroundColor: '#FEF2F2',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: '#2563EB',
    fontWeight: '700',
  },
});
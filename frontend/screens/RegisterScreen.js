import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import app, { db } from '../../database/config';

const auth = getAuth(app);

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');

    if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill all fields');
      return;
    }

    if (phone.length !== 10) {
      setErrorMessage('Enter a valid mobile number');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        phone,
        email,
        createdAt: new Date(),
      });

      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password must be at least 6 characters.');
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <LinearGradient colors={['#F8FAFC', '#E0F2FE']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="person-add-outline" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.headerBox}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Get ready for a safer tomorrow.</Text>
          </View>

          <TextInput placeholder="First Name" style={styles.input} value={firstName} onChangeText={setFirstName} accessibilityLabel="register-first-name" testID="register-first-name" />
          <TextInput placeholder="Last Name" style={styles.input} value={lastName} onChangeText={setLastName} accessibilityLabel="register-last-name" testID="register-last-name" />
          <TextInput placeholder="Mobile Number" style={styles.input} keyboardType="phone-pad" value={phone} onChangeText={setPhone} accessibilityLabel="register-phone" testID="register-phone" />
          <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} accessibilityLabel="register-email" testID="register-email" />

          <View style={styles.passwordContainer}>
            <TextInput placeholder="Password" style={styles.passwordInput} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} accessibilityLabel="register-password" testID="register-password" />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#2563EB" />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput placeholder="Confirm Password" style={styles.passwordInput} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} accessibilityLabel="register-confirm-password" testID="register-confirm-password" />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleRegister} accessibilityLabel="register-submit-button" testID="register-submit-button">
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    fontSize: 13,
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
    textAlign: 'center',
    marginBottom: 12,
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
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthService } from '../services/AuthService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => navigation.replace('Home') }
        ]);
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="sports-volleyball" size={64} color="#2196F3" />
          <Text style={styles.appName}>Khel-Dristi</Text>
          <Text style={styles.tagline}>AI-Powered Sports Assessment</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to continue your sports journey</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Features Highlight */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Why Khel-Dristi?</Text>
          <View style={styles.featuresList}>
            <View style={styles.feature}>
              <MaterialIcons name="smart-toy" size={20} color="#2196F3" />
              <Text style={styles.featureText}>AI-powered performance analysis</Text>
            </View>
            <View style={styles.feature}>
              <MaterialIcons name="videocam" size={20} color="#2196F3" />
              <Text style={styles.featureText}>Real-time pose estimation</Text>
            </View>
            <View style={styles.feature}>
              <MaterialIcons name="leaderboard" size={20} color="#2196F3" />
              <Text style={styles.featureText}>National ranking system</Text>
            </View>
            <View style={styles.feature}>
              <MaterialIcons name="offline-bolt" size={20} color="#2196F3" />
              <Text style={styles.featureText}>Works offline anywhere</Text>
            </View>
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Login */}
        <View style={styles.demoContainer}>
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={() => {
              setEmail('demo@kheldristi.com');
              setPassword('demo123');
            }}
          >
            <Text style={styles.demoButtonText}>Try Demo Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#2196F3',
    fontSize: 14,
  },
  featuresContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  demoContainer: {
    alignItems: 'center',
  },
  demoButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  demoButtonText: {
    color: '#666',
    fontSize: 12,
  },
});
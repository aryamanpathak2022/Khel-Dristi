import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TestSelectionScreen from './src/screens/TestSelectionScreen';
import CameraScreen from './src/screens/CameraScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

// Import services
import { AuthService } from './src/services/AuthService';
import { AIService } from './src/services/AIService';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize AI models
      await AIService.initializeModels();
      
      // Check authentication status
      const authStatus = await AuthService.checkAuthStatus();
      setIsAuthenticated(authStatus);
      
    } catch (error) {
      console.error('App initialization failed:', error);
      Alert.alert('Initialization Error', 'Failed to initialize app. Please restart.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="auto" />
        {/* Add loading screen component here */}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Login"}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          // Authentication stack
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Create Account' }}
            />
          </>
        ) : (
          // Main app stack
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Khel-Dristi' }}
            />
            <Stack.Screen 
              name="TestSelection" 
              component={TestSelectionScreen}
              options={{ title: 'Select Test' }}
            />
            <Stack.Screen 
              name="Camera" 
              component={CameraScreen}
              options={{ title: 'Record Performance' }}
            />
            <Stack.Screen 
              name="Results" 
              component={ResultsScreen}
              options={{ title: 'Your Results' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'Your Profile' }}
            />
            <Stack.Screen 
              name="Leaderboard" 
              component={LeaderboardScreen}
              options={{ title: 'Leaderboards' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
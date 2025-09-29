import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [athleteStats, setAthleteStats] = useState({
    totalTests: 0,
    bestScore: 0,
    currentRank: 0,
    recentActivity: []
  });

  useEffect(() => {
    loadAthleteData();
  }, []);

  const loadAthleteData = async () => {
    // Mock data loading - would connect to backend
    setAthleteStats({
      totalTests: 12,
      bestScore: 87.5,
      currentRank: 156,
      recentActivity: [
        { test: 'Vertical Jump', score: 87.5, date: '2024-01-20' },
        { test: 'Squat', score: 82.1, date: '2024-01-18' },
        { test: 'Sprint', score: 78.9, date: '2024-01-15' }
      ]
    });
  };

  const startNewTest = () => {
    navigation.navigate('TestSelection');
  };

  const viewProfile = () => {
    navigation.navigate('Profile');
  };

  const viewLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  const testTypes = [
    {
      id: 'vertical-jump',
      name: 'Vertical Jump',
      icon: 'trending-up',
      description: 'Measure your explosive power',
      color: '#FF6B6B'
    },
    {
      id: 'squat',
      name: 'Squat Test',
      icon: 'fitness-center',
      description: 'Test your lower body strength',
      color: '#4ECDC4'
    },
    {
      id: 'sprint',
      name: 'Sprint Test',
      icon: 'directions-run',
      description: 'Measure your speed and agility',
      color: '#45B7D1'
    },
    {
      id: 'push-up',
      name: 'Push-up Test',
      icon: 'accessibility',
      description: 'Test your upper body endurance',
      color: '#96CEB4'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome to Khel-Dristi</Text>
        <Text style={styles.welcomeSubtitle}>
          Your AI-powered sports assessment platform
        </Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{athleteStats.totalTests}</Text>
          <Text style={styles.statLabel}>Tests Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{athleteStats.bestScore}</Text>
          <Text style={styles.statLabel}>Best Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>#{athleteStats.currentRank}</Text>
          <Text style={styles.statLabel}>National Rank</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.primaryAction} onPress={startNewTest}>
          <MaterialIcons name="add-circle" size={24} color="white" />
          <Text style={styles.primaryActionText}>Start New Test</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryAction} onPress={viewProfile}>
            <MaterialIcons name="person" size={20} color="#2196F3" />
            <Text style={styles.secondaryActionText}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryAction} onPress={viewLeaderboard}>
            <MaterialIcons name="leaderboard" size={20} color="#2196F3" />
            <Text style={styles.secondaryActionText}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Test Types Overview */}
      <View style={styles.testsSection}>
        <Text style={styles.sectionTitle}>Available Tests</Text>
        <View style={styles.testGrid}>
          {testTypes.map(test => (
            <TouchableOpacity
              key={test.id}
              style={[styles.testCard, { borderLeftColor: test.color }]}
              onPress={() => navigation.navigate('TestSelection', { selectedTest: test.id })}
            >
              <MaterialIcons name={test.icon} size={32} color={test.color} />
              <Text style={styles.testName}>{test.name}</Text>
              <Text style={styles.testDescription}>{test.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {athleteStats.recentActivity.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <FontAwesome5 name="medal" size={16} color="#FFD700" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTest}>{activity.test}</Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
            <View style={styles.activityScore}>
              <Text style={styles.scoreValue}>{activity.score}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* AI Features Highlight */}
      <View style={styles.aiSection}>
        <Text style={styles.sectionTitle}>🤖 AI-Powered Features</Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <MaterialIcons name="videocam" size={20} color="#2196F3" />
            <Text style={styles.featureText}>Real-time pose estimation</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="analytics" size={20} color="#2196F3" />
            <Text style={styles.featureText}>Kinetic blueprinting</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="security" size={20} color="#2196F3" />
            <Text style={styles.featureText}>Cheat detection</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="offline-bolt" size={20} color="#2196F3" />
            <Text style={styles.featureText}>Offline analysis</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeSection: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  actionsContainer: {
    padding: 20,
  },
  primaryAction: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryAction: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  secondaryActionText: {
    color: '#2196F3',
    marginLeft: 8,
    fontWeight: '600',
  },
  testsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  testGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  testCard: {
    backgroundColor: 'white',
    width: width * 0.42,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 2,
  },
  testName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  testDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  activitySection: {
    padding: 20,
  },
  activityItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 15,
  },
  activityTest: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityScore: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  aiSection: {
    padding: 20,
    marginBottom: 20,
  },
  featureList: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
});
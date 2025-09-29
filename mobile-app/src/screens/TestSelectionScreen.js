import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function TestSelectionScreen({ navigation, route }) {
  const [selectedTest, setSelectedTest] = useState(route.params?.selectedTest || null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

  const testTypes = [
    {
      id: 'vertical-jump',
      name: 'Vertical Jump Test',
      icon: 'trending-up',
      color: '#FF6B6B',
      duration: '30 seconds',
      difficulty: 'Beginner',
      description: 'Measure your explosive leg power and jumping ability',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Position yourself in front of the camera',
        'Jump as high as possible when prompted',
        'Land softly on both feet',
        'AI will automatically measure your jump height'
      ],
      tips: [
        'Warm up with light stretching',
        'Use your arms to generate momentum',
        'Focus on explosive upward movement'
      ],
      metrics: ['Jump Height', 'Takeoff Angle', 'Landing Stability', 'Form Score']
    },
    {
      id: 'squat',
      name: 'Squat Assessment',
      icon: 'fitness-center',
      color: '#4ECDC4',
      duration: '2 minutes',
      difficulty: 'Intermediate',
      description: 'Test your lower body strength and squatting technique',
      instructions: [
        'Stand with feet slightly wider than shoulders',
        'Keep your back straight throughout the movement',
        'Lower down until thighs are parallel to ground',
        'Push through heels to return to starting position',
        'Complete as many quality reps as possible'
      ],
      tips: [
        'Keep chest up and core engaged',
        'Knees should track over toes',
        'Control the descent and ascent'
      ],
      metrics: ['Rep Count', 'Squat Depth', 'Knee Alignment', 'Form Quality']
    },
    {
      id: 'sprint',
      name: 'Sprint Test',
      icon: 'directions-run',
      color: '#45B7D1',
      duration: '20 seconds',
      difficulty: 'Advanced',
      description: 'Measure your speed, acceleration and running technique',
      instructions: [
        'Position yourself at the starting line',
        'Wait for the audio signal to begin',
        'Run at maximum speed for the marked distance',
        'Maintain proper running form throughout',
        'AI will track your speed and technique'
      ],
      tips: [
        'Proper warm-up is essential',
        'Drive with your arms',
        'Stay on the balls of your feet'
      ],
      metrics: ['Sprint Time', 'Stride Length', 'Cadence', 'Running Form']
    },
    {
      id: 'push-up',
      name: 'Push-up Test',
      icon: 'accessibility',
      color: '#96CEB4',
      duration: '2 minutes',
      difficulty: 'Beginner',
      description: 'Assess your upper body strength and endurance',
      instructions: [
        'Start in plank position with hands shoulder-width apart',
        'Lower your body until chest nearly touches ground',
        'Push back up to starting position',
        'Maintain straight body line throughout',
        'Complete as many reps as possible with good form'
      ],
      tips: [
        'Keep core tight and engaged',
        'Full range of motion for each rep',
        'Breathe steadily throughout'
      ],
      metrics: ['Rep Count', 'Form Quality', 'Range of Motion', 'Endurance']
    }
  ];

  const handleTestSelection = (test) => {
    setSelectedTest(test.id);
    setCurrentTest(test);
    setShowInstructions(true);
  };

  const startTest = () => {
    if (!selectedTest) {
      Alert.alert('Selection Required', 'Please select a test to continue.');
      return;
    }

    setShowInstructions(false);
    
    // Navigate to camera screen with test details
    navigation.navigate('Camera', {
      testType: selectedTest,
      testDetails: currentTest
    });
  };

  const TestCard = ({ test }) => (
    <TouchableOpacity
      style={[
        styles.testCard,
        { borderColor: test.color },
        selectedTest === test.id && { backgroundColor: test.color + '20' }
      ]}
      onPress={() => handleTestSelection(test)}
    >
      <View style={[styles.testHeader, { backgroundColor: test.color }]}>
        <MaterialIcons name={test.icon} size={32} color="white" />
        <View style={styles.testBadge}>
          <Text style={styles.badgeText}>{test.difficulty}</Text>
        </View>
      </View>
      
      <View style={styles.testContent}>
        <Text style={styles.testTitle}>{test.name}</Text>
        <Text style={styles.testDescription}>{test.description}</Text>
        
        <View style={styles.testMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="access-time" size={16} color="#666" />
            <Text style={styles.metaText}>{test.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="assessment" size={16} color="#666" />
            <Text style={styles.metaText}>{test.metrics.length} metrics</Text>
          </View>
        </View>

        {selectedTest === test.id && (
          <View style={styles.selectedIndicator}>
            <MaterialIcons name="check-circle" size={20} color={test.color} />
            <Text style={[styles.selectedText, { color: test.color }]}>Selected</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const InstructionsModal = () => (
    <Modal
      visible={showInstructions}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{currentTest?.name}</Text>
          <TouchableOpacity
            onPress={() => setShowInstructions(false)}
            style={styles.closeButton}
          >
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Test Overview */}
          <View style={styles.overviewSection}>
            <View style={[styles.testIcon, { backgroundColor: currentTest?.color }]}>
              <MaterialIcons name={currentTest?.icon} size={40} color="white" />
            </View>
            <Text style={styles.overviewText}>{currentTest?.description}</Text>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Instructions</Text>
            {currentTest?.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Pro Tips</Text>
            {currentTest?.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <MaterialIcons name="lightbulb-outline" size={16} color="#FFA726" />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 What We'll Measure</Text>
            <View style={styles.metricsGrid}>
              {currentTest?.metrics.map((metric, index) => (
                <View key={index} style={styles.metricBadge}>
                  <Text style={styles.metricText}>{metric}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* AI Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 AI Analysis</Text>
            <View style={styles.aiFeatures}>
              <View style={styles.aiFeature}>
                <MaterialIcons name="videocam" size={20} color="#2196F3" />
                <Text style={styles.aiFeatureText}>Real-time pose tracking</Text>
              </View>
              <View style={styles.aiFeature}>
                <MaterialIcons name="analytics" size={20} color="#2196F3" />
                <Text style={styles.aiFeatureText}>Biomechanical analysis</Text>
              </View>
              <View style={styles.aiFeature}>
                <MaterialIcons name="security" size={20} color="#2196F3" />
                <Text style={styles.aiFeatureText}>Cheat detection</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={startTest}
          >
            <MaterialIcons name="play-arrow" size={24} color="white" />
            <Text style={styles.startButtonText}>Start Test</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Test</Text>
          <Text style={styles.headerSubtitle}>
            Select a performance test to assess your athletic abilities
          </Text>
        </View>

        <View style={styles.testsContainer}>
          {testTypes.map(test => (
            <TestCard key={test.id} test={test} />
          ))}
        </View>

        {selectedTest && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={() => setShowInstructions(true)}
            >
              <Text style={styles.proceedButtonText}>View Instructions</Text>
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <InstructionsModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  testsContainer: {
    padding: 20,
  },
  testCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  testHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  testContent: {
    padding: 15,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  testDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  testMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  actionContainer: {
    padding: 20,
  },
  proceedButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  overviewSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  testIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  overviewText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    backgroundColor: '#2196F3',
    color: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  metricText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  aiFeatures: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
  },
  aiFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiFeatureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
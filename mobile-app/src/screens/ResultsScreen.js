import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Share
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ResultsScreen({ navigation, route }) {
  const { testType, testDetails, videoUri, analysis, recordingDuration } = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    // Auto-upload results to backend
    uploadResults();
  }, []);

  const uploadResults = async () => {
    setIsUploading(true);
    
    try {
      // Mock upload process - in real implementation would upload to backend
      console.log('📤 Uploading results to backend...');
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful upload
      setUploadComplete(true);
      setIsUploading(false);
      
      console.log('✅ Results uploaded successfully');
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      setIsUploading(false);
      Alert.alert(
        'Upload Failed',
        'Failed to upload your results. Your data is saved locally.',
        [{ text: 'OK' }]
      );
    }
  };

  const shareResults = async () => {
    try {
      const shareContent = {
        message: `I just completed a ${testDetails.name} test on Khel-Dristi! 
Score: ${analysis.biomechanicalScore.toFixed(1)}/100
Ranking: ${analysis.performanceMetrics.technique}
#KhelDristi #SportsAssessment #AI`,
        url: videoUri // In production, this would be a shareable link
      };
      
      await Share.share(shareContent);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const retakeTest = () => {
    Alert.alert(
      'Retake Test',
      'Are you sure you want to retake this test? Your current results will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Retake', 
          onPress: () => navigation.navigate('Camera', { testType, testDetails })
        }
      ]
    );
  };

  const viewDetailedAnalysis = () => {
    // Navigate to detailed analysis screen (would be implemented)
    Alert.alert('Coming Soon', 'Detailed biomechanical analysis coming in next update!');
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#8BC34A';
    if (score >= 70) return '#FFC107';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const getBadges = () => {
    const badges = [];
    const score = analysis.biomechanicalScore;
    
    if (score >= 90) badges.push({ name: 'Gold Performance', icon: 'medal', color: '#FFD700' });
    if (score >= 80) badges.push({ name: 'Silver Performance', icon: 'medal', color: '#C0C0C0' });
    if (!analysis.cheatDetected) badges.push({ name: 'Fair Play', icon: 'shield-check', color: '#4CAF50' });
    if (analysis.confidenceScore >= 0.95) badges.push({ name: 'Perfect Form', icon: 'star', color: '#2196F3' });
    
    return badges;
  };

  const renderMetricCard = (label, value, unit = '', icon) => (
    <View style={styles.metricCard}>
      <MaterialIcons name={icon} size={24} color="#2196F3" />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>
        {typeof value === 'number' ? value.toFixed(1) : value}
        {unit && <Text style={styles.metricUnit}> {unit}</Text>}
      </Text>
    </View>
  );

  const renderTestSpecificMetrics = () => {
    const metrics = analysis.performanceMetrics;
    
    switch (testType) {
      case 'vertical-jump':
        return (
          <View style={styles.metricsGrid}>
            {renderMetricCard('Jump Height', metrics.jumpHeight, 'cm', 'height')}
            {renderMetricCard('Takeoff Angle', metrics.takeoffAngle, '°', 'trending-up')}
            {renderMetricCard('Landing Stability', metrics.landingStability * 100, '%', 'balance')}
            {renderMetricCard('Technique', metrics.technique, '', 'grade')}
          </View>
        );
      
      case 'squat':
        return (
          <View style={styles.metricsGrid}>
            {renderMetricCard('Squat Depth', metrics.squatDepth, '°', 'fitness-center')}
            {renderMetricCard('Knee Alignment', metrics.kneeAlignment * 100, '%', 'straighten')}
            {renderMetricCard('Rep Count', metrics.repCount, '', 'repeat')}
            {renderMetricCard('Form Quality', metrics.technique, '', 'grade')}
          </View>
        );
      
      case 'sprint':
        return (
          <View style={styles.metricsGrid}>
            {renderMetricCard('Run Time', metrics.runTime, 's', 'timer')}
            {renderMetricCard('Stride Length', metrics.strideLength, 'm', 'straighten')}
            {renderMetricCard('Cadence', metrics.cadence, 'spm', 'speed')}
            {renderMetricCard('Technique', metrics.technique, '', 'grade')}
          </View>
        );
      
      case 'push-up':
        return (
          <View style={styles.metricsGrid}>
            {renderMetricCard('Rep Count', metrics.repCount, '', 'repeat')}
            {renderMetricCard('Form Quality', metrics.formQuality * 100, '%', 'grade')}
            {renderMetricCard('Range of Motion', metrics.rangeOfMotion * 100, '%', 'open-with')}
            {renderMetricCard('Technique', metrics.technique, '', 'fitness-center')}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
        <Text style={styles.headerTitle}>Test Complete!</Text>
        <Text style={styles.headerSubtitle}>{testDetails.name}</Text>
      </View>

      {/* Overall Score */}
      <View style={styles.scoreContainer}>
        <View style={[styles.scoreCircle, { borderColor: getScoreColor(analysis.biomechanicalScore) }]}>
          <Text style={[styles.scoreNumber, { color: getScoreColor(analysis.biomechanicalScore) }]}>
            {analysis.biomechanicalScore.toFixed(1)}
          </Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <View style={styles.scoreDetails}>
          <Text style={styles.scoreGrade}>Grade: {getScoreGrade(analysis.biomechanicalScore)}</Text>
          <Text style={styles.scoreDescription}>
            {analysis.biomechanicalScore >= 90 ? 'Outstanding Performance!' :
             analysis.biomechanicalScore >= 80 ? 'Excellent Work!' :
             analysis.biomechanicalScore >= 70 ? 'Great Job!' :
             analysis.biomechanicalScore >= 60 ? 'Good Effort!' :
             'Keep Practicing!'}
          </Text>
        </View>
      </View>

      {/* Badges */}
      {getBadges().length > 0 && (
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          <View style={styles.badgesContainer}>
            {getBadges().map((badge, index) => (
              <View key={index} style={[styles.badge, { backgroundColor: badge.color + '20' }]}>
                <FontAwesome5 name={badge.icon} size={16} color={badge.color} />
                <Text style={[styles.badgeText, { color: badge.color }]}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Performance Metrics */}
      <View style={styles.metricsSection}>
        <Text style={styles.sectionTitle}>📊 Performance Metrics</Text>
        {renderTestSpecificMetrics()}
      </View>

      {/* AI Analysis Summary */}
      <View style={styles.aiSection}>
        <Text style={styles.sectionTitle}>🤖 AI Analysis</Text>
        <View style={styles.aiCard}>
          <View style={styles.aiMetric}>
            <Text style={styles.aiLabel}>Confidence Score</Text>
            <Text style={styles.aiValue}>{(analysis.confidenceScore * 100).toFixed(1)}%</Text>
          </View>
          <View style={styles.aiMetric}>
            <Text style={styles.aiLabel}>Cheat Detection</Text>
            <Text style={[styles.aiValue, { color: analysis.cheatDetected ? '#F44336' : '#4CAF50' }]}>
              {analysis.cheatDetected ? 'Flagged' : 'Clean'}
            </Text>
          </View>
          <View style={styles.aiMetric}>
            <Text style={styles.aiLabel}>Kinetic Blueprint</Text>
            <Text style={styles.aiValue}>Generated</Text>
          </View>
        </View>
      </View>

      {/* Upload Status */}
      <View style={styles.uploadSection}>
        <Text style={styles.sectionTitle}>🔗 Proof-of-Performance</Text>
        <View style={styles.uploadCard}>
          {isUploading ? (
            <View style={styles.uploadStatus}>
              <MaterialIcons name="cloud-upload" size={24} color="#2196F3" />
              <Text style={styles.uploadText}>Uploading to secure ledger...</Text>
            </View>
          ) : uploadComplete ? (
            <View style={styles.uploadStatus}>
              <MaterialIcons name="cloud-done" size={24} color="#4CAF50" />
              <Text style={[styles.uploadText, { color: '#4CAF50' }]}>
                Securely stored with tamper-proof hash
              </Text>
            </View>
          ) : (
            <View style={styles.uploadStatus}>
              <MaterialIcons name="cloud-off" size={24} color="#F44336" />
              <Text style={[styles.uploadText, { color: '#F44336' }]}>
                Upload failed - Data saved locally
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={shareResults}>
            <MaterialIcons name="share" size={20} color="#2196F3" />
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={retakeTest}>
            <MaterialIcons name="refresh" size={20} color="#2196F3" />
            <Text style={styles.secondaryButtonText}>Retake</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={viewDetailedAnalysis}>
          <MaterialIcons name="analytics" size={20} color="white" />
          <Text style={styles.primaryButtonText}>Detailed Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  scoreContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreMax: {
    fontSize: 16,
    color: '#666',
    marginTop: -5,
  },
  scoreDetails: {
    alignItems: 'center',
  },
  scoreGrade: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  scoreDescription: {
    fontSize: 16,
    color: '#666',
  },
  badgesSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  metricsSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: width * 0.4,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#666',
  },
  aiSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  aiCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  aiMetric: {
    alignItems: 'center',
  },
  aiLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  aiValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  uploadSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  uploadCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  uploadStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  actionsSection: {
    padding: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  homeButton: {
    alignItems: 'center',
    padding: 15,
  },
  homeButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
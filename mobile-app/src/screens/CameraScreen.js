import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { AIService } from '../services/AIService';

const { width, height } = Dimensions.get('window');

export default function CameraScreen({ navigation, route }) {
  const { testType, testDetails } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [isReady, setIsReady] = useState(false);
  
  const cameraRef = useRef(null);
  const recordingRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    requestCameraPermissions();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const requestCameraPermissions = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access to record your performance test.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      Alert.alert('Error', 'Failed to request camera permissions');
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    if (!cameraRef.current || !isReady) {
      Alert.alert('Error', 'Camera is not ready');
      return;
    }

    try {
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start recording video
      const recordingOptions = {
        quality: Camera.Constants.VideoQuality['720p'],
        maxDuration: getMaxDuration(testType),
        mute: false,
      };

      recordingRef.current = await cameraRef.current.recordAsync(recordingOptions);
      
      // Start recording timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Auto-stop after max duration
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, getMaxDuration(testType) * 1000);

    } catch (error) {
      console.error('Recording failed:', error);
      Alert.alert('Recording Error', 'Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;

    try {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      await cameraRef.current.stopRecording();
      
      if (recordingRef.current) {
        setIsAnalyzing(true);
        await processRecording(recordingRef.current);
      }
    } catch (error) {
      console.error('Stop recording failed:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const processRecording = async (recording) => {
    try {
      console.log('🎥 Processing recorded video...');
      
      // Mock video frames for AI analysis
      // In real implementation, you would extract frames from the video
      const mockFrames = generateMockFrames(Math.floor(recordingTime * 30)); // 30 FPS
      
      // Run AI analysis
      const analysis = await AIService.analyzePerformance(mockFrames, testType);
      
      setIsAnalyzing(false);
      
      // Navigate to results with analysis data
      navigation.navigate('Results', {
        testType,
        testDetails,
        videoUri: recording.uri,
        analysis,
        recordingDuration: recordingTime
      });
      
    } catch (error) {
      console.error('Processing failed:', error);
      setIsAnalyzing(false);
      Alert.alert(
        'Analysis Failed',
        'Failed to analyze your performance. Please try again.',
        [
          { text: 'Retry', onPress: () => navigation.goBack() },
          { text: 'Cancel', onPress: () => navigation.navigate('Home') }
        ]
      );
    }
  };

  const generateMockFrames = (frameCount) => {
    // Generate mock video frames for AI processing
    return Array.from({ length: frameCount }, (_, i) => ({
      frameIndex: i,
      timestamp: i / 30, // 30 FPS
      data: `mock_frame_${i}` // In real implementation, this would be actual frame data
    }));
  };

  const getMaxDuration = (testType) => {
    const durations = {
      'vertical-jump': 30,
      'squat': 120,
      'sprint': 20,
      'push-up': 120
    };
    return durations[testType] || 60;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="camera-alt" size={64} color="#ccc" />
        <Text style={styles.errorTitle}>Camera Access Required</Text>
        <Text style={styles.errorText}>
          Please enable camera permissions in your device settings to record performance tests.
        </Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={requestCameraPermissions}
        >
          <Text style={styles.settingsButtonText}>Retry Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isAnalyzing) {
    return (
      <View style={styles.analysisContainer}>
        <View style={styles.analysisContent}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.analysisTitle}>🤖 AI Analysis in Progress</Text>
          <Text style={styles.analysisText}>
            Our AI is analyzing your performance using pose estimation and kinetic blueprinting...
          </Text>
          <View style={styles.analysisSteps}>
            <Text style={styles.analysisStep}>✓ Processing video frames</Text>
            <Text style={styles.analysisStep}>✓ Extracting pose keypoints</Text>
            <Text style={styles.analysisStep}>✓ Generating kinetic blueprint</Text>
            <Text style={styles.analysisStep}>⏳ Calculating performance metrics</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        onCameraReady={() => setIsReady(true)}
      >
        {/* Test Information Overlay */}
        <View style={styles.testInfo}>
          <Text style={styles.testName}>{testDetails.name}</Text>
          <Text style={styles.testDuration}>
            Max Duration: {getMaxDuration(testType)}s
          </Text>
        </View>

        {/* Recording Status */}
        {isRecording && (
          <View style={styles.recordingStatus}>
            <View style={styles.recordingIndicator} />
            <Text style={styles.recordingText}>
              REC {formatTime(recordingTime)}
            </Text>
          </View>
        )}

        {/* Countdown Overlay */}
        {countdown > 0 && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.countdownLabel}>Get Ready!</Text>
          </View>
        )}

        {/* AI Status Indicator */}
        <View style={styles.aiIndicator}>
          <MaterialIcons name="smart-toy" size={20} color="white" />
          <Text style={styles.aiText}>AI Tracking Active</Text>
        </View>

        {/* Camera Controls */}
        <View style={styles.controls}>
          {/* Camera Flip Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCameraType}
            disabled={isRecording}
          >
            <MaterialIcons name="flip-camera-ios" size={24} color="white" />
          </TouchableOpacity>

          {/* Record Button */}
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive
            ]}
            onPress={isRecording ? stopRecording : startCountdown}
            disabled={!isReady}
          >
            <View style={[
              styles.recordButtonInner,
              isRecording && styles.recordButtonInnerActive
            ]}>
              <MaterialIcons
                name={isRecording ? "stop" : "fiber-manual-record"}
                size={32}
                color="white"
              />
            </View>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
            disabled={isRecording}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            {isRecording
              ? `Performing ${testDetails.name.toLowerCase()}...`
              : countdown > 0
              ? 'Recording will start soon!'
              : 'Tap the record button to begin'
            }
          </Text>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  settingsButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 12,
  },
  testName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testDuration: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  recordingStatus: {
    position: 'absolute',
    top: 120,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 8,
  },
  recordingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'white',
  },
  countdownLabel: {
    fontSize: 20,
    color: 'white',
    marginTop: 10,
  },
  aiIndicator: {
    position: 'absolute',
    top: 160,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  aiText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  recordButtonActive: {
    backgroundColor: 'rgba(255,0,0,0.3)',
    borderColor: '#FF0000',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInnerActive: {
    borderRadius: 8,
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 12,
  },
  instructionText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  analysisContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisContent: {
    alignItems: 'center',
    padding: 40,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  analysisText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  analysisSteps: {
    alignItems: 'flex-start',
  },
  analysisStep: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
});
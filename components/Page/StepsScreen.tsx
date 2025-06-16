import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, Alert, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LineChart } from 'react-native-chart-kit'
import GoogleFit, { Scopes } from 'react-native-google-fit'

const { width } = Dimensions.get('window')

interface StepData {
  date: string;
  steps: number;
}

const StepsScreen = () => {
  const [isGoogleFitAvailable, setIsGoogleFitAvailable] = useState<boolean>(false)
  const [currentSteps, setCurrentSteps] = useState<number>(0)
  const [dailyGoal, setDailyGoal] = useState<number>(10000)
  const [weeklyData, setWeeklyData] = useState<StepData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigation = useNavigation()

  useEffect(() => {
    initializeGoogleFit()
    return () => {
      // Cleanup if needed
    }
  }, [])

  const openGoogleFit = async () => {
    try {
      // Try different Google Fit URL schemes
      const googleFitUrls = [
        'googlefit://',
        'com.google.android.apps.fitness',
        'market://details?id=com.google.android.apps.fitness',
        'https://play.google.com/store/apps/details?id=com.google.android.apps.fitness'
      ]

      // First try to open Google Fit directly
      const canOpen = await Linking.canOpenURL(googleFitUrls[0])
      if (canOpen) {
        await Linking.openURL(googleFitUrls[0])
        return
      }

      // If direct open fails, try to open app settings
      const canOpenSettings = await Linking.canOpenURL('android-app://com.google.android.apps.fitness')
      if (canOpenSettings) {
        await Linking.openURL('android-app://com.google.android.apps.fitness')
        return
      }

      // If all else fails, open Play Store
      await Linking.openURL(googleFitUrls[2])
    } catch (error) {
      console.log('Error opening Google Fit:', error)
      // Fallback to Play Store in browser
      Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.fitness')
    }
  }

  const initializeGoogleFit = async () => {
    try {
      // First check if Google Fit is available
      const isAvailable = await GoogleFit.isAvailable()
      if (!isAvailable) {
        Alert.alert(
          'Google Fit Not Available',
          'Please install Google Fit from the Play Store.',
          [
            {
              text: 'Open Play Store',
              onPress: () => {
                Linking.openURL('market://details?id=com.google.android.apps.fitness')
              }
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => navigation.goBack()
            }
          ]
        )
        return
      }

      // Request OAuth permissions
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_WRITE,
        ],
      }

      // Check if already authorized
      const isAuthorized = await GoogleFit.isAuthorized()
      if (!isAuthorized) {
        const authResult = await GoogleFit.authorize(options)
        if (!authResult.success) {
          Alert.alert(
            'Permission Required',
            'Please grant access to Google Fit to track your steps.',
            [
              {
                text: 'Grant Permission',
                onPress: async () => {
                  try {
                    // Try to authorize again
                    const result = await GoogleFit.authorize(options)
                    if (result.success) {
                      setIsGoogleFitAvailable(true)
                      await fetchStepData()
                    } else {
                      // If still not authorized, open Google Fit settings
                      await openGoogleFit()
                    }
                  } catch (error) {
                    console.log('Error during authorization:', error)
                    await openGoogleFit()
                  }
                }
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => navigation.goBack()
              }
            ]
          )
          return
        }
      }

      setIsGoogleFitAvailable(true)
      await fetchStepData()
    } catch (error) {
      console.log('Error initializing Google Fit:', error)
      Alert.alert(
        'Error',
        'Failed to initialize Google Fit. Please make sure you have granted all necessary permissions.',
        [
          {
            text: 'Open Settings',
            onPress: async () => {
              try {
                await openGoogleFit()
              } catch (error) {
                Linking.openSettings()
              }
            }
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => navigation.goBack()
          }
        ]
      )
    }
  }

  const fetchStepData = async () => {
    try {
      setIsLoading(true)
      const today = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7) // Get last 7 days

      // Format dates for Google Fit API
      const options = {
        startDate: startDate.toISOString(),
        endDate: today.toISOString(),
        bucketUnit: 'DAY',
        bucketInterval: 1,
      }

      // Check authorization before fetching data
      const isAuthorized = await GoogleFit.isAuthorized()
      if (!isAuthorized) {
        throw new Error('Not authorized')
      }

      const result = await GoogleFit.getDailySteps(options)
      
      if (result && result.length > 0) {
        const formattedData = result.map((item: any) => ({
          date: new Date(item.start).toISOString().split('T')[0],
          steps: item.value || 0
        }))

        setWeeklyData(formattedData)
        
        // Set current steps from today's data
        const todayData = formattedData.find(
          item => item.date === today.toISOString().split('T')[0]
        )
        if (todayData) {
          setCurrentSteps(todayData.steps)
        }
      }
    } catch (error) {
      console.log('Error fetching step data:', error)
      Alert.alert(
        'Error',
        'Failed to fetch step data. Please check your Google Fit permissions.',
        [
          {
            text: 'Grant Permission',
            onPress: async () => {
              try {
                await initializeGoogleFit()
              } catch (error) {
                await openGoogleFit()
              }
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      )
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    if (isGoogleFitAvailable) {
      await fetchStepData()
    }
  }

  const chartData = {
    labels: weeklyData.map(data => data.date.split('-')[2]), // Show only day
    datasets: [
      {
        data: weeklyData.map(data => data.steps),
        color: (opacity = 1) => `rgba(11, 130, 212, ${opacity})`,
        strokeWidth: 2
      },
    ],
  }

  const progress = Math.min((currentSteps / dailyGoal) * 100, 100)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#0B82D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Step Counter</Text>
        <TouchableOpacity onPress={refreshData}>
          <AntDesign name="reload1" size={24} color="#0B82D4" />
        </TouchableOpacity>
      </View>

      {!isGoogleFitAvailable ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Google Fit is not available or access was denied
          </Text>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading step data...</Text>
        </View>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.circleContainer}>
              <View style={[styles.circle, { borderColor: progress >= 100 ? '#4CAF50' : '#0B82D4' }]}>
                <Text style={styles.stepsText}>{currentSteps}</Text>
                <Text style={styles.stepsLabel}>steps</Text>
              </View>
              <View style={[styles.progressRing, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.goalText}>Daily Goal: {dailyGoal} steps</Text>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Weekly Progress</Text>
            {weeklyData.length > 0 ? (
              <LineChart
                data={chartData}
                width={width - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(11, 130, 212, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#0B82D4'
                  },
                  formatYLabel: (value) => {
                    const num = parseInt(value);
                    if (num >= 1000) {
                      return `${(num / 1000).toFixed(1)}k`;
                    }
                    return num.toString();
                  }
                }}
                bezier
                style={styles.chart}
                yAxisSuffix=""
                yAxisInterval={1}
                segments={5}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No step data available yet</Text>
              </View>
            )}
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tips to reach your goal:</Text>
            <Text style={styles.tipText}>• Take a short walk every hour</Text>
            <Text style={styles.tipText}>• Use stairs instead of elevator</Text>
            <Text style={styles.tipText}>• Park further from your destination</Text>
            <Text style={styles.tipText}>• Take walking meetings when possible</Text>
          </View>
        </>
      )}
    </View>
  )
}

export default StepsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5252',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  circleContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  progressRing: {
    position: 'absolute',
    height: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  stepsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  stepsLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  goalText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  chartContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  tipsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
})
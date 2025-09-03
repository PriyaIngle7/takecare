import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import NameCard from '../compo/NameCard';
import { useAuth } from '../../contexts/AuthContext';
import SessionManager from '../../utils/sessionManager';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotesApp: React.FC = () => {
  const navigation = useNavigation();
  const { isAuthenticated, user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const sessionManager = SessionManager.getInstance();

  // Request notification permissions
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant notification permissions to receive note reminders.');
      }
    })();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);

  // Schedule notifications for existing notes on app load
  useEffect(() => {
    notes.forEach(note => {
      if (note.reminderAt) {
        scheduleNotification(note);
      }
    });
  }, [notes]);

  const fetchNotes = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to view your notes.');
      return;
    }

    const token = sessionManager.getToken();
    if (!token) {
      Alert.alert('Authentication Error', 'No valid token found. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('https://takecare-ds3g.onrender.com/notes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotes(response.data); 
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      if (error.response?.status === 401) {
        Alert.alert('Authentication Error', 'Your session has expired. Please log in again.');
      } else {
        Alert.alert('Error', 'Failed to fetch notes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const scheduleNotification = async (note: any) => {
    if (!note.reminderAt) return;

    // Fix timezone conversion - stored time is UTC, need to correct for IST
    const reminderTime = new Date(note.reminderAt);
    const correctedTime = new Date(reminderTime.getTime() - (5.5 * 60 * 60 * 1000)); // Subtract IST offset
    const now = new Date();
    
    console.log(`Current time: ${now.toLocaleString()}`);
    console.log(`Reminder time corrected: ${correctedTime.toLocaleString()}`);
    console.log(`Time difference in seconds: ${Math.floor((correctedTime.getTime() - now.getTime()) / 1000)}`);
    
    if (correctedTime <= now) {
      console.log('Reminder time has passed, not scheduling');
      return;
    }

    const secondsUntilReminder = Math.max(1, Math.floor((correctedTime.getTime() - now.getTime()) / 1000));

    // Expo Go doesn't support notifications - use Alert as fallback
    if (__DEV__) {
      console.log('⚠️ Expo Go detected - using Alert instead of notifications');
      setTimeout(() => {
        Alert.alert(
          'Note Reminder',
          note.text,
          [{ text: 'OK', style: 'default' }],
          { cancelable: false }
        );
      }, secondsUntilReminder * 1000);
      
      console.log(`Alert scheduled for: ${correctedTime.toLocaleString()}`);
      console.log(`Will trigger in ${secondsUntilReminder} seconds`);
      return 'alert_scheduled_' + Date.now();
    }

    try {
      let notificationId;
      
      if (secondsUntilReminder <= 5) {
        // For very short delays, use immediate notification
        notificationId = await Notifications.presentNotificationAsync({
          title: 'Note Reminder',
          body: note.text,
          sound: true,
        });
        console.log('Immediate notification sent');
      } else {
        // For longer delays, use setTimeout with notification
        setTimeout(async () => {
          try {
            await Notifications.presentNotificationAsync({
              title: 'Note Reminder',
              body: note.text,
              sound: true,
            });
          } catch (error) {
            // Fallback to Alert if notifications fail
            Alert.alert('Note Reminder', note.text);
          }
        }, secondsUntilReminder * 1000);
        
        console.log(`Notification scheduled for: ${correctedTime.toLocaleString()}`);
        console.log(`Will trigger in ${secondsUntilReminder} seconds`);
        notificationId = 'scheduled_' + Date.now();
      }
      
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      // Fallback to Alert
      setTimeout(() => {
        Alert.alert('Note Reminder', note.text);
      }, secondsUntilReminder * 1000);
      return 'alert_fallback_' + Date.now();
    }
  };

  const addNote = async () => {
    if (inputText.trim() === '') return;
    
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to add notes.');
      return;
    }

    const token = sessionManager.getToken();
    if (!token) {
      Alert.alert('Authentication Error', 'No valid token found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post('https://takecare-ds3g.onrender.com/add-note', 
        { text: inputText },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const newNote = response.data;
      
      // Schedule local notification if reminder time is set
      if (newNote.reminderAt) {
        await scheduleNotification(newNote);
      }
      
      setNotes([newNote, ...notes]); // Add new note at the beginning
      setInputText('');
    } catch (error: any) {
      console.error('Error adding note:', error);
      if (error.response?.status === 401) {
        Alert.alert('Authentication Error', 'Your session has expired. Please log in again.');
      } else if (error.response?.status === 400) {
        Alert.alert('Invalid Input', error.response.data.error || 'Please check your input and try again.');
      } else {
        Alert.alert('Error', 'Failed to add note. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#0B82D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notes</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <NameCard />
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, !isAuthenticated && styles.disabledInput]} 
          placeholder={isAuthenticated ? "Enter a note" : "Please log in to add notes"} 
          value={inputText} 
          onChangeText={setInputText}
          editable={isAuthenticated}
        />
        <TouchableOpacity 
          style={[styles.button, !isAuthenticated && styles.disabledButton]} 
          onPress={addNote}
          disabled={!isAuthenticated}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.notesList}>
        {loading ? (
          <Text style={styles.noItemText}>Loading your notes...</Text>
        ) : !isAuthenticated ? (
          <Text style={styles.noItemText}>Please log in to view your notes</Text>
        ) : notes.length === 0 ? (
          <Text style={styles.noItemText}>No notes yet. Add your first note above!</Text>
        ) : (
          notes.map((note) => {
            console.log('Note object:', note);
            console.log('reminderAt value:', note.reminderAt);
            console.log('reminderAt type:', typeof note.reminderAt);
            return (
            <View key={note._id} style={styles.noteItem}>
              <Text style={styles.noteText}>{note.text}</Text>
              <Text style={styles.reminderText}>{note.reminderAt ? (() => {
                const utcTime = new Date(note.reminderAt);
                const istTime = new Date(utcTime.getTime() - (5.5 * 60 * 60 * 1000));
                return istTime.toLocaleString();
              })() : 'No reminder set'}</Text>
            </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#E3F2FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingHorizontal: 5,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSpacer: {
    width: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#0B82D4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notesList: {
    marginTop: 10,
  },
  noItemText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 40,
    fontStyle: 'italic',
  },
  noteItem: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#0B82D4',
  },
  noteText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 22,
  },
  reminderText: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    color: '#999',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
});

export default NotesApp;

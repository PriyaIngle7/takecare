import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { AntDesign } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
}

const ChatApplication = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadUserInfo();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    if (userId) {
      setupWebSocket();
    }
  }, [userId]);

  const loadUserInfo = async () => {
    try {
    //   const storedUserId = await AsyncStorage.getItem('userId');
    //   const storedUserRole = await AsyncStorage.getItem('userRole');
    console.log("user");
      const userData = await AsyncStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user._id);
        setUserRole(user.role);
      }
    
    } catch (error) {
      console.error('Error loading user info:', error);
      Alert.alert('Error', 'Failed to load user information');
    }
  };

  const setupWebSocket = () => {
    try {
      const websocket = new WebSocket('ws://localhost:5000');
      console.log('Attempting to connect to WebSocket...');

      websocket.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
      };

      websocket.onmessage = (event) => {
        console.log('Received message:', event.data);
        try {
          const receivedMessages = JSON.parse(event.data);
          setMessages(prevMessages => [...prevMessages, ...receivedMessages]);
        } catch (error) {
          console.error('Error parsing received message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        Alert.alert('Connection Error', 'Failed to connect to chat server');
      };

      websocket.onclose = () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (userId) {
            setupWebSocket();
          }
        }, 5000);
      };

      setWs(websocket);
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      Alert.alert('Connection Error', 'Failed to establish chat connection');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || !ws) {
      console.log('Cannot send message:', { 
        hasMessage: !!newMessage.trim(), 
        hasUserId: !!userId, 
        hasWebSocket: !!ws 
      });
      return;
    }

    if (!isConnected) {
      Alert.alert('Connection Error', 'Not connected to chat server');
      return;
    }

    const message = {
      sender: userId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      console.log('Sending message:', message);
      ws.send(JSON.stringify(message));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender === userId;

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}>{item.content}</Text>
          <Text style={[
            styles.timestamp,
            isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp
          ]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#0B82D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={[styles.connectionStatus, { backgroundColor: isConnected ? '#4CAF50' : '#FF5252' }]} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            (!newMessage.trim() || !isConnected) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || !isConnected}
        >
          <AntDesign name="arrowup" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ChatApplication

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
  connectionStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  ownMessageBubble: {
    backgroundColor: '#0B82D4',
  },
  otherMessageBubble: {
    backgroundColor: '#E5E5E5',
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#0B82D4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
})
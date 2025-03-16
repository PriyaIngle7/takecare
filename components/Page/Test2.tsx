import React, { useState } from 'react';
import { Button, Text, View, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState();
  const [loading, setLoading] = useState(false);

  async function generateAndPlaySpeech() {
    try {
      setLoading(true);
      
      // Call your Node.js API
      const response = await fetch('http://local:3000/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Hello, this is a test of the Pinokio voice model.'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      // Get audio data
      const audioBlob = await response.blob();
      const audioUri = URL.createObjectURL(audioBlob);
      
      // Play the audio
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate or play speech');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Generate Speech" onPress={generateAndPlaySpeech} />
      )}
    </View>
  );
}
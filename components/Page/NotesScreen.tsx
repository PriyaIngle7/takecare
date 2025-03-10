import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import NameCard from '../compo/NameCard';

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    fetchNotes(); 
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/notes');
      setNotes(response.data); 
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    if (inputText.trim() === '') return;
    try {
      const response = await axios.post('http://localhost:5000/add-note', { text: inputText });
      setNotes([...notes, response.data]); 
      setInputText('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <View style={styles.container}>
      <NameCard />
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Enter a note " 
          value={inputText} 
          onChangeText={setInputText} 
        />
        <TouchableOpacity style={styles.button} onPress={addNote}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.notesList}>
        {notes.length === 0 ? (
          <Text style={styles.noItemText}>No notes yet</Text>
        ) : (
          notes.map((note) => (
            <View key={note._id} style={styles.noteItem}>
              <Text style={styles.noteText}>{note.text}</Text>
              <Text style={styles.reminderText}>{note.reminderAt ? new Date(note.reminderAt).toLocaleString() : 'No reminder set'}</Text>
            </View>
          ))
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
    backgroundColor: '#EAF6FF',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#D4EBFF',
    padding: 10,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#0B82D4',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
  },
  notesList: {
    marginTop: 20,
  },
  noItemText: {
    textAlign: 'center',
    color: 'gray',
  },
  noteItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#0B82D4',
    marginBottom: 10,
  },
  noteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reminderText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});

export default NotesApp;

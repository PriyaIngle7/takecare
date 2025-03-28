import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { io } from "socket.io-client";

// For physical devices, replace with your computer's local IP address.
// For Android Emulator, use "http://10.0.2.2:5000"
// For iOS Simulator, "http://localhost:5000" usually works.
const socket = io("http://192.168.1.100:5000"); // Replace with your IP if needed

export default function App() {
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Listen for connection events
        socket.on("connect", () => {
            console.log("✅ Connected to server:", socket.id);
            setIsConnected(true);
        });
        socket.on("disconnect", () => {
            console.log("❌ Disconnected from server");
            setIsConnected(false);
        });
        // Listen for incoming messages
        socket.on("receive_message", (data) => {
            console.log("📩 Received message:", data);
            setMessages(prev => [...prev, data]);
        });
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("receive_message");
        };
    }, []);

    const joinRoom = () => {
        if (room) {
            socket.emit("join_room", room);
            console.log(`🚪 Joining room: ${room}`);
        }
    };

    const sendMessage = () => {
        if (message && room) {
            const data = { room, message };
            socket.emit("send_message", data);
            console.log(`✉️ Sent message: ${message}`);
            setMessages(prev => [...prev, data]);
            setMessage("");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
                React Native Chat
            </Text>
            <Text style={{ fontSize: 16, color: isConnected ? "green" : "red" }}>
                {isConnected ? "🟢 Connected" : "🔴 Not Connected"}
            </Text>
            <TextInput
                placeholder="Enter Room ID"
                value={room}
                onChangeText={setRoom}
                style={{ borderWidth: 1, marginVertical: 10, padding: 10, borderRadius: 5 }}
            />
            <Button title="Join Room" onPress={joinRoom} />
            <TextInput
                placeholder="Type your message..."
                value={message}
                onChangeText={setMessage}
                style={{ borderWidth: 1, marginVertical: 10, padding: 10, borderRadius: 5 }}
            />
            <Button title="Send Message" onPress={sendMessage} />
            <ScrollView style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Messages:</Text>
                {messages.map((msg, index) => (
                    <Text key={index} style={{ padding: 5, backgroundColor: "#ddd", marginVertical: 2 }}>
                        <Text style={{ fontWeight: "bold" }}>{msg.room}: </Text>
                        {msg.message}
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
}

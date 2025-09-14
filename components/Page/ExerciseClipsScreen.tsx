import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Linking,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import NameCard from "../compo/NameCard";

const { width } = Dimensions.get("window");
const scale = width / 320;

export default function ExerciseClipsScreen() {
  const navigation = useNavigation();
  const [recommendation, setRecommendation] = useState("");
  const [videos, setVideos] = useState([]);

  const API_KEY = "AIzaSyDHwLV-epb2py3KMNFuuLhRjdevQHlhLDo"; // your API key

  // Function to fetch videos based on search term
  const fetchVideos = (query) => {
    if (!query) return; // don’t fetch if empty
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
        query
      )}&type=video&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setVideos(data.items || []);
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <NameCard />

      {/* Input box */}
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <TextInput
          placeholder="Type recommendation (e.g., Yoga, Cardio)"
          placeholderTextColor={"#666"}
          style={{
            flex: 1,
            color: "#000",
            backgroundColor: "#fff",
            paddingHorizontal: 12 * scale,
            borderRadius: 8 * scale,
            borderWidth: 1,
            borderColor: "#ccc",
            marginRight: 10,
          }}
          value={recommendation}
          onChangeText={setRecommendation}
        />

        {/* Search button */}
        <TouchableOpacity
          onPress={() => fetchVideos(recommendation)}
          style={{
            backgroundColor: "#007BFF",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 8 * scale,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* List of videos */}
      <FlatList
        data={videos}
        keyExtractor={(item, index) => item.id?.videoId || index.toString()}
        renderItem={({ item }) => {
          const videoId = item.id.videoId;
          return (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`)
              }
              style={{
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: item.snippet.thumbnails.medium.url }}
                style={{ width: 250, height: 150, borderRadius: 10 }}
              />
              <Text
                style={{
                  fontSize: 15 * scale,
                  fontWeight: "800",
                  marginTop: 5,
                  textAlign: "center",
                }}
              >
                {item.snippet.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0B82D4",
  },
});

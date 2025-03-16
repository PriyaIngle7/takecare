import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Linking,
  FlatList,
} from "react-native";

const { width } = Dimensions.get("window");
const scale = width / 320;

export default function ExerciseClipsScreen() {
  const [recommendation, setRecommendation] = useState("");
  const [videos, setVideos] = useState([]);

  const PLAYLIST_ID = "PLnfcpZm6el8iug2BBqZev2IDCt4I_sCH0"; // Your playlist ID
  const API_KEY = "AIzaSyDHwLV-epb2py3KMNFuuLhRjdevQHlhLDo"; // Replace with your actual API key

  useEffect(() => {
    fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${PLAYLIST_ID}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setVideos(data.items);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={{ backgroundColor: "#fff", flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Recommendations"
        placeholderTextColor={"#000000"}
        style={{
          color: "#000000",
          backgroundColor: "#fff",
          paddingHorizontal: 15 * scale,
          borderRadius: 10 * scale,
          marginBottom: 20,
        }}
        value={recommendation}
        onChangeText={setRecommendation}
      />

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const videoId = item.snippet.resourceId.videoId;
          return (
            <TouchableOpacity
              onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`)}
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

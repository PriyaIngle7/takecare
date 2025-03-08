import { View, Text, TouchableOpacity } from "react-native";
import NameCard from "../compo/NameCard";

export default function LocationScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#B3D4FC", padding: 20 }}>
   
      <NameCard />


      <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Location
      </Text>

      
      <View style={{ width: "100%", height: 200, backgroundColor: "#E0E0E0", borderRadius: 10, marginBottom: 20, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#555" }}>Map Placeholder</Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Last Location: Pune</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Other Option</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  card: {
    flex: 1,
    backgroundColor: "#1976D2",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  cardText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
};

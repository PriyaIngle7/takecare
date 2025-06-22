import { StyleSheet, Text, View, Dimensions, Image, FlatList, TouchableOpacity, Modal, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "@/contexts/AuthContext";
import { usePatient } from "@/contexts/PatientContext";

const { width } = Dimensions.get("window");
const scale = width / 320;

interface Patient {
  _id: string;
  name: string;
  email: string;
  role: string;
}

type RootStackParamList = {
  Createcaretaker: undefined;
  Features: undefined;
};

const UserList = ({}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const { setSelectedPatient } = usePatient();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await axios.get(
        "https://takecare-ds3g.onrender.com/api/caretaker/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients(response.data.patients);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch patients");
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePatientSelect = (patient: Patient) => {
    // Set the selected patient in context
    setSelectedPatient(patient);
    // Navigate to Features page
    navigation.navigate("Features");
  };

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity 
      style={styles.patientCard}
      onPress={() => handlePatientSelect(item)}
    >
      <Image
        source={require("../../assets/images/userImage2.png")}
        style={styles.patientImage}
      />
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientEmail}>{item.email}</Text>
        <Text style={styles.patientStatus}>Active</Text>
      </View>
      <AntDesign name="right" size={20 * scale} color="#0B82D4" />
    </TouchableOpacity>
  );

  const handleAddPatient = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Not authenticated");
        return;
      }

      const response = await axios.post(
        "https://takecare-ds3g.onrender.com/api/caretaker/validate-invite",
        { inviteCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Successfully linked with patient!");
      setModalVisible(false);
      setInviteCode("");
      fetchPatients(); // Refresh the patient list
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.error || "Failed to validate patient invite code"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {navigation.goBack()
          console.log("back")
         }}>
          <AntDesign name="arrowleft" size={20 * scale} color="#0B82D4" onP/>
        </TouchableOpacity>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search patients..."
          style={styles.searchInput}
        />
        <AntDesign name="search1" size={20 * scale} color="#0B82D4" />
      </View>

      <View style={styles.titleContainer}>
        <Image
          style={styles.titleImage}
          source={require("../../assets/images/userImage2.png")}
        />
        <Text style={styles.title}>Your Patients</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Text>Loading patients...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          renderItem={renderPatientItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text>No patients found</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={24 * scale} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Patient</Text>
            <Text style={styles.modalSubtitle}>Enter patient's invite code</Text>
            
            <TextInput
              style={styles.inviteInput}
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholder="Enter invite code"
              placeholderTextColor="#666"
              autoCapitalize="characters"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setInviteCode("");
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.addPatientButton]}
                onPress={handleAddPatient}
              >
                <Text style={[styles.buttonText, { color: '#fff' }]}>Add Patient</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  header: {
    paddingVertical: 10 * scale,
    paddingHorizontal: 10 * scale,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 2,
  },
  searchInput: {
    backgroundColor: "#C4DBFA",
    width: "80%",
    borderRadius: 10 * scale,
    padding: 10 * scale,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20 * scale,
    marginTop: 20 * scale,
  },
  titleImage: {
    left: -50 * scale,
    top: -55 * scale,
  },
  title: {
    fontSize: 20 * scale,
    left: -50 * scale,
    fontWeight: "700",
  },
  listContainer: {
    padding: 15 * scale,
  },
  patientCard: {
    flexDirection: "row",
    backgroundColor: "#F5F8FF",
    borderRadius: 15 * scale,
    padding: 15 * scale,
    marginBottom: 15 * scale,
    alignItems: "center",
  },
  patientImage: {
    width: 50 * scale,
    height: 50 * scale,
    borderRadius: 25 * scale,
  },
  patientInfo: {
    flex: 1,
    marginLeft: 15 * scale,
  },
  patientName: {
    fontSize: 16 * scale,
    fontWeight: "600",
    color: "#333",
  },
  patientEmail: {
    fontSize: 14 * scale,
    color: "#666",
    marginTop: 4 * scale,
  },
  patientStatus: {
    fontSize: 12 * scale,
    color: "#4CAF50",
    marginTop: 4 * scale,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  addButton: {
    position: 'absolute',
    right: 20 * scale,
    bottom: 20 * scale,
    backgroundColor: '#0B82D4',
    width: 56 * scale,
    height: 56 * scale,
    borderRadius: 28 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20 * scale,
    padding: 20 * scale,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20 * scale,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10 * scale,
  },
  modalSubtitle: {
    fontSize: 14 * scale,
    color: '#666',
    marginBottom: 20 * scale,
  },
  inviteInput: {
    width: '100%',
    height: 50 * scale,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10 * scale,
    paddingHorizontal: 15 * scale,
    fontSize: 16 * scale,
    marginBottom: 20 * scale,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',

  },
  modalButton: {
    flex: 1,
    padding: 10 * scale,
    borderRadius: 10 * scale,
    marginHorizontal: 5 * scale,
    
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    
  },
  addPatientButton: {
    backgroundColor: '#0B82D4',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14 * scale,
    fontWeight: '600',
  },
});

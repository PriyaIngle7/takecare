import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList } from "react-native";
const { width } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import AlarmImg from "../../assets/images/alarm";
import ActivityImg from "../../assets/images/activity";
import NotesImg from "../../assets/images/notes";
import LocationImg from "../../assets/images/location";
import CaloriesImg from "../../assets/images/calories";
import MedicineGuideImg from "../../assets/images/medicineguide";
import StepsImg from "../../assets/images/steps";
import MedicineMonitoringImg from "../../assets/images/medicinemonitoring";
import ExerciseClipsImg from "../../assets/images/exerciseclips";
import HealthRecordImg from "../../assets/images/healthrecord";
import NameCard from "../compo/NameCard";
import ProfileScreen from "./Profile";
const scale = width / 320;
type RootStackParamList = {
  AlarmScreen: undefined;
  ActivityScreen: undefined;
  NotesScreen: undefined;
  LocationScreen: undefined;
  CaloriesScreen: undefined;
  MedicineGuideScreen: undefined;
  StepsScreen: undefined;
  MedicineMonitoringScreen: undefined;
  ExerciseClipsScreen: undefined;
  HealthRecordScreen: undefined;
  UserList: undefined;
};

const features = [
  { title: "Alarm", image: AlarmImg, screen: "AlarmScreen" },
  { title: "Activity Monitoring", image: ActivityImg, screen: "ActivityScreen" },
  { title: "Your Notes", image: NotesImg, screen: "NotesScreen" },
  { title: "Location", image: LocationImg, screen: "LocationScreen" },
  { title: "Calories", image: CaloriesImg, screen: "CaloriesScreen" },
  { title: "Medicine Guide", image: MedicineGuideImg, screen: "MedicineGuideScreen" },
  { title: "Steps", image: StepsImg, screen: "StepsScreen" },
  { title: "Medicine Monitoring", image: MedicineMonitoringImg, screen: "MedicineMonitoringScreen" },
  { title: "Exercise Clips", image: ExerciseClipsImg, screen: "ExerciseClipsScreen" },
  { title: "Health Record", image: HealthRecordImg, screen: "HealthRecordScreen" },
];

const carouselImages = [
  require("../../assets/images/ad1.jpg"),
  require("../../assets/images/ad2.png"),
  require("../../assets/images/ad3.png"),
];

const Features = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isCaretaker, setIsCaretaker] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const isScrolling = useRef(false);

  useEffect(() => {
    checkUserRole();
    startAutoSlide();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex]);

  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (flatListRef.current && !isScrolling.current) {
        const nextIndex = (currentIndex + 1) % carouselImages.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      }
    }, 3000);
  };

  const handleManualScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const handleScrollBegin = () => {
    isScrolling.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleScrollEnd = () => {
    isScrolling.current = false;
    startAutoSlide();
  };

  const checkUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setIsCaretaker(user.role === "caretaker");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  const renderCarouselItem = ({ item }: { item: any }) => (
    <Image
      source={item}
      style={styles.carouselImage}
      resizeMode="cover"
    />
  );

  const renderCarouselDots = () => (
    <View style={styles.dotsContainer}>
      {carouselImages.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index === currentIndex ? '#0B82D4' : '#D1D1D1' }
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F8FF", paddingTop: 40 }}>
      <NameCard/>
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={carouselImages}
          renderItem={renderCarouselItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleManualScroll}
          onScrollBeginDrag={handleScrollBegin}
          onMomentumScrollBegin={handleScrollBegin}
          onScrollEndDrag={handleScrollEnd}
          getItemLayout={(data, index) => ({
            length: width - 40,
            offset: (width - 40) * index,
            index,
          })}
          initialScrollIndex={0}
          snapToInterval={width - 40}
          decelerationRate="fast"
          scrollEventThrottle={16}
          keyExtractor={(_, index) => index.toString()}
        />
        {renderCarouselDots()}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
          {features.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: "45%",
                backgroundColor: "#E6F0FF",
                borderRadius: 15,
                padding: 15,
                alignItems: "center",
                marginBottom: 15,
              }}
              onPress={() => navigation.navigate(item.screen as keyof RootStackParamList)}
            >
              <item.image width={100} height={100}/>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" ,backgroundColor: "#fff",borderRadius: 10,padding: 10,marginTop:10,textAlign:"center" }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {isCaretaker && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("UserList")}
        >
          <AntDesign name="team" size={28 * scale} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Features;

const styles = StyleSheet.create({
  carouselContainer: {
    margin: 20,
    backgroundColor: "#E6F0FF",
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
  },
  carouselImage: {
    width: width - 40,
    height: 200,
    borderRadius: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  dot: {
    width: 8 * scale,
    height: 8 * scale,
    borderRadius: 4 * scale,
    marginHorizontal: 4 * scale,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
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
});

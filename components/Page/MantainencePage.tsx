import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React from 'react'
import NameCard from '../compo/NameCard'
import MedicalKit from "../../assets/images/medicalkit"
const {width} = Dimensions.get('window')
const scale = width/320;
const MantainencePage = ({navigation}:any) => {
  return (
    <View style={{paddingVertical:20*scale,backgroundColor:"#fff",flex:1}}>
        <NameCard/>
        <View style={{backgroundColor:"#0B82D4",paddingHorizontal:20*scale,paddingVertical:40*scale,margin:20*scale,borderRadius:10*scale}}>
        <View style={{alignItems:"center",backgroundColor:"#fff",borderRadius:10*scale}}>

        <MedicalKit/>
        <Text style={{fontSize:30*scale,fontWeight:"bold"}}>THIS FEATURE</Text>
        <Text style={{fontSize:30*scale,fontWeight:"bold"}}>COMING</Text>
        <Text style={{fontSize:30*scale,fontWeight:"bold"}}>SOON</Text>
        </View>
        </View>
    </View>
  )
}

export default MantainencePage

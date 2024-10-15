import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Anos = () => {
  const navigation = useNavigation();
  const anos = [
    { label: "1° ano E.M.", icon: "school-outline", isHalfFilled: false },
    { label: "2° ano E.M.", icon: "school", isHalfFilled: true }, 
    { label: "3° ano E.M.", icon: "school", isHalfFilled: false } 
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Play')}>
        <Ionicons name="arrow-back" size={30} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Escolha um ano do Ensino Médio:</Text>

      {anos.map((ano) => (
        <TouchableOpacity 
          key={ano.label} 
          style={styles.button} 
          onPress={() => navigation.navigate('Materias', { year: ano.label })} 
        >
          <View style={styles.iconContainer}>
            <Ionicons name="school-outline" size={24} color="#004AAD" style={styles.iconOutline} />
            {ano.isHalfFilled ? (
              <Ionicons name={ano.icon} size={24} color="#004AAD" style={styles.halfFilledIcon} />
            ) : (
              <Ionicons name={ano.icon} size={24} color="#004AAD" style={styles.icon} />
            )}
          </View>
          <Text style={styles.buttonText}>{ano.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#004AAD",
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFF",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: 'BreeSerif',
  },
  button: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center", 
    elevation: 2,
  },
  iconContainer: {
    position: "absolute",
    left: 20,  
  },
  icon: {
    position: "absolute",
    left: 0,
    top: -10,
  },
  iconOutline: {
    position: "absolute",
    left: 0,
    top: -10,
    zIndex: 1,
  },
  halfFilledIcon: {
    position: "absolute",
    left: 0,
    top: -10,
    opacity: 0.5, 
  },
  buttonText: {
    fontSize: 20,
    color: "#004AAD",
    fontFamily: 'BreeSerif',
    textAlign: "center", 
  },
});

export default Anos;
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Play() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Image
          style={styles.img2}
          source={require("../../assets/enfeite.png")}
        />
        <Image style={styles.img} source={require("../../assets/logo.png")} />
      </View>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate("Anos")}>
        <Text style={styles.textButton}>Jogar Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004AAD",
    alignItems: "center",
  },

  container2: {
    alignItems: "center",
  },

  img: {
    marginTop: 100,
  },

  img2: {
    width: 410,
  },

  buttonContainer: {
    width: 350,
    height: 60,
    position: 'absolute', 
    bottom: 80, 
    borderRadius: 20,
    backgroundColor: "#1C98ED",
    alignItems: "center",
    justifyContent: "center",
  },

  textButton: {
    color: "#FFF",
    fontSize: 27,
    fontFamily: "BreeSerif",
  },
});


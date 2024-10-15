import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const materiasData = {
  "1° ano E.M.": [
    { name: "História", screen: "QuizHistoria", icon: "book-outline" },
    { name: "Geografia", screen: "QuizGeografia", icon: "earth-outline" },
    { name: "Língua Portuguesa", screen: "QuizPortugues", icon: "language-outline" },
    { name: "Quimica", screen: "QuizQuimica", icon: "flask-outline" },
    { name: "Educação Fisica", screen: "QuizEdFisica", icon: "fitness-outline" },
    { name: "Matemática", screen: "QuizMatematica", icon: "calculator-outline" },
    { name: "Física", screen: "QuizFisica", icon: "nuclear-outline" },
    { name: "Sociologia", screen: "QuizSociologia", icon: "people-outline" },
    { name: "Biologia", screen: "QuizBiologia", icon: "leaf-outline" },
    { name: "Inglês", screen: "QuizIngles", icon: "chatbubble-outline" },
    { name: "Arte", screen: "QuizArtes", icon: "color-palette-outline" },
    { name: "Filosofia", screen: "QuizFilosofia", icon: "bulb-outline" },
    { name: "Espanhol", screen: "QuizEspanhol", icon: "globe-outline" },
  ],
  "2° ano E.M.": [
    { name: "História", screen: "QuizHistoria2", icon: "book-outline" },
    { name: "Geografia", screen: "QuizGeografia2", icon: "earth-outline" },
    { name: "Língua Portuguesa", screen: "QuizPortugues2", icon: "language-outline" },
    { name: "Quimica", screen: "QuizQuimica2", icon: "flask-outline" },
    { name: "Educação Fisica", screen: "QuizEdFisica2", icon: "fitness-outline" },
    { name: "Matemática", screen: "QuizMatematica2", icon: "calculator-outline" },
    { name: "Física", screen: "QuizFisica2", icon: "nuclear-outline" },
    { name: "Sociologia", screen: "QuizSociologia2", icon: "people-outline" },
    { name: "Biologia", screen: "QuizBiologia2", icon: "leaf-outline" },
    { name: "Inglês", screen: "QuizIngles2", icon: "chatbubble-outline" },
    { name: "Arte", screen: "QuizArtes2", icon: "color-palette-outline" },
    { name: "Filosofia", screen: "QuizFilosofia2", icon: "bulb-outline" },
    { name: "Espanhol", screen: "QuizEspanhol2", icon: "globe-outline" },
  ],
  "3° ano E.M.": [
    { name: "História", screen: "QuizHistoria3", icon: "book-outline" },
    { name: "Geografia", screen: "QuizGeografia3", icon: "earth-outline" },
    { name: "Língua Portuguesa", screen: "QuizPortugues3", icon: "language-outline" },
    { name: "Quimica", screen: "QuizQuimica3", icon: "flask-outline" },
    { name: "Educação Fisica", screen: "QuizEdFisica3", icon: "fitness-outline" },
    { name: "Matemática", screen: "QuizMatematica3", icon: "calculator-outline" },
    { name: "Física", screen: "QuizFisica3", icon: "nuclear-outline" },
    { name: "Sociologia", screen: "QuizSociologia3", icon: "people-outline" },
    { name: "Biologia", screen: "QuizBiologia3", icon: "leaf-outline" },
    { name: "Inglês", screen: "QuizIngles3", icon: "chatbubble-outline" },
    { name: "Arte", screen: "QuizArtes3", icon: "color-palette-outline" },
    { name: "Filosofia", screen: "QuizFilosofia3", icon: "bulb-outline" },
    { name: "Espanhol", screen: "QuizEspanhol3", icon: "globe-outline" },
  ],
};

const Materias = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { year } = route.params;
  let materias = materiasData[year] || [];

  materias = materias.sort((a, b) => a.name.localeCompare(b.name));

  const handleMateriaPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Anos')}>
        <Ionicons name="arrow-back" size={30} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Matérias do {year}</Text>
      <FlatList
        data={materias}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleMateriaPress(item.screen)} 
          >
            <Ionicons name={item.icon} size={24} color="#004AAD" style={styles.icon} />
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#004AAD',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'BreeSerif',
  },
  button: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    elevation: 2,
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#004AAD',
    fontFamily: 'BreeSerif',
    textAlign: 'center'
  },
});

export default Materias;

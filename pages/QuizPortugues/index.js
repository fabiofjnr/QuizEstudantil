import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image, ScrollView, Alert } from 'react-native';
import {doc, updateDoc, collection, addDoc, increment, query, orderBy, limit, getDocs, deleteDoc, Timestamp} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import AlertaLogout from '../Alertas/AlertaLogout';

const { width } = Dimensions.get('window');

const questions = [
  {
    question: "Qual é a função do sujeito em uma frase?",
    options: ["Indicar a ação que está sendo realizada", "Descrever o local onde a ação ocorre", "Indicar quem ou o que está realizando a ação", "Modificar o verbo"],
    answer: "Indicar quem ou o que está realizando a ação",
  },
  {
    question: "Qual das alternativas abaixo apresenta uma frase com um verbo transitivo direto?",
    options: ["Ele gosta de ler livros.", "Ela vai ao supermercado.", "O cachorro correu pelo parque.", "Ele comprou um presente."],
    answer: "Ele comprou um presente.",
  },
  {
    question: "Na frase 'O professor explicou a lição claramente' qual é o complemento do verbo 'explicou'?",
    options: ["O professor", "A lição", "Claramente", "Explicou"],
    answer: "A lição",
  },
  {
    question: "Qual é a função da vírgula na frase: 'Eu gosto de estudar mas estou cansado'?",
    options: ["Separar a oração principal da subordinada", "Indicar a separação entre sujeito e predicado", "Separar orações coordenadas sindéticas", "Indicar uma elipse"],
    answer: "Separar orações coordenadas sindéticas",
  },
  {
    question: "Qual é a diferença entre um advérbio e um adjetivo?",
    options: ["O advérbio modifica o substantivo e o adjetivo modifica o verbo", "O advérbio modifica o verbo e o adjetivo modifica o substantivo", "O advérbio modifica o adjetivo e o adjetivo modifica o advérbio", "O advérbio e o adjetivo têm a mesma função"],
    answer: "O advérbio modifica o verbo e o adjetivo modifica o substantivo",
  },
  {
    question: "Qual das alternativas abaixo é um exemplo de um pronome pessoal do caso reto?",
    options: ["Me", "Ti", "Nós", "O"],
    answer: "Nós",
  },
  {
    question: "Qual é a função de um predicado na estrutura de uma frase?",
    options: ["Indicar quem está realizando a ação", "Indicar o tempo em que a ação ocorre", "Descrever o sujeito e a ação que ele realiza", "Modificar o sentido do verbo"],
    answer: "Descrever o sujeito e a ação que ele realiza",
  },
  {
    question: "Em 'A casa azul é muito bonita' qual é a função do adjetivo 'azul'?",
    options: ["Modificar o verbo", "Modificar o adjetivo", "Modificar o substantivo", "Indicar o tempo"],
    answer: "Modificar o substantivo",
  },
  {
    question: "Qual é a função de um conectivo na frase?",
    options: ["Modificar o substantivo", "Relacionar e unir partes do texto", "Indicar a ação principal", "Descrever o sujeito"],
    answer: "Relacionar e unir partes do texto",
  },
  {
    question: "Na frase 'Se eu estudar passarei no exame' qual é a função da expressão 'Se eu estudar'?",
    options: ["Expressar uma certeza", "Indicar uma consequência", "Indicar uma condição", "Descrever um fato"],
    answer: "Indicar uma condição",
  }
];

const QuizPortugues = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const pointsPerQuestion = 5;
  const [quizData, setQuizData] = useState([]);
  const [showExitAlert, setShowExitAlert] = useState(false);

  const handleExitQuiz = () => {
    setShowExitAlert(true);
  };

  const confirmExit = () => {
    setShowExitAlert(false);
    navigation.navigate('Play');
  };

  const cancelExit = () => {
    setShowExitAlert(false);
  };

  const handleOptionPress = (option) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = option === currentQuestion.answer;

    setSelectedOption(option);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(prevScore => prevScore + 1);
    }

    setQuizData(prevData => [
      ...prevData,
      {
        question: currentQuestion.question,
        selected: option,
        correct: currentQuestion.answer
      }
    ]);

    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setShowScore(true);
        calculateAndSavePoints();
      }
    }, 2300);
  };

  const calculateAndSavePoints = async () => {
    const totalPoints = score * pointsPerQuestion;
    const user = auth.currentUser;

    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);

        await updateDoc(userRef, { pontos: increment(totalPoints) });
        console.log("Pontos totais do usuário atualizados no Firestore.");

        const quizHistoryCollectionRef = collection(db, "users", user.uid, "quizHistory");

        const quizHistoryEntry = {
          titulo: 'Quiz de Português | 1° ano',
          score: totalPoints,
          totalQuestions: questions.length,
          acertos: score,
          data: Timestamp.now(), 
        };

        await addDoc(quizHistoryCollectionRef, quizHistoryEntry);
        console.log("Histórico de QuizArtes atualizado no Firestore.");
      } catch (error) {
        console.error("Erro ao salvar a pontuação e histórico:", error);
      }
    } else {
      console.log("Usuário não autenticado.");
    }
  };

  const getEmoji = () => {
    if (score <= 3) {
      return require('../../assets/sad.png');
    } else if (score <= 7) {
      return require('../../assets/happy.png');
    } else {
      return require('../../assets/super_happy.png');
    }
  };

  const getChartData = () => {
    const correctAnswers = quizData.filter(item => item.selected === item.correct).length;
    const incorrectAnswers = quizData.length - correctAnswers;

    return {
      labels: ['Corretas', 'Erradas'],
      datasets: [
        {
          data: [correctAnswers, incorrectAnswers],
        },
      ],
    };
  };

  const handleRefazerQuiz = async () => {
    console.log("Refazendo o quiz. Resetando estados.");

    const user = auth.currentUser;

    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const quizHistoryCollectionRef = collection(db, "users", user.uid, "quizHistory");

        const q = query(quizHistoryCollectionRef, orderBy("data", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const quizDoc = querySnapshot.docs[0];
          const quizData = quizDoc.data();
          const previousQuizScore = quizData.score || 0;

          await updateDoc(userRef, { pontos: increment(-previousQuizScore) });
          console.log("Pontuação anterior subtraída dos pontos totais.");

          await deleteDoc(quizDoc.ref);
          console.log("Tentativa anterior removida do histórico de quizzes.");
        } else {
          Alert.alert("Nenhuma tentativa encontrada", "Não há uma tentativa anterior para refazer.");
          return;
        }

        setShowScore(false);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsCorrect(false);
        setShowFeedback(false);
        setScore(0);
        setQuizData([]);

      } catch (error) {
        console.error("Erro ao refazer o quiz e remover a tentativa anterior:", error);
        Alert.alert("Erro", "Ocorreu um erro ao tentar refazer o quiz. Tente novamente.");
      }
    } else {
      console.log("Usuário não autenticado.");
      Alert.alert("Erro de Autenticação", "Usuário não autenticado. Por favor, faça login novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <AlertaLogout
        visible={showExitAlert}
        title="Sair do Quiz"
        message="Tem certeza que deseja sair do quiz? Sua pontuação não será salva."
        onClose={cancelExit}
        onConfirm={confirmExit}
      />

      {!showScore && (
        <TouchableOpacity style={styles.exitButton} onPress={handleExitQuiz}>
          <Ionicons name="exit-outline" size={24} color="white" />
          <Text style={styles.exitButtonText}> Sair do Quiz</Text>
        </TouchableOpacity>
      )}

      {showScore ? (
        <ScrollView contentContainerStyle={styles.scoreContainer}>
          <Image source={getEmoji()} style={styles.emoji} />

          <Text style={styles.scoreText}>
            Você acertou {score} de {questions.length} perguntas!
          </Text>
          <Text style={styles.pointsText}>
            Total de pontos: {score * pointsPerQuestion}
          </Text>

          <BarChart
            data={getChartData()}
            width={width * 0.8}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: "#E8EAF6",
              backgroundGradientFrom: "#E8EAF6",
              backgroundGradientTo: "#E8EAF6",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                stroke: "#ccc",
              },
            }}
            style={{
              marginVertical: 20,
              borderRadius: 16,
            }}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRefazerQuiz}
            >
              <Ionicons name="refresh-circle" size={24} color="white" />
              <Text style={styles.buttonText}></Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Play')}
            >
              <Ionicons name="home-outline" size={24} color="white" />
              <Text style={styles.buttonText}></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <Text style={styles.counterText}>
            Questão {currentQuestionIndex + 1} de {questions.length}
          </Text>
          <Text style={styles.questionText}>
            {questions[currentQuestionIndex].question}
          </Text>
          <FlatList
            data={questions[currentQuestionIndex].options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption && {
                    backgroundColor:
                      item === questions[currentQuestionIndex].answer
                        ? '#32CD32'
                        : item === selectedOption
                          ? '#FF6347'
                          : '#FFF',
                  },
                ]}
                onPress={() => handleOptionPress(item)}
                disabled={!!selectedOption}
              >
                <Text style={styles.optionText}>{item}</Text>
                {selectedOption && (
                  <Ionicons
                    name={
                      item === questions[currentQuestionIndex].answer
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={24}
                    color={
                      item === questions[currentQuestionIndex].answer
                        ? "#006400"
                        : "#8B0000"
                    }
                  />
                )}
              </TouchableOpacity>
            )}
          />
          {showFeedback && (
            <Text style={styles.feedbackText}>
              {isCorrect ? 'Resposta correta!' : `Resposta errada!`}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004AAD',
    paddingHorizontal: 10,
  },
  exitButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0277BD',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  exitButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  counterText: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'BreeSerif',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  optionButton: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 25,
    width: width * 0.9,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'BreeSerif',
    width: '85%',
    marginLeft: '5%',
  },
  feedbackText: {
    fontSize: 22,
    color: '#FFF',
    marginTop: 20,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  scoreText: {
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  pointsText: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
  },
  emoji: {
    width: 100,
    height: 100,
    marginTop: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    width: '92%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0277BD',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '45%',
    alignItems: 'center', 
    justifyContent: 'center', 
    flexDirection: 'row', 
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default QuizPortugues;

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
        question: "O que é metabolismo?",
        options: ["O processo de divisão celular", "O conjunto de reações químicas que ocorrem em um organismo", "A respiração celular", "A digestão dos alimentos"],
        answer: "O conjunto de reações químicas que ocorrem em um organismo",
      },
      {
        question: "Qual é o papel do DNA nas células?",
        options: ["Produzir energia para a célula", "Transportar nutrientes", "Armazenar e transmitir a informação genética", "Atuar na digestão celular"],
        answer: "Armazenar e transmitir a informação genética",
      },
      {
        question: "O que são enzimas?",
        options: ["Proteínas que aceleram reações químicas", "Moléculas que armazenam energia", "Células que produzem proteínas", "Gorduras que são usadas como reserva de energia"],
        answer: "Proteínas que aceleram reações químicas",
      },
      {
        question: "Qual é a principal função das mitocôndrias?",
        options: ["Fotossíntese", "Respiração celular e produção de energia", "Síntese de proteínas", "Divisão celular"],
        answer: "Respiração celular e produção de energia",
      },
      {
        question: "O que caracteriza os seres autótrofos?",
        options: ["São capazes de produzir seu próprio alimento", "São organismos heterotróficos", "Dependem de outros seres vivos para se alimentar", "Vivem em simbiose com outros organismos"],
        answer: "São capazes de produzir seu próprio alimento",
      },
      {
        question: "O que é seleção natural?",
        options: ["A escolha de indivíduos mais adaptados ao ambiente para sobreviver e se reproduzir", "A evolução programada por fatores externos", "A reprodução seletiva de plantas", "A mutação aleatória de genes"],
        answer: "A escolha de indivíduos mais adaptados ao ambiente para sobreviver e se reproduzir",
      },
      {
        question: "Qual é a principal característica das células-tronco?",
        options: ["São capazes de se diferenciar em vários tipos de células", "São especializadas em uma única função", "Não podem se dividir", "São encontradas apenas em plantas"],
        answer: "São capazes de se diferenciar em vários tipos de células",
      },
      {
        question: "O que é a meiose?",
        options: ["Um tipo de divisão celular que resulta em células idênticas", "Um tipo de divisão celular que resulta em quatro células com metade do número de cromossomos", "Um processo de duplicação de DNA", "A produção de proteínas no ribossomo"],
        answer: "Um tipo de divisão celular que resulta em quatro células com metade do número de cromossomos",
      },
      {
        question: "O que é um ecossistema?",
        options: ["Um sistema composto apenas por plantas", "Um conjunto de seres vivos que interagem entre si e com o meio ambiente", "Um ambiente artificial criado pelo ser humano", "Uma região desabitada"],
        answer: "Um conjunto de seres vivos que interagem entre si e com o meio ambiente",
      },
      {
        question: "O que caracteriza a respiração celular aeróbica?",
        options: ["O uso de oxigênio para quebrar moléculas de glicose e produzir energia", "A produção de energia sem oxigênio", "A transformação de oxigênio em gás carbônico", "A respiração sem a presença de glicose"],
        answer: "O uso de oxigênio para quebrar moléculas de glicose e produzir energia",
      }
];

const QuizBiologia2 = ({ navigation }) => {
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
          titulo: 'Quiz de Biologia | 2° ano',
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

export default QuizBiologia2;

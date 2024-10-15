import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, limit, deleteDoc } from 'firebase/firestore'; 
import { auth, db } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons';

const QuizesSalvos = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizAtual, setQuizAtual] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [noQuizzes, setNoQuizzes] = useState(false); 

  useFocusEffect(
    React.useCallback(() => {
      const fetchQuizzes = async () => {
        const user = auth.currentUser;

        if (user) {
          try {
            const quizHistoryRef = collection(db, "users", user.uid, "quizHistory");
            const querySnapshot = await getDocs(quizHistoryRef);
            const quizData = querySnapshot.docs
              .map(doc => ({
                id: doc.id,
                ...doc.data()
              }))
              .filter(quiz => quiz.data && quiz.data.seconds); 

            quizData.sort((a, b) => b.data.seconds - a.data.seconds);
            setQuizzes(quizData);
            setNoQuizzes(quizData.length === 0); 
          } catch (error) {
            console.error("Erro ao buscar quizzes:", error);
            Alert.alert("Erro", "Não foi possível carregar os quizzes.");
          } finally {
            setLoading(false); 
          }
        } else {
          console.error("Usuário não autenticado.");
          Alert.alert("Erro", "Usuário não autenticado.");
          setLoading(false); 
        }
      };

      fetchQuizzes();
    }, [])
  );

  const abrirQuiz = (quiz) => {
    setQuizAtual(quiz);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.quizItem} onPress={() => abrirQuiz(item)}>
      <Text style={styles.title}>{item.titulo}</Text>
      <View style={styles.infoContainer}>
        <Icon name="date-range" size={20} color="#0277BD" />
        <Text style={styles.date}>
          Feito em: {item.data && item.data.seconds ? new Date(item.data.seconds * 1000).toLocaleString() : 'Data não disponível'}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="star" size={20} color="#0277BD" />
        <Text style={styles.pontos}>Pontuação: {item.score}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Icon name="check-circle" size={20} color="#0277BD" />
        <Text style={styles.acertos}>Acertos: {item.acertos !== undefined ? item.acertos : 'Não disponível'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" /> 
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : noQuizzes ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não fez nenhum quiz.</Text>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {quizAtual && (
              <>
                <Text style={styles.modalTitle}><FontAwesome name="question-circle" size={24} color="#01579B" /> • {quizAtual.titulo}</Text>
                <Text style={styles.modalDate}>
                  Feito em: {quizAtual.data && quizAtual.data.seconds ? new Date(quizAtual.data.seconds * 1000).toLocaleString() : 'Data não disponível'}
                </Text>
                <Text style={styles.modalPontos}>Pontuação: {quizAtual.score}</Text>
                <Text style={styles.modalAcertos}>Acertos: {quizAtual.acertos !== undefined ? quizAtual.acertos : 'Não disponível'}</Text>
                <TouchableOpacity style={styles.roundCloseButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.roundCloseButtonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#01579B',
    padding: 20,
  },
  loadingContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  quizItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 80,
  },
  title: {
    fontSize: 18,
    color: '#0288D1',
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  date: {
    fontSize: 16,
    color: '#0277BD',
    marginLeft: 5,
  },
  pontos: {
    fontSize: 16,
    color: '#0277BD',
    marginLeft: 5,
  },
  acertos: {
    fontSize: 16,
    color: '#0277BD',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#01579B',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 18,
    color: '#0288D1',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalPontos: {
    fontSize: 18,
    color: '#0277BD',
    textAlign: 'center',
  },
  modalAcertos: {
    fontSize: 18,
    color: '#0277BD',
    textAlign: 'center',
  },
  roundCloseButton: {
    marginTop: 20,
    width: '40%',
    height: 40,
    borderRadius: 15,
    backgroundColor: '#0288D1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizesSalvos;

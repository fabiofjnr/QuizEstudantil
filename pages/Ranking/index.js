import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Modal, TouchableOpacity, TextInput } from 'react-native';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useIsFocused } from '@react-navigation/native';

const trophyIcons = [
  '🥇',
  '🥈',
  '🥉',
];

const Ranking = () => {
  const isFocused = useIsFocused();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newScore, setNewScore] = useState('');
  const [userRank, setUserRank] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  const authorizedEmails = ["fj878207@gmail.com", "quizestudantil@gmail.com"];

  useEffect(() => {
    const fetchRankingData = async () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('pontos', 'desc'), limit(10));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const rankingData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setUsers(rankingData);
        setLoading(false);
      }, (error) => {
        console.error("Erro ao buscar dados do ranking:", error);
        setLoading(false);
      });

      const allUsersSnapshot = await getDocs(query(usersRef, orderBy('pontos', 'desc')));
      const allUsers = allUsersSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        rank: index + 1
      }));

      const currentUser = allUsers.find(user => user.id === auth.currentUser?.uid);

      setCurrentUserData(currentUser || {
        pontos: 0,
        name: auth.currentUser?.displayName || 'Usuário',
        profileImageUrl: currentUser?.profileImageUrl || auth.currentUser?.photoURL || null
      });

      if (currentUser) {
        setUserRank(currentUser.rank);
      } else {
        setUserRank(null);
      }

      return () => unsubscribe();
    };

    if (isFocused) {  
      fetchRankingData();  
    }
  }, [isFocused]);

  const openUserModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
    setNewScore('');
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
    setNewScore('');
  };

  const updateUserScore = async () => {
    if (selectedUser && newScore !== '') {
      const userRef = doc(db, 'users', selectedUser.id);
      try {
        await updateDoc(userRef, { pontos: Number(newScore) });
        closeModal();
      } catch (error) {
        console.error("Erro ao atualizar a pontuação:", error);
      }
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.rankingItem} onPress={() => openUserModal(item)}>
      <Text style={styles.rank}>{index + 1}º</Text>
      <Image
        source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../../assets/avatarpadrao.png')}
        style={styles.avatar}
      />
      <Text style={styles.name}>
        {item.name} {index < 3 ? trophyIcons[index] : ''}
      </Text>
      <Text style={styles.score}>{item.pontos}pts</Text>
    </TouchableOpacity>
  );

  const renderUserStatus = () => {
    if (currentUserData && currentUserData.pontos === 0) {
      return (
        <View style={styles.rankingItem}>
          <Text style={styles.rank}>99º</Text>
          <Image
            source={currentUserData.profileImageUrl
              ? { uri: currentUserData.profileImageUrl }
              : auth.currentUser?.photoURL
                ? { uri: auth.currentUser.photoURL }
                : require('../../assets/avatarpadrao.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            Você ainda não está no ranking.
            Complete algum quiz e apareça!
          </Text>
        </View>
      );
    }

    if (currentUserData && userRank > 10) {
      return (
        <TouchableOpacity style={styles.rankingItem}>
          <Text style={styles.rank}>{userRank}º</Text>
          <Image
            source={currentUserData.profileImageUrl
              ? { uri: currentUserData.profileImageUrl }
              : auth.currentUser?.photoURL
                ? { uri: auth.currentUser.photoURL }
                : require('../../assets/avatarpadrao.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{currentUserData.name}</Text>
          <Text style={styles.score}>{currentUserData.pontos}pts</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };


  const isAuthorizedUser = authorizedEmails.includes(auth.currentUser?.email);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListFooterComponent={renderUserStatus} 
          />
        </>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <Image
                  source={selectedUser.profileImageUrl ? { uri: selectedUser.profileImageUrl } : require('../../assets/avatarpadrao.png')}
                  style={styles.modalAvatar}
                />
                <Text style={styles.modalName}>{selectedUser.name}</Text>
                <Text style={styles.modalUsername}>@{selectedUser.username ? selectedUser.username : "sem nome de usuário"}</Text>
                <Text style={styles.modalScore}>Pontuação atual: {selectedUser.pontos} pontos</Text>

                {isAuthorizedUser && (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Nova pontuação"
                      keyboardType="numeric"
                      value={newScore}
                      onChangeText={setNewScore}
                    />

                    <TouchableOpacity onPress={updateUserScore} style={styles.updateButton}>
                      <Text style={styles.updateButtonText}>Alterar Pontuação</Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Fechar</Text>
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
    fontFamily: 'BreeSerif',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  rank: {
    fontSize: 18,
    color: '#01579B',
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    marginLeft: 8,
  },
  name: {
    fontSize: 18,
    flex: 1,
    color: '#0288D1',
  },
  score: {
    fontSize: 16,
    color: '#0277BD',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outOfRanking: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '70%',
  },
  outOfRankingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
    textAlign: 'center',
    width: '70%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  modalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#01579B',
  },
  modalUsername: {
    fontSize: 16,
    color: '#0288D1',
    marginBottom: 10,
  },
  modalScore: {
    fontSize: 18,
    color: '#0277BD',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#0288D1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Ranking;

import React, { useState, useEffect } from "react";
import {StyleSheet,Text,View,Image,TextInput,TouchableOpacity,ScrollView,Alert,} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import AlertaLogin from "../Alertas/AlertaLogin";
import AlertaLogout from '../Alertas/AlertaLogout';

export default function Perfil() {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [alertData, setAlertData] = useState({ title: '', message: '' });


  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNome(userData.name || "");
          setUsername(userData.username || "");
          setProfileImageUrl(userData.profileImageUrl || null);
        }
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      setAlertVisible(true);
      setAlertData({
        title: "Erro",
        message: "Nenhum usuário autenticado.",
      });
      return;
    }

    const isValidUsername = (username) => {
      const usernameRegex = /^[a-zA-Z0-9._]{3,24}$/; 
      return usernameRegex.test(username);
    };

    if (!isValidUsername(username)) {
      setAlertVisible(true);
      setAlertData({
        title: "Erro",
        message: "Nome de usuário inválido. Deve conter apenas letras, números, pontos ou sublinhados e ter entre 3 e 24 caracteres.",
      });
      return;
    }

    try {
      const usernamesQuery = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const usernamesSnapshot = await getDocs(usernamesQuery);

      if (!usernamesSnapshot.empty && username !== (await getDoc(doc(db, "users", user.uid))).data().username) {
        setAlertVisible(true);
        setAlertData({
          title: "Erro!",
          message: "Esse nome de usuário já está em uso.",
        });
        return;
      }

      let imageUrl = profileImageUrl;
      if (newImage) {
        const response = await fetch(newImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const userRef = doc(db, "users", user.uid);
      const currentData = (await getDoc(userRef)).data();
      const previousUsername = currentData.username;

      await updateDoc(userRef, {
        name: nome || null,
        username: username || null,
        profileImageUrl: imageUrl || null,
      });

      if (previousUsername !== username) {
      }

      setProfileImageUrl(imageUrl);
      setNewImage(null);
      setAlertVisible(true);
      setAlertData({
        title: "Sucesso!",
        message: "As alterações foram salvas com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
      setAlertVisible(true);
      setAlertData({
        title: "Erro",
        message: "Não foi possível salvar as alterações.",
      });
    }
  };

  const handleChangeProfilePicture = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Erro", "Permissão para acessar a galeria negada.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      setNewImage(pickerResult.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <AlertaLogin
      visible={alertVisible}
      title={alertData.title}
      message={alertData.message}
      onClose={() => setAlertVisible(false)}
    />


      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={
              newImage
                ? { uri: newImage }
                : profileImageUrl
                  ? { uri: profileImageUrl }
                  : require("../../assets/avatarpadrao.png")
            }
          />
          <TouchableOpacity
            style={styles.editPictureButton}
            onPress={handleChangeProfilePicture}
          >
            <Icon name="camera" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{nome}</Text>
          <Text style={styles.profileUsername}>@{username ? username : "sem nome de usuário"}</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#000"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          placeholderTextColor="#000"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <Icon name="save" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#004AAD",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#1C98ED",
  },
  editPictureButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1C98ED",
    borderRadius: 20,
    padding: 10,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileUsername: {
    color: "white",
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: "#1C98ED",
    borderRadius: 13,
    padding: 20,
    marginBottom: 20,
    width: "90%",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 13,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    borderColor: "#004AAD",
    borderWidth: 1,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "100%",
  },
  actionButton: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#1C98ED",
    padding: 15,
    borderRadius: 10,
    width: "90%",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 10,
  },
});

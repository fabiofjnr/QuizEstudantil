import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import AlertaLogin from '../Alertas/AlertaLogin';

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = () => {
    if (!email || !password || !confirmPassword || !name) {
      showAlert("Erro", "Todos os campos devem ser preenchidos!");
      return;
    }

    if (!isValidEmail(email)) {
      showAlert("Erro", "Por favor, insira um e-mail válido!");
      return;
    }

    if (password.length < 6) {
      showAlert("Erro", "A senha deve ter no mínimo 6 caracteres!");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Erro", "As senhas não conferem!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          name: name, 
          email: user.email,
        });
        console.log('Usuário Cadastrado com:', user.email);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          showAlert("Erro", "Esse e-mail já está em uso! Tente novamente com outro e-mail.");
        } else {
          console.error(error);
          showAlert("Erro", "Ocorreu um erro ao criar a conta. Tente novamente.");
        }
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContainer,
          isKeyboardVisible && { paddingBottom: 150 } 
        ]}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={isKeyboardVisible}
      >
        <View style={styles.innerContainer}>
          <Image style={styles.img} source={require('../../assets/logo.png')} />

          <View style={styles.inputcontainer}>
            <Icon name="account" size={25} color="black" style={styles.icon} />
            <TextInput
              placeholder="Nome"
              placeholderTextColor="black"
              autoCapitalize="words"
              keyboardType="default"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputcontainer}>
            <Icon name="email" size={25} color="black" style={styles.icon} />
            <TextInput
              placeholder="E-mail"
              placeholderTextColor="black"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputcontainer}>
            <Icon name="shield-lock-outline" size={25} color="black" style={styles.icon} />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="black"
              autoCapitalize="none"
              secureTextEntry={!showPassword} 
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputcontainer}>
            <Icon name="check-circle" size={25} color="black" style={styles.icon} />
            <TextInput
              placeholder="Confirme a senha"
              autoCapitalize="none"
              placeholderTextColor="black"
              secureTextEntry={!showPassword} 
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? "eye" : "eye-off"} size={25} color="black" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>CADASTRAR</Text>
          </TouchableOpacity>

          {alertVisible && (
            <AlertaLogin
              visible={alertVisible}
              title={alertTitle}
              message={alertMessage}
              onClose={() => setAlertVisible(false)}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004AAD',
  },

  innerContainer: {
    width: '90%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  input: {
    height: 40,
    width: 249,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'BreeSerif',
  },

  button: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 250,
    padding: 13,
    borderRadius: 15,
    marginTop: 30,
  },

  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'BreeSerif',
  },

  img: {
    width: '100%',
    height: 300,
    borderColor: 'black',
    marginBottom: 40,
  },

  inputcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    height: 50,
    width: 300,
  },

  icon: {
    marginRight: 10,
    width: 30,
  },

  eyeIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
});

export default Cadastro;

import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import AlertaLogin from '../Alertas/AlertaLogin';

const RecSenha = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const showAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const handleResetPassword = async () => {
        if (!email.trim()) {
            showAlert('Erro', 'Por favor, insira seu e-mail.');
            return;
        }

        try {
            console.log('E-mail:', email);

            await sendPasswordResetEmail(auth, email);
            showAlert('Sucesso', 'E-mail de redefinição de senha enviado!');
        } catch (error) {
            console.error('Erro ao enviar e-mail de redefinição:', error);

            if (error.code === 'auth/invalid-email') {
                showAlert('Erro', 'Por favor, insira um e-mail válido!');
            } else if (error.code === 'auth/user-not-found') {
                showAlert('Erro', 'Nenhum usuário foi encontrado com este e-mail!');
            } else {
                showAlert('Erro', 'Erro ao enviar e-mail de redefinição!');
            }
        }
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={isKeyboardVisible}
            >
                <View style={styles.innerContainer}>
                    <Image style={styles.img} source={require('../../assets/logo.png')} />
                    <Text style={styles.title}>Recuperação de Senha</Text>
                    <View style={styles.inputcontainer}>
                        <Icon name="email" size={30} color="black" style={styles.icon} />
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
                    <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                        <Text style={styles.buttonText}>ENVIAR E-MAIL</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <AlertaLogin
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
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
        paddingBottom: 20,
    },
    innerContainer: {
        width: '90%',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        marginBottom: 20,
        color: 'white',
        fontFamily: 'BreeSerif',
    },
    input: {
        height: 40,
        width: '100%',
        maxWidth: 250,
        paddingHorizontal: 10,
        borderRadius: 15,
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'BreeSerif',
    },
    button: {
        backgroundColor: 'white',
        width: '100%',
        maxWidth: 300,
        padding: 13,
        marginBottom: 10,
        borderRadius: 15,
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontFamily: 'BreeSerif',
    },
    inputcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
    img: {
        width: '100%',
        height: 300,
        borderColor: 'black',
        marginTop: 28,
        marginBottom: 28,
    },
});

export default RecSenha;

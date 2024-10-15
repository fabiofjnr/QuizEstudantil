import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AlertaLogin = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#01579B',
    fontFamily: 'BreeSerif',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'BreeSerif',
    color: '#0277BD'
  },
  button: {
    backgroundColor: '#0288D1', 
    borderRadius: 15,
    padding: 10,
    elevation: 2,
    width: 100,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'BreeSerif',
  },
});

export default AlertaLogin;

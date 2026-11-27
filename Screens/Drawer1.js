import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import * as Speech from 'expo-speech';

export default function Drawer1() {

  const falar = () => {
    const texto = `
      Sobre o aplicativo.

      Para usar o aplicativo, clique nos botões que existem na tela.

      É recomendado fazer login para ter a experiência completa.

      Não beba e dirija.
    `;

    Speech.stop();

    Speech.speak(texto, {
      language: 'pt-BR',
      pitch: 1,
      rate: 0.9,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>
          Sobre o aplicativo
        </Text>

        <Text style={styles.texto}>
          Para usar o aplicativo, clique nos botões que existem na tela.
        </Text>

        <Text style={styles.texto}>
          É recomendado fazer login para ter a experiência completa.
        </Text>

        <Text style={styles.texto}>
          Não beba e dirija.
        </Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={falar}
        >
          <Text style={styles.textoBotao}>
            🔊 Ouvir
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
    padding: 20
  },

  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 20
  },

  texto: {
    fontSize: 18,
    lineHeight: 28,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 15
  },

  botao: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
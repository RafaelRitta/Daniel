import React from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';

export default function Drawer1() {

  return (

    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.titulo}>
          Como usar
        </Text>

        <Text style={styles.texto}>
          Para usar o aplicativo, pressione os botões que existem na tela e seja feliz.
        </Text>

        <View style={styles.divisor} />

        <Text style={styles.aviso}>
          Não vendemos nada mostrado nesse aplicativo.
        </Text>

        <Text style={styles.subtexto}>
          Os produtos e informações exibidos são apenas para consulta.
        </Text>

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
    textAlign: 'center'
  },

  divisor: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 22
  },

  aviso: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8
  },

  subtexto: {
    fontSize: 14,
    lineHeight: 21,
    color: '#888888',
    textAlign: 'center'
  }

});

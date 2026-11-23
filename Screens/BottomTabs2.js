import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getUsuarioLogado,
  listarFavoritosUsuario,
  adicionarFavorito,
  removerFavoritoPorVeiculo,
} from '../database/database';

const veiculos = [
  {
    id: '1',
    marca: 'Chevrolet',
    modelo: 'Corvette',
    categoria: 'Supercar',
    desc: 'Músculo americano em forma de supercarro, edição Chevrolet',
    img: require('../assets/chev.jpg'),
  },
  {
    id: '2',
    marca: 'Ford',
    modelo: 'GT',
    categoria: 'Supercar',
    desc: 'Músculo americano em forma de supercarro, edição Ford',
    img: require('../assets/gt.jpg'),
  },
  {
    id: '3',
    marca: 'Peel',
    modelo: 'P50',
    categoria: 'Microcarro',
    desc: 'O menor carro de produção do mundo. "R$50 se tu couber" - Cauã',
    img: require('../assets/p50.jpg'),
  },
];

export default function BottomTabs2({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [favoritosIds, setFavoritosIds] = useState([]);

  const carregarDados = useCallback(async () => {
    try {
      const user = await getUsuarioLogado();
      setUsuario(user);

      if (user) {
        const lista = await listarFavoritosUsuario(user.id);
        setFavoritosIds(lista.map((item) => String(item.veiculo_id)));
      } else {
        setFavoritosIds([]);
      }
    } catch (error) {
      console.error('Erro ao carregar veículos/favoritos:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const alternarFavorito = async (veiculo) => {
    if (!usuario) {
      Alert.alert(
        'Login necessário',
        'Entre na sua conta na aba Perfil para favoritar veículos.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Ir para Perfil',
            onPress: () => navigation.navigate('BottomTabs3'),
          },
        ]
      );
      return;
    }

    try {
      const jaFavoritado = favoritosIds.includes(veiculo.id);

      if (jaFavoritado) {
        await removerFavoritoPorVeiculo(usuario.id, veiculo.id);
      } else {
        await adicionarFavorito(usuario.id, veiculo);
      }

      await carregarDados();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Os Veículos</Text>

      <FlatList
        data={veiculos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isFavorito = favoritosIds.includes(item.id);

          return (
            <View style={styles.card}>
              <View style={styles.imagemContainer}>
                <Image
                  source={item.img}
                  style={styles.imagem}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.cabecalhoCard}>
                <View>
                  <Text style={styles.marca}>{item.marca}</Text>
                  <Text style={styles.modelo}>{item.modelo}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.botaoFavorito,
                    isFavorito && styles.botaoFavoritoAtivo,
                  ]}
                  onPress={() => alternarFavorito(item)}
                >
                  <Ionicons
                    name={isFavorito ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFavorito ? '#fff' : '#e53935'}
                  />
                  <Text
                    style={[
                      styles.textoFavorito,
                      isFavorito && styles.textoFavoritoAtivo,
                    ]}
                  >
                    {isFavorito ? 'Favoritado' : 'Favoritar'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.categoria}>Categoria: {item.categoria}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f5f6fa',
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    padding: 15,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagemContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#181a20',
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  cabecalhoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marca: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modelo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  botaoFavorito: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e53935',
    backgroundColor: '#fff',
  },
  botaoFavoritoAtivo: {
    backgroundColor: '#e53935',
  },
  textoFavorito: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e53935',
  },
  textoFavoritoAtivo: {
    color: '#fff',
  },
  categoria: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
    marginTop: 8,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    lineHeight: 20,
  },
});
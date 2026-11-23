import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getUsuarioLogado,
  listarFavoritosUsuario,
  atualizarObservacaoFavorito,
  removerFavorito,
} from '../database/database';

const imagensVeiculos = {
  '1': require('../assets/chev.jpg'),
  '2': require('../assets/gt.jpg'),
  '3': require('../assets/p50.jpg'),
};

export default function Drawer2() {
  const [usuario, setUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [textoObservacao, setTextoObservacao] = useState('');

  const carregarFavoritos = useCallback(async () => {
    try {
      const user = await getUsuarioLogado();
      setUsuario(user);

      if (user) {
        const dados = await listarFavoritosUsuario(user.id);
        setFavoritos(dados);
      } else {
        setFavoritos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [carregarFavoritos])
  );

  const iniciarEdicao = (item) => {
    setEditandoId(item.id);
    setTextoObservacao(item.observacao || '');
  };

  const salvarObservacao = async (favoritoId) => {
    try {
      await atualizarObservacaoFavorito(favoritoId, textoObservacao);
      setEditandoId(null);
      setTextoObservacao('');
      await carregarFavoritos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a anotação.');
    }
  };

  const excluirFavorito = async (favoritoId) => {
    try {
      await removerFavorito(favoritoId);
      if (editandoId === favoritoId) {
        setEditandoId(null);
      }
      await carregarFavoritos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o favorito.');
    }
  };

  if (!usuario) {
    return (
      <View style={styles.centralizado}>
        <Ionicons name="lock-closed-outline" size={48} color="#888" />
        <Text style={styles.mensagemVazia}>
          Faça login na aba Perfil para visualizar seus veículos favoritos.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Favoritos de @{usuario.username}</Text>

      <FlatList
        data={favoritos}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Ionicons name="heart-dislike-outline" size={48} color="#888" />
            <Text style={styles.mensagemVazia}>
              Você ainda não favoritou nenhum veículo.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const emEdicao = editandoId === item.id;
          const imagemSource =
            imagensVeiculos[String(item.veiculo_id)] ||
            require('../assets/chev.jpg');

          return (
            <View style={styles.card}>
              <View style={styles.imagemContainer}>
                <Image
                  source={imagemSource}
                  style={styles.imagem}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.marca}>{item.marca}</Text>
              <Text style={styles.modelo}>{item.modelo}</Text>
              <Text style={styles.categoria}>Categoria: {item.categoria}</Text>
              <Text style={styles.desc}>{item.descricao}</Text>

              <View style={styles.notaBox}>
                <Text style={styles.notaLabel}>Anotação:</Text>

                {emEdicao ? (
                  <>
                    <TextInput
                      style={styles.inputNota}
                      placeholder="Ex: Meta de compra, carro dos sonhos..."
                      value={textoObservacao}
                      onChangeText={setTextoObservacao}
                    />
                    <View style={styles.acoesLinha}>
                      <TouchableOpacity
                        style={styles.botaoSalvar}
                        onPress={() => salvarObservacao(item.id)}
                      >
                        <Text style={styles.textoBotaoBranco}>Salvar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.botaoCancelar}
                        onPress={() => setEditandoId(null)}
                      >
                        <Text style={styles.textoBotaoSecundario}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <Text style={styles.notaTexto}>
                    {item.observacao
                      ? item.observacao
                      : 'Nenhuma anotação adicionada.'}
                  </Text>
                )}
              </View>

              {!emEdicao && (
                <View style={styles.acoesLinha}>
                  <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() => iniciarEdicao(item)}
                  >
                    <Ionicons name="create-outline" size={18} color="#2563eb" />
                    <Text style={styles.textoEditar}>Editar nota</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botaoRemover}
                    onPress={() => excluirFavorito(item.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#e53935" />
                    <Text style={styles.textoRemover}>Remover</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    backgroundColor: '#f2f4f7',
    padding: 16,
  },
  centralizado: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  vazioContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  mensagemVazia: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagemContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#181a20',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  marca: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modelo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  categoria: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  notaBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notaLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 4,
  },
  notaTexto: {
    fontSize: 14,
    color: '#334155',
    fontStyle: 'italic',
  },
  inputNota: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  acoesLinha: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  botaoEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  textoEditar: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 13,
  },
  botaoRemover: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e53935',
  },
  textoRemover: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 13,
  },
  botaoSalvar: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  textoBotaoBranco: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  botaoCancelar: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  textoBotaoSecundario: {
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
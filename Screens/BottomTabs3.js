import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  getUsuarioLogado,
  autenticarUsuario,
  cadastrarUsuario,
  logoutUsuario,
} from '../database/database';

export default function BottomTabs3() {
  const [usuario, setUsuario] = useState(null);
  const [modoCadastro, setModoCadastro] = useState(false);
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');

  const verificarSessao = useCallback(async () => {
    try {
      const user = await getUsuarioLogado();
      setUsuario(user);
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      verificarSessao();
    }, [verificarSessao])
  );

  const handleAutenticacao = async () => {
    if (!username.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      const user = modoCadastro
        ? await cadastrarUsuario(username, senha)
        : await autenticarUsuario(username, senha);

      setUsuario(user);
      setUsername('');
      setSenha('');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha na autenticação.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUsuario();
      setUsuario(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  if (!usuario) {
    return (
      <KeyboardAvoidingView
        style={styles.authContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.authScroll}>
          <View style={styles.authCard}>
            <Text style={styles.authTitulo}>
              {modoCadastro ? 'Criar Conta' : 'Entrar'}
            </Text>
            <Text style={styles.authSubtitulo}>
              {modoCadastro
                ? 'Cadastre-se para salvar seus veículos favoritos'
                : 'Acesse sua conta para ver seu perfil e favoritos'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome de usuário"
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity
              style={styles.botao}
              onPress={handleAutenticacao}
            >
              <Text style={styles.botaoTexto}>
                {modoCadastro ? 'Cadastrar' : 'Entrar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.alternarModo}
              onPress={() => setModoCadastro(!modoCadastro)}
            >
              <Text style={styles.alternarTexto}>
                {modoCadastro
                  ? 'Já tem uma conta? Faça login'
                  : 'Não tem conta? Cadastre-se'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Meu Perfil</Text>
      </View>

      <View style={styles.perfil}>
        <Image
          source={require('../assets/foto.jpg')}
          style={styles.avatar}
        />

        <Text style={styles.usernameDestaque}>@{usuario.username}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.secao}>Dados da Conta</Text>

        <View style={styles.info}>
          <Text style={styles.label}>ID do Usuário</Text>
          <Text style={styles.valor}>#{usuario.id}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Nome de usuário</Text>
          <Text style={styles.valor}>@{usuario.username}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.secao}>Conta</Text>

        <TouchableOpacity
          style={[styles.botao, styles.botaoSair]}
          onPress={handleLogout}
        >
          <Text style={styles.textoSair}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  authTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitulo: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F5F6FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222222',
    marginBottom: 14,
  },
  alternarModo: {
    marginTop: 8,
    alignItems: 'center',
  },
  alternarTexto: {
    color: '#4F46E5',
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
  },
  perfil: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingBottom: 30,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
  },
  usernameDestaque: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222222',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    padding: 20,
  },
  secao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  info: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 3,
  },
  valor: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  botao: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoSair: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E53935',
  },
  textoSair: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
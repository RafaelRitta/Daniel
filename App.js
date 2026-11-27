import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import BottomTabs1 from './Screens/BottomTabs1';
import BottomTabs2 from './Screens/BottomTabs2';
import BottomTabs3 from './Screens/BottomTabs3';
import Drawer1 from './Screens/Drawer1';
import Drawer2 from './Screens/Drawer2';

const Tab = createBottomTabNavigator();
const LARGURA_GAVETA = 260;

export default function App() {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [telaAtual, setTelaAtual] = useState('Home'); // 'Home' | 'Drawer1' | 'Drawer2'
  const slideAnim = useRef(new Animated.Value(-LARGURA_GAVETA)).current;

  const abrirMenu = () => {
    setMenuVisivel(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const fecharMenu = (proximaTela = null) => {
    Animated.timing(slideAnim, {
      toValue: -LARGURA_GAVETA,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisivel(false);
      if (proximaTela) {
        setTelaAtual(proximaTela);
      }
    });
  };

  const obterTituloHeader = () => {
    if (telaAtual === 'Drawer1') return 'Informações';
    if (telaAtual === 'Drawer2') return 'Favoritos';
    return 'Home';
  };

  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Cabeçalho Superior com ícone ☰ */}
        <View style={styles.header}>
          <TouchableOpacity onPress={abrirMenu} style={styles.botaoMenu}>
            <Ionicons name="menu" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>{obterTituloHeader()}</Text>
        </View>

        {/* Conteúdo das Telas */}
        <View style={{ flex: 1 }}>
          {telaAtual === 'Drawer1' ? (
            <Drawer1 />
          ) : telaAtual === 'Drawer2' ? (
            <Drawer2 />
          ) : (
            <Tab.Navigator
              initialRouteName="BottomTabs1"
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === 'BottomTabs1') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'BottomTabs2') {
                    iconName = focused ? 'list' : 'list-outline';
                  } else if (route.name === 'BottomTabs3') {
                    iconName = focused ? 'person' : 'person-outline';
                  }
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#673ab7',
                tabBarInactiveTintColor: '#555',
              })}
            >
              <Tab.Screen
                name="BottomTabs1"
                component={BottomTabs1}
                options={{ title: 'Home' }}
              />
              <Tab.Screen
                name="BottomTabs2"
                component={BottomTabs2}
                options={{ title: 'Lista' }}
              />
              <Tab.Screen
                name="BottomTabs3"
                component={BottomTabs3}
                options={{ title: 'Perfil' }}
              />
            </Tab.Navigator>
          )}
        </View>

        {/* Menu Lateral Deslizante */}
        <Modal
          visible={menuVisivel}
          transparent={true}
          animationType="none"
          onRequestClose={() => fecharMenu()}
        >
          <View style={styles.overlay}>
            <Animated.View
              style={[
                styles.gaveta,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <Text style={styles.menuTitulo}>Menu</Text>

              <TouchableOpacity
                style={[styles.item, telaAtual === 'Home' && styles.itemAtivo]}
                onPress={() => fecharMenu('Home')}
              >
                <Ionicons
                  name="home-outline"
                  size={22}
                  color={telaAtual === 'Home' ? '#673ab7' : '#222'}
                />
                <Text
                  style={[
                    styles.itemTexto,
                    telaAtual === 'Home' && styles.textoAtivo,
                  ]}
                >
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.item,
                  telaAtual === 'Drawer1' && styles.itemAtivo,
                ]}
                onPress={() => fecharMenu('Drawer1')}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={telaAtual === 'Drawer1' ? '#673ab7' : '#222'}
                />
                <Text
                  style={[
                    styles.itemTexto,
                    telaAtual === 'Drawer1' && styles.textoAtivo,
                  ]}
                >
                  Informações
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.item,
                  telaAtual === 'Drawer2' && styles.itemAtivo,
                ]}
                onPress={() => fecharMenu('Drawer2')}
              >
                <Ionicons
                  name="heart-outline"
                  size={22}
                  color={telaAtual === 'Drawer2' ? '#673ab7' : '#222'}
                />
                <Text
                  style={[
                    styles.itemTexto,
                    telaAtual === 'Drawer2' && styles.textoAtivo,
                  ]}
                >
                  Favoritos
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Área escura fora do menu para fechar ao tocar */}
            <Pressable style={{ flex: 1 }} onPress={() => fecharMenu()} />
          </View>
        </Modal>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    paddingTop: 35,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  botaoMenu: {
    marginRight: 16,
    padding: 4,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gaveta: {
    width: LARGURA_GAVETA,
    backgroundColor: '#ffffff',
    paddingTop: 55,
    paddingHorizontal: 12,
    height: '100%',
    elevation: 10,
  },
  menuTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 12,
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  itemAtivo: {
    backgroundColor: '#ede7f6',
  },
  itemTexto: {
    fontSize: 16,
    marginLeft: 16,
    color: '#222',
  },
  textoAtivo: {
    color: '#673ab7',
    fontWeight: '600',
  },
});
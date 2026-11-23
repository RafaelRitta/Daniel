import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Drawer1 from './Drawer1';
import Drawer2 from './Drawer2';

const Drawer = createDrawerNavigator();

function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Bem vindo ao aplicativo.</Text>
    </View>
  );
}

export default function BottomTabs1() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        drawerType: 'front',
        drawerStyle: {
          width: 260,
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
        }}
      />

      <Drawer.Screen
        name="Drawer1"
        component={Drawer1}
        options={{
          title: 'Informações',
        }}
      />

      <Drawer.Screen
        name="Drawer2"
        component={Drawer2}
        options={{
          title: 'Favoritos',
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    fontSize: 24,
    textAlign: 'center',
  },
});
import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import BottomTabs1 from './Screens/BottomTabs1';
import BottomTabs2 from './Screens/BottomTabs2';
import BottomTabs3 from './Screens/BottomTabs3';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="BottomTabs1"
          screenOptions={({ route }) => ({
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
            options={{
              title: 'Home',
              headerShown: false,
            }}
          />

          <Tab.Screen
            name="BottomTabs2"
            component={BottomTabs2}
            options={{
              title: 'Lista',
            }}
          />

          <Tab.Screen
            name="BottomTabs3"
            component={BottomTabs3}
            options={{
              title: 'Perfil',
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
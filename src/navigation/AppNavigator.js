import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas de Autenticación
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Pantallas Principales
import StudentHomeScreen from '../screens/auth/student/StudentHomeScreen';
import ProfessorHomeScreen from '../screens/auth/professor/ProfessorHomeScreen';
import CoordinatorHomeScreen from '../screens/auth/coordinator/CoordinatorHomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Módulos post-login */}
        <Stack.Screen name="StudentTabs" component={StudentHomeScreen} />
        <Stack.Screen name="ProfessorTabs" component={ProfessorHomeScreen} />
        <Stack.Screen name="CoordinatorTabs" component={CoordinatorHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
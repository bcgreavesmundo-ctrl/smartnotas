import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas de Autenticación
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Pantallas de Estudiante
import StudentHomeScreen from '../screens/auth/student/StudentHomeScreen';
import StudentSubjectDetailScreen from '../screens/auth/student/StudentSubjectDetailScreen';

// Pantallas de Profesor
import ProfessorHomeScreen from '../screens/auth/professor/ProfessorHomeScreen';
import ProfessorSubjectDetailScreen from '../screens/auth/professor/ProfessorSubjectDetailScreen';

// Pantallas de Coordinador
import CoordinatorHomeScreen from '../screens/auth/coordinator/CoordinatorHomeScreen';
import ModuloGestionScreen from '../screens/auth/coordinator/ModuloGestionScreen';
import CoordinatorStudentDetailScreen from '../screens/auth/coordinator/CoordinatorStudentDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
        <Stack.Screen name="StudentTabs" component={StudentHomeScreen} />
        <Stack.Screen name="StudentSubjectDetail" component={StudentSubjectDetailScreen} />
        <Stack.Screen name="ProfessorHome" component={ProfessorHomeScreen} />
        <Stack.Screen name="ProfessorTabs" component={ProfessorHomeScreen} />
        <Stack.Screen name="ProfessorSubjectDetail" component={ProfessorSubjectDetailScreen} />
        <Stack.Screen name="CoordinatorHome" component={CoordinatorHomeScreen} />
        <Stack.Screen name="CoordinatorTabs" component={CoordinatorHomeScreen} />
        <Stack.Screen name="ModuloGestion" component={ModuloGestionScreen} />
        <Stack.Screen name="CoordinatorStudentDetail" component={CoordinatorStudentDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
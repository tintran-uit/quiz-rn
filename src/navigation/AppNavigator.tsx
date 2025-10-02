import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

import { LoginScreen } from '../screens/LoginScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { HomeScreen } from '../screens/HomeScreen';

import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import ResultsScreen from '../screens/ResultsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
        />
        <Stack.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

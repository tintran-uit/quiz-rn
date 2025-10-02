import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { LoginScreen } from '../screens/LoginScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            title: 'Đăng nhập',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen} 
          options={{ 
            title: 'Quiz',
            headerLeft: () => null, // Không cho phép quay lại
          }} 
        />
        <Stack.Screen 
          name="Leaderboard" 
          component={LeaderboardScreen} 
          options={{ 
            title: 'Bảng xếp hạng',
            headerLeft: () => null, // Không cho phép quay lại
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

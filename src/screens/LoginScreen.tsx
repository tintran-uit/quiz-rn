import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    if (username.trim().length < 3) {
      Alert.alert('Lỗi', 'Tên người dùng phải có ít nhất 3 ký tự');
      return;
    }

    try {
      // Lưu thông tin người dùng
      const user = {
        id: Date.now().toString(),
        username: username.trim(),
        score: 0,
      };
      
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      
      // Chuyển đến màn hình quiz
      navigation.navigate('Quiz');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng nhập. Vui lòng thử lại.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Quiz App</Text>
        <Text style={styles.subtitle}>Chào mừng đến với ứng dụng quiz!</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên người dùng</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Nhập tên của bạn"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, !username.trim() && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!username.trim()}
        >
          <Text style={styles.buttonText}>Bắt đầu Quiz</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});


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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { colors, spacing, fontSizes, borderRadius, shadow } from '../styles/theme';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    if (username.trim().length < 3) {
      Alert.alert('Tên không hợp lệ', 'Tên người dùng phải có ít nhất 3 ký tự.');
      return;
    }

    try {
      const user = {
        id: Date.now().toString(),
        username: username.trim(),
        score: 0,
      };
      
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng nhập. Vui lòng thử lại sau.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.background, '#E0E7FF']}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Image source={require('../../assets/icon.png')} style={styles.logo} />
            <Text style={styles.title}>Chào mừng đến với Quiz!</Text>
            <Text style={styles.subtitle}>Thử thách kiến thức của bạn</Text>
          </View>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Nhập tên của bạn..."
              placeholderTextColor={colors.textLight}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={handleLogin}
              disabled={!username.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={!username.trim() ? ['#9CA3AF', '#9CA3AF'] : [colors.primaryHover, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.button, shadow.button]}
              >
                <Text style={styles.buttonText}>Bắt đầu</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.lg,
    color: colors.textLight,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadow.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    backgroundColor: colors.white,
    height: 50,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    fontSize: fontSizes.md,
    color: colors.text,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    height: 50,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
});

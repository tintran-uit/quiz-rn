
import React, { useState } from 'react';
import useTranslation from '../i18n/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
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
  const { t, locale, setLocale } = useTranslation();

  const handleLogin = async () => {
    if (username.trim().length < 3) {
      Alert.alert(t('invalid_name_title'), t('invalid_name_desc'));
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
      Alert.alert(t('error'), t('login_failed'));
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
  {/* Language Switcher */}
        <View style={{ position: 'absolute', top: 60, right: 0, zIndex: 20 }}>
          <LanguageSwitcher />
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Image source={require('../../assets/icon.png')} style={styles.logo} />
            <Text style={styles.title}>{t('welcome_title')}</Text>
            <Text style={styles.subtitle}>{t('welcome_subtitle')}</Text>
          </View>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder={t('enter_your_name')}
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
                <Text style={styles.buttonText}>{t('start')}</Text>
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
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
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

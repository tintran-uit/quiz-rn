import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { colors, spacing, fontSizes, borderRadius, shadow } from '../styles/theme';

export default function ResultsScreen() {
  const navigation: any = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Results'>>();
  const { score = 0, total = 10 } = route.params || {};

  const percentage = total > 0 ? (score / (total * 10)) * 100 : 0;
  const message =
    percentage >= 80
      ? 'Xuất sắc! Bạn là một chuyên gia thực thụ!'
      : percentage >= 50
      ? 'Làm tốt lắm! Kiến thức của bạn thật đáng nể.'
      : 'Cố gắng hơn nhé! Mỗi lần chơi là một lần học hỏi.';

  const onShare = async () => {
    try {
      await Share.share({
        message: `Tôi vừa đạt được ${score} điểm trong ứng dụng Quiz! Bạn có muốn thử không?`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, '#E0E7FF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Kết quả</Text>
        <View style={styles.card}>
          <Text style={styles.scoreLabel}>Điểm số của bạn</Text>
          <Text style={styles.scoreText}>{score}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Chơi lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('Leaderboard')}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Xem bảng xếp hạng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.tertiaryButton]} onPress={onShare}>
          <Text style={[styles.buttonText, styles.tertiaryButtonText]}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    alignItems: 'center',
    ...shadow.card,
    marginBottom: spacing.xl,
  },
  scoreLabel: {
    fontSize: fontSizes.lg,
    color: colors.textLight,
  },
  scoreText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: spacing.md,
  },
  message: {
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.full,
    width: '100%',
    alignItems: 'center',
    ...shadow.button,
    marginBottom: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.white,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
  },
  tertiaryButtonText: {
    color: colors.textLight,
  },
});
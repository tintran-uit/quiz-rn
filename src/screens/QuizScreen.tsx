import React, { useState, useEffect, useRef } from 'react';
import { I18nManager } from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Question, User } from '../types';
import { questions } from '../data/questions';
import { colors, spacing, fontSizes, borderRadius, shadow } from '../styles/theme';
import useTranslation from '../i18n/useTranslation';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;

interface Props {
  navigation: QuizScreenNavigationProp;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
];

export const QuizScreen: React.FC<Props> = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { t, locale, setLocale } = useTranslation();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadUser();
    animateProgress();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (!isAnswered) {
      setTimeLeft(15);
      timerAnim.setValue(1);
      Animated.timing(timerAnim, {
        toValue: 0,
        duration: 15000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          // handleTimeout();
        }
      });
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;
          return 0;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentQuestionIndex, isAnswered]);

  const animateProgress = () => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Đã chuyển logic timer vào useEffect để đồng bộ đếm ngược

  const loadUser = async () => {
    const userString = await AsyncStorage.getItem('currentUser');
    if (userString) setUser(JSON.parse(userString));
  };

  // const handleTimeout = () => {
  //   if (isAnswered) return;
  //   setIsAnswered(true);
  //   Alert.alert('Hết giờ!', 'Bạn đã không trả lời kịp.', [
  //     { text: 'Câu tiếp', onPress: handleNextQuestion }
  //   ]);
  // };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    timerAnim.stopAnimation();
    setIsAnswered(true);
    setSelectedAnswer(answerIndex);

    if (answerIndex === currentQuestion.correctAnswer) {
      const earned = 20 + timeLeft * 2;
      setScore(prev => prev + earned);
      setEarnedScore(earned);
      setShowScorePopup(true);
      setTimeout(() => setShowScorePopup(false), 2000);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      animateProgress();
    }
  };

  const finishQuiz = async () => {
    if (user) {
      const leaderboardString = await AsyncStorage.getItem('leaderboard') || '[]';
      let leaderboard = JSON.parse(leaderboardString);
      const userIndex = leaderboard.findIndex((u: User) => u.id === user.id);

      if (userIndex > -1) {
        leaderboard[userIndex].score = Math.max(leaderboard[userIndex].score, score);
      } else {
        leaderboard.push({ ...user, score });
      }

      leaderboard.sort((a: User, b: User) => b.score - a.score);
      await AsyncStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
    navigation.navigate('Results', { score, total: questions.length });
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index ? styles.optionSelected : styles.option;
    }
    if (index === currentQuestion.correctAnswer) {
      return styles.optionCorrect;
    }
    if (index === selectedAnswer) {
      return styles.optionIncorrect;
    }
    return styles.option;
  };

  const getOptionTextStyle = (index: number) => {
    if (!isAnswered) {
        return selectedAnswer === index ? styles.optionTextSelected : styles.optionText;
    }
    if (index === currentQuestion.correctAnswer || index === selectedAnswer) {
        return styles.optionTextSelected;
    }
    return styles.optionText;
  }

  return (
    <LinearGradient colors={[colors.background, '#E0E7FF']} style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* Language Switcher */}
        <View style={styles.languageSwitcher}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langButton, locale === lang.code && styles.langButtonActive]}
              onPress={() => setLocale(lang.code)}
            >
              <Text style={[styles.langButtonText, locale === lang.code && styles.langButtonTextActive]}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.progressText}>{t('question_progress', { current: currentQuestionIndex + 1, total: questions.length })}</Text>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }]} />
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Animated.View style={[styles.timerFill, {
              width: timerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }]} />
            <Text style={styles.timerText}>{timeLeft}</Text>
          </View>

          <View style={styles.card}>
            {currentQuestion.imageUrl && currentQuestion.imageUrl !== '' && (
              <Image
                source={{ uri: currentQuestion.imageUrl }}
                style={styles.questionImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={getOptionStyle(index)}
                onPress={() => handleAnswerSelect(index)}
                disabled={isAnswered}
              >
                <Text style={getOptionTextStyle(index)}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {showScorePopup && (
            <View style={styles.scorePopup} pointerEvents="none">
              <Text style={styles.scorePopupTitle}>🎉 {t('correct')}</Text>
              <Text style={styles.scorePopupScore}>+{earnedScore} {t('points')}</Text>
            </View>
          )}
        </ScrollView>
        {isAnswered && (
          <View style={styles.nextButtonWrapper}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
              <Text style={styles.nextButtonText}>
                {isLastQuestion ? t('view_results') : t('next_question')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: 8,
  },
  langButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: 8,
  },
  langButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  langButtonTextActive: {
    color: colors.white,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollView: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  progressText: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: borderRadius.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  timerContainer: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  timerFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
  },
  timerText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text ,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.card,
    marginBottom: spacing.xl,
  },
  questionImage: {
    width: '100%',
    height: 180,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  questionText: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  optionCorrect: {
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.success,
  },
  optionIncorrect: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.error,
  },
  optionText: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: '600',
  },
  optionTextSelected: {
    fontSize: fontSizes.md,
    color: colors.white,
    fontWeight: '600',
  },
  nextButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.lg,
    alignItems: 'center',
    zIndex: 10,
  },
  nextButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    ...shadow.button,
    minWidth: 180,
    maxWidth: 400,
    width: '70%',
  },
  nextButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  scorePopup: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    zIndex: 100,
    minWidth: 300,
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadow.card,
    elevation: 20,
  },
  scorePopupTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: spacing.md,
  },
  scorePopupScore: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default QuizScreen;
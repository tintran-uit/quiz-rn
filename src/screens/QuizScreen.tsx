import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Question, User } from '../types';
import { questions } from '../data/questions';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;

interface Props {
  navigation: QuizScreenNavigationProp;
}

const { width } = Dimensions.get('window');

export const QuizScreen: React.FC<Props> = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeout();
    }
  }, [timeLeft, isAnswered]);

  const loadUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) {
        setUser(JSON.parse(userString));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleTimeout = () => {
    setIsAnswered(true);
    Alert.alert('Hết thời gian!', 'Bạn đã hết thời gian cho câu hỏi này.', [
      { text: 'Tiếp tục', onPress: handleNextQuestion }
    ]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + currentQuestion.points);
    }
    
    setTimeout(() => {
      Alert.alert(
        isCorrect ? 'Đúng rồi!' : 'Sai rồi!',
        isCorrect 
          ? `Bạn được ${currentQuestion.points} điểm!` 
          : `Đáp án đúng là: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
        [{ text: 'Tiếp tục', onPress: handleNextQuestion }]
      );
    }, 500);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setIsAnswered(false);
    }
  };

  const finishQuiz = async () => {
    try {
      if (user) {
        const updatedUser = { ...user, score: Math.max(user.score, score) };
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Lưu vào leaderboard
        const leaderboardString = await AsyncStorage.getItem('leaderboard');
        let leaderboard = leaderboardString ? JSON.parse(leaderboardString) : [];
        
        const existingUserIndex = leaderboard.findIndex((u: User) => u.id === user.id);
        if (existingUserIndex >= 0) {
          leaderboard[existingUserIndex] = updatedUser;
        } else {
          leaderboard.push(updatedUser);
        }
        
        leaderboard.sort((a: User, b: User) => b.score - a.score);
        await AsyncStorage.setItem('leaderboard', JSON.stringify(leaderboard));
      }
      
      Alert.alert(
        'Hoàn thành!',
        `Bạn đã hoàn thành quiz với ${score} điểm!`,
        [
          { text: 'Xem bảng xếp hạng', onPress: () => navigation.navigate('Leaderboard') },
          { text: 'Chơi lại', onPress: resetQuiz }
        ]
      );
    } catch (error) {
      console.error('Error finishing quiz:', error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(30);
    setIsAnswered(false);
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return styles.option;
    }
    
    if (index === currentQuestion.correctAnswer) {
      return [styles.option, styles.correctOption];
    }
    
    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return [styles.option, styles.wrongOption];
    }
    
    return styles.option;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Câu {currentQuestionIndex + 1}/{questions.length}
        </Text>
        <Text style={styles.score}>Điểm: {score}</Text>
        <Text style={styles.timer}>⏰ {timeLeft}s</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        
        {currentQuestion.type === 'image' && currentQuestion.imageUrl && (
          <Image 
            source={{ uri: currentQuestion.imageUrl }} 
            style={styles.questionImage}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(index)}
            onPress={() => handleAnswerSelect(index)}
            disabled={isAnswered}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  timer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5722',
  },
  questionContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  questionImage: {
    width: width - 70,
    height: 200,
    alignSelf: 'center',
    borderRadius: 8,
  },
  optionsContainer: {
    paddingHorizontal: 15,
  },
  option: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  correctOption: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  progressContainer: {
    padding: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, User } from '../types';

type LeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Leaderboard'>;

interface Props {
  navigation: LeaderboardScreenNavigationProp;
}

export const LeaderboardScreen: React.FC<Props> = ({ navigation }) => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadLeaderboard();
    loadCurrentUser();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const leaderboardString = await AsyncStorage.getItem('leaderboard');
      if (leaderboardString) {
        const data = JSON.parse(leaderboardString);
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) {
        setCurrentUser(JSON.parse(userString));
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const handlePlayAgain = () => {
    navigation.navigate('Quiz');
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          onPress: async () => {
            await AsyncStorage.removeItem('currentUser');
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const getRankDisplay = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${index + 1}`;
    }
  };

  const renderLeaderboardItem = ({ item, index }: { item: User; index: number }) => {
    const isCurrentUser = currentUser?.id === item.id;
    
    return (
      <View style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankContainer}>
          <Text style={styles.rank}>{getRankDisplay(index)}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.username, isCurrentUser && styles.currentUserText]}>
            {item.username}
          </Text>
          {isCurrentUser && <Text style={styles.youText}>(Bạn)</Text>}
        </View>
        <Text style={[styles.score, isCurrentUser && styles.currentUserText]}>
          {item.score} điểm
        </Text>
      </View>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>🏆 Bảng Xếp Hạng</Text>
      {currentUser && (
        <View style={styles.currentUserStats}>
          <Text style={styles.welcomeText}>Xin chào, {currentUser.username}!</Text>
          <Text style={styles.scoreText}>Điểm cao nhất của bạn: {currentUser.score}</Text>
        </View>
      )}
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Chưa có người chơi nào</Text>
      <Text style={styles.emptySubtext}>Hãy là người đầu tiên!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaderboardItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayAgain}>
          <Text style={styles.playButtonText}>🎮 Chơi lại</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  currentUserStats: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 14,
    color: '#666',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentUserItem: {
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentUserText: {
    color: '#E65100',
  },
  youText: {
    fontSize: 12,
    color: '#FF9800',
    fontStyle: 'italic',
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

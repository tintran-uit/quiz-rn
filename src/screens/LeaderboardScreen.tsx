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
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList, User } from '../types';
import { colors, spacing, fontSizes, borderRadius, shadow } from '../styles/theme';
import { useFocusEffect } from '@react-navigation/native';

type LeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Leaderboard'>;

interface Props {
  navigation: LeaderboardScreenNavigationProp;
}

export const LeaderboardScreen: React.FC<Props> = ({ navigation }) => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const leaderboardString = await AsyncStorage.getItem('leaderboard');
      const userString = await AsyncStorage.getItem('currentUser');
      
      if (leaderboardString) {
        setLeaderboard(JSON.parse(leaderboardString));
      }
      if (userString) {
        setCurrentUser(JSON.parse(userString));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('currentUser');
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const getRankDisplay = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return <Text style={styles.rankNumber}>{index + 1}</Text>;
  };

  const renderLeaderboardItem = ({ item, index }: { item: User; index: number }) => {
    const isCurrentUser = currentUser?.id === item.id;
    
    return (
      <View style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankContainer}>
          <Text style={styles.rank}>{getRankDisplay(index)}</Text>
        </View>
        <Text style={[styles.username, isCurrentUser && styles.currentUserText]}>
          {item.username}
          {isCurrentUser && ' (Bạn)'}
        </Text>
        <Text style={[styles.score, isCurrentUser && styles.currentUserText]}>
          {item.score}
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[colors.background, '#E0E7FF']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Bảng Xếp Hạng</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaderboardItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có ai trên bảng xếp hạng. Hãy là người đầu tiên!</Text>
          </View>
        )}
      />
      
      <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.playButtonText}>Chơi Ngay</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  logoutText: {
    fontSize: fontSizes.md,
    color: colors.primary,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  currentUserItem: {
    backgroundColor: colors.primary,
    ...shadow.button,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rank: {
    fontSize: fontSizes.xl,
  },
  rankNumber: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  username: {
    flex: 1,
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
  },
  score: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  currentUserText: {
    color: colors.white,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    margin: spacing.lg,
    ...shadow.button,
  },
  playButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
});
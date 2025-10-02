import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, fontSizes, borderRadius, shadow } from '../styles/theme';
import { User } from '../types';

const topics = [
  {
    title: 'Lịch sử',
    desc: 'Các sự kiện, nhân vật và mốc thời gian quan trọng.',
    gradient: ['#6D28D9', '#4F46E5'],
    icon: '🏛️',
  },
  {
    title: 'Địa lý',
    desc: 'Khám phá thế giới qua các câu hỏi về quốc gia, thủ đô.',
    gradient: ['#15803D', '#16A34A'],
    icon: '🌍',
  },
  {
    title: 'Khoa học',
    desc: 'Vật lý, hóa học, sinh học và vũ trụ.',
    gradient: ['#0E7490', '#06B6D4'],
    icon: '🔬',
  },
  {
    title: 'Văn hóa Pop',
    desc: 'Âm nhạc, điện ảnh và các xu hướng hiện đại.',
    gradient: ['#DB2777', '#E11D48'],
    icon: '🎬',
  },
];

export function HomeScreen() {
  const navigation: any = useNavigation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) {
        setUser(JSON.parse(userString));
      }
    };
    loadUser();
  }, []);

  return (
    <LinearGradient
      colors={[colors.background, '#E0E7FF']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.username}>{user?.username || 'Guest'}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')} style={styles.leaderboardButton}>
            <Text style={styles.leaderboardText}>🏆 Bảng xếp hạng</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chọn chủ đề</Text>
          <Text style={styles.cardSubtitle}>Hãy chọn một chủ đề để bắt đầu!</Text>
          
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.title}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Quiz', { topic: topic.title })}
            >
              <LinearGradient
                colors={topic.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.topicButton}
              >
                <Text style={styles.topicIcon}>{topic.icon}</Text>
                <View>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicDesc}>{topic.desc}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSizes.lg,
    color: colors.textLight,
  },
  username: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  leaderboardButton: {
    position: 'absolute',
    right: spacing.lg,
    top: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  leaderboardText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadow.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  topicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadow.button,
  },
  topicIcon: {
    fontSize: fontSizes.xl,
    marginRight: spacing.md,
  },
  topicTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.white,
  },
  topicDesc: {
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.8,
  },
});

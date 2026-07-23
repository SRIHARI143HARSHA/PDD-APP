import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '../../database/config';
import { ThemeContext } from '../App';

export default function LeaderboardScreen() {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;
  const [leaderboard, setLeaderboard] = useState([]);
  const currentUser = 'Ramayanapu Srihari'; // Current user name matching App Profile

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'leaderboard'), (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      const grouped = data.reduce((acc, entry) => {
        const existing = acc.find((item) => item.name === entry.name);
        if (existing) {
          existing.totalScore += Number(entry.score || 0);
          existing.quizCount += 1;
          if (!existing.courses.includes(entry.topic)) {
            existing.courses.push(entry.topic);
          }
        } else {
          acc.push({
            id: entry.id,
            name: entry.name || 'Anonymous Learner',
            totalScore: Number(entry.score || 0),
            quizCount: 1,
            courses: [entry.topic || 'General Safety'],
          });
        }
        return acc;
      }, []);

      // Sort descending by totalScore
      grouped.sort((a, b) => b.totalScore - a.totalScore);
      setLeaderboard(grouped);
    });

    return unsubscribe;
  }, []);

  const colors = isDark
    ? {
        bg: '#061225',
        card: '#071426',
        border: '#1E293B',
        text: '#E6EEF8',
        subtext: '#94A3B8',
        highlightBg: '#0F284D',
        highlightBorder: '#2563EB',
      }
    : {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtext: '#64748B',
        highlightBg: '#EFF6FF',
        highlightBorder: '#3B82F6',
      };

  const firstPlace = leaderboard[0];
  const secondPlace = leaderboard[1];
  const thirdPlace = leaderboard[2];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.mainWrapper}>
        {/* Top Hero Banner */}
        <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.heroCard}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={32} color="#F59E0B" />
          </View>
          <Text style={styles.heroTitle}>Preparedness Champions</Text>
          <Text style={styles.heroSubtitle}>Top learners based on completed disaster preparedness quizzes and scores.</Text>
        </LinearGradient>

        {/* Podium Layout for Top 3 */}
        {leaderboard.length > 0 && (
          <View style={styles.podiumSection}>
            {/* Rank 2 (Silver - Left) */}
            <View style={styles.podiumCol}>
              {secondPlace ? (
                <View style={[styles.podiumBox, styles.podiumSilver, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                  <Text style={styles.medalEmoji}>🥈</Text>
                  <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                    {secondPlace.name}
                  </Text>
                  <Text style={styles.podiumScore}>{secondPlace.totalScore} pts</Text>
                  <View style={[styles.rankStep, styles.stepSilver]}>
                    <Text style={styles.stepNum}>2</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.podiumBox, styles.emptyPodium]} />
              )}
            </View>

            {/* Rank 1 (Gold - Center Tall) */}
            <View style={styles.podiumCol}>
              {firstPlace && (
                <View style={[styles.podiumBox, styles.podiumGold, { backgroundColor: isDark ? '#1E3A8A' : '#FEF3C7' }]}>
                  <Ionicons name="sparkles" size={16} color="#F59E0B" style={{ position: 'absolute', top: 6, right: 6 }} />
                  <Text style={styles.medalEmojiGold}>🥇</Text>
                  <Text style={[styles.podiumNameGold, { color: isDark ? '#FFFFFF' : '#92400E' }]} numberOfLines={1}>
                    {firstPlace.name}
                  </Text>
                  <Text style={styles.podiumScoreGold}>{firstPlace.totalScore} pts</Text>
                  <View style={[styles.rankStep, styles.stepGold]}>
                    <Text style={styles.stepNumGold}>1</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Rank 3 (Bronze - Right) */}
            <View style={styles.podiumCol}>
              {thirdPlace ? (
                <View style={[styles.podiumBox, styles.podiumBronze, { backgroundColor: isDark ? '#1E293B' : '#FFF7ED' }]}>
                  <Text style={styles.medalEmoji}>🥉</Text>
                  <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                    {thirdPlace.name}
                  </Text>
                  <Text style={styles.podiumScore}>{thirdPlace.totalScore} pts</Text>
                  <View style={[styles.rankStep, styles.stepBronze]}>
                    <Text style={styles.stepNum}>3</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.podiumBox, styles.emptyPodium]} />
              )}
            </View>
          </View>
        )}

        {/* Compact Rankings List Table */}
        <View style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.thRank, { color: colors.subtext }]}>RANK</Text>
            <Text style={[styles.thUser, { color: colors.subtext }]}>LEARNER</Text>
            <Text style={[styles.thQuizzes, { color: colors.subtext }]}>QUIZZES</Text>
            <Text style={[styles.thPoints, { color: colors.subtext }]}>POINTS</Text>
          </View>

          {leaderboard.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={36} color={colors.subtext} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Quiz Scores Recorded Yet</Text>
              <Text style={[styles.emptySub, { color: colors.subtext }]}>Complete a disaster quiz to take your place on the leaderboard!</Text>
            </View>
          ) : (
            leaderboard.map((item, idx) => {
              const isUser = item.name === currentUser;
              const rank = idx + 1;
              return (
                <View
                  key={item.id || idx}
                  style={[
                    styles.tableRow,
                    { borderBottomColor: colors.border },
                    isUser && { backgroundColor: colors.highlightBg, borderColor: colors.highlightBorder, borderWidth: 1, borderRadius: 12 },
                  ]}
                >
                  <View style={styles.rankCell}>
                    <Text
                      style={[
                        styles.rankBadgeText,
                        rank === 1 && { color: '#F59E0B' },
                        rank === 2 && { color: '#94A3B8' },
                        rank === 3 && { color: '#D97706' },
                        rank > 3 && { color: colors.subtext },
                      ]}
                    >
                      #{rank}
                    </Text>
                  </View>

                  <View style={styles.userCell}>
                    <Text style={[styles.userName, { color: colors.text }, isUser && { fontWeight: '900', color: '#2563EB' }]}>
                      {item.name} {isUser && '(You)'}
                    </Text>
                    <Text style={[styles.userCourses, { color: colors.subtext }]} numberOfLines={1}>
                      {item.courses.join(' • ')}
                    </Text>
                  </View>

                  <Text style={[styles.quizzesCell, { color: colors.subtext }]}>{item.quizCount || 1}</Text>
                  <Text style={[styles.pointsCell, { color: '#10B981' }]}>{item.totalScore} pts</Text>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 36,
  },
  mainWrapper: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  trophyCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: 500,
  },
  podiumSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  podiumCol: {
    flex: 1,
    maxWidth: 220,
  },
  podiumBox: {
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
    position: 'relative',
  },
  emptyPodium: {
    opacity: 0,
  },
  podiumGold: {
    minHeight: 170,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  podiumSilver: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  podiumBronze: {
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  medalEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  medalEmojiGold: {
    fontSize: 34,
    marginBottom: 4,
  },
  podiumName: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  podiumNameGold: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 2,
  },
  podiumScoreGold: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D97706',
    marginTop: 2,
  },
  rankStep: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  stepGold: {
    backgroundColor: '#F59E0B',
  },
  stepSilver: {
    backgroundColor: '#94A3B8',
  },
  stepBronze: {
    backgroundColor: '#D97706',
  },
  stepNum: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  stepNumGold: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  tableCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  thRank: {
    width: 50,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  thUser: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  thQuizzes: {
    width: 70,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  thPoints: {
    width: 80,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  rankCell: {
    width: 42,
  },
  rankBadgeText: {
    fontSize: 14,
    fontWeight: '900',
  },
  userCell: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
  },
  userCourses: {
    fontSize: 11,
    marginTop: 1,
  },
  quizzesCell: {
    width: 70,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
  },
  pointsCell: {
    width: 80,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '900',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});
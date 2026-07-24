import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { courseData } from '../../data/courseData';
import { ThemeContext } from '../context/ThemeContext';
import { getItem } from '../services/storageService';

const defaultQuizData = {
  'Flood Safety': { attempted: false, completed: false, attempts: 0, latestScore: null, bestScore: null },
  'Earthquake Safety': { attempted: false, completed: false, attempts: 0, latestScore: null, bestScore: null },
  'Fire Safety': { attempted: false, completed: false, attempts: 0, latestScore: null, bestScore: null },
  'Cyclone Preparedness': { attempted: false, completed: false, attempts: 0, latestScore: null, bestScore: null },
  'Tsunami Preparedness': { attempted: false, completed: false, attempts: 0, latestScore: null, bestScore: null },
  'Landslide Safety': { attempted: false, completed: false, attempts: 0, latestScore: null, bestScore: null },
};

const quizList = [
  {
    id: 'flood',
    title: 'Flood Safety Quiz',
    topicKey: 'Flood Safety',
    desc: 'Test your flood safety knowledge on alerts, evacuation orders, and water safety.',
    questions: 10,
    difficulty: 'Beginner',
    icon: 'water-outline',
    accent: '#2563EB',
  },
  {
    id: 'earthquake',
    title: 'Earthquake Safety Quiz',
    topicKey: 'Earthquake Safety',
    desc: 'Test your earthquake safety knowledge on drop, cover, hold on, and gas safety.',
    questions: 10,
    difficulty: 'Intermediate',
    icon: 'earth-outline',
    accent: '#F97316',
  },
  {
    id: 'fire',
    title: 'Fire Safety Quiz',
    topicKey: 'Fire Safety',
    desc: 'Test your fire safety knowledge on smoke alarms, PASS technique, and evacuation.',
    questions: 10,
    difficulty: 'Beginner',
    icon: 'flame-outline',
    accent: '#EF4444',
  },
  {
    id: 'cyclone',
    title: 'Cyclone Preparedness Quiz',
    topicKey: 'Cyclone Preparedness',
    desc: 'Test your cyclone knowledge on window boarding, storm eye dangers, and 72-hr kits.',
    questions: 10,
    difficulty: 'Intermediate',
    icon: 'rainy-outline',
    accent: '#0D9488',
  },
  {
    id: 'tsunami',
    title: 'Tsunami Preparedness Quiz',
    topicKey: 'Tsunami Preparedness',
    desc: 'Test your tsunami knowledge on natural signs, 100ft elevation rules, and coastal safety.',
    questions: 10,
    difficulty: 'Intermediate',
    icon: 'boat-outline',
    accent: '#7C3AED',
  },
  {
    id: 'landslide',
    title: 'Landslide & Slope Safety Quiz',
    topicKey: 'Landslide Safety',
    desc: 'Test your knowledge on slope instability signs, mudslide risks, and downhill safety.',
    questions: 10,
    difficulty: 'Intermediate',
    icon: 'trending-down-outline',
    accent: '#D97706',
  },
];

export default function QuizTopicsScreen({ navigation, searchQuery = '' }) {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;

  const [quizStats, setQuizStats] = useState(defaultQuizData);

  const loadQuizProgress = useCallback(async () => {
    try {
      const saved = await getItem('disaster_app_quiz_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        setQuizStats((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadQuizProgress();
    }, [loadQuizProgress])
  );

  useEffect(() => {
    loadQuizProgress();
  }, [loadQuizProgress]);

  const attemptedQuizzes = quizList.filter((q) => quizStats[q.topicKey]?.attempted || quizStats[q.topicKey]?.completed).length;
  const totalQuizzes = quizList.length;

  const attemptedScores = quizList
    .map((q) => quizStats[q.topicKey]?.bestScore)
    .filter((score) => typeof score === 'number' && score !== null);

  const bestScoreOverall = attemptedScores.length > 0 ? Math.max(...attemptedScores) : null;
  const avgScoreOverall =
    attemptedScores.length > 0
      ? Math.round(attemptedScores.reduce((a, b) => a + b, 0) / attemptedScores.length)
      : null;

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleQuizzes = normalizedQuery
    ? quizList.filter((quiz) => {
        const haystack = `${quiz.title} ${quiz.desc}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : quizList;

  const colors = isDark
    ? {
        bg: '#061225',
        card: '#071426',
        border: '#1E293B',
        text: '#E6EEF8',
        subtext: '#94A3B8',
        statBg: '#0B182B',
      }
    : {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtext: '#64748B',
        statBg: '#F8FAFC',
      };

  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mainPageWrapper}>
        {/* Intro Header */}
        <View style={styles.introHeader}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Quizzes</Text>
          <Text style={[styles.pageSubtitle, { color: colors.subtext }]}>
            Test your disaster preparedness knowledge.
          </Text>
        </View>

        {/* Overall Quiz Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardHeaderTitle, { color: colors.text }]}>Quiz Progress</Text>
            <Text style={[styles.cardPercentText, { color: '#2563EB' }]}>
              {attemptedQuizzes} of {totalQuizzes} Completed
            </Text>
          </View>

          <Text style={[styles.completionSub, { color: colors.subtext }]}>
            {attemptedQuizzes === 0
              ? 'No quizzes completed yet.'
              : `${attemptedQuizzes} quiz topic${attemptedQuizzes > 1 ? 's' : ''} completed.`}
          </Text>

          {attemptedQuizzes > 0 ? (
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: colors.statBg }]}>
                <Text style={[styles.statNum, { color: '#10B981' }]}>{bestScoreOverall}%</Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>Best Score</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: colors.statBg }]}>
                <Text style={[styles.statNum, { color: '#3B82F6' }]}>{avgScoreOverall}%</Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>Average Score</Text>
              </View>
            </View>
          ) : (
            <View style={[styles.emptyStatsBox, { backgroundColor: colors.statBg }]}>
              <Text style={[styles.emptyStatsText, { color: colors.subtext }]}>
                Take a quiz below to start tracking your score statistics.
              </Text>
            </View>
          )}
        </View>

        {/* MANDATORY 3-COLUMN CSS GRID FOR DESKTOP */}
        <View
          className="courses-grid-container"
          dataSet={{ class: 'courses-grid-container' }}
          style={
            isWeb
              ? {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 24,
                  width: '100%',
                  alignItems: 'stretch',
                }
              : styles.quizGridNative
          }
        >
          {visibleQuizzes.map((quiz) => {
            const stat = quizStats[quiz.topicKey] || { attempted: false, completed: false, attempts: 0 };
            const isDone = stat.attempted || stat.completed;
            const questionsCount = courseData[quiz.topicKey]?.quizQuestions?.length || quiz.questions;
            const correctNum = typeof stat.latestScore === 'number' ? Math.round((stat.latestScore / 100) * questionsCount) : 0;

            return (
              <View
                key={quiz.id}
                className="course-card-cell"
                dataSet={{ class: 'course-card-cell' }}
                style={[
                  styles.quizCard,
                  { backgroundColor: colors.card, borderColor: isDone ? '#10B981' : colors.border },
                ]}
              >
                <View style={styles.quizCardTop}>
                  <View style={[styles.iconWrap, { backgroundColor: `${quiz.accent}15` }]}>
                    <Ionicons name={quiz.icon} size={24} color={quiz.accent} />
                  </View>

                  {isDone ? (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.completedBadgeText}>COMPLETED</Text>
                    </View>
                  ) : (
                    <View style={styles.notAttemptedBadge}>
                      <Text style={[styles.notAttemptedBadgeText, { color: colors.subtext }]}>○ Not Attempted</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.quizTitle, { color: colors.text }]}>{quiz.title}</Text>
                <Text style={[styles.quizDesc, { color: colors.subtext }]} numberOfLines={2}>
                  {quiz.desc}
                </Text>

                <View style={styles.quizMetaRow}>
                  <Text style={[styles.quizMetaText, { color: colors.subtext }]}>
                    {questionsCount} Questions • {quiz.difficulty}
                  </Text>
                </View>

                {isDone ? (
                  <View style={styles.scoreRow}>
                    <View style={styles.scoreMetaCol}>
                      <Text style={[styles.scoreLabel, { color: colors.subtext }]}>Score</Text>
                      <Text style={[styles.scoreVal, { color: colors.text }]}>{correctNum} / {questionsCount}</Text>
                    </View>
                    <View style={styles.scoreMetaCol}>
                      <Text style={[styles.scoreLabel, { color: colors.subtext }]}>Best Score</Text>
                      <Text style={[styles.scoreVal, { color: '#10B981' }]}>{stat.bestScore}%</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.scoreRowSingle}>
                    <Text style={[styles.scoreLabel, { color: colors.subtext }]}>Status: Not attempted</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: isDone ? '#10B981' : quiz.accent },
                  ]}
                  onPress={() =>
                    navigation.navigate('Quiz', {
                      topic: quiz.topicKey,
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionButtonText}>
                    {isDone ? '✓ Completed (Retry)' : 'Start Quiz'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  mainPageWrapper: {
    width: '100%',
    maxWidth: 1400,
  },
  introHeader: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  cardPercentText: {
    fontSize: 15,
    fontWeight: '800',
  },
  completionSub: {
    fontSize: 13,
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyStatsBox: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStatsText: {
    fontSize: 13,
    textAlign: 'center',
  },
  quizGridNative: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  quizCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  quizCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  notAttemptedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  notAttemptedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  quizDesc: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  quizMetaRow: {
    marginBottom: 12,
  },
  quizMetaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  scoreRowSingle: {
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  scoreMetaCol: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  scoreVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
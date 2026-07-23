import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { courseData } from '../../data/courseData';
import { db } from '../../database/config';
import { ThemeContext } from '../context/ThemeContext';

export default function QuizScreen({ route, navigation }) {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;

  const auth = getAuth();
  const user = auth.currentUser;
  const selectedCourse = route?.params?.topic || 'Flood Safety';
  const quizQuestions = courseData[selectedCourse]?.quizQuestions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
  }, [selectedCourse]);

  const handleSelectOption = (option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        correct += 1;
      }
    });
    return correct;
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const correctCount = calculateScore();
    const percent = Math.round((correctCount / (quizQuestions.length || 1)) * 100);

    setIsSubmitted(true);

    // Save to Firestore leaderboard if available
    try {
      if (db) {
        await addDoc(collection(db, 'leaderboard'), {
          name: user?.email || 'Anonymous',
          score: percent,
          topic: selectedCourse,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.log('Leaderboard save log:', error);
    }

    // Persist real quiz attempt and score to localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('disaster_app_quiz_progress');
        const map = saved ? JSON.parse(saved) : {};
        const previous = map[selectedCourse] || { attempted: false, attempts: 0, latestScore: null, bestScore: null };
        const previousBest = typeof previous.bestScore === 'number' ? previous.bestScore : 0;
        const newBest = Math.max(previousBest, percent);

        map[selectedCourse] = {
          attempted: true,
          attempts: (previous.attempts || 0) + 1,
          latestScore: percent,
          bestScore: newBest,
        };
        window.localStorage.setItem('disaster_app_quiz_progress', JSON.stringify(map));
      }
    } catch (e) {}
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const colors = isDark
    ? {
        bg: '#061225',
        card: '#071426',
        border: '#1E293B',
        text: '#E6EEF8',
        subtext: '#94A3B8',
        optionBg: '#0F1C2E',
        optionBorder: '#1E293B',
        selectedOptionBg: '#1E3A8A',
        selectedOptionBorder: '#3B82F6',
      }
    : {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtext: '#64748B',
        optionBg: '#F8FAFC',
        optionBorder: '#E2E8F0',
        selectedOptionBg: '#EFF6FF',
        selectedOptionBorder: '#2563EB',
      };

  const currentQ = quizQuestions[currentIndex];
  const questionProgressPercent = Math.round(((currentIndex + 1) / (quizQuestions.length || 1)) * 100);

  if (isSubmitted) {
    const scoreCount = calculateScore();
    const totalQ = quizQuestions.length;
    const percentage = Math.round((scoreCount / (totalQ || 1)) * 100);
    const passed = percentage >= 60;

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.resultBadge, { backgroundColor: passed ? '#E6F4EA' : '#FEE2E2' }]}>
            <Ionicons
              name={passed ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={passed ? '#10B981' : '#EF4444'}
            />
            <Text style={[styles.resultBadgeText, { color: passed ? '#059669' : '#DC2626' }]}>
              {passed ? 'Passed!' : 'Needs Review'}
            </Text>
          </View>

          <Text style={[styles.resultTitle, { color: colors.text }]}>{selectedCourse} Quiz Complete</Text>

          <Text style={[styles.resultScoreNum, { color: passed ? '#10B981' : '#EF4444' }]}>
            {percentage}%
          </Text>

          <Text style={[styles.resultScoreDetail, { color: colors.subtext }]}>
            You scored {scoreCount} out of {totalQ} questions correctly.
          </Text>

          <View style={styles.resultMetricsRow}>
            <View style={[styles.metricBox, { backgroundColor: isDark ? '#0B182B' : '#F8FAFC' }]}>
              <Text style={[styles.metricVal, { color: '#10B981' }]}>{scoreCount}</Text>
              <Text style={[styles.metricLabel, { color: colors.subtext }]}>Correct</Text>
            </View>
            <View style={[styles.metricBox, { backgroundColor: isDark ? '#0B182B' : '#F8FAFC' }]}>
              <Text style={[styles.metricVal, { color: '#EF4444' }]}>{totalQ - scoreCount}</Text>
              <Text style={[styles.metricLabel, { color: colors.subtext }]}>Incorrect</Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={resetQuiz} activeOpacity={0.85}>
              <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.primaryBtnText}>Retry Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryBtn, { borderColor: colors.border }]}
              onPress={() => navigation.navigate('QuizTopics')}
              activeOpacity={0.85}
            >
              <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Back to Quizzes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.quizHeader}>
        <Text style={[styles.quizHeaderTitle, { color: colors.text }]}>{selectedCourse} Quiz</Text>
        <Text style={[styles.questionCountText, { color: colors.subtext }]}>
          Question {currentIndex + 1} of {quizQuestions.length}
        </Text>
      </View>

      {/* Question Progress Bar */}
      <View style={[styles.progressTrack, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
        <View style={[styles.progressFill, { width: `${questionProgressPercent}%` }]} />
      </View>

      {/* Question Card */}
      <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.questionText, { color: colors.text }]}>{currentQ?.question}</Text>

        <View style={styles.optionsList}>
          {currentQ?.options.map((option, idx) => {
            const isSelected = userAnswers[currentIndex] === option;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.optionBtn,
                  {
                    backgroundColor: isSelected ? colors.selectedOptionBg : colors.optionBg,
                    borderColor: isSelected ? colors.selectedOptionBorder : colors.optionBorder,
                  },
                ]}
                onPress={() => handleSelectOption(option)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected ? '#2563EB' : colors.subtext,
                      backgroundColor: isSelected ? '#2563EB' : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <View style={styles.radioInnerDot} />}
                </View>

                <Text style={[styles.optionText, { color: isSelected ? '#2563EB' : colors.text }]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Previous & Next / Submit Controls */}
        <View style={styles.navControlsRow}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              { borderColor: colors.border, opacity: currentIndex === 0 ? 0.4 : 1 },
            ]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={16} color={colors.text} style={{ marginRight: 4 }} />
            <Text style={[styles.navBtnText, { color: colors.text }]}>Previous</Text>
          </TouchableOpacity>

          {currentIndex < quizQuestions.length - 1 ? (
            <TouchableOpacity
              style={[styles.nextBtn, { opacity: userAnswers[currentIndex] ? 1 : 0.6 }]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>Next</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitBtn, { opacity: userAnswers[currentIndex] ? 1 : 0.6 }]}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>Submit Quiz</Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  quizHeader: {
    marginBottom: 12,
  },
  quizHeaderTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 2,
  },
  questionCountText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 999,
  },
  questionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 25,
    marginBottom: 20,
  },
  optionsList: {
    gap: 10,
    marginBottom: 24,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  navControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  submitBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  resultCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  resultBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultScoreNum: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 6,
  },
  resultScoreDetail: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultMetricsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  metricBox: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultActions: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
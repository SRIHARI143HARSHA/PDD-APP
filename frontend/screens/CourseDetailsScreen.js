import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { courseData } from '../../data/courseData';
import { ThemeContext } from '../context/ThemeContext';

export default function CourseDetailsScreen({ route, navigation }) {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;
  const { title } = route?.params || { title: 'Flood Safety' };
  const course = courseData[title] || courseData['Flood Safety'];

  const lessons = course.lessons || [];
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [resetNotice, setResetNotice] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('disaster_app_course_progress');
        if (saved) {
          const map = JSON.parse(saved);
          if (map[title] && Array.isArray(map[title].completedLessons)) {
            setCompletedLessonIds(map[title].completedLessons);
          }
        }
      }
    } catch (e) {}
  }, [title]);

  const completeLesson = (id) => {
    let nextCompleted = completedLessonIds;
    if (!completedLessonIds.includes(id)) {
      nextCompleted = [...completedLessonIds, id];
      setCompletedLessonIds(nextCompleted);
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('disaster_app_course_progress');
        const map = saved ? JSON.parse(saved) : {};
        map[title] = {
          started: nextCompleted.length > 0,
          completedLessons: nextCompleted,
          totalLessons: lessons.length,
        };
        window.localStorage.setItem('disaster_app_course_progress', JSON.stringify(map));
      }
    } catch (e) {}

    const currentIndex = lessons.findIndex((l) => l.id === id);
    if (currentIndex < lessons.length - 1) {
      setActiveLesson(lessons[currentIndex + 1]);
    } else {
      setActiveLesson(null);
    }
  };

  // Reset / Restart Course Completion Percentage to 0%
  const handleRestartCourse = () => {
    setCompletedLessonIds([]);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('disaster_app_course_progress');
        const map = saved ? JSON.parse(saved) : {};
        map[title] = {
          started: false,
          completedLessons: [],
          totalLessons: lessons.length,
        };
        window.localStorage.setItem('disaster_app_course_progress', JSON.stringify(map));
      }
    } catch (e) {}
  };

  const progressPercent = Math.round((completedLessonIds.length / (lessons.length || 1)) * 100);

  const colors = isDark
    ? {
        bg: '#061225',
        card: '#071426',
        border: '#1E293B',
        text: '#E6EEF8',
        subtext: '#94A3B8',
        lessonBg: '#0F1C2E',
        ruleBg: '#0F2942',
        ruleBorder: '#1E4976',
        tipBg: '#1E1B4B',
        tipBorder: '#3730A3',
        mythBg: '#311B1B',
        mythBorder: '#7F1D1D',
        infoBg: '#0F2942',
        infoBorder: '#1E4976',
      }
    : {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtext: '#64748B',
        lessonBg: '#F8FAFC',
        ruleBg: '#EFF6FF',
        ruleBorder: '#BFDBFE',
        tipBg: '#EEF2FF',
        tipBorder: '#C7D2FE',
        mythBg: '#FEF2F2',
        mythBorder: '#FECACA',
        infoBg: '#F0F9FF',
        infoBorder: '#BAE6FD',
      };

  // Active Lesson Reader View
  if (activeLesson) {
    const isAlreadyCompleted = completedLessonIds.includes(activeLesson.id);
    const lessonIndex = lessons.findIndex((l) => l.id === activeLesson.id) + 1;

    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.contentContainer}>
        {/* Single Clean Back Button */}
        <TouchableOpacity
          style={[styles.singleBackBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setActiveLesson(null)}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={16} color={colors.text} style={{ marginRight: 6 }} />
          <Text style={[styles.singleBackText, { color: colors.text }]}>← Return to Course Overview</Text>
        </TouchableOpacity>

        <View style={styles.lessonMetaHeader}>
          <Text style={[styles.lessonMetaIndex, { color: '#2563EB' }]}>Lesson {lessonIndex} of {lessons.length}</Text>
          <Text style={[styles.lessonMainTitle, { color: colors.text }]}>{activeLesson.title}</Text>
        </View>

        {/* Lesson Educational Content */}
        <View style={[styles.lessonContentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.educationalBody, { color: colors.text }]}>{activeLesson.content}</Text>

          {/* Key Safety Rule */}
          {activeLesson.keyRule && (
            <View style={[styles.keyRuleCard, { backgroundColor: colors.ruleBg, borderColor: colors.ruleBorder }]}>
              <View style={styles.cardHeaderInline}>
                <Ionicons name="warning-outline" size={18} color="#2563EB" style={{ marginRight: 6 }} />
                <Text style={styles.keyRuleTitle}>Key Safety Rule</Text>
              </View>
              <Text style={[styles.keyRuleText, { color: colors.text }]}>{activeLesson.keyRule}</Text>
            </View>
          )}

          {/* Pro Preparedness Tip */}
          {activeLesson.proTip && (
            <View style={[styles.proTipCard, { backgroundColor: colors.tipBg, borderColor: colors.tipBorder }]}>
              <View style={styles.cardHeaderInline}>
                <Ionicons name="bulb-outline" size={18} color="#6366F1" style={{ marginRight: 6 }} />
                <Text style={styles.proTipTitle}>Pro Preparedness Tip</Text>
              </View>
              <Text style={[styles.proTipText, { color: colors.text }]}>{activeLesson.proTip}</Text>
            </View>
          )}

          {/* Myth vs Fact */}
          {activeLesson.mythVsFact && (
            <View style={[styles.mythCard, { backgroundColor: colors.mythBg, borderColor: colors.mythBorder }]}>
              <View style={styles.cardHeaderInline}>
                <Ionicons name="flash-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.mythTitle}>Myth vs. Fact</Text>
              </View>
              <Text style={[styles.mythText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
                <Text style={{ fontWeight: '800' }}>MYTH: </Text>
                {activeLesson.mythVsFact.myth}
              </Text>
              <Text style={[styles.factText, { color: isDark ? '#E6EEF8' : '#0F172A' }]}>
                <Text style={{ fontWeight: '800', color: '#10B981' }}>FACT: </Text>
                {activeLesson.mythVsFact.fact}
              </Text>
            </View>
          )}

          {/* Action Step Checklist */}
          {activeLesson.checklist && (
            <View style={[styles.checklistCard, { backgroundColor: colors.ruleBg, borderColor: colors.ruleBorder }]}>
              <View style={styles.cardHeaderInline}>
                <Ionicons name="checkbox-outline" size={18} color="#2563EB" style={{ marginRight: 6 }} />
                <Text style={styles.checklistTitle}>Action Step Checklist</Text>
              </View>
              {activeLesson.checklist.map((step, sIdx) => (
                <View key={sIdx} style={styles.checkRow}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={[styles.checkText, { color: colors.text }]}>{step}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Key Takeaways */}
          {activeLesson.remember && (
            <View style={[styles.rememberCard, { backgroundColor: isDark ? '#0B1E36' : '#FEF3C7', borderColor: isDark ? '#1E3A8A' : '#FDE68A' }]}>
              <Text style={[styles.rememberTitle, { color: isDark ? '#93C5FD' : '#92400E' }]}>✓ Key Takeaways to Remember</Text>
              {activeLesson.remember.map((item, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={[styles.bulletDot, { color: isDark ? '#60A5FA' : '#D97706' }]}>•</Text>
                  <Text style={[styles.bulletText, { color: isDark ? '#E6EEF8' : '#78350F' }]}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Complete & Continue Button */}
          <TouchableOpacity
            style={[styles.completeLessonBtn, { backgroundColor: isAlreadyCompleted ? '#059669' : '#2563EB' }]}
            onPress={() => completeLesson(activeLesson.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.completeLessonBtnText}>
              {isAlreadyCompleted ? '✓ Completed • Continue' : 'Complete Lesson & Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* Watch Awareness Video at VERY END */}
        {course.video && (
          <TouchableOpacity activeOpacity={0.9} style={styles.videoButton} onPress={() => Linking.openURL(course.video)}>
            <Ionicons name="play-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.videoButtonText}>Watch Awareness Video</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }

  // Course Overview View
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.contentContainer}>
      {/* High Quality Hero Banner Aligned with HomeScreen Hero Style */}
      <View style={styles.heroCard}>
        <Image source={course.image} style={styles.heroBackground} resizeMode="cover" />
        <LinearGradient
          colors={[
            'rgba(2, 10, 25, 0.85)',
            'rgba(2, 10, 25, 0.55)',
            'rgba(2, 10, 25, 0.20)',
            'rgba(2, 10, 25, 0.08)',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.heroOverlay}
        >
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{course.category}</Text>
          </View>
          <Text style={styles.heroTitle}>{course.title}</Text>
          <Text style={styles.heroSubtitle}>{course.description}</Text>
        </LinearGradient>
      </View>

      {/* Progress & Reset Percentage Section */}
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.progressHeaderRow}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Course Completion</Text>
            <Text style={[styles.progressSub, { color: colors.subtext }]}>
              {completedLessonIds.length} of {lessons.length} lessons completed ({progressPercent}%)
            </Text>
          </View>

          {/* Restart Course Completion Percentage Button */}
          <TouchableOpacity
            style={[
              styles.restartPercentageBtn,
              { backgroundColor: progressPercent > 0 ? '#EF4444' : isDark ? '#1E293B' : '#E2E8F0' },
            ]}
            onPress={handleRestartCourse}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-outline" size={16} color={progressPercent > 0 ? '#FFFFFF' : colors.subtext} />
            <Text
              style={[
                styles.restartPercentageBtnText,
                { color: progressPercent > 0 ? '#FFFFFF' : colors.subtext },
              ]}
            >
              Restart Progress (0%)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progressPercent}%` }]} />
        </View>

        {resetNotice && (
          <View style={styles.resetNoticeBanner}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginRight: 6 }} />
            <Text style={styles.resetNoticeText}>Course progress has been reset to 0%!</Text>
          </View>
        )}
      </View>

      {/* RELATED EXTRA INFORMATION SECTIONS ABOUT THE COURSE */}
      <View style={[styles.sectionCard, { backgroundColor: colors.infoBg, borderColor: colors.infoBorder }]}>
        <View style={styles.cardHeaderInline}>
          <Ionicons name="information-circle-outline" size={20} color="#0284C7" style={{ marginRight: 6 }} />
          <Text style={[styles.sectionTitle, { color: isDark ? '#38BDF8' : '#0369A1', marginBottom: 0 }]}>
            Course Overview & Key Objectives
          </Text>
        </View>

        <Text style={[styles.infoParagraph, { color: colors.text }]}>
          {course.content}
        </Text>

        <View style={styles.infoGridRow}>
          <View style={[styles.infoSubCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#10B981" style={{ marginBottom: 4 }} />
            <Text style={[styles.infoSubTitle, { color: colors.text }]}>Safety Standard</Text>
            <Text style={[styles.infoSubDesc, { color: colors.subtext }]}>FEMA & Red Cross compliant guidelines</Text>
          </View>

          <View style={[styles.infoSubCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="time-outline" size={18} color="#2563EB" style={{ marginBottom: 4 }} />
            <Text style={[styles.infoSubTitle, { color: colors.text }]}>Self-Paced</Text>
            <Text style={[styles.infoSubDesc, { color: colors.subtext }]}>{lessons.length} interactive modules</Text>
          </View>

          <View style={[styles.infoSubCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="ribbon-outline" size={18} color="#F59E0B" style={{ marginBottom: 4 }} />
            <Text style={[styles.infoSubTitle, { color: colors.text }]}>Quiz Verified</Text>
            <Text style={[styles.infoSubDesc, { color: colors.subtext }]}>Knowledge check at course completion</Text>
          </View>
        </View>
      </View>

      {/* Sequential Lesson Modules */}
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Course Lessons</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
          Complete lessons in sequential order to unlock the next module.
        </Text>
        <View style={styles.lessonsList}>
          {lessons.map((item, idx) => {
            const done = completedLessonIds.includes(item.id);
            const isUnlocked = idx === 0 || completedLessonIds.includes(lessons[idx - 1].id);

            return (
              <View
                key={item.id}
                style={[
                  styles.compactLessonCard,
                  {
                    backgroundColor: colors.lessonBg,
                    borderColor: done ? '#10B981' : isUnlocked ? colors.border : 'transparent',
                    opacity: isUnlocked ? 1 : 0.65,
                  },
                ]}
              >
                <View style={styles.lessonCardLeft}>
                  <View
                    style={[
                      styles.lessonNumCircle,
                      {
                        backgroundColor: done
                          ? '#10B981'
                          : isUnlocked
                          ? '#2563EB'
                          : isDark
                          ? '#1E293B'
                          : '#94A3B8',
                      },
                    ]}
                  >
                    <Text style={styles.lessonNumText}>
                      {done ? '✓' : isUnlocked ? `0${idx + 1}` : '🔒'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.compactLessonTitle, { color: colors.text }]}>{item.title}</Text>
                    {item.keyRule && (
                      <Text style={[styles.compactLessonRulePreview, { color: colors.subtext }]} numberOfLines={1}>
                        Rule: {item.keyRule}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.compactLessonStatus,
                        { color: done ? '#10B981' : isUnlocked ? colors.subtext : '#EF4444' },
                      ]}
                    >
                      {done ? '✓ Completed' : isUnlocked ? '○ Unlocked • Ready' : '🔒 Locked (Complete previous lesson)'}
                    </Text>
                  </View>
                </View>

                {isUnlocked ? (
                  <TouchableOpacity
                    style={[styles.startLessonBtn, { backgroundColor: done ? '#059669' : '#2563EB' }]}
                    onPress={() => setActiveLesson(item)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.startLessonBtnText}>{done ? 'Review' : 'Start Lesson'}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.startLessonBtn, { backgroundColor: '#94A3B8' }]}>
                    <Text style={styles.startLessonBtnText}>🔒 Locked</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Watch Awareness Video at VERY END */}
      {course.video && (
        <TouchableOpacity activeOpacity={0.9} style={styles.videoButton} onPress={() => Linking.openURL(course.video)}>
          <Ionicons name="play-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.videoButtonText}>Watch Awareness Video</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 36,
  },
  singleBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  singleBackText: {
    fontSize: 13,
    fontWeight: '700',
  },
  heroCard: {
    position: 'relative',
    width: '100%',
    minHeight: 240,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#020A19',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    padding: 22,
    justifyContent: 'center',
    minHeight: 240,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  progressSub: {
    fontSize: 13,
  },
  restartPercentageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  restartPercentageBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  resetNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  resetNoticeText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 999,
  },
  infoParagraph: {
    fontSize: 13,
    lineHeight: 20,
    marginVertical: 10,
  },
  infoGridRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  infoSubCard: {
    flex: 1,
    minWidth: 100,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoSubTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  infoSubDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  lessonsList: {
    gap: 10,
    marginTop: 4,
  },
  compactLessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  lessonCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  lessonNumCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  lessonNumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  compactLessonTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  compactLessonRulePreview: {
    fontSize: 11,
    marginTop: 1,
  },
  compactLessonStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  startLessonBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startLessonBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  lessonMetaHeader: {
    marginBottom: 14,
  },
  lessonMetaIndex: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  lessonMainTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  lessonContentCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  educationalBody: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  keyRuleCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  keyRuleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  keyRuleText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  cardHeaderInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  proTipCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  proTipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6366F1',
  },
  proTipText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  mythCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  mythTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EF4444',
  },
  mythText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  factText: {
    fontSize: 13,
    lineHeight: 19,
  },
  checklistCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  checkText: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
    fontWeight: '600',
  },
  rememberCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  rememberTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  bulletDot: {
    fontSize: 14,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  completeLessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  completeLessonBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    marginTop: 18,
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
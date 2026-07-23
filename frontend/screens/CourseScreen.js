import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { courseData } from '../../data/courseData';
import { ThemeContext } from '../App';

const defaultCourseData = {
  'Flood Safety': { started: false, completedLessons: [], totalLessons: 6 },
  'Earthquake Safety': { started: false, completedLessons: [], totalLessons: 6 },
  'Fire Safety': { started: false, completedLessons: [], totalLessons: 6 },
  'Cyclone Preparedness': { started: false, completedLessons: [], totalLessons: 6 },
  'Tsunami Preparedness': { started: false, completedLessons: [], totalLessons: 6 },
};

const courses = [
  {
    id: 'flood',
    name: 'Flood Safety',
    category: 'FLOOD SAFETY',
    desc: 'Learn how to prepare for floods, protect property, and evacuate safely.',
    difficulty: 'Beginner',
    totalLessons: 6,
    image: require('../../assets/images/flood.jpg'),
    accent: '#2563EB',
  },
  {
    id: 'earthquake',
    name: 'Earthquake Safety',
    category: 'EARTHQUAKE SAFETY',
    desc: 'Practice drop, cover, and hold on responses when the ground shakes.',
    difficulty: 'Intermediate',
    totalLessons: 6,
    image: require('../../assets/images/earthquake.jpg'),
    accent: '#F97316',
  },
  {
    id: 'fire',
    name: 'Fire Safety',
    category: 'FIRE SAFETY',
    desc: 'Master fire prevention, extinguisher operation, and building escape routes.',
    difficulty: 'Beginner',
    totalLessons: 6,
    image: require('../../assets/images/fire.jpg'),
    accent: '#EF4444',
  },
  {
    id: 'cyclone',
    name: 'Cyclone Preparedness',
    category: 'CYCLONE PREPAREDNESS',
    desc: 'Secure property and assemble supplies before severe wind storms.',
    difficulty: 'Intermediate',
    totalLessons: 6,
    image: require('../../assets/images/cyclone.jpg'),
    accent: '#0D9488',
  },
  {
    id: 'tsunami',
    name: 'Tsunami Preparedness',
    category: 'TSUNAMI PREPAREDNESS',
    desc: 'Recognize natural coastal warning signs and move to high ground fast.',
    difficulty: 'Intermediate',
    totalLessons: 6,
    image: require('../../assets/images/tsunami.jpg'),
    accent: '#7C3AED',
  },
];

export default function CourseScreen({ navigation, searchQuery = '' }) {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;

  const [courseMap, setCourseMap] = useState(defaultCourseData);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('disaster_app_course_progress');
        if (saved) {
          const parsed = JSON.parse(saved);
          setCourseMap((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {}
  }, []);

  const completedCoursesCount = courses.filter((c) => {
    const data = courseMap[c.name] || {};
    const completedArr = data.completedLessons || [];
    return completedArr.length >= c.totalLessons;
  }).length;

  const inProgressCoursesCount = courses.filter((c) => {
    const data = courseMap[c.name] || {};
    const completedArr = data.completedLessons || [];
    return completedArr.length > 0 && completedArr.length < c.totalLessons;
  }).length;

  const totalLessonsOverall = courses.reduce((sum, c) => sum + (courseData[c.name]?.lessons?.length || c.totalLessons), 0);
  const completedLessonsOverall = courses.reduce((sum, c) => {
    const data = courseMap[c.name] || {};
    return sum + (data.completedLessons?.length || 0);
  }, 0);

  const overallPercent = Math.round((completedLessonsOverall / (totalLessonsOverall || 1)) * 100);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleCourses = normalizedQuery
    ? courses.filter((course) => {
        const haystack = `${course.name} ${course.desc} ${course.category}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : courses;

  const colors = isDark
    ? {
        bg: '#061225',
        card: '#071426',
        border: '#1E293B',
        text: '#E6EEF8',
        subtext: '#94A3B8',
        trackBg: '#1E293B',
      }
    : {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtext: '#64748B',
        trackBg: '#F1F5F9',
      };

  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mainPageWrapper}>
        {/* Intro */}
        <View style={styles.introHeader}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Courses</Text>
          <Text style={[styles.pageSubtitle, { color: colors.subtext }]}>
            Master essential disaster preparedness skills.
          </Text>
        </View>

        {/* Overall Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardHeaderTitle, { color: colors.text }]}>Your Learning Progress</Text>
            <Text style={[styles.cardPercentText, { color: '#2563EB' }]}>{overallPercent}%</Text>
          </View>

          <Text style={[styles.progressSub, { color: colors.subtext }]}>
            {completedCoursesCount === 0 && inProgressCoursesCount === 0
              ? 'No courses started yet.'
              : `${completedCoursesCount} of ${courses.length} courses completed`}
          </Text>

          <View style={[styles.progressTrack, { backgroundColor: colors.trackBg }]}>
            <View style={[styles.progressFill, { width: `${overallPercent}%` }]} />
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginRight: 6 }} />
              <Text style={[styles.metricText, { color: colors.subtext }]}>
                <Text style={{ fontWeight: '800', color: colors.text }}>{completedLessonsOverall}</Text> of {totalLessonsOverall} lessons completed
              </Text>
            </View>

            <View style={styles.metricItem}>
              <Ionicons name="time-outline" size={16} color="#3B82F6" style={{ marginRight: 6 }} />
              <Text style={[styles.metricText, { color: colors.subtext }]}>
                <Text style={{ fontWeight: '800', color: colors.text }}>{inProgressCoursesCount}</Text> courses in progress
              </Text>
            </View>
          </View>
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
              : styles.courseGridNative
          }
        >
          {visibleCourses.map((course) => {
            const data = courseMap[course.name] || {};
            const completedCount = data.completedLessons?.length || 0;
            const totalL = courseData[course.name]?.lessons?.length || course.totalLessons;
            const percent = Math.round((completedCount / totalL) * 100);

            const isCompleted = completedCount >= totalL;
            const isStarted = completedCount > 0;

            return (
              <View
                key={course.id}
                className="course-card-cell"
                dataSet={{ class: 'course-card-cell' }}
                style={[
                  styles.courseCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {/* Image Banner */}
                <View style={styles.cardImageWrap}>
                  <Image source={course.image} style={styles.cardImage} resizeMode="cover" />
                  <View style={[styles.categoryBadge, { backgroundColor: 'rgba(15, 23, 42, 0.75)' }]}>
                    <Text style={styles.categoryBadgeText}>{course.category}</Text>
                  </View>
                </View>

                {/* Card Content */}
                <View style={styles.cardBody}>
                  <Text style={[styles.courseTitle, { color: colors.text }]}>{course.name}</Text>
                  <Text style={[styles.courseDesc, { color: colors.subtext }]} numberOfLines={2}>
                    {course.desc}
                  </Text>

                  <View style={styles.metaRow}>
                    <Text style={[styles.metaText, { color: colors.subtext }]}>
                      {course.difficulty} • {totalL} Lessons
                    </Text>
                  </View>

                  {/* Progress State Display */}
                  {!isStarted && !isCompleted ? (
                    <View style={styles.notStartedRow}>
                      <Ionicons name="ellipse-outline" size={14} color={colors.subtext} style={{ marginRight: 6 }} />
                      <Text style={[styles.notStartedText, { color: colors.subtext }]}>Not Started</Text>
                    </View>
                  ) : (
                    <View style={styles.progressDetailSection}>
                      <View style={styles.progressDetailHeader}>
                        <Text style={[styles.progressLabel, { color: colors.subtext }]}>
                          {isCompleted ? '✓ Course Completed' : `${completedCount} of ${totalL} lessons completed`}
                        </Text>
                        <Text style={[styles.progressVal, { color: isCompleted ? '#10B981' : colors.text }]}>
                          {percent}%
                        </Text>
                      </View>
                      <View style={[styles.cardProgressTrack, { backgroundColor: colors.trackBg }]}>
                        <View
                          style={[
                            styles.cardProgressFill,
                            {
                              width: `${percent}%`,
                              backgroundColor: isCompleted ? '#10B981' : course.accent,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  )}

                  {/* Action Button */}
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: isCompleted ? '#059669' : isStarted ? course.accent : '#2563EB',
                      },
                    ]}
                    onPress={() => {
                      if (navigation) {
                        navigation.navigate('CourseDetails', { title: course.name });
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionBtnText}>
                      {isCompleted ? 'Review Course' : isStarted ? 'Continue Learning' : 'Start Course'}
                    </Text>
                  </TouchableOpacity>
                </View>
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
    fontSize: 18,
    fontWeight: '900',
  },
  progressSub: {
    fontSize: 13,
    marginBottom: 12,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 999,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricText: {
    fontSize: 12,
  },
  courseGridNative: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  courseCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  cardImageWrap: {
    height: 160,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  courseDesc: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  metaRow: {
    marginBottom: 14,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notStartedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  notStartedText: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressDetailSection: {
    marginBottom: 16,
  },
  progressDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardProgressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  cardProgressFill: {
    height: '100%',
    borderRadius: 999,
  },
  actionBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../../database/config';
import { ThemeContext } from '../context/ThemeContext';

export default function ProfileScreen({ navigation, realNavigation }) {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;

  const auth = getAuth();
  const user = auth.currentUser;

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('Ramayanapu');
  const [lastName, setLastName] = useState('Srihari');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);

  // Real Progress Statistics State
  const [coursesStat, setCoursesStat] = useState('0/5');
  const [quizzesStat, setQuizzesStat] = useState('0/5');
  const [bestScoreStat, setBestScoreStat] = useState('--');

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setEmail('srihari@disasterapp.com');
    }
    loadRealStats();
  }, [user]);

  const loadRealStats = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Course Stats
        const savedCourses = window.localStorage.getItem('disaster_app_course_progress');
        if (savedCourses) {
          const map = JSON.parse(savedCourses);
          const completedCount = Object.values(map).filter(
            (c) => c && Array.isArray(c.completedLessons) && c.completedLessons.length >= 6
          ).length;
          setCoursesStat(`${completedCount}/5`);
        }

        // Quiz Stats
        const savedQuizzes = window.localStorage.getItem('disaster_app_quiz_progress');
        if (savedQuizzes) {
          const map = JSON.parse(savedQuizzes);
          const attemptedCount = Object.values(map).filter((q) => q && q.attempted).length;
          setQuizzesStat(`${attemptedCount}/5`);

          let maxBest = 0;
          let hasAttempt = false;
          Object.values(map).forEach((q) => {
            if (q && q.bestScore !== undefined && q.bestScore !== null) {
              hasAttempt = true;
              if (q.bestScore > maxBest) maxBest = q.bestScore;
            }
          });

          if (hasAttempt) {
            setBestScoreStat(`${maxBest}%`);
          } else {
            setBestScoreStat('--');
          }
        }
      }
    } catch (e) {}
  };

  const loadProfile = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.firstName) setFirstName(data.firstName);
        if (data.lastName) setLastName(data.lastName);
        if (data.phone) setPhone(data.phone);
        setEmail(data.email || user.email || '');
      } else {
        setEmail(user.email || 'srihari@disasterapp.com');
      }
    } catch (error) {
      setEmail(user?.email || 'srihari@disasterapp.com');
    }
  };

  const saveProfile = async () => {
    try {
      if (!user?.uid) {
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 2500);
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          firstName: firstName || '',
          lastName: lastName || '',
          phone: phone || '',
          email: user.email || email,
          updatedAt: new Date().toISOString(),
          uid: user.uid,
        },
        { merge: true }
      );

      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      Alert.alert('Save Failed', error.message || 'Could not update profile.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (realNavigation?.reset) {
        realNavigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else if (navigation?.navigate) {
        navigation.navigate('Login');
      }
    } catch (error) {
      if (navigation?.navigate) {
        navigation.navigate('Login');
      }
    }
  };

  const initials = `${firstName?.[0] || 'R'}${lastName?.[0] || 'S'}`.toUpperCase();

  const colors = isDark
    ? {
        bg: '#061225',
        card: '#071426',
        border: '#1E293B',
        text: '#E6EEF8',
        subtext: '#94A3B8',
        fieldBg: '#0F1C2E',
        inputBg: '#0B1220',
      }
    : {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtext: '#64748B',
        fieldBg: '#F8FAFC',
        inputBg: '#FFFFFF',
      };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.mainWrapper}>
        {/* Profile Cover Header */}
        <View style={styles.coverCard}>
          <LinearGradient colors={['#1E3A8A', '#2563EB']} style={styles.coverGradient}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.profileMeta}>
                <Text style={styles.profileName}>{`${firstName} ${lastName}`.trim() || 'Learner Profile'}</Text>
                <View style={styles.badgeRow}>
                  <Ionicons name="shield-checkmark" size={14} color="#60A5FA" />
                  <Text style={styles.badgeText}>Preparedness Learner</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Real Progress Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="book-outline" size={20} color="#2563EB" style={{ marginBottom: 4 }} />
            <Text style={[styles.statVal, { color: colors.text }]}>{coursesStat}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Courses</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="school-outline" size={20} color="#F97316" style={{ marginBottom: 4 }} />
            <Text style={[styles.statVal, { color: colors.text }]}>{quizzesStat}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Quizzes</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="ribbon-outline" size={20} color="#10B981" style={{ marginBottom: 4 }} />
            <Text style={[styles.statVal, { color: colors.text }]}>{bestScoreStat}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Best Score</Text>
          </View>
        </View>

        {/* Personal Details Form Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.headerLeft}>
              <Ionicons name="person-outline" size={18} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
            </View>
            <TouchableOpacity onPress={() => setEditing((v) => !v)} activeOpacity={0.8}>
              <Text style={styles.editActionText}>{editing ? 'Cancel' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldsGrid}>
            <View style={styles.fieldItem}>
              <Text style={[styles.fieldLabel, { color: colors.subtext }]}>First Name</Text>
              {editing ? (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              ) : (
                <View style={[styles.readOnlyBox, { backgroundColor: colors.fieldBg, borderColor: colors.border }]}>
                  <Text style={[styles.fieldValue, { color: colors.text }]}>{firstName || '—'}</Text>
                </View>
              )}
            </View>

            <View style={styles.fieldItem}>
              <Text style={[styles.fieldLabel, { color: colors.subtext }]}>Last Name</Text>
              {editing ? (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                  value={lastName}
                  onChangeText={setLastName}
                />
              ) : (
                <View style={[styles.readOnlyBox, { backgroundColor: colors.fieldBg, borderColor: colors.border }]}>
                  <Text style={[styles.fieldValue, { color: colors.text }]}>{lastName || '—'}</Text>
                </View>
              )}
            </View>

            <View style={styles.fieldItem}>
              <Text style={[styles.fieldLabel, { color: colors.subtext }]}>Email Address</Text>
              <View style={[styles.readOnlyBox, { backgroundColor: colors.fieldBg, borderColor: colors.border }]}>
                <Text style={[styles.fieldValue, { color: colors.text }]}>{email || 'srihari@disasterapp.com'}</Text>
              </View>
            </View>

            <View style={styles.fieldItem}>
              <Text style={[styles.fieldLabel, { color: colors.subtext }]}>Mobile Number</Text>
              {editing ? (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                  value={phone}
                  onChangeText={setPhone}
                />
              ) : (
                <View style={[styles.readOnlyBox, { backgroundColor: colors.fieldBg, borderColor: colors.border }]}>
                  <Text style={[styles.fieldValue, { color: colors.text }]}>{phone || '—'}</Text>
                </View>
              )}
            </View>
          </View>

          {editing && (
            <TouchableOpacity style={styles.saveBtn} onPress={saveProfile} activeOpacity={0.85}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Save Profile Changes</Text>
            </TouchableOpacity>
          )}

          {saved && (
            <View style={styles.savedBanner}>
              <Ionicons name="checkmark-circle" size={16} color="#065F46" />
              <Text style={styles.savedBannerText}>Profile changes saved successfully!</Text>
            </View>
          )}
        </View>

        {/* Separate Account Options Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>Account</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
            <Text style={styles.logoutBtnText}>Logout Account</Text>
          </TouchableOpacity>
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
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  coverCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  coverGradient: {
    padding: 24,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2563EB',
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    gap: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  editActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  fieldsGrid: {
    gap: 12,
  },
  fieldItem: {},
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  readOnlyBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    marginTop: 16,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  savedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
    gap: 6,
  },
  savedBannerText: {
    color: '#065F46',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
  },
});
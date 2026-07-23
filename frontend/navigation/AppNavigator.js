import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CourseDetailsScreen from '../screens/CourseDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizTopicsScreen from '../screens/QuizTopicsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  return (

    <NavigationContainer>

      <Stack.Navigator>

        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Register Screen */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* Main App */}
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        {/* Quiz Topics Screen */}
        <Stack.Screen
          name="QuizTopics"
          component={QuizTopicsScreen}
          options={{ title: 'Quiz Topics' }}
        />

        {/* Quiz Screen */}
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: 'Course Quiz' }}
        />

        <Stack.Screen
          name="CourseDetails"
          component={CourseDetailsScreen}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );
}
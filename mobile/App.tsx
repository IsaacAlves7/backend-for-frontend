import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { Text, View, ActivityIndicator } from 'react-native';
import { store } from './src/store';
import { useAppDispatch, useAppSelector } from './src/hooks/redux';
import { initializeAuth } from './src/store/slices/authSlice';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { DashboardScreen } from './src/screens/tasks/DashboardScreen';
import { TasksScreen } from './src/screens/tasks/TasksScreen';
import { NotificationsScreen } from './src/screens/tasks/NotificationsScreen';
import { ProfileScreen } from './src/screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = { Home: '⊞', Tasks: '☑', Notifications: '🔔', Profile: '👤' };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>{icons[label] ?? '●'}</Text>
    </View>
  );
}

function MainTabs() {
  const unread = useAppSelector((s) => s.notifications.unreadCount);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopColor: '#f3f4f6', height: 60, paddingBottom: 8 },
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: '700', color: '#111827' },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'Início', headerTitle: 'TaskFlow' }} />
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: 'Tarefas', headerTitle: 'Minhas Tarefas' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen}
        options={{ title: 'Notificações', headerTitle: 'Notificações', tabBarBadge: unread > 0 ? unread : undefined }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil', headerTitle: 'Meu Perfil' }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const dispatch = useAppDispatch();
  const { accessToken, initialized } = useAppSelector((s) => s.auth);

  useEffect(() => { dispatch(initializeAuth()); }, []);

  if (!initialized) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {accessToken ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

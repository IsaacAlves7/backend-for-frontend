import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loadDashboard } from '../../store/slices/authSlice';
import { fetchTaskFeed } from '../../store/slices/taskSlice';

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  LOW:    { bg: '#f3f4f6', text: '#374151' },
  MEDIUM: { bg: '#dbeafe', text: '#1d4ed8' },
  HIGH:   { bg: '#ffedd5', text: '#c2410c' },
  URGENT: { bg: '#fee2e2', text: '#dc2626' },
};

const STATUS_MAP: Record<string, string> = {
  TODO: 'A fazer', IN_PROGRESS: 'Em progresso', REVIEW: 'Revisão', DONE: 'Concluído',
};

export function DashboardScreen({ navigation }: { navigation: { navigate: (s: string, p?: object) => void } }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items: tasks, loading: tasksLoading } = useAppSelector((s) => s.tasks);
  const unread = useAppSelector((s) => s.notifications.unreadCount);
  const [refreshing, setRefreshing] = React.useState(false);

  const load = () => {
    dispatch(loadDashboard());
    dispatch(fetchTaskFeed({ limit: '5' }));
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    load();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Greeting */}
      <View style={styles.greeting}>
        <View>
          <Text style={styles.greetingText}>Olá, {user?.firstName ?? user?.name?.split(' ')[0] ?? 'usuário'} 👋</Text>
          <Text style={styles.greetingSub}>Veja o resumo de hoje</Text>
        </View>
        {unread > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>{unread}</Text></View>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'A fazer', key: 'todo', color: '#6366f1' },
          { label: 'Progresso', key: 'inProgress', color: '#f59e0b' },
          { label: 'Concluído', key: 'done', color: '#10b981' },
        ].map((s) => (
          <View key={s.key} style={[styles.statCard, { borderTopColor: s.color }]}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>
              {tasks.filter((t) => {
                if (s.key === 'todo') return t.status === 'TODO';
                if (s.key === 'inProgress') return t.status === 'IN_PROGRESS';
                return t.status === 'DONE';
              }).length}
            </Text>
          </View>
        ))}
      </View>

      {/* Recent tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tarefas recentes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {tasksLoading ? (
          <ActivityIndicator color="#4f46e5" style={{ marginVertical: 16 }} />
        ) : tasks.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma tarefa ainda. Crie uma!</Text>
        ) : (
          tasks.slice(0, 5).map((task) => {
            const pc = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.MEDIUM;
            return (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => navigation.navigate('TaskDetail', { id: task.id })}
              >
                <View style={styles.taskCardInner}>
                  <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                  <Text style={styles.taskStatus}>{STATUS_MAP[task.status]}</Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: pc.bg }]}>
                  <Text style={[styles.priorityText, { color: pc.text }]}>{task.priority}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f9fafb' },
  container: { padding: 20, paddingBottom: 40 },
  greeting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greetingText: { fontSize: 22, fontWeight: '700', color: '#111827' },
  greetingSub: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  notifBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, borderTopWidth: 3, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  statLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '700' },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  seeAll: { fontSize: 13, color: '#4f46e5', fontWeight: '500' },
  taskCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  taskCardInner: { flex: 1, marginRight: 12 },
  taskTitle: { fontSize: 14, fontWeight: '500', color: '#111827', marginBottom: 2 },
  taskStatus: { fontSize: 12, color: '#9ca3af' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  priorityText: { fontSize: 11, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#9ca3af', fontSize: 14, paddingVertical: 16 },
});

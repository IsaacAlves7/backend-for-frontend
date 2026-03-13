import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchTaskFeed, deleteTask, updateTaskStatus, Task, TaskStatus } from '../../store/slices/taskSlice';

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  LOW:    { bg: '#f3f4f6', text: '#374151' },
  MEDIUM: { bg: '#dbeafe', text: '#1d4ed8' },
  HIGH:   { bg: '#ffedd5', text: '#c2410c' },
  URGENT: { bg: '#fee2e2', text: '#dc2626' },
};

const STATUS_MAP: Record<string, string> = {
  TODO: 'A fazer', IN_PROGRESS: 'Em progresso', REVIEW: 'Revisão', DONE: 'Concluído',
};

const STATUS_NEXT: Record<TaskStatus, TaskStatus> = {
  TODO: 'IN_PROGRESS', IN_PROGRESS: 'REVIEW', REVIEW: 'DONE', DONE: 'TODO',
};

export function TasksScreen({ navigation }: { navigation: { navigate: (s: string, p?: object) => void } }) {
  const dispatch = useAppDispatch();
  const { items, loading, total } = useAppSelector((s) => s.tasks);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = () => dispatch(fetchTaskFeed({ ...(statusFilter ? { status: statusFilter } : {}), ...(search ? { search } : {}) }));

  useEffect(() => { load(); }, [statusFilter, search]);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleDelete = (id: string) => {
    Alert.alert('Excluir tarefa', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => dispatch(deleteTask(id)) },
    ]);
  };

  const handleAdvanceStatus = (task: Task) => {
    dispatch(updateTaskStatus({ id: task.id, status: STATUS_NEXT[task.status] }));
  };

  const renderTask = ({ item }: { item: Task }) => {
    const pc = PRIORITY_COLORS[item.priority] ?? PRIORITY_COLORS.MEDIUM;
    return (
      <TouchableOpacity
        style={styles.taskCard}
        onPress={() => navigation.navigate('TaskDetail', { id: item.id })}
        onLongPress={() => handleDelete(item.id)}
      >
        <View style={styles.taskLeft}>
          <TouchableOpacity style={styles.statusDot} onPress={() => handleAdvanceStatus(item)}>
            <View style={[styles.dot, item.status === 'DONE' && styles.dotDone]} />
          </TouchableOpacity>
          <View style={styles.taskBody}>
            <Text style={[styles.taskTitle, item.status === 'DONE' && styles.taskTitleDone]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.taskMeta}>
              <Text style={styles.taskStatusText}>{STATUS_MAP[item.status]}</Text>
              {item.dueDate && (
                <Text style={styles.taskDue}>  · {new Date(item.dueDate).toLocaleDateString('pt-BR')}</Text>
              )}
            </View>
          </View>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: pc.bg }]}>
          <Text style={[styles.priorityText, { color: pc.text }]}>{item.priority}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tarefas..."
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateTask')}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Status filter chips */}
      <View style={styles.chips}>
        {[['', 'Todas'], ['TODO', 'A fazer'], ['IN_PROGRESS', 'Progresso'], ['DONE', 'Concluído']].map(([v, l]) => (
          <TouchableOpacity
            key={v}
            style={[styles.chip, statusFilter === v && styles.chipActive]}
            onPress={() => setStatusFilter(v)}
          >
            <Text style={[styles.chipText, statusFilter === v && styles.chipTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.countText}>{total} tarefa{total !== 1 ? 's' : ''}</Text>

      {loading && items.length === 0 ? (
        <ActivityIndicator color="#4f46e5" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderTask}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  searchRow: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 8 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#fff', fontSize: 15, color: '#111827' },
  addBtn: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 24, fontWeight: '300', lineHeight: 28 },
  chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  chipActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  chipText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  countText: { paddingHorizontal: 16, paddingBottom: 8, fontSize: 12, color: '#9ca3af' },
  taskCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  taskLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  statusDot: { paddingTop: 3 },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#4f46e5' },
  dotDone: { backgroundColor: '#4f46e5' },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: '500', color: '#111827', marginBottom: 3 },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#9ca3af' },
  taskMeta: { flexDirection: 'row' },
  taskStatusText: { fontSize: 12, color: '#9ca3af' },
  taskDue: { fontSize: 12, color: '#9ca3af' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, marginLeft: 8 },
  priorityText: { fontSize: 11, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 40, fontSize: 15 },
});

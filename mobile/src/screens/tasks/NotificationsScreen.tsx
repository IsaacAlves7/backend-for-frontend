import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchNotifications, markRead } from '../../store/slices/notificationSlice';

const TYPE_ICONS: Record<string, string> = {
  TASK_ASSIGNED: '📋', TASK_UPDATED: '✏️', TASK_COMPLETED: '✅', MENTION: '💬', REMINDER: '⏰',
};

export function NotificationsScreen() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.notifications);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => { dispatch(fetchNotifications()); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchNotifications());
    setRefreshing(false);
  };

  return (
    <FlatList
      style={styles.list}
      data={items}
      keyExtractor={(i) => i.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={
        <Text style={styles.empty}>Nenhuma notificação.</Text>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.card, !item.read && styles.cardUnread]}
          onPress={() => !item.read && dispatch(markRead(item.id))}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{TYPE_ICONS[item.type] ?? '🔔'}</Text>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMsg}>{item.message}</Text>
            <Text style={styles.cardTime}>{new Date(item.createdAt).toLocaleString('pt-BR')}</Text>
          </View>
          {!item.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#f9fafb' },
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#fff', marginHorizontal: 16, marginTop: 10, borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: '#4f46e5', backgroundColor: '#eef2ff' },
  icon: { fontSize: 22, marginTop: 1 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 2 },
  cardMsg: { fontSize: 13, color: '#4b5563', lineHeight: 18 },
  cardTime: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4f46e5', marginTop: 6 },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 60, fontSize: 15 },
});

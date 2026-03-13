import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutThunk, loadDashboard } from '../../store/slices/authSlice';
import { api } from '../../api/client';

export function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');

  const handleSave = async () => {
    try {
      await api.patch('/profile', { name });
      await dispatch(loadDashboard());
      setEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => dispatch(logoutThunk()) },
    ]);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        {editing ? (
          <TextInput style={styles.nameInput} value={name} onChangeText={setName} autoFocus />
        ) : (
          <Text style={styles.name}>{user?.name}</Text>
        )}
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        {editing ? (
          <View style={styles.editBtns}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditing(false); setName(user?.name ?? ''); }}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.menuItem} onPress={() => setEditing(true)}>
            <Text style={styles.menuItemText}>Editar nome</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f9fafb' },
  container: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#4f46e5' },
  name: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  nameInput: { fontSize: 20, fontWeight: '700', color: '#111827', borderBottomWidth: 2, borderBottomColor: '#4f46e5', paddingVertical: 4, marginBottom: 4, minWidth: 160, textAlign: 'center' },
  email: { fontSize: 14, color: '#6b7280' },
  section: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  menuItemText: { fontSize: 15, color: '#111827' },
  menuItemArrow: { fontSize: 20, color: '#9ca3af' },
  logoutItem: { justifyContent: 'center' },
  logoutText: { fontSize: 15, color: '#ef4444', fontWeight: '600' },
  editBtns: { flexDirection: 'row', gap: 10, padding: 12 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { color: '#374151', fontWeight: '500' },
  saveBtn: { flex: 1, backgroundColor: '#4f46e5', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600' },
});

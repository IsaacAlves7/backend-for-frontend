import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { registerThunk } from '../store/slices/authSlice';

export function RegisterScreen({ navigation }: { navigation: { navigate: (s: string) => void } }) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.loading);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return Alert.alert('Erro', 'Preencha todos os campos');
    if (form.password !== form.confirmPassword) return Alert.alert('Erro', 'Senhas não conferem');
    if (form.password.length < 8) return Alert.alert('Erro', 'Senha deve ter pelo menos 8 caracteres');
    const result = await dispatch(registerThunk({ name: form.name, email: form.email, password: form.password }));
    if (registerThunk.rejected.match(result)) {
      Alert.alert('Erro', result.payload as string ?? 'Falha no cadastro');
    }
  };

  const update = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}><Text style={styles.logoText}>TF</Text></View>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Comece a organizar suas tarefas</Text>
      </View>
      <View style={styles.form}>
        {[
          { key: 'name' as const, label: 'Nome completo', keyboard: 'default', secure: false },
          { key: 'email' as const, label: 'E-mail', keyboard: 'email-address', secure: false },
          { key: 'password' as const, label: 'Senha', keyboard: 'default', secure: true },
          { key: 'confirmPassword' as const, label: 'Confirmar senha', keyboard: 'default', secure: true },
        ].map((f) => (
          <TextInput
            key={f.key}
            style={styles.input}
            placeholder={f.label}
            value={form[f.key]}
            onChangeText={update(f.key)}
            keyboardType={f.keyboard as 'default' | 'email-address'}
            autoCapitalize="none"
            secureTextEntry={f.secure}
          />
        ))}
        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Criar conta</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem conta? <Text style={styles.linkBold}>Entrar</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f9fafb' },
  container: { padding: 24, justifyContent: 'center', flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6b7280' },
  form: { backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 12, color: '#111827' },
  btn: { backgroundColor: '#4f46e5', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  link: { textAlign: 'center', color: '#6b7280', fontSize: 14 },
  linkBold: { color: '#4f46e5', fontWeight: '600' },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginThunk } from '../store/slices/authSlice';

export function LoginScreen({ navigation }: { navigation: { navigate: (s: string) => void } }) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Erro', 'Preencha todos os campos');
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.rejected.match(result)) {
      Alert.alert('Erro', result.payload as string ?? 'Falha no login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}><Text style={styles.logoText}>TF</Text></View>
        <Text style={styles.title}>Entrar no TaskFlow</Text>
        <Text style={styles.subtitle}>Gerencie suas tarefas</Text>
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Entrar</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Não tem conta? <Text style={styles.linkBold}>Criar conta</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', justifyContent: 'center', padding: 24 },
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

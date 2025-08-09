import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const ROLE_OPTIONS = [
  'Startup Founder / Co-founder',
  'Investor / VC / Angel',
  'Developer / Engineer',
  'Designer / UI/UX',
  'Marketer / Growth Hacker',
  'Business Consultant / Mentor',
  'Job Seeker / Intern',
  'Service Provider (Legal, Finance, etc.)',
  'Other (Freelancer, Advisor, etc.)',
] as const;

type Role = typeof ROLE_OPTIONS[number];

export default function RolesScreen() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  const existingRoles = useMemo<Role[]>(() => {
    const roles = (user?.publicMetadata as any)?.roles;
    if (Array.isArray(roles)) return roles as Role[];
    return [];
  }, [user]);

  const [selected, setSelected] = useState<Role[]>(existingRoles);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) return null;

  const toggle = (role: Role) => {
    setSelected((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const onContinue = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await user.update({ publicMetadata: { ...(user.publicMetadata as any), roles: selected } });
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Failed to save roles.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>What best describes you?</Text>
        <Text style={styles.subtitle}>Select one or more roles. You can change this later.</Text>

        <ScrollView contentContainerStyle={styles.rolesWrap}>
          {ROLE_OPTIONS.map((role) => {
            const active = selected.includes(role);
            return (
              <TouchableOpacity key={role} onPress={() => toggle(role)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{role}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryBtn} onPress={onContinue} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Continue</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(tabs)')} disabled={saving}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 560, backgroundColor: '#111214', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#22252a' },
  title: { color: 'white', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#a0a0a0', marginTop: 6, marginBottom: 14 },
  rolesWrap: { gap: 10, flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 8 },
  chip: { borderWidth: 1, borderColor: '#2a2e35', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 9999, backgroundColor: '#1a1c20' },
  chipActive: { backgroundColor: '#2b2f3a', borderColor: '#6c5ce7' },
  chipText: { color: '#d1d1d6', fontSize: 14 },
  chipTextActive: { color: 'white', fontWeight: '600' },
  error: { color: '#ff4d4f', marginTop: 8 },
  primaryBtn: { backgroundColor: '#6c5ce7', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  primaryText: { color: 'white', fontWeight: '600' },
  skipBtn: { paddingVertical: 10, alignItems: 'center', marginTop: 8 },
  skipText: { color: '#a0a0a0' },
});
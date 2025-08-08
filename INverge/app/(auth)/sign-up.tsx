import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'form' | 'verify'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);
    try {
      await signUp.create({ emailAddress: email.trim(), password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStage('verify');
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Unable to sign up.');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/details');
      } else {
        setError('Verification incomplete.');
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Invalid code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {stage === 'form' ? (
          <>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Join INverge to grow faster</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@startup.com"
                placeholderTextColor="#8e8e93"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholder="Create a strong password"
                placeholderTextColor="#8e8e93"
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryBtn} onPress={onSignUpPress} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Continue</Text>}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Link href="/(auth)/sign-in" style={styles.linkText}>Sign in</Link>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to {email}</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Verification code</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                placeholderTextColor="#8e8e93"
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryBtn} onPress={onVerifyPress} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Verify & Continue</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.secondaryBtn, { marginTop: 10 }]} onPress={() => setStage('form')} disabled={loading}>
              <Text style={styles.secondaryText}>Change email</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111214',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#22252a',
  },
  title: { color: 'white', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#a0a0a0', marginTop: 4, marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { color: '#d1d1d6', marginBottom: 6 },
  input: {
    backgroundColor: '#1a1c20',
    color: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2a2e35',
  },
  error: { color: '#ff4d4f', marginBottom: 8 },
  primaryBtn: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryText: { color: 'white', fontWeight: '600' },
  secondaryBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2e35',
  },
  secondaryText: { color: '#d1d1d6', fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 },
  footerText: { color: '#a0a0a0' },
  linkText: { color: '#7aa2ff', fontWeight: '600' },
});
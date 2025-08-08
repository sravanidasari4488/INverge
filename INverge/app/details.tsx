import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function DetailsScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, user } = useUser();

  const primaryEmail = useMemo(() => {
    if (!user) return '';
    const id = user.primaryEmailAddressId;
    const email = user.emailAddresses?.find((e) => e.id === id);
    return email?.emailAddress || '';
  }, [user]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhoneNumber((user.privateMetadata as any)?.phoneNumber || '');
      const loc = (user.publicMetadata as any)?.location;
      if (loc) {
        setCity(loc.city || '');
        setCountry(loc.country || '');
      }
    }
  }, [user]);

  const chooseImage = async () => {
    setError(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await user.update({ firstName, lastName, publicMetadata: { location: { city, country } }, privateMetadata: { phoneNumber } });
      if (imageUri) {
        const blob = await (await fetch(imageUri)).blob();
        await user.setProfileImage({ file: blob });
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Failed to save details.');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#6c5ce7" />
        <Text style={styles.loadingText}>Finalizing sign-up…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>Tell INverge about you to personalize your experience</Text>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Text style={styles.label}>First name</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Jane" placeholderTextColor="#8e8e93" />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Text style={styles.label}>Last name</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Doe" placeholderTextColor="#8e8e93" />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email address</Text>
          <TextInput style={[styles.input, { opacity: 0.6 }]} value={primaryEmail} editable={false} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone (optional)</Text>
          <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="+1 555 000 1111" placeholderTextColor="#8e8e93" />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="San Francisco" placeholderTextColor="#8e8e93" />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Text style={styles.label}>Country</Text>
            <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="United States" placeholderTextColor="#8e8e93" />
          </View>
        </View>

        <View style={[styles.field, { alignItems: 'flex-start' }]}>
          <Text style={styles.label}>Profile picture</Text>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: 84, height: 84, borderRadius: 42, marginTop: 8 }} />
          ) : null}
          <TouchableOpacity style={styles.secondaryBtn} onPress={chooseImage}>
            <Text style={styles.secondaryText}>{imageUri ? 'Change image' : 'Upload image'}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryBtn} onPress={onSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Save & Continue</Text>}
        </TouchableOpacity>
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
    maxWidth: 520,
    backgroundColor: '#111214',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#22252a',
  },
  title: { color: 'white', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#a0a0a0', marginTop: 4, marginBottom: 16 },
  field: { marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 12 },
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
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2e35',
    marginTop: 8,
  },
  secondaryText: { color: '#d1d1d6', fontWeight: '600' },
  loadingWrap: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: '#a0a0a0' },
});
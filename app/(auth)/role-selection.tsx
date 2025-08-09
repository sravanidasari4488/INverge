import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const roles = [
  {
    id: 'founder',
    title: 'Startup Founder / Co-founder',
    icon: '🚀',
    description: 'Building the next big thing',
  },
  {
    id: 'investor',
    title: 'Investor / VC / Angel',
    icon: '💰',
    description: 'Funding innovative startups',
  },
  {
    id: 'developer',
    title: 'Developer / Engineer',
    icon: '👨‍💻',
    description: 'Building amazing products',
  },
  {
    id: 'designer',
    title: 'Designer / UI/UX',
    icon: '🎨',
    description: 'Creating beautiful experiences',
  },
  {
    id: 'marketer',
    title: 'Marketer / Growth Hacker',
    icon: '📈',
    description: 'Growing businesses strategically',
  },
  {
    id: 'consultant',
    title: 'Business Consultant / Mentor',
    icon: '🎯',
    description: 'Guiding businesses to success',
  },
  {
    id: 'jobseeker',
    title: 'Job Seeker / Intern',
    icon: '🔍',
    description: 'Looking for opportunities',
  },
  {
    id: 'service',
    title: 'Service Provider (Legal, Finance, etc.)',
    icon: '⚖️',
    description: 'Providing professional services',
  },
  {
    id: 'other',
    title: 'Other (Freelancer, Advisor, etc.)',
    icon: '✨',
    description: 'Contributing in unique ways',
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { user } = useUser();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleContinue = async () => {
    if (selectedRoles.length === 0) {
      Alert.alert('Please select at least one role', 'This helps us personalize your experience.');
      return;
    }

    setLoading(true);
    try {
      // Store roles in user metadata
      await user?.update({
        publicMetadata: {
          roles: selectedRoles,
          onboardingCompleted: true,
        },
      });

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>What best describes you?</Text>
          <Text style={styles.subtitle}>
            You can select multiple roles or change them later
          </Text>
        </View>

        <View style={styles.rolesContainer}>
          {roles.map((role) => {
            const isSelected = selectedRoles.includes(role.id);
            return (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  isSelected && styles.roleCardSelected,
                ]}
                onPress={() => toggleRole(role.id)}
                activeOpacity={0.7}
              >
                <View style={styles.roleContent}>
                  <View style={styles.roleHeader}>
                    <Text style={styles.roleIcon}>{role.icon}</Text>
                    <View style={styles.roleTextContainer}>
                      <Text style={[
                        styles.roleTitle,
                        isSelected && styles.roleTitleSelected
                      ]}>
                        {role.title}
                      </Text>
                      <Text style={[
                        styles.roleDescription,
                        isSelected && styles.roleDescriptionSelected
                      ]}>
                        {role.description}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected
                  ]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, selectedRoles.length === 0 && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading || selectedRoles.length === 0}
          >
            <Text style={styles.continueButtonText}>
              {loading ? 'Setting up...' : `Continue${selectedRoles.length > 0 ? ` (${selectedRoles.length})` : ''}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={loading}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.icon,
    textAlign: 'center',
    lineHeight: 22,
  },
  rolesContainer: {
    flex: 1,
    marginBottom: 32,
  },
  roleCard: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.icon + '20',
    borderRadius: 16,
    marginBottom: 12,
    padding: 20,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roleCardSelected: {
    borderColor: colors.tint,
    backgroundColor: colors.tint + '08',
    shadowColor: colors.tint,
    shadowOpacity: 0.15,
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  roleTitleSelected: {
    color: colors.tint,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.icon,
    lineHeight: 18,
  },
  roleDescriptionSelected: {
    color: colors.tint + 'CC',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.icon + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: colors.tint,
    borderColor: colors.tint,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    paddingTop: 16,
  },
  continueButton: {
    height: 56,
    backgroundColor: colors.tint,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.tint,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    color: colors.icon,
    fontSize: 16,
    fontWeight: '500',
  },
});
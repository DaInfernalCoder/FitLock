import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, loading } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      const result = await signIn({ email: email.trim(), password });

      if (result.error) {
        Alert.alert('Sign In Error', result.error.message);
      } else {
        // Navigation will be handled by the auth state listener
        console.log('✅ Sign in successful');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Sign in error:', error);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign In (Social Auth - Subtask 2.5)
    Alert.alert('Coming Soon', 'Google Sign In will be available soon!');
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    Alert.alert('Forgot Password', 'Password reset functionality coming soon!');
  };

  const navigateToSignUp = () => {
    router.push('/auth/sign-up');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Welcome Text */}
            <View style={styles.welcomeSection}>
              <ThemedText type="title" style={styles.welcomeTitle}>
                Welcome to FitBod
              </ThemedText>
              <ThemedText style={styles.welcomeSubtitle}>
                Sign in to continue your fitness journey
              </ThemedText>
            </View>

            {/* Sign In Form */}
            <View style={styles.formSection}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Email</ThemedText>
                <TextInput
                  style={[styles.textInput, errors.email && styles.inputError]}
                  placeholder="your@email.com"
                  placeholderTextColor="#6B7280"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.email && (
                  <ThemedText style={styles.errorText}>
                    {errors.email}
                  </ThemedText>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={styles.passwordLabelRow}>
                  <ThemedText style={styles.inputLabel}>Password</ThemedText>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <ThemedText style={styles.forgotLink}>Forgot?</ThemedText>
                  </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.textInput,
                      styles.passwordInput,
                      errors.password && styles.inputError,
                    ]}
                    placeholder="••••••••"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <ThemedText style={styles.errorText}>
                    {errors.password}
                  </ThemedText>
                )}
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.signInButton, loading && styles.buttonDisabled]}
                onPress={handleSignIn}
                disabled={loading}
              >
                <ThemedText style={styles.signInButtonText}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>
                or continue with
              </ThemedText>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
            >
              <MaterialCommunityIcons
                name="google"
                size={20}
                color="#FFFFFF"
                style={styles.googleIcon}
              />
              <ThemedText style={styles.googleButtonText}>
                Sign in with Google
              </ThemedText>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpSection}>
              <ThemedText style={styles.signUpText}>
                Don&apos;t have an account?{' '}
                <ThemedText
                  style={styles.signUpLink}
                  onPress={navigateToSignUp}
                >
                  Sign up
                </ThemedText>
              </ThemedText>
            </View>
          </ScrollView>

          {/* Legal Footer */}
          <View style={styles.footer}>
            <ThemedText style={styles.legalText}>
              By signing in, you agree to our{' '}
              <ThemedText style={styles.legalLink}>Terms of Service</ThemedText>{' '}
              and{' '}
              <ThemedText style={styles.legalLink}>Privacy Policy</ThemedText>
            </ThemedText>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 32,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 48,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotLink: {
    fontSize: 14,
    color: '#0070FF',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    padding: 4,
  },
  signInButton: {
    backgroundColor: '#0070FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#374151',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  dividerText: {
    fontSize: 14,
    color: '#9CA3AF',
    paddingHorizontal: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 32,
    minHeight: 48,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpSection: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  signUpLink: {
    color: '#0070FF',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  legalText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  legalLink: {
    color: '#9CA3AF',
  },
});

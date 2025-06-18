import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignInTestScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
      }}
    >
      <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>
        🎉 Auth Screen Works!
      </Text>
      <Text style={{ color: 'white', fontSize: 16, marginBottom: 30 }}>
        This is the sign-in screen
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: '#0070FF',
          padding: 15,
          borderRadius: 10,
          marginBottom: 10,
        }}
        onPress={() => router.push('/auth/sign-up')}
      >
        <Text style={{ color: 'white' }}>Go to Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: '#666', padding: 15, borderRadius: 10 }}
        onPress={() => router.back()}
      >
        <Text style={{ color: 'white' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

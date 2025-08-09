@@ .. @@
 import { Image } from 'expo-image';
+import { TouchableOpacity } from 'react-native';
 import { Platform, StyleSheet } from 'react-native';
+import { useAuth } from '@clerk/clerk-expo';
 
 import { HelloWave } from '@/components/HelloWave';
@@ .. @@
 export default function HomeScreen() {
+  const { signOut, user } = useAuth();
+
   return (
@@ .. @@
       <ThemedView style={styles.titleContainer}>
-        <ThemedText type="title">Welcome!</ThemedText>
+        <ThemedText type="title">Welcome, {user?.firstName}!</ThemedText>
         <HelloWave />
@@ .. @@
         <ThemedText>
           {`When you're ready, run `}
           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
         </ThemedText>
       </ThemedView>
+      <ThemedView style={styles.stepContainer}>
+        <TouchableOpacity
+          style={styles.signOutButton}
+          onPress={() => signOut()}
+        >
+          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
+        </TouchableOpacity>
+      </ThemedView>
     </ParallaxScrollView>
@@ .. @@
     left: 0,
     position: 'absolute',
   },
+  signOutButton: {
+    backgroundColor: '#ff4444',
+    paddingHorizontal: 24,
+    paddingVertical: 12,
+    borderRadius: 8,
+    alignItems: 'center',
+  },
+  signOutText: {
+    color: '#FFFFFF',
+    fontWeight: '600',
+  },
 });
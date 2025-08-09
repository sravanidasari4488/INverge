@@ .. @@
 import { Tabs } from 'expo-router';
+import { Redirect } from 'expo-router';
+import { useAuth } from '@clerk/clerk-expo';
 import React from 'react';
 import { Platform } from 'react-native';
 
@@ .. @@
 export default function TabLayout() {
   const colorScheme = useColorScheme();
+  const { isSignedIn } = useAuth();
+
+  if (!isSignedIn) {
+    return <Redirect href="/(auth)/sign-in" />;
+  }
 
   return (
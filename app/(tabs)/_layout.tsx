import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.wrapper}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            web: {
              position: "relative",
              maxWidth: 800,
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            default: {
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Your Tasks",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="photos"
          options={{
            title: "Photos",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="photo.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "red",
  },
});

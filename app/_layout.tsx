import { StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components";
import { theme } from "@/infrastructure/themes";
import i18n from "i18next";
import * as Linking from "expo-linking";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import { PaperProvider } from "react-native-paper";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "@/utils/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InternetWrapper from "@/components/internet-wrapper";
import { InternetProvider } from "@/components/InternetDetector";

const TextComponent = Text as any;
if (TextComponent.defaultProps == null) {
  TextComponent.defaultProps = {};
}

TextComponent.defaultProps.allowFontScaling = false;

const processReferralLink = async (url: string) => {
  try {
    console.log("Processing URL:", url);
    const { queryParams } = Linking.parse(url);

    let referralCode = null;

    // Handle Play Store referrer parameter: referrer=ref_USER123
    if (queryParams?.referrer) {
      const referrer = queryParams.referrer as string;
      if (referrer.startsWith("ref_")) {
        referralCode = referrer.replace("ref_", "");
      }
    }

    // Handle direct referral parameter: ref=USER123
    if (queryParams?.ref) {
      referralCode = queryParams.ref as string;
    }

    if (referralCode) {
      await AsyncStorage.setItem("pendingReferralCode", referralCode);
      console.log("Referral code saved:", referralCode);
    }
  } catch (error) {
    console.log("Error processing referral link:", error);
  }
};

const _layout = () => {
  let [poppinsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  // Move useEffect BEFORE the conditional return
  useEffect(() => {
    const handleReferralLinks = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await processReferralLink(initialUrl);
      }

      const subscription = Linking.addEventListener("url", async ({ url }) => {
        await processReferralLink(url);
      });
      return () => subscription?.remove();
    };

    handleReferralLinks();
  }, []);

  // Now the conditional return comes after all hooks
  if (!poppinsLoaded) {
    return null;
  }
  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <PaperProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="(screens)/LanguageSeletionScreen"
                options={{ title: "Language" }}
              />
              <Stack.Screen name="(tabs)" options={{ title: "tabs" }} />
            </Stack>
            <StatusBar backgroundColor="#000000" barStyle={"light-content"} />
          </PaperProvider>
        </ThemeProvider>
      </I18nextProvider>
    </AuthProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { theme } from "@/infrastructure/themes";
const UserBentogrids = () => {
  return (
    <View style={{ flexDirection: "row", gap: hp(3), width: wp(80),justifyContent:"center",  }}>
      <View style={styles.box1}>
        <Text
          style={{
            fontSize: hp(3.2),
            fontFamily: theme.fontFamily.semiBold,
            textAlign: "center",
            color: theme.colors.brand.blue,
          }}
        >
          150
        </Text>
        <Text
          style={{
            fontSize: hp(1.7),
            fontFamily: theme.fontFamily.regular,
            textAlign: "center",
            color: "#8E8F8F",
          }}
        >
          Total Points
        </Text>
      </View>
      <View style={styles.box2}>
        <Text
          style={{
            fontSize: hp(3.2),
            fontFamily: theme.fontFamily.semiBold,
            textAlign: "center",
            color: theme.colors.brand.blue,
          }}
        >
          3
        </Text>
        <Text
          style={{
            fontSize: hp(1.7),
            fontFamily: theme.fontFamily.regular,
            textAlign: "center",
            color: "#8E8F8F",
          }}
        >
          Referal
        </Text>
      </View>
    </View>
  );
};

export default UserBentogrids;

const styles = StyleSheet.create({
  box1: {
    height: hp(12),
    width: wp(40),
    borderRadius: 10,
    borderWidth: 0.7,
    borderColor: "#D5D5D7",
    backgroundColor: theme.colors.ui.cardbg,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box2: {
    height: hp(12),
    width: wp(25),
    borderRadius: 10,

    borderWidth: 0.7,
    borderColor: "#D5D5D7",
    backgroundColor: theme.colors.ui.cardbg,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

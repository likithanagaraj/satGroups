import { StyleSheet, Text, View } from "react-native";
import React from "react";
import styled from "styled-components";
import { theme } from "@/infrastructure/themes";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const Title = ({ children }: any) => {
  return (
    <Text style={styles.heading}>{children}</Text>
  );
};

export default Title;

const styles = StyleSheet.create({
heading:
{
  fontSize:hp("2.5%"),
  fontFamily:theme.fontFamily.semiBold,
  color:theme.colors.ui.black,
  textAlign:"center",
}
});

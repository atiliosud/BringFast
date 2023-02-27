import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";

export default function FinishedCard({ order, onPress }) {
  const getDayMonth: Function = (dateNumber: number) => {
    let date = new Date(dateNumber);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    return `${day}/${month}`;
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardSection}>
        <Text>
          {getDayMonth(order.initial_date)} -{" "}
          {new Date(order.initial_date).toLocaleTimeString()}
        </Text>
      </View>
      <View style={styles.cardSectionLarge}>
        <Text>{order.client ? order.client : "Anônimo"}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "100%",
    height: 80,
    marginBottom: 20,
    borderRadius: 5,
  },
  cardSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardSectionLarge: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
});

import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TableButton({ order, onPress }) {
  const statusHandling: Function = (status: number) => {
    let statusColor: string;

    switch (status) {
      case 1:
        statusColor = "#009fb7";
        break;
      case 0:
        statusColor = "#dc143c";
        break;
      default:
        statusColor = "#009fb7";
        break;
    }

    return (
      <MaterialCommunityIcons
        name="table-chair"
        color={statusColor}
        size={40}
      />
    );
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardSection}>
        {statusHandling(order.status)}
        <View style={{}}>
          <Text>{order.id}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: 100,
    height: 100,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 50,
  },
  cardSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardSectionLarge: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

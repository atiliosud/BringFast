import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import TableButton from "../../../components/TableButton";
import functions from "../../../firebase/functions";
import { AuthContext } from "../../../context/AuthContext";
import { PlacesContext } from "../../../context/PlacesContext";

interface orderList {
  table: string;
  status: number;
}

export function TablesList({ navigation }) {
  const { employee } = useContext(AuthContext);
  const { places, setPlaces } = useContext(PlacesContext);

  useEffect(() => {
    (async () => {
      let data = await functions.getDocsByCollection({
        collectionName: "places",
        query: {
          field: "created_by",
          operator: "==",
          value: employee.company,
        },
      });
      setPlaces(data);
    })();
  }, []);

  const orderList: Array<orderList> = [
    {
      table: "id1",
      status: 999,
    },
    {
      table: "id2",
      status: 100,
    },
    {
      table: "id3",
      status: 100,
    },
    {
      table: "id4",
      status: 102,
    },
    {
      table: "id5",
      status: 999,
    },
    {
      table: "id3",
      status: 100,
    },
    {
      table: "id4",
      status: 102,
    },
    {
      table: "id5",
      status: 999,
    },
    {
      table: "id3",
      status: 100,
    },
    {
      table: "id4",
      status: 102,
    },
    {
      table: "id5",
      status: 999,
    },
  ];

  const openOrder: Function = (table) => {
    if (table.status == 0) {
      navigation.navigate("Info", { readOnly: false, table });
    } else if (table.status == 1) {
      navigation.navigate("Pedido", { table });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.mainContainer}
      style={styles.main}
    >
      {places.map((order) => {
        return (
          <TableButton
            onPress={() => {
              openOrder(order);
            }}
            order={order}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 20,
  },
  mainContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingBottom: 20,
  },
});

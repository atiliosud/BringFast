import React, { useEffect, useContext, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import FinishedCard from "../../../components/FinishedCard";
import { AuthContext } from "../../../context/AuthContext";
import functions from "../../../firebase/functions";

interface orderList {
  table: string;
  status: number;
}

export function FinishedOrders({ navigation }) {
  const { employee } = useContext(AuthContext);
  const [orderList, setOrderList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const openOrder: Function = (order) => {
    navigation.navigate("Info", { readOnly: true, table: order.place });
  };

  const getData = async () => {
    //Buscar pedidos pelo employee
    let orders = await functions.getDocsByCollection({
      collectionName: "orders",
      query: {
        field: "employee",
        operator: "==",
        value: employee._id,
      },
    });
    //Filtar os finalizados
    let ordersWithStatus0 = orders.filter((order) => order.status === 0);
    setOrderList(ordersWithStatus0);
  };
  const onRefresh = () => {
    setRefreshing(true);
    setOrderList([]);
    getData();
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      getData();
    })();
  }, []);
  return (
    <ScrollView
      contentContainerStyle={styles.mainContainer}
      style={styles.main}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {orderList.map((order) => {
        return (
          <FinishedCard
            order={order}
            onPress={async () => {
              let place = await functions.getDocById({
                collectionName: "places",
                id: order.place,
              });
              place.active_order = order._id;
              let newOrder = { ...order, place };
              openOrder(newOrder);
            }}
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

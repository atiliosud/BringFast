import { collection, doc } from "firebase/firestore";
import React, { useEffect, useState, useContext } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Receipt } from "../../../components/Receipt";
import functions from "../../../firebase/functions";
import firebase from "../../../firebase/";
import { AuthContext } from "../../../context/AuthContext";
import { PlacesContext } from "../../../context/PlacesContext";
import { OrdersContext } from "../../../context/OrdersContext";

const lancheImagem =
  "https://veja.abril.com.br/wp-content/uploads/2020/09/Whooper.jpg";
const cocaColaImagem =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.gobankingrates.com%2Fwp-content%2Fuploads%2F2018%2F05%2FCoca-Cola-shutterstock_281176775.jpg&f=1&nofb=1&ipt=873a46b4d0907307bb6f2be53351e77fbeb160ae6bd4eccc08e5bb0359ff0b70&ipo=images";

export function OrderInfo({ route, navigation }) {
  const { readOnly, table } = route.params;
  const { employee } = useContext(AuthContext);
  const { setPlaces } = useContext(PlacesContext);
  const { order, setOrder } = useContext(OrdersContext);
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      //buscar a ordem baseada no active_order da mesa
      let orderFirebase = await functions.getDocById({
        collectionName: "orders",
        id: table.active_order,
      });
      //buscar os produtos da order pelo _id
      let prods = [];
      for (let prodId of orderFirebase.products) {
        let data = await functions.getDocById({
          collectionName: "product",
          id: prodId,
        });
        prods.push(data);
      }
      console.log(orderFirebase);
      setOrder({ ...orderFirebase, products: prods, place: table });
      setReady(true);
    })();
  }, []);

  const handleEditOrder: Function = () => {
    navigation.navigate("Pedido", { table: table });
  };
  const handleFinishOrder = async () => {
    // Get the collection reference
    const collectionOrdersRef = collection(firebase.firestore, "orders");
    const collectionPlacesRef = collection(firebase.firestore, "places");
    // Generate "locally" a new document for the given collection reference
    const docOrderRef = doc(collectionOrdersRef, table.active_order);
    const docPlacesRef = doc(collectionPlacesRef, table._id);

    //setar o status para 0 do pedido e setar o final_date
    await functions.updateDoc({
      docRef: docOrderRef,
      payload: { status: 0, final_date: new Date().toISOString() },
    });
    //desocupar a mesa setando o status para 1 e apagando o active_order
    await functions.updateDoc({
      docRef: docPlacesRef,
      payload: { status: 1, active_order: "" },
    });

    let data = await functions.getDocsByCollection({
      collectionName: "places",
      query: {
        field: "created_by",
        operator: "==",
        value: employee.company,
      },
    });
    setPlaces(data);

    navigation.goBack();
  };

  const toReal: Function = (value: number) => {
    return value
      .toLocaleString("pt-br", { style: "currency", currency: "BRL" })
      .replace(".", ",");
  };

  const getDayMonth: Function = (dateNumber: number) => {
    let date = new Date(dateNumber);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

  const getTime: Function = (dateNumber: number) => {
    let date = new Date(dateNumber);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };

  return (
    <ScrollView style={styles.main}>
      {!readOnly ? (
        <View style={styles.editRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleFinishOrder()}
          >
            <Text style={styles.editButtonText}>Finalizar pedido</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleEditOrder()}
          >
            <Text style={styles.saveButtonText}>Editar pedido</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
      {ready ? (
        <Receipt>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Pedido - {order.place.id}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.itemText}>
              {order.client ? order.client : "Anônimo"}
            </Text>
            <Text style={styles.itemText}>
              {getDayMonth(order.initial_date)} (
              {new Date(order.initial_date).toLocaleTimeString()})
            </Text>
          </View>
          <View style={styles.orderContainer}>
            <Text style={styles.orderTitle}>Produtos:</Text>
            {order.products.map((product) => {
              return (
                <Text style={styles.itemText}>
                  * {product.name} - R${toReal(product.price)}
                </Text>
              );
            })}
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.title}>Valor: R${toReal(order.value)}</Text>
          </View>
        </Receipt>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <ActivityIndicator size="large" color="#2541b2" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#E3F2FD",
    padding: 20,
  },
  rowContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 60,
  },
  titleRow: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 60,
  },
  editRow: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2541b2",
    width: "45%",
    height: 40,
    borderRadius: 5,
  },
  editButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  orderContainer: {
    width: "100%",
    marginLeft: 50,
  },
  valueContainer: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 60,
    marginLeft: 50,
  },
  divide: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    // paddingLeft: 10,
  },
  title: {
    fontSize: 24,
  },
  orderTitle: {
    fontSize: 20,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 18,
  },
});

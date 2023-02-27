import React, { useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import { ListItems } from "../../../components/ListItem";
import { AddProductModal } from "../../../components/AddProductModal";
import { AuthContext } from "../../../context/AuthContext";
import { PlacesContext } from "../../../context/PlacesContext";
import { OrdersContext } from "../../../context/OrdersContext";
import firebase from "../../../firebase/";
import functions from "../../../firebase/functions";
import uuid from "react-native-uuid";
import { doc, collection } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
const lancheImagem =
  "https://veja.abril.com.br/wp-content/uploads/2020/09/Whooper.jpg";

export function NewOrder(props) {
  const [observation, setObservations] = React.useState("");
  const [client, setClient] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [orderProducts, setOrderProducts] = React.useState([]);
  const { employee } = useContext(AuthContext);
  const { setPlaces } = useContext(PlacesContext);
  const { order, setOrder } = useContext(OrdersContext);
  const navigation = useNavigation();
  useEffect(() => {
    (async () => {
      //se ja possuir uma ordem ativa devemos buscala e preencher os dados na tela
      if (props.route.params.table.active_order) {
        //buscar a ordem baseada no active_order da mesa
        let orderFirebase = await functions.getDocById({
          collectionName: "orders",
          id: props.route.params.table.active_order,
        });
        //buscar os produtos da order pelo _id
        let prods = [];
        for (let prodId of orderFirebase.products) {
          let data = await functions.getDocById({
            collectionName: "product",
            id: prodId,
          });
          data.id = uuid.v4();
          prods.push(data);
        }
        setOrder({
          ...orderFirebase,
          products: prods,
          place: props.route.params.table,
        });
        setClient(orderFirebase.client);
        setOrderProducts(prods);
        setObservations(orderFirebase.observation);
        console.log(prods.map((i) => i.id));
      }
    })();
  }, []);

  const handleSubmit = async () => {
    // Get the collection reference
    const collectionOrdersRef = collection(firebase.firestore, "orders");

    // Generate "locally" a new document for the given collection reference
    const docRef = doc(collectionOrdersRef);

    //Payload
    let payload = {
      _id: docRef.id,
      id: uuid.v4(),
      client: client,
      employee: employee._id,
      value: orderProducts.reduce(
        (previus, current) => current.price + previus,
        0
      ),
      products: orderProducts.map((prod) => prod._id),
      initial_date: new Date().toISOString(),
      final_date: null,
      status: 1,
      observation: observation,
      place: props.route.params.table._id,
      company: employee.company,
    };

    if (await functions.saveData({ docRef, payload })) {
      //atualizar o status da mesa para ocupada

      // Get the collection reference
      const collectionPlaceRef = collection(firebase.firestore, "places");
      // Generate "locally" a new document for the given collection reference
      const docPlaceRef = doc(collectionPlaceRef, props.route.params.table._id);

      await functions.updateDoc({
        docRef: docPlaceRef,
        payload: { status: 0, active_order: docRef.id },
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
    }
  };
  const handleUpdateOrder = async () => {
    // Get the collection reference
    const collectionOrdersRef = collection(firebase.firestore, "orders");

    // Generate "locally" a new document for the given collection reference
    const docRef = doc(
      collectionOrdersRef,
      props.route.params.table.active_order
    );
    //Payload
    let payload = {
      client: client,
      employee: employee._id,
      id: uuid.v4(),
      value: orderProducts.reduce(
        (previus, current) => current.price + previus,
        0
      ),
      products: orderProducts.map((prod) => prod._id),
      status: 1,
      observation: observation,
    };
    console.log(payload);

    if (await functions.updateDoc({ docRef, payload })) {
      //buscar a ordem baseada no active_order da mesa
      let orderFirebase = await functions.getDocById({
        collectionName: "orders",
        id: props.route.params.table.active_order,
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
      setOrder({
        ...orderFirebase,
        products: prods,
        place: props.route.params.table,
      });
      navigation.goBack();
    }
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <AddProductModal
          setShowModal={setShowModal}
          updateProductList={setOrderProducts}
        />
      </Modal>
      <ScrollView style={styles.main}>
        <View style={styles.row}>
          <TextInput
            style={styles.clientInput}
            onChangeText={setClient}
            value={client}
            placeholder="Cliente"
          />
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.addProductButton}
            onPress={() => setShowModal(!showModal)}
          >
            <Text style={styles.addProductText}>Adicionar Produto+</Text>
          </Pressable>
        </View>
        {orderProducts.map((product) => {
          return <ListItems product={product} setProducts={setOrderProducts} />;
        })}
        <View style={styles.obsRow}>
          <TextInput
            style={styles.obsInput}
            onChangeText={setObservations}
            value={observation}
            multiline={true}
            placeholder="Observações do pedido"
          />
        </View>
        <View style={styles.lastRow}>
          <TouchableOpacity
            onPress={
              props.route.params.table.active_order
                ? handleUpdateOrder
                : handleSubmit
            }
            style={styles.addProductButton}
          >
            <Text style={styles.addProductText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#E3F2FD",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 70,
  },
  clientInput: {
    color: "#708090",
    width: "100%",
    height: 50,
    paddingLeft: 20,
    borderColor: "#708090",
    borderWidth: 1,
    borderRadius: 5,
  },
  addProductButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2541b2",
    width: "100%",
    height: 40,
    borderRadius: 5,
  },
  addProductText: {
    fontSize: 20,
    color: "#fff",
  },
  obsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 120,
  },
  obsInput: {
    color: "#708090",
    width: "100%",
    height: 100,
    paddingLeft: 20,
    borderColor: "#708090",
    borderWidth: 1,
    borderRadius: 5,
  },
  lastRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 70,
    marginBottom: 40,
  },
});

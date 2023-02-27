import React, { useEffect, useContext } from "react";
import { ScrollView, View, StyleSheet, Text, Pressable } from "react-native";
import { ListItems } from "../components/ListItem";
import functions from "../firebase/functions";
import { AuthContext } from "../context/AuthContext";

const lancheImagem =
  "https://veja.abril.com.br/wp-content/uploads/2020/09/Whooper.jpg";
const sucoImagem =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcomper.vteximg.com.br%2Farquivos%2Fids%2F162280-1000-1000%2F1114654.jpg%3Fv%3D637210587162570000&f=1&nofb=1&ipt=8023797aded4e791f4be5b7258198859155fc94ce35f219ff7409de5357ff95c&ipo=images";

export function AddProductModal({ setShowModal, updateProductList }) {
  const { employee } = useContext(AuthContext);
  const [products, setProducts] = React.useState([]);

  //Buscar pelos produtos baseado na empresa do employee
  useEffect(() => {
    (async () => {
      let data = await functions.getDocsByCollection({
        collectionName: "product",
        query: {
          field: "created_by",
          operator: "==",
          value: employee.company,
        },
      });
      setProducts(data);
    })();
  }, []);
  return (
    <View style={styles.centered}>
      <View style={styles.main}>
        <View style={styles.topRow}>
          <Text style={styles.topText}>Selecione os produtos</Text>
        </View>
        <ScrollView style={styles.selectSection}>
          {products.map((product) => (
            <ListItems
              product={product}
              setProducts={updateProductList}
              newProduct
              setShowModal={setShowModal}
            />
          ))}
        </ScrollView>
        <View style={styles.bottomRow}>
          {/* <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Confirmar</Text>
            </Pressable> */}
          <Pressable
            onPress={() => {
              setShowModal(false);
            }}
            style={styles.buttonCancel}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "flex-end",
    paddingTop: 100,
  },
  main: {
    borderRadius: 15,
    backgroundColor: "#fff",
    flex: 1,
  },
  topRow: {
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#2541b2",
    paddingHorizontal: 10,
    flex: 0.15,
  },
  topText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 20,
  },
  selectSection: {
    flex: 1,
    padding: 10,
  },
  bottomRow: {
    borderTopColor: "#d4d4d4",
    borderTopWidth: 2,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    flex: 0.2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2541b2",
    flex: 1,
    height: 40,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonCancel: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c4c4c4",
    flex: 1,
    height: 40,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
});

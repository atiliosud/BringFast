import { Routes } from "./src/routes";
import { AuthProvider } from "./src/context/AuthContext";
import { PlacesProvider } from "./src/context/PlacesContext";
import { OrdersProvider } from "./src/context/OrdersContext";

export default function App() {
  return (
    <AuthProvider>
      <PlacesProvider>
        <OrdersProvider>
          <Routes />
        </OrdersProvider>
      </PlacesProvider>
    </AuthProvider>
  );
}

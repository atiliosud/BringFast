import React, { useEffect, useState } from "react";

export const OrdersContext = React.createContext<any | null>(null);
interface Props {
  children: React.ReactNode;
}

export const OrdersProvider: React.FC<Props> = ({ children }) => {
  const [order, setOrder] = React.useState<any>({});

  return (
    <OrdersContext.Provider value={{ order, setOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;

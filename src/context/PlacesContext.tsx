import React, { useEffect, useState } from "react";

export const PlacesContext = React.createContext<any | null>(null);
interface Props {
  children: React.ReactNode;
}

export const PlacesProvider: React.FC<Props> = ({ children }) => {
  const [places, setPlaces] = useState([]);

  return (
    <PlacesContext.Provider value={{ places, setPlaces }}>
      {children}
    </PlacesContext.Provider>
  );
};

export default PlacesProvider;

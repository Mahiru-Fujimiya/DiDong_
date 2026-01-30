import React, { createContext, useState, useContext } from 'react';

const FavoriteContext = createContext<any>(null);

export const FavoriteProvider = ({ children }: any) => {
  const [favorites, setFavorites] = useState<any[]>([]);

  const toggleFavorite = (product: any) => {
    setFavorites((prev) => {
      const isExist = prev.find((item) => item.id === product.id);
      if (isExist) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  const isFavorite = (productId: any) => favorites.some((item) => item.id === productId);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);
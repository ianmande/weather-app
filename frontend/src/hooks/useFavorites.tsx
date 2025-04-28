import {useCallback, useContext, useState} from 'react';

import {toast} from 'react-toastify';

import {WeatherContext} from '@context/weatherContext';

import {FavoriteCity} from '@interfaces/weather';

import {addFavoriteCity, getFavoriteCities, removeFavoriteCity} from '@services/endpoints/weather';

export const useFavorites = () => {
  const [loading, setLoading] = useState(false);
  const {favorites, setFavorites} = useContext(WeatherContext);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFavoriteCities();
      if (response.success) {
        setFavorites(response.data);
        return response.data;
      } else {
        toast.error(response.message || 'Error al obtener favoritos');
        return [];
      }
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      toast.error('Error al conectar con el servidor');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setFavorites]);

  const addToFavorites = useCallback(
    async (city: FavoriteCity) => {
      setLoading(true);
      try {
        const response = await addFavoriteCity(city);
        console.log(response);
        if (response.success) {
          toast.success('Ciudad agregada a favoritos');

          await loadFavorites();
          return true;
        } else {
          toast.error(response.message || 'Error al agregar a favoritos');
          return false;
        }
      } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        toast.error('Error al conectar con el servidor');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadFavorites],
  );

  const removeFromFavorites = useCallback(
    async (city: string) => {
      setLoading(true);
      try {
        const response = await removeFavoriteCity(city);
        if (response.success) {
          toast.success('Ciudad eliminada de favoritos');
          await loadFavorites();

          setFavorites((prevFavorites: FavoriteCity[]) => prevFavorites.filter((favorite) => favorite.city !== city));
          return true;
        } else {
          toast.error(response.message || 'Error al eliminar de favoritos');
          return false;
        }
      } catch (error) {
        console.error('Error al eliminar de favoritos:', error);
        toast.error('Error al conectar con el servidor');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadFavorites, setFavorites],
  );

  const isFavorite = useCallback(
    (city: string) => {
      return favorites.some((favorite) => favorite.city === city);
    },
    [favorites],
  );

  return {loadFavorites, addToFavorites, removeFromFavorites, isFavorite, favorites, loading};
};

import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach} from 'vitest';

import {Favorites} from '@screens/home/parts/Favorites';

import {WeatherProvider} from '@context/weatherContext';

const mockUseWeather = {
  favorites: [
    {id: '1', name: 'Madrid', temp_c: 22, condition: {text: 'Soleado', icon: 'icon-url'}},
    {id: '2', name: 'Barcelona', temp_c: 25, condition: {text: 'Despejado', icon: 'icon-url'}},
  ],
  removeFromFavorites: vi.fn(),
  fetchWeather: vi.fn(),
};

vi.mock('../hooks/useWeather', () => ({
  useWeather: () => mockUseWeather,
}));

describe('Favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente con ciudades favoritas', () => {
    render(
      <WeatherProvider>
        <Favorites />
      </WeatherProvider>,
    );

    expect(screen.getByText('Favoritos')).toBeDefined();
    expect(screen.getByText('Madrid')).toBeDefined();
    expect(screen.getByText('Barcelona')).toBeDefined();
    expect(screen.getByText('22°C')).toBeDefined();
    expect(screen.getByText('25°C')).toBeDefined();
  });

  it('muestra mensaje cuando no hay favoritos', () => {
    mockUseWeather.favorites = [];

    render(
      <WeatherProvider>
        <Favorites />
      </WeatherProvider>,
    );

    expect(screen.getByText('No tienes ciudades favoritas')).toBeDefined();

    // Restaurar el mock
    mockUseWeather.favorites = [
      {id: '1', name: 'Madrid', temp_c: 22, condition: {text: 'Soleado', icon: 'icon-url'}},
      {id: '2', name: 'Barcelona', temp_c: 25, condition: {text: 'Despejado', icon: 'icon-url'}},
    ];
  });

  it('permite eliminar una ciudad de favoritos', () => {
    render(
      <WeatherProvider>
        <Favorites />
      </WeatherProvider>,
    );

    const removeButton = screen.getAllByRole('button')[0];
    fireEvent.click(removeButton);

    expect(mockUseWeather.removeFromFavorites).toHaveBeenCalledWith('1');
  });

  it('permite seleccionar una ciudad para ver detalles', () => {
    render(
      <WeatherProvider>
        <Favorites />
      </WeatherProvider>,
    );

    const favoriteCard = screen.getByText('Madrid').parentElement;
    if (favoriteCard) {
      fireEvent.click(favoriteCard);
    }

    expect(mockUseWeather.fetchWeather).toHaveBeenCalledWith('Madrid');
  });
});

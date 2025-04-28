import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, it, expect, vi, beforeEach} from 'vitest';

import {SearchBar} from '../SearchBar';

describe('SearchBar', () => {
  const mockProps = {
    searchQuery: '',
    setSearchQuery: vi.fn(),
    searchCities: vi.fn(),
    autocompleteCities: [],
    loading: false,
    fetchWeather: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente', () => {
    render(<SearchBar {...mockProps} />);
    expect(screen.getByPlaceholderText('Buscar ciudad...')).toBeDefined();
  });

  it('llama a searchCities cuando se escribe y se espera el debounce', async () => {
    render(<SearchBar {...mockProps} />);

    const input = screen.getByPlaceholderText('Buscar ciudad...');
    await userEvent.type(input, 'Madrid');

    // Esperar a que el debounce termine
    await waitFor(
      () => {
        expect(mockProps.searchCities).toHaveBeenCalledWith('Madrid');
      },
      {timeout: 600},
    );
  });

  it('muestra las sugerencias cuando hay resultados disponibles', () => {
    const propsWithCities = {
      ...mockProps,
      autocompleteCities: [
        {id: 1, name: 'Madrid', region: 'Madrid', country: 'España', lat: 40.4, lon: -3.7, url: ''},
        {id: 2, name: 'Barcelona', region: 'Cataluña', country: 'España', lat: 41.4, lon: 2.1, url: ''},
      ],
    };

    render(<SearchBar {...propsWithCities} />);

    const input = screen.getByPlaceholderText('Buscar ciudad...');
    fireEvent.change(input, {target: {value: 'Ma'}});
    fireEvent.focus(input);

    expect(screen.getByText('Madrid')).toBeDefined();
    expect(screen.getByText('Barcelona')).toBeDefined();
  });

  it('llama a fetchWeather cuando se hace clic en una sugerencia', () => {
    const propsWithCities = {
      ...mockProps,
      autocompleteCities: [{id: 1, name: 'Madrid', region: 'Madrid', country: 'España', lat: 40.4, lon: -3.7, url: ''}],
    };

    render(<SearchBar {...propsWithCities} />);

    const input = screen.getByPlaceholderText('Buscar ciudad...');
    fireEvent.change(input, {target: {value: 'Ma'}});
    fireEvent.focus(input);

    const suggestion = screen.getByText('Madrid');
    fireEvent.click(suggestion);

    expect(mockProps.fetchWeather).toHaveBeenCalledWith('Madrid');
  });

  it('muestra mensaje de carga cuando está buscando', () => {
    const loadingProps = {
      ...mockProps,
      loading: true,
    };

    render(<SearchBar {...loadingProps} />);

    const input = screen.getByPlaceholderText('Buscar ciudad...');
    fireEvent.change(input, {target: {value: 'Ma'}});
    fireEvent.focus(input);

    expect(screen.getByText('Buscando ciudades...')).toBeDefined();
  });

  it('muestra mensaje cuando no hay resultados', () => {
    const propsWithNoResults = {
      ...mockProps,
      loading: false,
    };

    render(<SearchBar {...propsWithNoResults} />);

    const input = screen.getByPlaceholderText('Buscar ciudad...');
    fireEvent.change(input, {target: {value: 'XYZ'}});
    fireEvent.focus(input);

    expect(screen.getByText('No se encontraron resultados')).toBeDefined();
  });

  it('busca al presionar Enter', () => {
    render(<SearchBar {...mockProps} />);

    const input = screen.getByPlaceholderText('Buscar ciudad...');
    fireEvent.change(input, {target: {value: 'Madrid'}});
    fireEvent.keyDown(input, {key: 'Enter', code: 'Enter'});

    expect(mockProps.fetchWeather).toHaveBeenCalledWith('Madrid');
  });
});

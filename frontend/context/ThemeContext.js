import { createContext } from 'react';

export const ThemeContext = createContext({
  dark: false,
  toggle: () => {},
});

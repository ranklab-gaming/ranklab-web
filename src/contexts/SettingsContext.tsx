import { ReactNode, createContext } from 'react';
// hooks
import useLocalStorage from '../hooks/useLocalStorage';
// theme
import palette from '../theme/palette';
// @type
import {
  ThemeMode,
  ThemeDirection,
  ThemeColor,
  SettingsContextProps,
} from '../@types/settings';

// ----------------------------------------------------------------------

const PRIMARY_COLOR =
  {
    name: 'purple',
    lighter: '#EBD6FD',
    light: '#B985F4',
    main: '#7635dc',
    dark: '#431A9E',
    darker: '#200A69',
    contrastText: '#fff',
  };

const SettingsContext = createContext({
  themeMode: 'dark',
  themeDirection: 'ltr',
  themeColor: 'purple',
  themeStretch: false,
  setColor: PRIMARY_COLOR,
});

export { SettingsContext };

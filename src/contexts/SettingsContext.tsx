import { createContext } from 'react';

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

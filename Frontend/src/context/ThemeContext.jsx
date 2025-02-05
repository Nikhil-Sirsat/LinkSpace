import { createContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ThemeContext = createContext();

export const ThemeProviderComponent = ({ children }) => {
  // Get mode from localStorage (if available) or set default as "light"
  const storedMode = localStorage.getItem("theme") || "light";
  const [mode, setMode] = useState(storedMode);

  // Function to toggle mode
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("theme", newMode); // Save to localStorage
      return newMode;
    });
  };

  // Create Material UI theme based on mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          ...(mode === "dark"
            ? {
                background: { default: "#121212", paper: "#1e1e1e" },
                text: { primary: "#ffffff" },
              }
            : {
                background: { default: "#ffffff", paper: "#f5f5f5" },
                text: { primary: "#000000" },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

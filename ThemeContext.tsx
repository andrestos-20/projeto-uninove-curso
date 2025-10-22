Text file: ThemeContext.tsx
Latest content with line numbers:
1	import React, { createContext, useContext, useEffect, useState } from "react";
2	
3	type Theme = "light" | "dark";
4	
5	interface ThemeContextType {
6	  theme: Theme;
7	  toggleTheme?: () => void;
8	  switchable: boolean;
9	}
10	
11	const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
12	
13	interface ThemeProviderProps {
14	  children: React.ReactNode;
15	  defaultTheme?: Theme;
16	  switchable?: boolean;
17	}
18	
19	export function ThemeProvider({
20	  children,
21	  defaultTheme = "light",
22	  switchable = false,
23	}: ThemeProviderProps) {
24	  const [theme, setTheme] = useState<Theme>(() => {
25	    if (switchable) {
26	      const stored = localStorage.getItem("theme");
27	      return (stored as Theme) || defaultTheme;
28	    }
29	    return defaultTheme;
30	  });
31	
32	  useEffect(() => {
33	    const root = document.documentElement;
34	    if (theme === "dark") {
35	      root.classList.add("dark");
36	    } else {
37	      root.classList.remove("dark");
38	    }
39	
40	    if (switchable) {
41	      localStorage.setItem("theme", theme);
42	    }
43	  }, [theme, switchable]);
44	
45	  const toggleTheme = switchable
46	    ? () => {
47	        setTheme(prev => (prev === "light" ? "dark" : "light"));
48	      }
49	    : undefined;
50	
51	  return (
52	    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
53	      {children}
54	    </ThemeContext.Provider>
55	  );
56	}
57	
58	export function useTheme() {
59	  const context = useContext(ThemeContext);
60	  if (!context) {
61	    throw new Error("useTheme must be used within ThemeProvider");
62	  }
63	  return context;
64	}
65	
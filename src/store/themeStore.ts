import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme: Theme) => {
        set({ theme });
        updateDOMTheme(theme);
      },
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          updateDOMTheme(newTheme);
          return { theme: newTheme };
        }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Apply theme to DOM
export function updateDOMTheme(theme: Theme) {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
    localStorage.setItem('bpl-theme', 'dark');
  } else {
    html.classList.remove('dark');
    localStorage.setItem('bpl-theme', 'light');
  }
}

// Initialize theme on app load
export function initializeTheme() {
  const stored = localStorage.getItem('bpl-theme') as Theme | null;
  const theme = stored || useThemeStore.getState().theme;
  updateDOMTheme(theme);
  if (stored) {
    useThemeStore.setState({ theme });
  }
}

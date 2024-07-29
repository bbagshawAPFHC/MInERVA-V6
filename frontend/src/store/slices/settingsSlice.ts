// src/store/slices/settingsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  // Define your state properties here
  theme: string;
  language: string;
}

const initialState: SettingsState = {
  theme: 'light',
  language: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
  },
});

export const { setTheme, setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
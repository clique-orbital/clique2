import { TOGGLE_THEME } from "../constants";

export const toggleTheme = mode => {
  return {
    type: TOGGLE_THEME,
    payload: {
      mode
    }
  }
}
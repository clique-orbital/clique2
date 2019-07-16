import { TOGGLE_THEME } from "../constants";
import theme from "../../assets/theme";

const { lightColors, darkColors } = theme;

const initialState = {
  colors: lightColors
}

export const themeReducer = (state = initialState, action) => {
  if (action.type === TOGGLE_THEME) {
    return {
      mode: action.payload.mode,
      colors: action.payload.mode ? darkColors : lightColors
    }
  } else {
    return state;
  }
}
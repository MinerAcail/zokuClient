export const Themes: Record<ThemeName, Theme> = {
  green: {
    primaryColor: "#4b9a6a",
    backgroundColor: "#1d884c",
    textColor: "#9ad1b8",
  },
  blue: {
    primaryColor: "#1d4e8c",
    backgroundColor: "#AAE3EC",
    textColor: "#004d6f",
  },
  lavender: {
    primaryColor: "#c6aecb",
    backgroundColor: "#f9f871",
    textColor: "#4b009e",
  },
  beige: {
    primaryColor: "#d9c3a4",
    backgroundColor: "#eaeeee",
    textColor: "#333333",
  },
  pink: {
    primaryColor: "#ffb3cf",
    backgroundColor: "#d9c3a4",
    textColor: "#333333",
  },
  grayBlue: {
    primaryColor: "#7c7e9e",
    backgroundColor: "#eaeeee",
    textColor: "#333333",
  },
  warmPink: {
    primaryColor: "#a17677",
    backgroundColor: "#eaeeee",
    textColor: "#333333",
  },
  deepBlue: {
    primaryColor: "#0042b0",
    backgroundColor: "#e0e4f2",
    textColor: "#ffffff",
  },
  darkNight: {
    primaryColor: "#04040d",
    backgroundColor: "#1c1c1c",
    textColor: "#e0e0e0",
  },
  cream: {
    primaryColor: "#ffefca",
    backgroundColor: "#f4f1e6",
    textColor: "#6b4f4e",
  },
};
export interface Theme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
}
// Define ThemeName type
export type ThemeName =
  | "green"
  | "blue"
  | "lavender"
  | "beige"
  | "pink"
  | "grayBlue"
  | "warmPink"
  | "deepBlue"
  | "darkNight"
  | "cream";

// Ensure the ThemeOptions array is correctly typed
export const ThemeOptions: ThemeName[] = [
  "green",
  "blue",
  "lavender",
  "beige",
  "pink",
  "grayBlue",
  "warmPink",
  "deepBlue",
  "darkNight",
  "cream",
];

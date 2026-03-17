import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  devTools: true,
  reducer: {
    user: userReducer,
  },
});

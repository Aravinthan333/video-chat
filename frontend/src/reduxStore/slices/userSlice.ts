import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: number;
  googleId: string;
  name: string;
  email: string;
  diaplayName: string;
}
const initialState: User = {
  id: 0,
  googleId: "",
  name: "",
  email: "",
  diaplayName: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("action",action)
      state.id = action.payload.id;
      state.googleId = action.payload.googleId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.diaplayName = action.payload.avatar;
    },
    removeUser: (state) => {
      state.id = 0;
      state.googleId = "";
      state.name = "";
      state.email = "";
      state.diaplayName = "";
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

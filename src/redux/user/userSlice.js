import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  cart: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    signInFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutStart: (state) => {
      state.loading = true;
    },
    signOutSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    signOutFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    updateFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    addMore: (state, action) => {
      const itemIndex = state.cart.findIndex(
        (item) => item.name === action.payload
      );
      ++state.cart[itemIndex].amount;
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.cart.findIndex(
        (item) => item.name === action.payload
      );
      if (state.cart[itemIndex].amount === 1) state.cart.splice(itemIndex, 1);
      else --state.cart[itemIndex].amount;
    },
    deleteWholeCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  signInFail,
  signInStart,
  signInSuccess,
  signOutStart,
  signOutSuccess,
  signOutFail,
  updateStart,
  updateSuccess,
  updateFail,
  addToCart,
  addMore,
  removeFromCart,
  deleteWholeCart,
} = userSlice.actions;

export default userSlice.reducer;

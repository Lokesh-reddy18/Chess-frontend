import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  status: false,
  userData: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      // Make sure we're properly updating the state with all user data
      state.status = true
      state.userData = action.payload
      // Log the state update for debugging
      console.log("Auth state updated:", { status: true, userData: action.payload })
    },
    logout: (state) => {
      state.status = false
      state.userData = null
    },
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer


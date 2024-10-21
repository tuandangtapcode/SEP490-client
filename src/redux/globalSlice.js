import { createSlice } from '@reduxjs/toolkit'

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    user: {},
    isLogin: false,
    listSystemKey: [],
    profitPercent: 0
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload
    },
    setListSystemKey: (state, action) => {
      state.listSystemKey = action.payload
    },
    setProfitPercent: (state, action) => {
      state.profitPercent = action.payload
    }
  }
})

export default globalSlice

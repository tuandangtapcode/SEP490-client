import { createSlice } from '@reduxjs/toolkit'

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    user: {},
    isLogin: false,
    isCheckAuth: false,
    listSystemKey: [],
    profitPercent: 0,
    routerBeforeLogin: "",
    listTabs: []
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload
    },
    setIsCheckAuth: (state, action) => {
      state.isCheckAuth = action.payload
    },
    setListSystemKey: (state, action) => {
      state.listSystemKey = action.payload
    },
    setProfitPercent: (state, action) => {
      state.profitPercent = action.payload
    },
    setRouterBeforeLogin: (state, action) => {
      state.routerBeforeLogin = action.payload
    },
    setListTabs: (state, action) => {
      state.listTabs = action.payload
    }
  }
})

export default globalSlice

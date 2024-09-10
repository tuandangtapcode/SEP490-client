// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import "./assets/sass/index.scss"
import 'react-toastify/dist/ReactToastify.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
// const clientIdLocal = "343060988584-3p4dfhskci0qeprij8gj9lnbj089idb7.apps.googleusercontent.com"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="343060988584-3p4dfhskci0qeprij8gj9lnbj089idb7.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </BrowserRouter>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from "react-redux"
import { store } from './redux/store.js'

// ✅ Automatically switch between local and deployed backend
export const serverUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000" // your local backend
    : "https://chat-app-sigma-ten-72.vercel.app/";
createRoot(document.getElementById('root')).render(
<BrowserRouter>
<Provider store={store}>
    <App />
</Provider>
</BrowserRouter>
 
)

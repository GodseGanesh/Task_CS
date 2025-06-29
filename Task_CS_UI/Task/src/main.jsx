import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Route,BrowserRouter, Routes } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Logout from './Logout.jsx';


createRoot(document.getElementById('root')).render(

  <StrictMode>
     <BrowserRouter>
    <Routes>
      <Route path='/' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/logout' element={<Logout />} />
      <Route path='/messages' element={<App />} />
      

    </Routes>
    </BrowserRouter>
  </StrictMode>
,
)

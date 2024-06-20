import './App.css'
import Index from './components/Index'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/Login';
import Template from './components/Template';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Index/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

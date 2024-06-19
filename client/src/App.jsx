import './App.css'
import Index from './components/Index'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/Login';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Index/>}/>
      {/* <Route element={<Protected />}> */}
      <Route path='/login' element={<Login/>}/>
      {/* </Route> */}
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

import Cookies from 'js-cookie';
import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

export default function Protected({child}:any) {

    const navigate = useNavigate();
    const isLogged=Cookies.get("isLogged")
    
  return  isLogged? (
    <Outlet/>
  ):(
    <Navigate to = "/login"/>
  )
}
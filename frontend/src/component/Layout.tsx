import { ReactElement } from "react";
import Signin from '../pages/Register';
import Login from '../pages/Login';
import { PrivateRoutes } from './PrivateRoutes';
import { Header } from './Header';
import { CreateSpace } from '../pages/CreateSpace'
import { Dashboard } from "../pages/Dashboard";
import { BrowserRouter as Router,Routes,Route,useLocation} from 'react-router-dom'
import { PageNotFound } from "../pages/PageNotFound";
import { useRecoilValue } from "recoil";
import { PublishedState } from "../store/atoms";

export function Layout():ReactElement{
  const authtoken = localStorage.getItem("AccessToken")
  const {Published} = useRecoilValue(PublishedState)
  const location = useLocation()
  const header = ['/dashboard']
  const Paths = ['/signup','/login','/createspace',"/dashboard",'/']
  
  authtoken ? header.push("/") : null
  Published ? header.splice(0,1) :null
    return (
      <>
        {!Paths.includes(location.pathname) ? <PageNotFound /> : null}
        {header.includes(location.pathname) ? <Header /> : null}
          <Routes>
            <Route element={authtoken ? <Dashboard /> : <Login />} path="/" />
            <Route element={<Signin />} path="/signup" />
            <Route element={<Login />} path="/login" />
            <Route element={<PrivateRoutes />}>
              <Route path="/createspace" element={<CreateSpace />} />
              <Route element={<Dashboard />} path="/dashboard"></Route>
            </Route>
          </Routes>
      </>
    );
}
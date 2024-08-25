import { ReactElement } from "react";
import Signin from '../pages/Register';
import Login from '../pages/Login';
import { PrivateRoutes } from './PrivateRoutes';
import { Header } from './Header';
import { CreateSpace } from '../pages/CreateSpace'
import { Dashboard } from "../pages/Dashboard";
import { BrowserRouter as Router,Routes,Route,useMatch} from 'react-router-dom'
import { PageNotFound } from "../pages/PageNotFound";
import { useRecoilValue } from "recoil";
import { EditFormModal, PublishedState } from "../store/atoms";
import { SubmitReview } from "../pages/SubmitReview";
import { Reviews } from "../pages/Reviews";

export function Layout():ReactElement{
  const authtoken = localStorage.getItem("AccessToken")
  const {Published} = useRecoilValue(PublishedState)
  const  editModal  = useRecoilValue(EditFormModal)
  const header = ['/dashboard']
  const matchfordashboard = useMatch('/dashboard')
  const matchforproduct = useMatch('/products/:spacelink')
  const matchforentry = useMatch("/")
  
  const showHeader =Published || !authtoken ? false : matchfordashboard ||editModal ? false:  matchforproduct || matchforentry
  authtoken ? header.push("/") : null
  Published ? header.splice(0,1) :null
    return (
      <>
        {showHeader && <Header /> }
          <Routes>
            <Route element={<PageNotFound/>} path="*" />
            <Route element={authtoken ? <Dashboard /> : <Login />} path="/" />
            <Route element={<Signin />} path="/signup" />
            <Route element={<Login />} path="/login" />
            <Route element={<SubmitReview/>} path={`/review/:spacelink`} /> 
            <Route element={<PrivateRoutes />}>
              <Route path="/createspace" element={<CreateSpace />} />
              <Route element={<Dashboard />} path="/dashboard"></Route>
              <Route element={<Reviews/>} path={`/products/:spaceLink`}/>
            </Route>
          </Routes>
      </>
    );
}
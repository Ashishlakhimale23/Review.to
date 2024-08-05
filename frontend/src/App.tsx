import './App.css'
import { CreateSpace } from './pages/CreateSpace'
import { RecoilRoot } from "recoil"
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Signin from './pages/Register';
import Login from './pages/Login';
import { PrivateRoutes } from './component/PrivateRoutes';
function App() {

  return (
    <>
      <RecoilRoot>
         <Router>
          <Routes>
            <Route element={<Signin/>} path='/signup' />          
            <Route element={<Login/>} path='/login'/>
            <Route element={<PrivateRoutes/>}>
                  <Route element={<CreateSpace/>} path='/createspace' />
            </Route>
          </Routes>
         </Router>
      </RecoilRoot>
    </>
  );
}

export default App

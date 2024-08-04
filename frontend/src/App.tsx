import './App.css'
import { CreateSpace } from './pages/CreateSpace'
import { RecoilRoot } from "recoil"
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Signin from './pages/Register';
import Login from './pages/Login';
function App() {

  return (
    <>
      <RecoilRoot>
         <Router>
          <Routes>
            <Route element={<Signin/>} path='/signup' />          
            <Route element={<Login/>} path='/login'/>
          </Routes>
         </Router>
      </RecoilRoot>
    </>
  );
}

export default App

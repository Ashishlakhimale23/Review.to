import './App.css'
import { CreateSpace } from './component/CreateSpace'
import { RecoilRoot } from "recoil"
function App() {

  return (
    <>
      <RecoilRoot>
        <CreateSpace />
      </RecoilRoot>
    </>
  );
}

export default App

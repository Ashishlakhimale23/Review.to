import './App.css'
import { RecoilRoot } from "recoil"
import { BrowserRouter as Router} from 'react-router-dom';
import { Layout } from './component/Layout';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {

  const queryClient = new QueryClient() 
  return (
    <>
      <RecoilRoot>
        <Router>
          <QueryClientProvider client={queryClient}>
            <Layout />
          </QueryClientProvider>
        </Router>
      </RecoilRoot>
      <ToastContainer theme='dark'/>
    </>
  );
}

export default App

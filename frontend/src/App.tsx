import './App.css'
import { RecoilRoot } from "recoil"
import { BrowserRouter as Router} from 'react-router-dom';
import { Layout } from './component/Layout';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

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
    </>
  );
}

export default App

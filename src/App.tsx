import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { Layout } from './components/pages';
import { About, Home, NotFound } from './components/pages';
import { useArweave, useWalletAddress } from './hooks/';
import './index.css';



function App() {

  useArweave();

  const { wallet, walletAddress } = useWalletAddress();

  const router = createHashRouter(
    createRoutesFromElements(
      <Route element={<Layout />} errorElement={<NotFound />}>
        <Route
          index
          element={<Home />}
        />
        <Route path="info" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  );

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App

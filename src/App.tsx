import { App as KonstaApp } from 'konsta/react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home.tsx';
import ItemDetail from './pages/ItemDetail.tsx';
import Cart from './pages/Cart.tsx';
import Admin from './pages/Admin.tsx';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="popLayout">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
};

import { CartProvider } from './context/CartContext.tsx';
import { MenuProvider } from './context/MenuContext.tsx';

function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <KonstaApp theme="ios" safeAreas>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </KonstaApp>
      </CartProvider>
    </MenuProvider>
  );
}

export default App;

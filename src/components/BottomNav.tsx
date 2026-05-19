import { ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, total } = useCart();
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Do not show the bar on the cart page itself, or when the cart is empty
  if (location.pathname === '/cart' || totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] p-4 pb-safe z-50 animate-fade-in flex justify-center">
      <button
        onClick={() => navigate('/cart')}
        className="w-full max-w-lg bg-primary hover:bg-primary/95 text-white py-3.5 px-5 rounded-2xl font-black flex items-center justify-between shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all border-0 cursor-pointer text-base"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
              {totalItems}
            </span>
          </div>
          <span className="tracking-wide">Confirmar Pedido</span>
        </div>
        <span className="font-extrabold text-sm bg-white/20 px-3 py-1 rounded-xl">
          S/ {total.toFixed(2)}
        </span>
      </button>
    </div>
  );
}

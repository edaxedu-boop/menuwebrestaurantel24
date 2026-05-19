import { Tabbar, TabbarLink, Icon } from 'konsta/react';
import { Home as HomeIcon, ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isHome = location.pathname === '/';
  const isCart = location.pathname === '/cart';

  return (
    <Tabbar
      // @ts-ignore
      translucent={false}
      // @ts-ignore
      colors={{
        bgIos: 'bg-white',
        bgMaterial: 'bg-white'
      }}
      className="shadow-[0_-4px_16px_rgba(0,0,0,0.06)] border-t border-gray-100/50 pb-safe left-0 bottom-0 fixed w-full z-50"
    >
      <TabbarLink
        active={isHome}
        onClick={() => navigate('/')}
        // @ts-ignore
        colors={{
          textIos: 'text-gray-400',
          textActiveIos: 'text-primary',
          textMaterial: 'text-gray-400',
          textActiveMaterial: 'text-primary',
          iconBgActiveMaterial: 'bg-primary/10'
        }}
        icon={
          <Icon
            ios={<HomeIcon className="w-6 h-6" />}
            material={<HomeIcon className="w-6 h-6" />}
          />
        }
        label="Inicio"
      />
      <TabbarLink
        active={isCart}
        onClick={() => navigate('/cart')}
        // @ts-ignore
        colors={{
          textIos: 'text-gray-400',
          textActiveIos: 'text-primary',
          textMaterial: 'text-gray-400',
          textActiveMaterial: 'text-primary',
          iconBgActiveMaterial: 'bg-primary/10'
        }}
        icon={
          <Icon
            ios={
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
            }
            material={
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
            }
          />
        }
        label="Carrito"
      />
    </Tabbar>
  );
}

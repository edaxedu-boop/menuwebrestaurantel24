import { useState } from 'react';
import { Page, Navbar, Block, Button, Link } from 'konsta/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Trash2, Plus, Minus, Printer } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { usePrinter } from '../context/PrinterContext.tsx';
import BottomNav from '../components/BottomNav.tsx';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, total, clearCart, addToCart, updateQuantity } = useCart();
  const { printReceipt } = usePrinter();

  const [isPrinting, setIsPrinting] = useState(false);

  const handleCheckout = async () => {
    setIsPrinting(true);
    const success = await printReceipt(cart, total);
    if (success) {
      setTimeout(() => {
        clearCart();
        setIsPrinting(false);
        navigate('/');
      }, 3000);
    } else {
      setIsPrinting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="h-full w-full"
    >
      <Page colors={{ bgIos: 'bg-white', bgMaterial: 'bg-white' }}>
        <Navbar
          title="Tu Pedido"
          colors={{
            bgIos: 'bg-white border-b border-gray-100',
            bgMaterial: 'bg-white border-b border-gray-100',
            textIos: 'text-gray-900 font-bold',
            textMaterial: 'text-gray-900 font-bold',
          }}
          left={
            <Link onClick={() => navigate(-1)} navbar className="text-primary flex items-center gap-1 font-semibold">
              <ChevronLeft className="w-6 h-6" />
              Atrás
            </Link>
          }
        />

        {cart.length === 0 ? (
          <Block className="text-center mt-20 text-gray-500">
            <p className="text-xl mb-4 font-semibold">Tu carrito está vacío</p>
            <Button onClick={() => navigate('/')} clear className="text-primary font-bold">Volver al Menú</Button>
          </Block>
        ) : (
          <>
            {/* Lista Premium de Platos en el Carrito */}
            <div className="space-y-4 px-4 mt-5">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex gap-3.5 items-center">
                  {/* Imagen del plato */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Detalles y Controles */}
                  <div className="flex-grow flex flex-col justify-between h-20">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{item.name}</h3>
                      <span className="text-xs text-gray-400 font-medium">S/ {item.price.toFixed(2)} c/u</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      {/* Controles de cantidad */}
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-2.5 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="text-gray-500 p-0.5 hover:text-red-500 active:scale-90 transition-transform cursor-pointer border-0 bg-transparent flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-sm text-gray-800 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="text-gray-500 p-0.5 hover:text-emerald-500 active:scale-90 transition-transform cursor-pointer border-0 bg-transparent flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {/* Subtotal del plato */}
                      <span className="font-extrabold text-primary text-sm">S/ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 p-1.5 transition flex-shrink-0 self-start cursor-pointer border-0 bg-transparent flex items-center justify-center"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen de Costos y Botón Confirmar */}
            <div className="mt-8 px-4 pb-24">
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span>Productos ({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex justify-between items-center text-lg font-black text-gray-900">
                  <span>Total a Pagar</span>
                  <span className="text-primary text-xl">S/ {total.toFixed(2)}</span>
                </div>
              </div>
              <Button large onClick={handleCheckout} className="w-full shadow-lg font-bold bg-primary text-white rounded-xl py-4 h-auto text-base">
                Confirmar Pedido
              </Button>
            </div>
          </>
        )}
        <BottomNav />
      </Page>

      {/* Pantalla de Impresión en curso */}
      {isPrinting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md font-sans">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner mb-6 animate-pulse">
            <Printer className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Imprimiendo Pedido...</h2>
          <p className="text-slate-500 font-extrabold text-base tracking-wide">¡Gracias por su pedido!</p>
          <div className="mt-8 flex gap-1.5 justify-center">
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-75"></span>
            <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce delay-150"></span>
            <span className="w-2.5 h-2.5 bg-primary/30 rounded-full animate-bounce delay-225"></span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

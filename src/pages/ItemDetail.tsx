import { useState } from 'react';
import { Page, Navbar, Block, Button, Link } from 'konsta/react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import { useMenu } from '../context/MenuContext.tsx';
import { useCart } from '../context/CartContext.tsx';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { menuItems } = useMenu();

  const item = menuItems.find((i) => i.id === id);

  if (!item) {
    return (
      <Page colors={{ bgIos: 'bg-white', bgMaterial: 'bg-white' }}>
        <Navbar title="No encontrado" left={<Link onClick={() => navigate(-1)}>Volver</Link>} />
        <Block>Item no encontrado</Block>
      </Page>
    );
  }

  const handleAdd = () => {
    addToCart(item, quantity);
    navigate(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.12 }}
      className="h-full bg-white w-full"
    >
      <Page colors={{ bgIos: 'bg-white', bgMaterial: 'bg-white' }}>
        <Navbar
          title={item.name}
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

        <div className="max-w-5xl mx-auto p-0 md:px-6 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
            {/* Columna Izquierda: Imagen */}
            <div className="w-full aspect-square overflow-hidden relative bg-gray-50 md:rounded-3xl shadow-sm border border-gray-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent md:hidden"></div>
              <h1 className="absolute bottom-5 left-5 text-white text-2xl font-black tracking-tight pr-5 drop-shadow-sm md:hidden">{item.name}</h1>
            </div>

            {/* Columna Derecha: Detalles del Plato */}
            <div className="p-4 md:p-0 flex flex-col h-full justify-between pb-32 md:pb-0">
              <div>
                <h1 className="hidden md:block text-3xl font-black text-gray-900 mb-4 tracking-tight leading-none">{item.name}</h1>
                
                <div className="flex justify-between items-center mb-5 md:mt-2">
                  <span className="text-2xl md:text-3xl font-black text-primary">S/ {item.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-gray-500 hover:text-red-500 active:scale-90 transition-transform cursor-pointer border-0 bg-transparent flex items-center justify-center"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-extrabold text-lg w-6 text-center text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-gray-500 hover:text-emerald-500 active:scale-90 transition-transform cursor-pointer border-0 bg-transparent flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {item.description && (
                  <div className="bg-gray-50/50 md:bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-5">
                    <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">Descripción del Plato</h3>
                    <p className="text-gray-500 text-base leading-relaxed font-medium">{item.description}</p>
                  </div>
                )}
              </div>

              {/* Botón de añadir en versión escritorio */}
              <div className="hidden md:block mt-4">
                <Button
                  large
                  onClick={handleAdd}
                  className="w-full shadow-lg font-bold bg-primary text-white rounded-full py-4 h-auto text-base hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  Añadir al Pedido • S/ {(item.price * quantity).toFixed(2)}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de añadir flotante para versión móvil */}
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 pb-safe z-30 md:hidden">
          <Button
            large
            onClick={handleAdd}
            className="w-full shadow-lg font-bold bg-primary text-white rounded-full py-4 h-auto text-base hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Añadir S/ {(item.price * quantity).toFixed(2)}
          </Button>
        </div>
      </Page>
    </motion.div>
  );
}

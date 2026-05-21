import React, { useState } from 'react';
import { Page } from 'konsta/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronLeft, ShoppingCart, Printer } from 'lucide-react';
import { useMenu } from '../context/MenuContext.tsx';
import BottomNav from '../components/BottomNav.tsx';
import { usePrinter } from '../context/PrinterContext.tsx';

export default function Home() {
  const { categories, menuItems } = useMenu();
  const [activeCategory, setActiveCategory] = useState('inicio');
  const navigate = useNavigate();
  const { printReceipt } = usePrinter();
  const [isPrinting, setIsPrinting] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setIsPrinting(true);
    
    // Print this single product immediately
    await printReceipt([{ ...item, quantity: 1 }], item.price);
    
    setTimeout(() => {
      setIsPrinting(false);
    }, 2500);
  };

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="h-full w-full"
    >
      <Page colors={{ bgIos: 'bg-white', bgMaterial: 'bg-white' }}>
        {/* Portada y Perfil del Restaurante - Solo visible en Inicio */}
        {activeCategory === 'inicio' && (
          <div className="w-full relative">
            {/* Imagen de Portada */}
            <div className="h-44 w-full relative bg-gray-200 overflow-hidden">
              <img
                src="https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/DJygTkLdmOw2UcPCFGlU.gif"
                alt="Portada del Restaurante"
                className="w-full h-full object-cover"
              />
              {/* Gradiente de sombra sobre la portada */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/65"></div>
              
              {/* Botón transparente para el Panel Admin */}
              <button
                onClick={() => navigate('/admin')}
                className="absolute top-4 right-4 z-30 w-11 h-11 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer border-0 active:scale-95 shadow-sm"
                title="Panel de Control"
              >
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </button>
            </div>

            {/* Información del Restaurante (Perfil e Info Centrados que traslapan) */}
            <div className="px-4 pb-5 flex flex-col items-center -mt-12 relative z-10 text-center">
              {/* Foto de Perfil Circular */}
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex-shrink-0">
                <img
                  src="https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/ASMXWoNF8X10q4sd36fh/pub/PaMOLGOaGKmyQKBsJBYo.png"
                  alt="Logo del Restaurante"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nombre y Especialidad */}
              <div className="mt-3">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Restaurant El 24</h1>
                <p className="text-xs text-primary font-bold mt-2 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  -Parrillas criollos y chifa
                </p>
              </div>

              {/* Redes Sociales */}
              <div className="flex justify-center gap-3 mt-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="https://wa.me/51999999999"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Contenido Principal */}
        {activeCategory === 'inicio' ? (
          /* VISTA INICIO: Solo Categorías en un Grid de 2 Columnas */
          <div className="px-4 py-6 pb-24">
            <h2 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Nuestras Categorías</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {categories.map((cat) => {
                const catImage = cat.image;

                // Contar cantidad de platos en esta categoría
                const itemCount = menuItems.filter(item => item.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="w-full relative aspect-square rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-end text-left active:scale-95 transition-transform group cursor-pointer border-0 p-0"
                  >
                    {/* Imagen de fondo de la categoría */}
                    <img
                      src={catImage}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Overlay oscuro para legibilidad del texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                    
                    {/* Información de la categoría */}
                    <div className="p-4 relative z-10">
                      <h3 className="font-extrabold text-white text-base leading-tight tracking-wide">{cat.name}</h3>
                      <p className="text-xs text-white/70 font-semibold mt-1">{itemCount} platos</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* VISTA CATEGORÍA FILTRADA: Grid tradicional de 2 columnas */
          <div className="px-4 pt-4 pb-24 min-h-screen bg-white">
            {/* Header Limpio con Botón Volver */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
              <button
                onClick={() => setActiveCategory('inicio')}
                className="text-primary text-sm font-bold flex items-center gap-1 active:scale-95 transition-transform border-0 bg-transparent cursor-pointer py-1"
              >
                <ChevronLeft className="w-5 h-5" />
                Volver
              </button>
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                {categories.find(c => c.id === activeCategory)?.name}
              </h2>
              <button
                onClick={() => navigate('/admin')}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-250 text-slate-700 flex items-center justify-center transition-all cursor-pointer border-0 active:scale-95 shadow-sm"
                title="Panel de Control"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col active:scale-[0.99] transition-transform"
                >
                  <div className="w-full pt-[100%] relative bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-1.5">
                      <span className="font-black text-primary text-base whitespace-nowrap">S/ {item.price.toFixed(2)}</span>
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="bg-primary text-white text-xs font-black px-4 py-2.5 rounded-full flex items-center gap-1.5 hover:scale-[1.05] active:scale-95 transition-all shadow-sm cursor-pointer border-0 whitespace-nowrap flex-shrink-0"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Añadir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <BottomNav />
      </Page>

      {/* Pantalla de Impresión en curso */}
      {isPrinting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md font-sans animate-fade-in">
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

import { useState } from 'react';
import { Page, Navbar, Block, Button, Link } from 'konsta/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Trash2, Plus, Minus, Printer } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import BottomNav from '../components/BottomNav.tsx';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, total, clearCart, addToCart, updateQuantity } = useCart();

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return false;

    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const itemsHtml = cart.map(item => `
      <tr>
        <td style="font-weight: bold; padding: 4px 0;">${item.quantity}</td>
        <td style="padding: 4px 0;">${item.name}</td>
        <td style="font-weight: bold; text-align: right; padding: 4px 0;">S/ ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <meta charset="utf-8">
          <title>Ticket - Restaurant El 24</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 72mm;
              margin: 0;
              padding: 5mm 3mm;
              color: #000;
              font-size: 13px;
              line-height: 1.4;
              background: #fff;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            .restaurant-title {
              font-size: 19px;
              font-weight: 900;
              margin: 0;
              letter-spacing: 0.5px;
            }
            .restaurant-subtitle {
              font-size: 11px;
              margin: 2px 0 0 0;
              text-transform: uppercase;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .info-block {
              font-size: 12px;
              margin: 8px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
            }
            .info-label { font-weight: bold; }
            .items-table {
              width: 100%;
              border-collapse: collapse;
            }
            .items-table th {
              border-bottom: 1px dashed #000;
              font-size: 12px;
              padding-bottom: 5px;
              font-weight: bold;
            }
            .items-table td {
              padding: 4px 0;
              font-size: 13px;
              vertical-align: top;
            }
            .total-container {
              margin-top: 8px;
              padding-top: 5px;
              font-size: 15px;
              font-weight: bold;
            }
            .footer-text {
              font-size: 11px;
              margin-top: 25px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
          </style>
        </head>
        <body>
          <div class="text-center">
            <h2 class="restaurant-title">RESTAURANT EL 24</h2>
            <p class="restaurant-subtitle">Parrillas, Criollos y Chifa</p>
            <p style="font-size: 9px; margin: 3px 0 0 0; color: #555;">Av. Principal S/N - Pedidos Online</p>
          </div>
          
          <div class="divider"></div>
          
          <div class="info-block">
            <div class="info-row">
              <span class="info-label">FECHA:</span>
              <span>${dateStr}</span>
            </div>
            <div class="info-row">
              <span class="info-label">HORA:</span>
              <span>${timeStr}</span>
            </div>
            <div class="info-row">
              <span class="info-label">TIPO:</span>
              <span>TICKET DE CONTROL</span>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th class="text-left" style="width: 15%;">CANT</th>
                <th class="text-left" style="width: 60%;">PRODUCTO</th>
                <th class="text-right" style="width: 25%;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="divider"></div>
          
          <div class="total-container">
            <div class="info-row" style="font-size: 16px;">
              <span>TOTAL A PAGAR:</span>
              <span>S/ ${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="divider" style="border-top-style: dotted;"></div>
          
          <div class="text-center footer-text">
            <p class="bold">¡Muchas gracias por su compra!</p>
            <p style="font-size: 9px; margin-top: 5px; color: #444;">Vuelva pronto</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    return true;
  };

  const printDirectBluetooth = async () => {
    const characteristic = (window as any).printerCharacteristic;
    if (!characteristic) {
      alert("La impresora Bluetooth no está conectada. Por favor vincula tu impresora desde el Panel de Control.");
      return false;
    }

    try {
      const encoder = new TextEncoder();
      const bytes: number[] = [];
      const write = (str: string) => {
        const encoded = encoder.encode(str);
        bytes.push(...Array.from(encoded));
      };
      const cmd = (arr: number[]) => {
        bytes.push(...arr);
      };

      // ESC/POS Command stream for JP-80H
      cmd([0x1B, 0x40]); // Init
      cmd([0x1B, 0x61, 0x01]); // Center alignment
      cmd([0x1B, 0x21, 0x30]); // Double height/width font
      cmd([0x1B, 0x45, 0x01]); // Bold on
      write("RESTAURANT EL 24\n");
      
      cmd([0x1B, 0x21, 0x00]); // Normal size font
      cmd([0x1B, 0x45, 0x00]); // Bold off
      write("Parrillas, Criollos y Chifa\n");
      write("Av. Principal S/N - Pedidos Online\n");
      write("------------------------------------------------\n"); // 48 columns

      cmd([0x1B, 0x61, 0x00]); // Left alignment
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      write(`FECHA:   ${dateStr}\n`);
      write(`HORA:    ${timeStr}\n`);
      write("TIPO:    TICKET DE CONTROL\n");
      write("------------------------------------------------\n");

      write("CANT  PRODUCTO                           TOTAL  \n");
      write("------------------------------------------------\n");

      cart.forEach(item => {
        const qtyStr = item.quantity.toString().padEnd(6, ' ');
        const priceStr = `S/ ${(item.price * item.quantity).toFixed(2)}`;
        const maxProdLength = 48 - 6 - priceStr.length;
        
        let prodName = item.name;
        if (prodName.length > maxProdLength) {
          prodName = prodName.substring(0, maxProdLength - 3) + "...";
        }
        const paddedProdName = prodName.padEnd(maxProdLength, ' ');
        write(`${qtyStr}${paddedProdName}${priceStr}\n`);
      });

      write("------------------------------------------------\n");

      cmd([0x1B, 0x45, 0x01]); // Bold on
      const totalLabel = "TOTAL A PAGAR:";
      const totalValStr = `S/ ${total.toFixed(2)}`;
      const totalSpaces = 48 - totalLabel.length - totalValStr.length;
      write(`${totalLabel}${" ".repeat(totalSpaces)}${totalValStr}\n`);
      cmd([0x1B, 0x45, 0x00]); // Bold off

      write("------------------------------------------------\n");
      cmd([0x1B, 0x61, 0x01]); // Center alignment
      cmd([0x1B, 0x45, 0x01]); // Bold on
      write("¡Muchas gracias por su compra!\n");
      cmd([0x1B, 0x45, 0x00]); // Bold off
      write("Vuelva pronto\n\n\n\n\n");

      cmd([0x1D, 0x56, 0x41, 0x00]); // Paper Cut command

      const dataArray = new Uint8Array(bytes);

      // Send GATT payload in 20-byte chunks due to BLE channel limits
      const chunkSize = 20;
      for (let i = 0; i < dataArray.length; i += chunkSize) {
        const chunk = dataArray.slice(i, i + chunkSize);
        await characteristic.writeValue(chunk);
      }
      return true;
    } catch (err: any) {
      alert("Error al imprimir via Bluetooth: " + err.message);
      return false;
    }
  };

  const handleCheckout = async () => {
    const printerType = localStorage.getItem('el24_printer_type') || 'system';

    if (printerType === 'bluetooth') {
      const isConnected = !!(window as any).printerCharacteristic;
      if (!isConnected) {
        alert("La impresora Bluetooth no está conectada. Por favor ve al Panel de Control (Impresora) para vincularla.");
        return;
      }
      setIsPrinting(true);
      const success = await printDirectBluetooth();
      if (success) {
        setTimeout(() => {
          clearCart();
          setIsPrinting(false);
          navigate('/');
        }, 3000);
      } else {
        setIsPrinting(false);
      }
    } else {
      setIsPrinting(true);
      const success = handlePrint();
      if (success) {
        setTimeout(() => {
          clearCart();
          setIsPrinting(false);
          navigate('/');
        }, 3500);
      } else {
        setIsPrinting(false);
      }
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

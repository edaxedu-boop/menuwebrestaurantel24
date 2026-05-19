import { useState } from 'react';
import { Page, Navbar, Block, Button, Link } from 'konsta/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Trash2, Plus, Minus, X, Printer, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import BottomNav from '../components/BottomNav.tsx';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, total, clearCart, addToCart, updateQuantity } = useCart();

  // Checkout Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [printMethod, setPrintMethod] = useState<'normal' | 'bluetooth'>('normal');

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handlePrint = (name: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

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
              <span class="info-label">CLIENTE:</span>
              <span>${name.toUpperCase()}</span>
            </div>
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
  };

  const printDirectBluetooth = async (name: string) => {
    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error("No se pudo conectar al servidor GATT.");

      const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

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
      write(`CLIENTE: ${name.toUpperCase()}\n`);
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

      alert("¡Pedido impreso con éxito via Bluetooth!");
    } catch (err: any) {
      alert("Error al imprimir via Bluetooth: " + err.message);
    }
  };

  const sendToWhatsApp = () => {
    if (!customerName.trim()) {
      alert("Por favor, ingresa tu nombre.");
      return;
    }

    const itemsText = cart
      .map(item => `• ${item.quantity}x ${item.name} - S/ ${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    const whatsappText = `*🍔 NUEVO PEDIDO - RESTAURANT EL 24 🍔*
---------------------------------------
*Cliente:* ${customerName}
---------------------------------------
*Detalle del Pedido:*
${itemsText}
---------------------------------------
*Total a Pagar:* *S/ ${total.toFixed(2)}*

_¡Muchas gracias!_`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=51900900312&text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, '_blank');
    
    clearCart();
    setIsModalOpen(false);
    navigate('/');
  };

  const printReceipt = async () => {
    if (!customerName.trim()) {
      alert("Por favor, ingresa tu nombre.");
      return;
    }

    if (printMethod === 'bluetooth') {
      await printDirectBluetooth(customerName);
    } else {
      handlePrint(customerName);
    }
    
    clearCart();
    setIsModalOpen(false);
    navigate('/');
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

      {/* Modal de Confirmación de Pedido */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          {/* Fondo clickeable para cerrar */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Tarjeta del Modal */}
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col z-10 animate-slide-up">
            {/* Encabezado */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Confirmar Pedido</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-100 text-gray-500 hover:bg-gray-200 p-2 rounded-full border-0 cursor-pointer flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <div className="space-y-4 flex-grow mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 text-left">Tu Nombre</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 text-left">Método de Impresión</label>
                <div className="relative">
                  <select
                    value={printMethod}
                    onChange={(e) => setPrintMethod(e.target.value as 'normal' | 'bluetooth')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-900 font-bold focus:outline-none focus:border-primary focus:bg-white transition appearance-none cursor-pointer"
                  >
                    <option value="normal">🖨️ Sistema (Red / USB / Wi-Fi / Bluetooth)</option>
                    <option value="bluetooth">🔵 Bluetooth Directo ESC/POS (JP-80H)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <ChevronLeft className="w-4 h-4 -rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-3">
              <button
                onClick={sendToWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition border-0 cursor-pointer text-base shadow-md shadow-[#25D366]/20"
              >
                <MessageCircle className="w-5 h-5" />
                Enviar a WhatsApp
              </button>
              <button
                onClick={printReceipt}
                className="w-full bg-gray-100 text-gray-800 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition border-0 cursor-pointer text-base shadow-sm hover:bg-gray-200"
              >
                <Printer className="w-5 h-5" />
                Imprimir Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

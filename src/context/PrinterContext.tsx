import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface PrinterContextType {
  printerType: string;
  setPrinterType: (type: string) => void;
  bluetoothDeviceName: string;
  isBluetoothConnected: boolean;
  pairBluetooth: () => Promise<void>;
  printReceipt: (cart: any[], total: number) => Promise<boolean>;
  handleTestPrint: () => Promise<void>;
}

const PrinterContext = createContext<PrinterContextType | undefined>(undefined);

export const PrinterProvider = ({ children }: { children: ReactNode }) => {
  const [printerType, setPrinterTypeState] = useState(() => {
    return localStorage.getItem('el24_printer_type') || 'system';
  });
  const [bluetoothDeviceName, setBluetoothDeviceName] = useState(() => {
    return localStorage.getItem('el24_printer_name') || '';
  });
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(() => {
    return !!(window as any).printerCharacteristic;
  });

  const setPrinterType = (type: string) => {
    localStorage.setItem('el24_printer_type', type);
    setPrinterTypeState(type);
  };

  const pairBluetooth = async () => {
    try {
      if (!(navigator as any).bluetooth) {
        throw new Error("La API Web Bluetooth no está soportada o habilitada en este navegador.");
      }
      
      const commonServices = [
        '0000ffe0-0000-1000-8000-00805f9b34fb',
        '0000ae30-0000-1000-8000-00805f9b34fb',
        '49535343-fe7d-4ae5-8fa9-9fafd205e455',
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
        '000018f0-0000-1000-8000-00805f9b34fb'
      ];

      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: commonServices
      });

      alert(`Conectando a ${device.name || 'Impresora'}...`);
      const server = await device.gatt?.connect();
      if (!server) throw new Error("No se pudo conectar al servidor GATT.");

      let service = null;
      let characteristic = null;
      let connectedServiceUUID = '';
      let connectedCharacteristicUUID = '';

      const serviceMap = [
        {
          service: '0000ffe0-0000-1000-8000-00805f9b34fb',
          characteristic: '0000ffe1-0000-1000-8000-00805f9b34fb'
        },
        {
          service: '0000ae30-0000-1000-8000-00805f9b34fb',
          characteristic: '0000ae01-0000-1000-8000-00805f9b34fb'
        },
        {
          service: '49535343-fe7d-4ae5-8fa9-9fafd205e455',
          characteristic: '49535343-1e4d-4bd9-ba61-23c647249616'
        },
        {
          service: 'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
          characteristic: 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'
        },
        {
          service: '000018f0-0000-1000-8000-00805f9b34fb',
          characteristic: '00002af1-0000-1000-8000-00805f9b34fb'
        }
      ];

      for (const item of serviceMap) {
        try {
          console.log(`Intentando conectar al servicio: ${item.service}`);
          service = await server.getPrimaryService(item.service);
          characteristic = await service.getCharacteristic(item.characteristic);
          if (characteristic) {
            connectedServiceUUID = item.service;
            connectedCharacteristicUUID = item.characteristic;
            console.log(`¡Conectado con éxito al servicio ${item.service}!`);
            break;
          }
        } catch (e) {
          console.log(`Servicio ${item.service} no soportado.`);
        }
      }

      if (!characteristic) {
        // Descubrimiento genérico
        try {
          console.log("Intentando descubrir servicios de forma genérica...");
          const services = await server.getPrimaryServices();
          for (const s of services) {
            const characteristics = await s.getCharacteristics();
            for (const c of characteristics) {
              if (c.properties.write || c.properties.writeWithoutResponse) {
                service = s;
                characteristic = c;
                connectedServiceUUID = s.uuid;
                connectedCharacteristicUUID = c.uuid;
                console.log(`¡Servicio genérico encontrado! S: ${s.uuid}, C: ${c.uuid}`);
                break;
              }
            }
            if (characteristic) break;
          }
        } catch (e) {
          console.warn("Fallo el descubrimiento genérico:", e);
        }
      }

      if (!characteristic) {
        throw new Error("No se encontró ningún canal de escritura ESC/POS compatible en esta impresora.");
      }

      (window as any).printerDevice = device;
      (window as any).printerCharacteristic = characteristic;

      device.addEventListener('gattserverdisconnected', () => {
        setIsBluetoothConnected(false);
        (window as any).printerCharacteristic = null;
        alert("¡Impresora Bluetooth desconectada!");
      });

      localStorage.setItem('el24_printer_name', device.name || 'JP-80H');
      localStorage.setItem('el24_printer_service_uuid', connectedServiceUUID);
      localStorage.setItem('el24_printer_characteristic_uuid', connectedCharacteristicUUID);
      
      setBluetoothDeviceName(device.name || 'JP-80H');
      setIsBluetoothConnected(true);
      alert("¡Impresora vinculada y conectada con éxito!");
    } catch (err: any) {
      alert("Error al vincular: " + err.message);
    }
  };

  // Autoreconnect on reload/load
  useEffect(() => {
    const tryReconnect = async () => {
      if (printerType !== 'bluetooth') return;
      try {
        const navBluetooth = (navigator as any).bluetooth;
        if (navBluetooth && navBluetooth.getDevices) {
          const devices = await navBluetooth.getDevices();
          const savedName = localStorage.getItem('el24_printer_name');
          const device = devices.find((d: any) => d.name === savedName) || devices[0];
          
          if (device) {
            console.log("Intentando reconectar automáticamente a:", device.name);
            const server = await device.gatt.connect();
            
            const serviceUuid = localStorage.getItem('el24_printer_service_uuid') || '0000ffe0-0000-1000-8000-00805f9b34fb';
            const characteristicUuid = localStorage.getItem('el24_printer_characteristic_uuid') || '0000ffe1-0000-1000-8000-00805f9b34fb';

            const service = await server.getPrimaryService(serviceUuid);
            const characteristic = await service.getCharacteristic(characteristicUuid);
            
            (window as any).printerDevice = device;
            (window as any).printerCharacteristic = characteristic;

            device.addEventListener('gattserverdisconnected', () => {
              setIsBluetoothConnected(false);
              (window as any).printerCharacteristic = null;
            });

            setBluetoothDeviceName(device.name || 'JP-80H');
            setIsBluetoothConnected(true);
            console.log("¡Reconexión automática exitosa!");
          }
        }
      } catch (err) {
        console.warn("Reconexión automática silenciosa falló:", err);
      }
    };

    tryReconnect();
  }, [printerType]);

  const handlePrint = (cart: any[], total: number) => {
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

  const printDirectBluetooth = async (cart: any[], total: number) => {
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

  const printReceipt = async (cart: any[], total: number) => {
    if (printerType === 'bluetooth') {
      const isConnected = !!(window as any).printerCharacteristic;
      if (!isConnected) {
        alert("La impresora Bluetooth no está conectada. Por favor vincula tu impresora desde el Panel de Control.");
        return false;
      }
      return await printDirectBluetooth(cart, total);
    } else {
      return handlePrint(cart, total);
    }
  };

  const handleTestPrint = async () => {
    if (printerType === 'bluetooth') {
      const characteristic = (window as any).printerCharacteristic;
      if (!characteristic) {
        alert("La impresora Bluetooth no está conectada. Por favor vincula tu impresora.");
        return;
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

        cmd([0x1B, 0x40]); // Init
        cmd([0x1B, 0x61, 0x01]); // Center
        cmd([0x1B, 0x21, 0x10]); // Medium bold text
        cmd([0x1B, 0x45, 0x01]); // Bold on
        write("RESTAURANT EL 24\n");
        cmd([0x1B, 0x21, 0x00]); // Normal text
        cmd([0x1B, 0x45, 0x00]); // Bold off
        write("PRUEBA DE CONEXION DE IMPRESORA\n");
        write("------------------------------------------------\n");
        write("FECHA: " + new Date().toLocaleString() + "\n");
        write("Impresora JP-80H 80mm configurada OK!\n\n\n\n\n");
        cmd([0x1D, 0x56, 0x41, 0x00]); // Cut

        const dataArray = new Uint8Array(bytes);
        const chunkSize = 20;
        for (let i = 0; i < dataArray.length; i += chunkSize) {
          const chunk = dataArray.slice(i, i + chunkSize);
          await characteristic.writeValue(chunk);
        }
        alert("¡Ticket de prueba enviado!");
      } catch (err: any) {
        alert("Error al imprimir prueba: " + err.message);
      }
    } else {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      printWindow.document.write(`
        <html>
          <body style="font-family: monospace; width: 72mm; padding: 10px;">
            <h2 style="text-align: center; margin-bottom: 2px;">RESTAURANT EL 24</h2>
            <h3 style="text-align: center; margin-top: 2px;">PRUEBA DE IMPRESION</h3>
            <p>Impresora configurada correctamente por Sistema / Red / USB.</p>
            <p>Fecha: ${new Date().toLocaleString()}</p>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <PrinterContext.Provider value={{
      printerType,
      setPrinterType,
      bluetoothDeviceName,
      isBluetoothConnected,
      pairBluetooth,
      printReceipt,
      handleTestPrint
    }}>
      {children}
    </PrinterContext.Provider>
  );
};

export const usePrinter = () => {
  const context = useContext(PrinterContext);
  if (!context) throw new Error("usePrinter must be used within PrinterProvider");
  return context;
};

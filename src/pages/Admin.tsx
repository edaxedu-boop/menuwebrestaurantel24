import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { ArrowLeft, Eye, EyeOff, Plus, Trash2, LogOut, Coffee, Tag, DollarSign, ChevronDown, ChevronUp, Edit, Printer } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://restaurantel24.duckdns.org/api';

export default function Admin() {
  const navigate = useNavigate();
  const { categories, menuItems, addCategory, deleteCategory, updateCategory, addMenuItem, deleteMenuItem, updateMenuItem } = useMenu();

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('el24_admin_logged_in') === 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Category form states
  const [categoryName, setCategoryName] = useState('');
  const [categoryFile, setCategoryFile] = useState<File | null>(null);
  const [categoryFilePreview, setCategoryFilePreview] = useState<string>('');
  const [categorySuccess, setCategorySuccess] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [existingCategoryImageUrl, setExistingCategoryImageUrl] = useState<string>('');

  // Product form states
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productFilePreview, setProductFilePreview] = useState<string>('');
  const [productCategory, setProductCategory] = useState('');
  const [productSuccess, setProductSuccess] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [existingProductImageUrl, setExistingProductImageUrl] = useState<string>('');

  // Accordion state
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Tab state
  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'printer'>('products');

  // Printer configuration states
  const [printerType, setPrinterType] = useState(() => {
    return localStorage.getItem('el24_printer_type') || 'system';
  });
  const [bluetoothDeviceName, setBluetoothDeviceName] = useState(() => {
    return localStorage.getItem('el24_printer_name') || '';
  });
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(() => {
    return !!(window as any).printerCharacteristic;
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setIsLoggedIn(true);
        localStorage.setItem('el24_admin_logged_in', 'true');
        localStorage.setItem('el24_admin_token', data.token);
        setLoginError('');
      } else {
        setLoginError(data.error || 'Correo o contraseña incorrectos.');
      }
    } catch (err) {
      setLoginError('Error de conexión con el servidor.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('el24_admin_logged_in');
    localStorage.removeItem('el24_admin_token');
  };

  const handleCategoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCategoryFile(file);
      setCategoryFilePreview(URL.createObjectURL(file));
    }
  };

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductFile(file);
      setProductFilePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('el24_admin_token');
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Error al subir imagen');
    }
    const data = await res.json();
    return data.imageUrl;
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Por favor rellena todos los campos.');
      return;
    }
    try {
      let uploadedUrl = existingCategoryImageUrl;
      if (categoryFile) {
        uploadedUrl = await uploadImage(categoryFile);
      } else if (!editingCategoryId) {
        alert('Por favor selecciona una imagen para la categoría.');
        return;
      }

      if (editingCategoryId) {
        const success = await updateCategory(editingCategoryId, categoryName, uploadedUrl);
        if (success) {
          setCategoryName('');
          setCategoryFile(null);
          setCategoryFilePreview('');
          setEditingCategoryId(null);
          setExistingCategoryImageUrl('');
          setCategorySuccess('¡Categoría actualizada con éxito!');
          setTimeout(() => setCategorySuccess(''), 3000);
        }
      } else {
        const success = await addCategory(categoryName, uploadedUrl);
        if (success) {
          setCategoryName('');
          setCategoryFile(null);
          setCategoryFilePreview('');
          setCategorySuccess('¡Categoría agregada con éxito!');
          setTimeout(() => setCategorySuccess(''), 3000);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Error al guardar categoría.');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice || !productCategory) {
      alert('Por favor rellena todos los campos.');
      return;
    }
    const priceNum = parseFloat(productPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Por favor ingresa un precio válido.');
      return;
    }
    try {
      let uploadedUrl = existingProductImageUrl;
      if (productFile) {
        uploadedUrl = await uploadImage(productFile);
      } else if (!editingProductId) {
        alert('Por favor selecciona una imagen para el plato.');
        return;
      }

      if (editingProductId) {
        const success = await updateMenuItem(editingProductId, productName, priceNum, uploadedUrl, productCategory);
        if (success) {
          setExpandedCategories(prev => ({ ...prev, [productCategory]: true }));
          setProductName('');
          setProductPrice('');
          setProductFile(null);
          setProductFilePreview('');
          setEditingProductId(null);
          setExistingProductImageUrl('');
          setProductSuccess('¡Plato actualizado con éxito!');
          setTimeout(() => setProductSuccess(''), 3000);
        }
      } else {
        const success = await addMenuItem(productName, priceNum, uploadedUrl, productCategory);
        if (success) {
          setExpandedCategories(prev => ({ ...prev, [productCategory]: true }));
          setProductName('');
          setProductPrice('');
          setProductFile(null);
          setProductFilePreview('');
          setProductSuccess('¡Plato agregado con éxito!');
          setTimeout(() => setProductSuccess(''), 3000);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Error al guardar plato.');
    }
  };

  const handlePairBluetooth = async () => {
    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
      });

      alert(`Conectando a ${device.name || 'Impresora'}...`);
      const server = await device.gatt?.connect();
      if (!server) throw new Error("No se pudo conectar al servidor GATT.");

      const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

      (window as any).printerDevice = device;
      (window as any).printerCharacteristic = characteristic;

      device.addEventListener('gattserverdisconnected', () => {
        setIsBluetoothConnected(false);
        (window as any).printerCharacteristic = null;
        alert("¡Impresora Bluetooth desconectada!");
      });

      localStorage.setItem('el24_printer_name', device.name || 'JP-80H');
      setBluetoothDeviceName(device.name || 'JP-80H');
      setIsBluetoothConnected(true);
      alert("¡Impresora vinculada y conectada con éxito!");
    } catch (err: any) {
      alert("Error al vincular: " + err.message);
    }
  };

  const handleSavePrinterSettings = (type: string) => {
    localStorage.setItem('el24_printer_type', type);
    setPrinterType(type);
    alert("Configuración de impresora guardada con éxito.");
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none"></div>

        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors duration-200 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Menú</span>
        </button>

        <div className="w-full max-w-md bg-white border border-slate-150 rounded-3xl p-8 shadow-xl relative z-10 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-rose-500 flex items-center justify-center mx-auto shadow-lg shadow-primary/20 mb-4">
              <span className="text-white font-black text-2xl">24</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Control</h2>
            <p className="text-slate-500 text-sm mt-2">Inicia sesión para gestionar el menú</p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs px-4 py-3 rounded-xl mb-6 text-center font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-rose-500 hover:from-primary/95 hover:to-rose-500/95 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-primary/10 transition-all duration-200 text-sm tracking-wide mt-2"
            >
              Ingresar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none"></div>

      {/* Admin Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-rose-500 flex items-center justify-center shadow-md">
            <span className="text-white font-black text-lg">24</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Restaurant El 24</h1>
            <span className="text-xs text-slate-500 font-medium">Panel Administrativo</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="hidden sm:flex items-center gap-2 text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 rounded-xl px-4 py-2.5 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ver Menú Digital</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-4 py-2.5 transition-all shadow-md shadow-rose-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 relative z-10">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-200/80 p-1.5 rounded-2xl w-full max-w-lg mx-auto mb-8 border border-slate-350/20 shadow-inner">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'products'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-555 hover:text-slate-800'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Gestionar Platos</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'categories'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-555 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categorías</span>
          </button>
          <button
            onClick={() => setActiveTab('printer')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'printer'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-555 hover:text-slate-800'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Impresora</span>
          </button>
        </div>

        {/* Tab contents */}
        {activeTab === 'printer' ? (
          <div className="max-w-xl mx-auto w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-100/60 mt-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Configuración de Impresora</h3>
                <p className="text-slate-500 text-xs font-medium">JP-80H (Red / USB / Wi-Fi o Bluetooth Directo)</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 text-xs font-black uppercase tracking-wider mb-2.5">Tipo de Conexión</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSavePrinterSettings('system')}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      printerType === 'system'
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm shadow-primary/5'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 font-semibold'
                    }`}
                  >
                    <span className="block text-lg mb-1">🖥️ / 🔌</span>
                    <span className="text-xs">Sistema / Red / USB</span>
                  </button>
                  <button
                    onClick={() => handleSavePrinterSettings('bluetooth')}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      printerType === 'bluetooth'
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm shadow-primary/5'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 font-semibold'
                    }`}
                  >
                    <span className="block text-lg mb-1">🔵</span>
                    <span className="text-xs">Bluetooth Directo</span>
                  </button>
                </div>
                <p className="text-slate-450 text-[11px] font-medium leading-relaxed mt-2.5">
                  * **Sistema/Red/USB**: Utiliza el controlador del sistema. Recomendado si la JP-80H está conectada por red ethernet/Wi-Fi (IP) o USB a una computadora.<br/>
                  * **Bluetooth Directo**: Envía comandos directos ESC/POS desde el navegador usando Web Bluetooth.
                </p>
              </div>

              {printerType === 'bluetooth' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Estado de Conexión Bluetooth</h4>
                  
                  <div className="flex items-center justify-between bg-white border border-slate-150 rounded-xl p-3.5">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Dispositivo Vinculado</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                        {bluetoothDeviceName || 'Ninguna impresora vinculada'}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full ${
                      isBluetoothConnected
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isBluetoothConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                      {isBluetoothConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handlePairBluetooth}
                      className="flex-1 bg-gradient-to-tr from-primary to-rose-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98] border-0 cursor-pointer text-xs"
                    >
                      {bluetoothDeviceName ? 'Vincular Nuevamente' : 'Buscar y Vincular'}
                    </button>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-5">
                <button
                  onClick={handleTestPrint}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-4 rounded-xl transition-all border-0 cursor-pointer text-xs flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Probar Impresión de Ticket</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: FORMS */}
          <div className="lg:col-span-1">
            {activeTab === 'categories' ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-100/60 sticky top-24">
                <h3 className="text-xl font-black mb-5 flex items-center gap-2 text-slate-900">
                  {editingCategoryId ? <Edit className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                  <span>{editingCategoryId ? 'Modificar Categoría' : 'Añadir Categoría'}</span>
                </h3>

                {categorySuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs px-4 py-3 rounded-xl mb-5 font-semibold text-center animate-fade-in">
                    {categorySuccess}
                  </div>
                )}

                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">Nombre de la Categoría</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Parrillas o Postres"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-405"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">
                      Imagen de la Categoría {editingCategoryId && <span className="text-[9px] text-slate-400 font-normal capitalize">(opcional para mantener actual)</span>}
                    </label>
                    <div className="relative flex flex-col gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingCategoryId}
                        onChange={handleCategoryFileChange}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all file:mr-4 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                      {categoryFilePreview && (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm self-start">
                          <img src={categoryFilePreview} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    {editingCategoryId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategoryId(null);
                          setCategoryName('');
                          setCategoryFile(null);
                          setCategoryFilePreview('');
                          setExistingCategoryImageUrl('');
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all text-sm tracking-wide border-0 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-primary/10 transition-all text-sm tracking-wide border-0 cursor-pointer"
                    >
                      {editingCategoryId ? 'Guardar' : 'Guardar Categoría'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-100/60 sticky top-24">
                <h3 className="text-xl font-black mb-5 flex items-center gap-2 text-slate-900">
                  {editingProductId ? <Edit className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                  <span>{editingProductId ? 'Modificar Plato' : 'Añadir Plato'}</span>
                </h3>

                {productSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs px-4 py-3 rounded-xl mb-5 font-semibold text-center animate-fade-in">
                    {productSuccess}
                  </div>
                )}

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">Nombre del Plato</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Lomo Saltado Especial"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-405"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">Precio (S/)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        required
                        placeholder="10.00"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-405"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">Categoría</label>
                    <select
                      required
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
                    >
                      <option value="" className="text-slate-500">Selecciona categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="text-slate-900">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2">
                      Imagen del Plato {editingProductId && <span className="text-[9px] text-slate-400 font-normal capitalize">(opcional para mantener actual)</span>}
                    </label>
                    <div className="relative flex flex-col gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingProductId}
                        onChange={handleProductFileChange}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all file:mr-4 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                      {productFilePreview && (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm self-start">
                          <img src={productFilePreview} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    {editingProductId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProductId(null);
                          setProductName('');
                          setProductPrice('');
                          setProductFile(null);
                          setProductFilePreview('');
                          setExistingProductImageUrl('');
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all text-sm tracking-wide border-0 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-primary/10 transition-all text-sm tracking-wide border-0 cursor-pointer"
                    >
                      {editingProductId ? 'Guardar' : 'Guardar Plato'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* COLUMN 2 & 3: LISTINGS */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'categories' ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-100/60">
                <h3 className="text-xl font-black mb-6 text-slate-900 flex items-center justify-between">
                  <span>Categorías Existentes</span>
                  <span className="text-xs bg-slate-100 text-slate-555 px-3 py-1 rounded-full border border-slate-200/50">
                    {categories.length} categorías
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...categories].reverse().map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-slate-50/50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between group hover:border-slate-300 hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80';
                          }}
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{cat.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">id: {cat.id}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCategoryId(cat.id);
                            setCategoryName(cat.name);
                            setExistingCategoryImageUrl(cat.image);
                            setCategoryFilePreview(cat.image);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-slate-400 hover:text-primary hover:bg-slate-100 p-2 rounded-xl transition-all duration-200 border-0 bg-transparent cursor-pointer"
                          title="Editar categoría"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Estás seguro de eliminar la categoría "${cat.name}"?`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all duration-200 border-0 bg-transparent cursor-pointer"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-100/60">
                <h3 className="text-xl font-black mb-6 text-slate-900 flex items-center justify-between">
                  <span>Platos en el Menú</span>
                  <span className="text-xs bg-slate-100 text-slate-555 px-3 py-1 rounded-full border border-slate-200/50">
                    {menuItems.length} platos
                  </span>
                </h3>

                <div className="space-y-4">
                  {categories.map((cat) => {
                    const itemsInCat = menuItems.filter((i) => i.category === cat.id);
                    if (itemsInCat.length === 0) return null;
                    const isExpanded = !!expandedCategories[cat.id];

                    return (
                      <div key={cat.id} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                        {/* Header Collapsible Row */}
                        <button
                          onClick={() => toggleCategory(cat.id)}
                          className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/80 active:bg-slate-50 transition-all border-0 text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-150 shadow-sm bg-slate-100 flex-shrink-0">
                              <img src={cat.image} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                                {cat.name}
                              </h4>
                              <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 mt-1 inline-block">
                                {itemsInCat.length} {itemsInCat.length === 1 ? 'plato' : 'platos'}
                              </span>
                            </div>
                          </div>

                          <div className="text-slate-400 p-1.5 rounded-lg bg-slate-50 border border-slate-150">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {/* Collapsed/Expanded Dishes List */}
                        {isExpanded && (
                          <div className="p-4 border-t border-slate-150 bg-slate-50/50 space-y-2.5">
                            <div className="grid grid-cols-1 gap-2.5">
                              {[...itemsInCat].reverse().map((item) => (
                                <div
                                  key={item.id}
                                  className="bg-white border border-slate-150 p-3.5 rounded-xl flex items-center justify-between group hover:border-slate-350 hover:shadow-sm transition-all"
                                >
                                  <div className="flex items-center gap-3.5">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-12 h-12 rounded-xl object-cover border border-slate-150 bg-slate-100"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80';
                                      }}
                                    />
                                    <div>
                                      <p className="font-bold text-slate-800 text-sm leading-snug">{item.name}</p>
                                      <p className="text-xs text-emerald-600 font-extrabold mt-0.5">S/ {item.price.toFixed(2)}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => {
                                        setEditingProductId(item.id);
                                        setProductName(item.name);
                                        setProductPrice(item.price.toString());
                                        setProductCategory(item.category);
                                        setExistingProductImageUrl(item.image);
                                        setProductFilePreview(item.image);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                      className="text-slate-400 hover:text-primary hover:bg-slate-100 p-2 rounded-xl transition-all duration-200 border-0 bg-transparent cursor-pointer"
                                      title="Editar plato"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`¿Estás seguro de eliminar el plato "${item.name}"?`)) {
                                          deleteMenuItem(item.id);
                                        }
                                      }}
                                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all duration-200 border-0 bg-transparent cursor-pointer"
                                      title="Eliminar plato"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </main>
    </div>
  );
}

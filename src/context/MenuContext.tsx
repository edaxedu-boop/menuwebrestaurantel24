import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { categories as defaultCategories, menuItems as defaultMenuItems } from '../data/menu';
import type { Category, MenuItem } from '../data/menu';

interface MenuContextType {
  categories: Category[];
  menuItems: MenuItem[];
  addCategory: (name: string, image: string) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  addMenuItem: (name: string, price: number, image: string, category: string) => Promise<boolean>;
  deleteMenuItem: (id: string) => Promise<boolean>;
  refreshMenu: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const API_URL = 'https://restaurantel24.duckdns.org/api';

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);

  const refreshMenu = async () => {
    try {
      const resCat = await fetch(`${API_URL}/categories`);
      if (resCat.ok) {
        const dataCat = await resCat.json();
        if (Array.isArray(dataCat) && dataCat.length > 0) {
          setCategories(dataCat);
        }
      }

      const resMenu = await fetch(`${API_URL}/menu`);
      if (resMenu.ok) {
        const dataMenu = await resMenu.json();
        if (Array.isArray(dataMenu) && dataMenu.length > 0) {
          setMenuItems(dataMenu);
        }
      }
    } catch (err) {
      console.warn('Backend offline, using fallback menu data.', err);
    }
  };

  // Load from database on mount
  useEffect(() => {
    refreshMenu();
  }, []);

  const addCategory = async (name: string, image: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('el24_admin_token');
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, image })
      });
      
      if (!res.ok) {
        throw new Error('Error al añadir categoría');
      }

      const newCat = await res.json();
      setCategories(prev => [...prev, newCat]);
      return true;
    } catch (err) {
      console.error(err);
      alert('Error de conexión o permisos con el servidor de base de datos.');
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('el24_admin_token');
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Error al eliminar categoría');
      }

      setCategories(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      alert('Error de conexión o permisos con el servidor de base de datos.');
      return false;
    }
  };

  const addMenuItem = async (name: string, price: number, image: string, category: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('el24_admin_token');
      const res = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, price, image, category })
      });

      if (!res.ok) {
        throw new Error('Error al añadir plato');
      }

      const newItem = await res.json();
      setMenuItems(prev => [...prev, newItem]);
      return true;
    } catch (err) {
      console.error(err);
      alert('Error de conexión o permisos con el servidor de base de datos.');
      return false;
    }
  };

  const deleteMenuItem = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('el24_admin_token');
      const res = await fetch(`${API_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Error al eliminar plato');
      }

      setMenuItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      alert('Error de conexión o permisos con el servidor de base de datos.');
      return false;
    }
  };

  return (
    <MenuContext.Provider value={{ categories, menuItems, addCategory, deleteCategory, addMenuItem, deleteMenuItem, refreshMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within MenuProvider");
  return context;
};

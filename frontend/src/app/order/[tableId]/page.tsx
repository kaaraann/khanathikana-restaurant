'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { tableAPI, menuAPI, orderAPI } from '@/lib/api';
import NavigationBar from '@/components/NavigationBar';
import ResponsiveNavigationBar from '@/components/ResponsiveNavigationBar';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  available: boolean;
  isFavorite: boolean;
  imageUrl?: string;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

interface DeliveryInfo {
  customerName: string;
  phoneNumber: string;
  address: string;
  instructions: string;
  deliveryTime: string;
  deliveryFee: number;
}

interface OrderMode {
  type: 'DINE_IN' | 'DELIVERY' | 'PICKUP';
  label: string;
  icon: string;
}

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();
  const tableId = params.tableId as string;

  const [table, setTable] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderMode, setOrderMode] = useState<'DINE_IN' | 'DELIVERY' | 'PICKUP'>('DINE_IN');
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    customerName: '',
    phoneNumber: '',
    address: '',
    instructions: '',
    deliveryTime: 'ASAP',
    deliveryFee: 0
  });
  const [user, setUser] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingOrders, setExistingOrders] = useState<any[]>([]);
  const [showCompleteOrder, setShowCompleteOrder] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState<MenuItem[]>([]);
  const [editingPrice, setEditingPrice] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [runningStartTime, setRunningStartTime] = useState<number | null>(null);
  const [sessionStartTime] = useState<number>(Date.now()); // Track when this page session started
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editItemData, setEditItemData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  const [updatingItem, setUpdatingItem] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });
  const [addingCategory, setAddingCategory] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    show: boolean;
    itemType: 'menu' | 'category';
    itemId: number | null;
    itemName: string;
    categoryId?: number;
    categoryName?: string;
  }>({
    show: false,
    itemType: 'menu',
    itemId: null,
    itemName: ''
  });
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    available: true,
    isFavorite: false,
    imageUrl: ''
  });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
    onClose?: () => void
  }>({
    show: false,
    message: '',
    type: 'info',
    onClose: undefined
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', onClose?: () => void) => {
    setToast({ show: true, message, type, onClose });
  };

  // Loading skeleton component for database data loading
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-stone-200 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-stone-200 h-12 w-12 rounded-xl"></div>
            <div>
              <div className="bg-stone-200 h-6 w-32 rounded mb-2"></div>
              <div className="bg-stone-200 h-4 w-24 rounded"></div>
            </div>
          </div>
          <div className="bg-stone-200 h-10 w-24 rounded-xl"></div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-stone-200 h-6 w-12 rounded-lg"></div>
                  <div className="bg-stone-200 h-6 w-20 rounded-lg"></div>
                  <div className="bg-stone-200 h-4 w-16 rounded"></div>
                </div>
                <div className="bg-stone-200 h-8 w-20 rounded"></div>
              </div>
              <div className="space-y-2">
                {[1, 2].map((j) => (
                  <div key={j} className="flex justify-between items-center py-2 px-3 bg-stone-100/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-stone-200 h-8 w-8 rounded-full"></div>
                      <div>
                        <div className="bg-stone-200 h-4 w-24 rounded mb-1"></div>
                        <div className="bg-stone-200 h-3 w-16 rounded"></div>
                      </div>
                    </div>
                    <div className="bg-stone-200 h-4 w-12 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t-2 border-stone-200">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="bg-stone-200 h-4 w-20 rounded mb-1"></div>
                <div className="bg-stone-200 h-3 w-16 rounded"></div>
              </div>
              <div className="bg-stone-200 h-8 w-24 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const closeToast = () => {
    if (toast.onClose) {
      toast.onClose();
    }
    setToast({ show: false, message: '', type: 'info', onClose: undefined });
  };

  const getDefaultImage = (itemName: string) => {
    const name = itemName.toLowerCase();
    console.log(`Getting default image for: "${itemName}" -> "${name}"`);
    
    if (name.includes('chai') || name.includes('tea')) {
      const url = 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cda9?w=400&h=200&fit=crop&crop=center';
      console.log(`Tea/Chai detected, using: ${url}`);
      return url;
    } else if (name.includes('coffee')) {
      const url = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop&crop=center';
      console.log(`Coffee detected, using: ${url}`);
      return url;
    } else if (name.includes('lassi') || name.includes('mango')) {
      const url = 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=200&fit=crop&crop=center';
      console.log(`Lassi/Mango detected, using: ${url}`);
      return url;
    } else if (name.includes('limbu') || name.includes('paanii') || name.includes('thandai')) {
      const url = 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=200&fit=crop&crop=center';
      console.log(`Drink detected, using: ${url}`);
      return url;
    } else if (name.includes('virgin pina colada') || name.includes('pina colada')) {
      const url = 'https://images.unsplash.com/photo-1514362545857-3bc16c4284a7?w=400&h=200&fit=crop&crop=center';
      console.log(`Pina Colada detected, using: ${url}`);
      return url;
    } else if (name.includes('blue lagoon')) {
      const url = 'https://images.unsplash.com/photo-1546484396-fb3fc6f600c8?w=400&h=200&fit=crop&crop=center';
      console.log(`Blue Lagoon detected, using: ${url}`);
      return url;
    } else if (name.includes('mojito')) {
      const url = 'https://images.unsplash.com/photo-1546171757-f46d8d1a0e48?w=400&h=200&fit=crop&crop=center';
      console.log(`Mojito detected, using: ${url}`);
      return url;
    } else if (name.includes('mocktail') || name.includes('virgin')) {
      const url = 'https://images.unsplash.com/photo-1514362545857-3bc16c4284a7?w=400&h=200&fit=crop&crop=center';
      console.log(`Mocktail detected, using: ${url}`);
      return url;
    } else if (name.includes('cocktail')) {
      const url = 'https://images.unsplash.com/photo-1506721035901-b2075e3c798e?w=400&h=200&fit=crop&crop=center';
      console.log(`Cocktail detected, using: ${url}`);
      return url;
    } else if (name.includes('soft drink') || name.includes('coke') || name.includes('pepsi') || name.includes('sprite') || name.includes('soda')) {
      const url = 'https://images.unsplash.com/photo-1546484396-fb3fc6f600c8?w=400&h=200&fit=crop&crop=center';
      console.log(`Soft Drink detected, using: ${url}`);
      return url;
    } else if (name.includes('dal makhani') || name.includes('dal')) {
      const url = 'https://images.unsplash.com/photo-1563729781172-c65113915159?w=400&h=200&fit=crop&crop=center';
      console.log(`Dal Makhani detected, using: ${url}`);
      return url;
    } else if (name.includes('butter chicken') || name.includes('chicken')) {
      const url = 'https://images.unsplash.com/photo-1563729781172-c65113915159?w=400&h=200&fit=crop&crop=center';
      console.log(`Butter Chicken detected, using: ${url}`);
      return url;
    } else if (name.includes('dosa') || name.includes('tikka') || name.includes('curry') || name.includes('naan') || name.includes('rice') || name.includes('paneer') || name.includes('masala')) {
      const url = 'https://images.unsplash.com/photo-1678450143527-2e21c32087c9?w=400&h=200&fit=crop&crop=center';
      console.log(`Indian food detected, using: ${url}`);
      return url;
    } else if (name.includes('starter') || name.includes('appetizer')) {
      const url = 'https://images.unsplash.com/photo-1519677229234-f75b0377e8b9?w=400&h=200&fit=crop&crop=center';
      console.log(`Starter detected, using: ${url}`);
      return url;
    } else if (name.includes('main course') || name.includes('entree')) {
      const url = 'https://images.unsplash.com/photo-1563729781172-c65113915159?w=400&h=200&fit=crop&crop=center';
      console.log(`Main Course detected, using: ${url}`);
      return url;
    } else if (name.includes('dessert') || name.includes('sweet') || name.includes('ice cream') || name.includes('cake')) {
      const url = 'https://images.unsplash.com/photo-1551026044-63304a37829a?w=400&h=200&fit=crop&crop=center';
      console.log(`Dessert detected, using: ${url}`);
      return url;
    } else if (name.includes('bread') || name.includes('naan') || name.includes('roti')) {
      const url = 'https://images.unsplash.com/photo-1509440159596-0249088772ce?w=400&h=200&fit=crop&crop=center';
      console.log(`Bread detected, using: ${url}`);
      return url;
    } else {
      const url = 'https://images.unsplash.com/photo-1565958011703-d8d288d2994b?w=400&h=200&fit=crop&crop=center';
      console.log(`Generic food, using: ${url}`);
      return url;
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    loadData();
  }, [tableId, router]);

  // Clear timer when table becomes AVAILABLE
  useEffect(() => {
    if (table && table.status !== 'RUNNING') {
      const storageKey = `table_start_time_${tableId}`;
      localStorage.removeItem(storageKey);
      setRunningStartTime(null);
    }
  }, [table?.status, tableId]);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getElapsedTime = () => {
    if (!table || table.status !== 'RUNNING') return null;
    
    // Get stored start time from localStorage for this specific table
    const storageKey = `table_start_time_${tableId}`;
    let actualStartTime = runningStartTime;
    
    // Check if we have a stored start time in localStorage
    const storedStartTime = localStorage.getItem(storageKey);
    if (storedStartTime && !runningStartTime) {
      actualStartTime = parseInt(storedStartTime);
      setRunningStartTime(actualStartTime);
    }
    
    // If no stored time and not already set, initialize it now
    if (!actualStartTime) {
      actualStartTime = currentTime.getTime();
      setRunningStartTime(actualStartTime);
      localStorage.setItem(storageKey, actualStartTime.toString());
    }
    
    const runningTime = Math.floor((currentTime.getTime() - actualStartTime) / 1000);
    
    const hours = Math.floor(runningTime / 3600);
    const minutes = Math.floor((runningTime % 3600) / 60);
    const seconds = runningTime % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [tableRes, categoriesRes, ordersRes] = await Promise.all([
        tableAPI.getById(Number(tableId)),
        menuAPI.getCategories(),
        orderAPI.getByTable(Number(tableId)),
      ]);
      
      console.log("=== TABLE STATUS DEBUG ===");
      console.log("Table ID:", tableId);
      console.log("Table Response:", tableRes.data);
      console.log("Table Status:", tableRes.data.status);
      console.log("Table Status Type:", typeof tableRes.data.status);
      console.log("Is RUNNING?:", tableRes.data.status === 'RUNNING');
      console.log("========================");
      
      console.log("=== ORDERS API DEBUG ===");
      console.log("Orders API Response:", ordersRes);
      console.log("Orders Data:", ordersRes.data);
      console.log("Orders Data Type:", typeof ordersRes.data);
      console.log("Orders Length:", ordersRes.data?.length || 0);
      console.log("=====================");
      
      setTable(tableRes.data);
      setCategories(categoriesRes.data);
      const allOrders = ordersRes.data || [];
      console.log("=== ALL ORDERS RECEIVED ===");
      console.log("Raw orders data:", allOrders);
      
      // If table is RUNNING, show orders from the current running session only
      // If table is not RUNNING, show no orders (empty current orders)
      let activeOrders = [];
      
      if (tableRes.data.status === 'RUNNING') {
        // DEBUG: Show ALL orders without any filtering
        console.log("=== DEBUG: SHOWING ALL ORDERS WITHOUT FILTERING ===");
        console.log(`Total orders from API: ${allOrders.length}`);
        activeOrders = allOrders; // Show ALL orders
        
        allOrders.forEach((order: any, index: number) => {
          console.log(`Order ${index + 1}: ID=${order.id}, status=${order.status}, isPaid=${order.isPaid}, total=${order.total}, items=${order.items?.length || 0}`);
        });
        console.log(`=== RESULT: All ${activeOrders.length} orders will show ===`);
      } else {
        // Table is not RUNNING, show no orders
        activeOrders = [];
      }
      
      console.log("=== ACTIVE ORDERS AFTER FILTERING ===");
      console.log("Active orders:", activeOrders);
      console.log("Active orders count:", activeOrders.length);
      setExistingOrders(activeOrders);
      
      // Show payment section if table is RUNNING (regardless of filtered orders)
      if (tableRes.data.status === 'RUNNING') {
        setShowCompleteOrder(true);
      } else {
        setShowCompleteOrder(false);
      }
      
      if (categoriesRes.data.length > 0) {
        setSelectedCategory(categoriesRes.data[0].id);
        loadMenuItems(categoriesRes.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMenuItems = async (categoryId: number) => {
    try {
      const response = await menuAPI.getItemsByCategory(categoryId);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  };

  const loadFavoriteItems = async () => {
    try {
      const response = await menuAPI.getFavorites();
      setFavoriteItems(response.data);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Failed to load favorite items:', error);
    }
  };

  const toggleFavorite = async (itemId: number, currentStatus: boolean) => {
    try {
      console.log('Toggling favorite for item', itemId, 'from', currentStatus, 'to', !currentStatus);
      const response = await menuAPI.updateItem(itemId, { isFavorite: !currentStatus });
      console.log('Favorite toggled successfully:', response.data);
      // Reload current view
      if (showFavorites) {
        await loadFavoriteItems();
      } else if (selectedCategory) {
        await loadMenuItems(selectedCategory);
      }
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      console.error('Error details:', error.response?.data || error.message);
      showToast(`Failed to update favorite status: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handlePriceUpdate = async (itemId: number) => {
    if (!newPrice || isNaN(parseFloat(newPrice))) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    try {
      console.log('Updating price for item', itemId, 'to', newPrice);
      const response = await menuAPI.updateItem(itemId, { price: parseFloat(newPrice) });
      console.log('Price updated successfully:', response.data);
      setEditingPrice(null);
      setNewPrice('');
      // Reload current view
      if (showFavorites) {
        await loadFavoriteItems();
      } else if (selectedCategory) {
        await loadMenuItems(selectedCategory);
      }
      showToast('Price updated successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to update price:', error);
      console.error('Error details:', error.response?.data || error.message);
      showToast(`Failed to update price: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setShowFavorites(false);
    setSelectedCategory(categoryId);
    loadMenuItems(categoryId);
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    setSelectedCategory(null);
    loadFavoriteItems();
  };

  const handleAddMenuItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.categoryId) {
      showToast('Please fill in all required fields (Name, Price, Category)', 'error');
      return;
    }

    try {
      setLoading(true);
      const itemData = {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: { id: parseInt(newItem.categoryId) },
        available: newItem.available,
        isFavorite: newItem.isFavorite,
        imageUrl: newItem.imageUrl || null
      };

      console.log('Creating menu item with data:', itemData);
      const response = await menuAPI.createItem(itemData);
      console.log('Menu item created successfully:', response.data);
      
      // Reset form
      setNewItem({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        available: true,
        isFavorite: false,
        imageUrl: ''
      });
      setShowAddItemModal(false);
      
      // Reload current view
      if (showFavorites) {
        await loadFavoriteItems();
      } else if (selectedCategory) {
        await loadMenuItems(selectedCategory);
      }
      
      showToast(`Menu item "${response.data.name}" added successfully!`, 'success');
    } catch (error: any) {
      console.error('Failed to add menu item:', error);
      console.error('Error details:', error.response?.data || error.message);
      showToast(`Failed to add menu item: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setNewItem({ ...newItem, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteMenuItem = async (itemId: number, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
      return;
    }

    try {
      console.log('Deleting menu item:', itemId, itemName);
      await menuAPI.deleteItem(itemId);
      console.log('Menu item deleted successfully');
      
      // Reload current view
      if (showFavorites) {
        await loadFavoriteItems();
      } else if (selectedCategory) {
        await loadMenuItems(selectedCategory);
      }
      
      showToast('Menu item deleted successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to delete menu item:', error);
      console.error('Error details:', error.response?.data || error.message);
      showToast(`Failed to delete menu item: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      showToast('Please enter a category name', 'error');
      return;
    }

    setAddingCategory(true);
    try {
      console.log('Adding new category:', newCategory);
      const response = await menuAPI.createCategory({
        name: newCategory.name.trim(),
        description: newCategory.description.trim()
      });
      console.log('Category added successfully:', response.data);
      
      // Reload categories
      const categoriesRes = await menuAPI.getCategories();
      setCategories(categoriesRes.data);
      
      // Reset form and close modal
      setNewCategory({ name: '', description: '' });
      setShowAddCategoryModal(false);
      
      showToast('Category added successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to add category:', error);
      showToast(`Failed to add category: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    // Show custom confirmation modal
    setDeleteConfirmModal({
      show: true,
      itemType: 'category',
      itemId: categoryId,
      itemName: categoryName,
      categoryId,
      categoryName
    });
  };

  const confirmDeleteCategory = async () => {
    const { categoryId, categoryName } = deleteConfirmModal;
    
    setDeletingCategory(true);
    try {
      console.log('Deleting category:', categoryId, categoryName);
      await menuAPI.deleteCategory(categoryId!);
      console.log('Category deleted successfully');
      
      // Reload categories
      const categoriesRes = await menuAPI.getCategories();
      setCategories(categoriesRes.data);
      
      // If deleted category was selected, switch to first available category
      if (selectedCategory === categoryId) {
        const remainingCategories = categoriesRes.data;
        if (remainingCategories.length > 0) {
          setSelectedCategory(remainingCategories[0].id);
          await loadMenuItems(remainingCategories[0].id);
        } else {
          setSelectedCategory(null);
          setMenuItems([]);
        }
      }
      
      showToast('Category deleted successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      showToast(`Failed to delete category: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setDeletingCategory(false);
      // Close modal
      setDeleteConfirmModal({ show: false, itemType: 'menu', itemId: null, itemName: '' });
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item.id);
    setEditItemData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      imageUrl: item.imageUrl || ''
    });
  };

  const handleUpdateItem = async () => {
    if (!editItemData.name.trim() || !editItemData.price || isNaN(parseFloat(editItemData.price))) {
      showToast('Please enter valid name and price', 'error');
      return;
    }

    setUpdatingItem(true);
    try {
      console.log('Updating item:', editingItem, editItemData);
      const response = await menuAPI.updateItem(editingItem!, {
        name: editItemData.name.trim(),
        description: editItemData.description.trim(),
        price: parseFloat(editItemData.price),
        imageUrl: editItemData.imageUrl.trim() || null
      });
      console.log('Item updated successfully:', response.data);
      
      // Reload current view
      if (showFavorites) {
        await loadFavoriteItems();
      } else if (selectedCategory) {
        await loadMenuItems(selectedCategory);
      }
      
      // Reset form
      setEditingItem(null);
      setEditItemData({ name: '', description: '', price: '', imageUrl: '' });
      
      showToast('Item updated successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to update item:', error);
      showToast(`Failed to update item: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setUpdatingItem(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((ci) => ci.menuItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((ci) =>
          ci.menuItem.id === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        )
      );
    } else {
      setCart([...cart, { menuItem: item, quantity: 1, notes: '' }]);
    }
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart(
      cart
        .map((ci) =>
          ci.menuItem.id === itemId
            ? { ...ci, quantity: ci.quantity + delta }
            : ci
        )
        .filter((ci) => ci.quantity > 0)
    );
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((ci) => ci.menuItem.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.05;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCompletePayment = async () => {
    if (!paymentMethod) {
      showToast('Please select a payment method', 'error');
      return;
    }

    setLoading(true);
    try {
      // Set table back to AVAILABLE (BLANK)
      await tableAPI.updateStatus(Number(tableId), 'BLANK');
      showToast('Payment completed successfully! Table is now available.', 'success', () => router.push('/tables'));
    } catch (error) {
      console.error('Failed to complete payment:', error);
      showToast('Failed to complete payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintOrders = () => {
    const printContent = `
      <html>
        <head>
          <title>Bill - Table ${table?.tableNumber}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0; font-size: 12px; }
            .table-info { margin: 10px 0; padding: 10px 0; border-bottom: 1px dashed #000; }
            .order { margin: 10px 0; padding-bottom: 10px; border-bottom: 1px dashed #000; }
            .order-header { display: flex; justify-content: space-between; font-weight: bold; }
            .item { display: flex; justify-content: space-between; font-size: 12px; margin: 5px 0; }
            .total { font-size: 18px; font-weight: bold; margin-top: 15px; display: flex; justify-content: space-between; border-top: 2px dashed #000; padding-top: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>KHANATHIKANA</h1>
            <p>123 Restaurant Street</p>
            <p>Phone: 07969 223344</p>
          </div>
          <div class="table-info">
            <strong>Table: ${table?.tableNumber} - ${table?.section}</strong><br/>
            <small>Date: ${new Date().toLocaleString()}</small>
          </div>
          ${existingOrders.map((order: any) => `
            <div class="order">
              <div class="order-header">
                <span>Order #${order.id}</span>
                <span>₹${order.total?.toFixed(2) || '0.00'}</span>
              </div>
              ${order.items?.map((item: any) => `
                <div class="item">
                  <span>${item.menuItem?.name || 'Item'} x ${item.quantity}</span>
                  <span>₹${item.total?.toFixed(2) || '0.00'}</span>
                </div>
              `).join('') || ''}
            </div>
          `).join('')}
          <div class="total">
            <span>GRAND TOTAL:</span>
            <span>₹${existingOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0).toFixed(2)}</span>
          </div>
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>Visit again soon</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleSaveOrder = async (action: string) => {
    if (cart.length === 0) {
      showToast('Please add items to cart', 'error');
      return;
    }

    // Validate delivery info
    if (orderMode === 'DELIVERY') {
      if (!deliveryInfo.customerName || !deliveryInfo.phoneNumber || !deliveryInfo.address) {
        showToast('Please fill in all delivery information', 'error');
        return;
      }
    }

    // Validate pickup info
    if (orderMode === 'PICKUP') {
      if (!deliveryInfo.customerName || !deliveryInfo.phoneNumber) {
        showToast('Please fill in customer name and phone number', 'error');
        return;
      }
    }

    setLoading(true);
    try {
      const orderData = {
        tableId: Number(tableId),
        userId: user.userId,
        orderType: orderMode,
        items: cart.map((ci) => ({
          menuItemId: ci.menuItem.id,
          quantity: ci.quantity,
          notes: ci.notes,
        })),
        discount: 0,
        paymentMethod: action === 'pay' ? paymentMethod : null,
        isLoyalty: false,
      };

      const response = await orderAPI.create(orderData);

      // Clear cart after order is saved
      setCart([]);

      // Update table status based on action
      if (action === 'pay') {
        // Payment completed - set table back to AVAILABLE (BLANK)
        await tableAPI.updateStatus(Number(tableId), 'BLANK');
        showToast('Payment completed successfully! Table is now available.', 'success', () => router.push('/tables'));
      } else {
        // Order created - set table to RUNNING
        await tableAPI.updateStatus(Number(tableId), 'RUNNING');
        
        if (action === 'print' || action === 'kot-print') {
          showToast('Order saved and sent to printer!', 'success', () => router.push('/tables'));
        } else if (action === 'ebill') {
          showToast('Order saved and eBill generated!', 'success', () => router.push('/tables'));
        } else if (action === 'kot') {
          showToast('KOT generated!', 'success', () => router.push('/tables'));
        } else {
          showToast('Order saved successfully! Table is now RUNNING.', 'success', () => router.push('/tables'));
        }
      }
    } catch (error) {
      console.error('Failed to save order:', error);
      showToast('Failed to save order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredMenuItems = searchQuery
    ? menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : menuItems;

  if (!table || !user || loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EB]">
        {/* Main Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Loading from Database</h3>
                <p className="text-stone-600 text-sm">Fetching data from Neon PostgreSQL...</p>
              </div>
            </div>
          </div>
        )}
        <div className="text-xl text-stone-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background with blur effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#F5F1EB] via-[#F0E8DC] to-[#E8DFD1]"/>
      <div className="fixed inset-0 bg-[#D4A574]/5"></div>
      
      {/* Decorative blur elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#D4A574]/20 to-transparent rounded-full blur-3xl"></div>
      <div className="fixed top-1/3 right-0 w-80 h-80 bg-gradient-to-bl from-[#D4A574]/15 to-transparent rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-[#D4A574]/10 to-transparent rounded-full blur-3xl"></div>
      
      {/* Floating food elements */}
      <div className="fixed top-20 right-20 text-6xl opacity-5 text-[#D4A574]/20">🍛</div>
      <div className="fixed bottom-32 left-20 text-5xl opacity-5 text-[#D4A574]/15">🥘</div>
      <div className="fixed top-1/2 left-1/4 text-4xl opacity-5 text-[#D4A574]/10">🍲</div>
      
      <div className="relative z-10">
        <ResponsiveNavigationBar
          title={`Table ${table.tableNumber} - ${table.section}`}
          subtitle={
            table.status === 'RUNNING' || (table.status !== 'BLANK' && table.status !== 'AVAILABLE') 
              ? 'Complete Payment or Add More Items' 
              : 'Create Order'
          }
          status={table.status}
          showBackButton={true}
          backRoute="/tables"
          showTableStatus={true}
        />
        
        {/* Timer for running tables - Responsive positioning */}
        {table.status === 'RUNNING' && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-lg z-10">
            ⏱️ {getElapsedTime()}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <div className="container mx-auto p-4 md:p-6 lg:p-8 xl:p-10">
          {showCompleteOrder && (
            <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 backdrop-blur-sm bg-white/80">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-orange-600">Table is RUNNING</h2>
                  <p className="text-orange-500 mt-1 text-sm md:text-base">This table has active orders. Complete payment to make it available.</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-orange-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-2xl font-bold text-base md:text-lg">
                    RUNNING
                  </div>
                  {getElapsedTime() && (
                    <div className="bg-black bg-opacity-75 text-white px-3 py-1.5 rounded-lg text-sm">
                      ⏱️ {getElapsedTime()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
            
            {loading ? (
              <LoadingSkeleton />
            ) : existingOrders.length > 0 ? (
              <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg rounded-2xl p-6 md:p-8 lg:p-10 xl:p-12 mb-6 md:mb-8 lg:mb-10 xl:mb-12 border border-stone-200 shadow-2xl" id="printable-orders">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3 rounded-2xl shadow-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-stone-800">Current Orders</h3>
                      <p className="text-sm text-stone-500">{existingOrders.length} active order{existingOrders.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePrintOrders()}
                    className="bg-gradient-to-r from-stone-700 to-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:from-stone-800 hover:to-stone-950 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Bill
                  </button>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {existingOrders.map((order: any, idx: number) => (
                    <div key={order.id} className="bg-gradient-to-r from-stone-50 to-white rounded-xl p-4 border border-stone-200 hover:border-stone-300 transition-all duration-300 hover:shadow-md">
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-md">
                            #{order.id}
                          </div>
                          <div className="bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                            {order.orderType === 'DINE_IN' ? '🍽️ Dine In' : order.orderType === 'DELIVERY' ? '🚚 Delivery' : '🥡 Pick Up'}
                          </div>
                          {order.createdAt && (
                            <div className="text-xs text-stone-500">
                              {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            ₹{order.total?.toFixed(2) || '0.00'}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.items && order.items.map((item: any, itemIdx: number) => (
                          <div key={item.id || itemIdx} className="flex justify-between items-center py-2 px-3 bg-stone-50/50 rounded-lg hover:bg-stone-100/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="bg-white text-stone-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                                {item.quantity}
                              </div>
                              <div>
                                <div className="font-medium text-stone-800">{item.menuItem?.name || 'Unknown Item'}</div>
                                {item.notes && (
                                  <div className="text-xs text-stone-500 italic">Note: {item.notes}</div>
                                )}
                              </div>
                            </div>
                            <div className="font-semibold text-stone-700">
                              ₹{(item.quantity * (item.menuItem?.price || 0)).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grand Total */}
                <div className="mt-6 pt-6 border-t-2 border-stone-200">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-stone-600 font-medium">Grand Total</div>
                        <div className="text-xs text-stone-500">{existingOrders.length} order{existingOrders.length !== 1 ? 's' : ''} • {existingOrders.reduce((sum: number, order: any) => sum + (order.items?.length || 0), 0)} items</div>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        ₹{existingOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-stone-200 shadow-2xl">
                <div className="text-center py-8">
                  <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-stone-700 mb-2">No Active Orders</h3>
                  <p className="text-stone-500">This table has no active orders. Add items to create an order.</p>
                </div>
              </div>
            )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 order-2 xl:order-1">
            {/* Show payment section only when there are existing orders */}
            {existingOrders.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-stone-200 shadow-lg mb-6">
                <h3 className="font-bold text-lg mb-3 text-stone-800">Complete Payment</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                  {['CASH', 'CARD', 'DUO', 'OTHER', 'PART_PAYMENT'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                        paymentMethod === method
                          ? 'bg-[#2D2D2D] text-white'
                          : 'bg-stone-100 text-stone-700 border border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {method.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCompletePayment}
                  disabled={!paymentMethod || loading}
                  aria-label="Complete payment and make table available"
                  className="w-full bg-[#D4A574] text-[#2D2D2D] py-4 rounded-xl font-bold text-lg hover:bg-[#C49A6C] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Complete Payment & Make Table Available'}
                </button>
              </div>
            )}

            {/* Menu items section - always show */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-stone-200">
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all outline-none placeholder-stone-400"
                />
                <button
                  onClick={() => {
                    console.log('Opening Add Item Modal');
                    setShowAddItemModal(true);
                  }}
                  className="bg-[#D4A574] text-[#2D2D2D] px-6 py-3 rounded-xl font-semibold hover:bg-[#C49A6C] transition-all duration-300 whitespace-nowrap"
                >
                  + Add Item
                </button>
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                >
                  ➕ Add Category
                </button>
                <button
                  onClick={handleShowFavorites}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                    showFavorites
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  ⭐ Favorites
                </button>
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-1">
                    <button
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                        selectedCategory === cat.id && !showFavorites
                          ? 'bg-[#2D2D2D] text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                    {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat.id, cat.name);
                        }}
                        className="bg-gray-800 hover:bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                        title="Delete category"
                      >
                        <div className="relative w-2 h-2">
                          <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-white transform -translate-x-1/2 rotate-45"></div>
                          <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-white transform -translate-x-1/2 -rotate-45"></div>
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                {loading ? (
                  // Loading skeleton for menu items
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-stone-200 w-16 h-16 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="bg-stone-200 h-4 w-32 rounded mb-2"></div>
                            <div className="bg-stone-200 h-3 w-24 rounded"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="bg-stone-200 h-6 w-16 rounded"></div>
                          <div className="bg-stone-200 h-8 w-20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-stone-50 p-4 rounded-xl border border-stone-200 relative hover:border-stone-400 transition-all duration-300"
                  >
                    {/* Item Image */}
                    <div className="mb-3 -mx-4 -mt-4 rounded-t-xl overflow-hidden">
                      <img 
                        src={item.imageUrl || "https://picsum.photos/400/200?random=" + item.id}
                        alt={item.name}
                        className="w-full h-32 object-cover"
                        onLoad={() => console.log(`Image loaded for: ${item.name}`)}
                        onError={(e) => {
                          console.error(`Image failed for ${item.name}, using fallback`);
                          e.currentTarget.src = "https://picsum.photos/400/200?random=" + item.id;
                        }}
                      />
                    </div>
                    
                    <div className="flex items-start justify-between mb-1">
                      <div 
                        onClick={() => addToCart(item)}
                        className="font-semibold text-lg pr-2 text-stone-800 cursor-pointer hover:text-[#D4A574] flex-1"
                      >
                        {item.name}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id, item.isFavorite);
                        }}
                        className={`text-2xl hover:scale-125 transition-all p-1 ${
                          item.isFavorite 
                            ? '' 
                            : 'text-amber-400 opacity-70 hover:opacity-100'
                        }`}
                        title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {item.isFavorite ? '⭐' : '★'}
                      </button>
                    </div>
                    <div 
                      onClick={() => addToCart(item)}
                      className="text-sm text-stone-500 mb-2 cursor-pointer"
                    >
                      {item.description}
                    </div>
                      
                      {editingPrice === item.id ? (
                        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="New price"
                            className="w-24 px-2 py-1 bg-white border border-stone-300 text-stone-800 rounded-lg text-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => handlePriceUpdate(item.id)}
                            className="bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-emerald-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingPrice(null);
                              setNewPrice('');
                            }}
                            className="bg-stone-300 text-stone-700 px-2 py-1 rounded-lg text-xs hover:bg-stone-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="text-[#D4A574] font-bold text-lg">₹{item.price}</div>
                          {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditItem(item);
                                }}
                                className="text-xs bg-blue-100 text-blue-600 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMenuItem(item.id, item.name);
                                }}
                                className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                ))
                )}
              </div>

              {filteredMenuItems.length === 0 && (
                <div className="text-center py-12 text-stone-500">
                  No items found
                </div>
              )}
            </div>
          </div>

          <div className="order-1 xl:order-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 sticky top-24 border border-stone-200">
              <h2 className="text-xl font-bold mb-4 text-stone-800">Order Summary</h2>

              {/* Delivery Mode Tabs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-600 mb-3">
                  Mode of Delivery
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'DINE_IN' as const, label: 'Dine In', icon: '🍽️' },
                    { type: 'DELIVERY' as const, label: 'Delivery', icon: '🚚' },
                    { type: 'PICKUP' as const, label: 'Pick Up', icon: '🥡' }
                  ].map((mode) => (
                    <button
                      key={mode.type}
                      onClick={() => setOrderMode(mode.type)}
                      className={`py-3 px-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                        orderMode === mode.type
                          ? 'bg-[#D4A574] text-[#2D2D2D] shadow-lg transform scale-105'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      <div className="text-lg mb-1">{mode.icon}</div>
                      <div>{mode.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Information Form */}
              {orderMode === 'DELIVERY' && (
                <div className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h3 className="font-semibold text-stone-800 mb-3">Delivery Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={deliveryInfo.customerName}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, customerName: e.target.value})}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={deliveryInfo.phoneNumber}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, phoneNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Delivery Address</label>
                      <textarea
                        value={deliveryInfo.address}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                        rows={2}
                        placeholder="Enter delivery address"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Delivery Instructions</label>
                      <input
                        type="text"
                        value={deliveryInfo.instructions}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, instructions: e.target.value})}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        placeholder="Special instructions (optional)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pick Up Information Form */}
              {orderMode === 'PICKUP' && (
                <div className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h3 className="font-semibold text-stone-800 mb-3">Pick Up Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={deliveryInfo.customerName}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, customerName: e.target.value})}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={deliveryInfo.phoneNumber}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, phoneNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Pick Up Time</label>
                      <select
                        value={deliveryInfo.deliveryTime}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, deliveryTime: e.target.value})}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                      >
                        <option value="ASAP">ASAP (15-20 mins)</option>
                        <option value="30_MIN">30 Minutes</option>
                        <option value="45_MIN">45 Minutes</option>
                        <option value="1_HOUR">1 Hour</option>
                        <option value="CUSTOM">Custom Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="max-h-[300px] overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-stone-400">
                    Cart is empty
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="flex items-center justify-between mb-3 pb-3 border-b border-stone-200"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-stone-800">{item.menuItem.name}</div>
                        <div className="text-sm text-stone-500">
                          ₹{item.menuItem.price} × {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, -1)}
                          className="w-8 h-8 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold border border-stone-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, 1)}
                          className="w-8 h-8 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold border border-stone-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.menuItem.id)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-bold border border-red-200"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <div className="border-t border-stone-200 pt-4 mb-4 space-y-2">
                    <div className="flex justify-between text-stone-500">
                      <span>Subtotal:</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Tax (5%):</span>
                      <span>₹{calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-[#D4A574]">
                      <span>Total:</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {!showPayment ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSaveOrder('save')}
                        disabled={loading}
                        aria-label="Save order"
                        className="w-full bg-[#D4A574] text-[#2D2D2D] py-3 rounded-xl font-semibold hover:bg-[#C49A6C] transition-all duration-300 disabled:opacity-50"
                      >
                        Save Order
                      </button>
                      <button
                        onClick={() => handleSaveOrder('print')}
                        disabled={loading}
                        className="w-full bg-[#D4A574] text-[#2D2D2D] py-3 rounded-xl font-semibold hover:bg-[#C49A6C] transition-all duration-300 disabled:opacity-50"
                      >
                        Save & Print
                      </button>
                      <button
                        onClick={() => handleSaveOrder('ebill')}
                        disabled={loading}
                        className="w-full bg-[#D4A574] text-[#2D2D2D] py-3 rounded-xl font-semibold hover:bg-[#C49A6C] transition-all duration-300 disabled:opacity-50"
                      >
                        Save & eBill
                      </button>
                      <button
                        onClick={() => handleSaveOrder('kot')}
                        disabled={loading}
                        className="w-full bg-[#D4A574] text-[#2D2D2D] py-3 rounded-xl font-semibold hover:bg-[#C49A6C] transition-all duration-300 disabled:opacity-50"
                      >
                        KOT
                      </button>
                      <button
                        onClick={() => handleSaveOrder('kot-print')}
                        disabled={loading}
                        className="w-full bg-[#D4A574] text-[#2D2D2D] py-3 rounded-xl font-semibold hover:bg-[#C49A6C] transition-all duration-300 disabled:opacity-50"
                      >
                        KOT & Print
                      </button>
                      <button
                        onClick={() => setShowPayment(true)}
                        aria-label="Proceed to payment"
                        className="w-full bg-[#2D2D2D] text-white py-3 rounded-xl font-semibold hover:bg-[#3D3D3D] transition-all duration-300"
                      >
                        Payment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg text-stone-800">Select Payment Method</h3>
                      {['CASH', 'CARD', 'DUO', 'OTHER', 'PART_PAYMENT'].map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                            paymentMethod === method
                              ? 'bg-[#2D2D2D] text-white'
                              : 'bg-stone-100 text-stone-700 border border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          {method.replace('_', ' ')}
                        </button>
                      ))}
                      <button
                        onClick={() => handleSaveOrder('pay')}
                        disabled={!paymentMethod || loading}
                        className="w-full bg-[#D4A574] text-[#2D2D2D] py-3 rounded-xl font-semibold hover:bg-[#C49A6C] transition-all duration-300 disabled:opacity-50"
                      >
                        Complete Payment
                      </button>
                      <button
                        onClick={() => setShowPayment(false)}
                        className="w-full bg-stone-100 text-stone-700 border border-stone-200 py-3 rounded-xl font-medium hover:bg-stone-200 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Menu Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full p-8 transform transition-all border border-[#D4A574]/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-stone-800">Add New Menu Item</h2>
              <button
                onClick={() => {
                  setShowAddItemModal(false);
                  setNewItem({
                    name: '',
                    description: '',
                    price: '',
                    categoryId: '',
                    available: true,
                    isFavorite: false,
                    imageUrl: ''
                  });
                }}
                className="text-stone-400 hover:text-stone-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all outline-none placeholder-stone-400"
                  placeholder="e.g., Paneer Tikka"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-2">
                  Description
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all outline-none resize-none placeholder-stone-400"
                  placeholder="Brief description of the item"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all outline-none placeholder-stone-400"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all outline-none"
                  >
                    <option value="">Select</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-2">
                  Item Image
                </label>
                
                {/* Image Preview */}
                {newItem.imageUrl && (
                  <div className="mb-3">
                    <img 
                      src={newItem.imageUrl}
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-xl border border-stone-200"
                      onError={(e) => {
                        e.currentTarget.src = "https://picsum.photos/400/200?random=preview";
                      }}
                    />
                  </div>
                )}

                {/* File Upload */}
                <div className="mb-3">
                  <label className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-stone-200 border-dashed text-stone-600 rounded-xl hover:border-stone-400 transition-all cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* URL Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                    className="flex-1 px-4 py-3 bg-white border-2 border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-stone-300 focus:border-stone-400 transition-all outline-none placeholder-stone-400"
                    placeholder="Or enter image URL..."
                  />
                  {newItem.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setNewItem({ ...newItem, imageUrl: '' })}
                      className="px-3 py-3 bg-red-100 text-red-600 border border-red-200 rounded-xl hover:bg-red-200 transition-all"
                      title="Clear image"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-1">Upload an image or enter a URL (optional)</p>
                
                {/* Sample Image URLs */}
                <div className="mt-3">
                  <p className="text-xs font-medium text-stone-600 mb-2">Sample food images:</p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      'https://images.unsplash.com/photo-1565299624946-b28f40a0a38b?w=400&h=200&fit=crop',
                      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=200&fit=crop',
                      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop',
                      'https://images.unsplash.com/photo-1565958011703-44f9829baeed?w=400&h=200&fit=crop'
                    ].map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewItem({ ...newItem, imageUrl: url })}
                        className="text-xs px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded border border-stone-200 transition-all"
                      >
                        Sample {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-white p-4 rounded-xl border border-stone-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.available}
                    onChange={(e) => setNewItem({ ...newItem, available: e.target.checked })}
                    className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 border-stone-300 rounded"
                  />
                  <span className="text-sm font-medium text-stone-600">Available for Order</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isFavorite}
                    onChange={(e) => setNewItem({ ...newItem, isFavorite: e.target.checked })}
                    className="w-5 h-5 text-amber-500 focus:ring-amber-500 border-stone-300 rounded"
                  />
                  <span className="text-sm font-medium text-stone-600">⭐ Mark as Favorite</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddMenuItem}
                  disabled={loading}
                  className="flex-1 bg-[#D4A574] text-[#2D2D2D] py-3.5 rounded-xl font-semibold hover:bg-[#C49A6C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    '✓ Add Menu Item'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowAddItemModal(false);
                    setNewItem({
                      name: '',
                      description: '',
                      price: '',
                      categoryId: '',
                      available: true,
                      isFavorite: false,
                      imageUrl: ''
                    });
                  }}
                  className="px-6 bg-stone-200 text-stone-700 py-3.5 rounded-xl font-semibold hover:bg-stone-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all border border-[#D4A574]/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Add New Category</h2>
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategory({ name: '', description: '' });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  disabled={addingCategory}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] outline-none text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g., Beverages, Appetizers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  disabled={addingCategory}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] outline-none resize-none text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                  placeholder="Optional description for this category"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddCategory}
                disabled={addingCategory}
                className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addingCategory ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    ✓ Add Category
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategory({ name: '', description: '' });
                }}
                disabled={addingCategory}
                className="px-6 bg-stone-200 text-stone-700 py-3.5 rounded-xl font-semibold hover:bg-stone-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all border border-[#D4A574]/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Edit Menu Item</h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditItemData({ name: '', description: '', price: '', imageUrl: '' });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={editItemData.name}
                  onChange={(e) => setEditItemData({ ...editItemData, name: e.target.value })}
                  disabled={updatingItem}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] outline-none text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g., Chai, Coffee"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editItemData.description}
                  onChange={(e) => setEditItemData({ ...editItemData, description: e.target.value })}
                  disabled={updatingItem}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] outline-none resize-none text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                  placeholder="Describe this menu item"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editItemData.imageUrl}
                    onChange={(e) => setEditItemData({ ...editItemData, imageUrl: e.target.value })}
                    disabled={updatingItem}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] outline-none text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://example.com/image.jpg"
                  />
                  {editItemData.imageUrl && !updatingItem && (
                    <button
                      type="button"
                      onClick={() => setEditItemData({ ...editItemData, imageUrl: '' })}
                      className="px-3 py-3 bg-red-100 text-red-600 border border-red-200 rounded-xl hover:bg-red-200 transition-all"
                      title="Clear image URL"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter URL of the food image (optional)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={editItemData.price}
                  onChange={(e) => setEditItemData({ ...editItemData, price: e.target.value })}
                  disabled={updatingItem}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] outline-none text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleUpdateItem}
                disabled={updatingItem}
                className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updatingItem ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    ✓ Update Item
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditItemData({ name: '', description: '', price: '', imageUrl: '' });
                }}
                disabled={updatingItem}
                className="px-6 bg-stone-200 text-stone-700 py-3.5 rounded-xl font-semibold hover:bg-stone-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all border border-[#D4A574]/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Delete Category</h2>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-red-600">"{deleteConfirmModal.categoryName}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This will also delete all menu items in this category. This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmDeleteCategory}
                disabled={deletingCategory}
                className="flex-1 bg-red-600 text-white py-3.5 rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deletingCategory ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    Delete Category
                  </>
                )}
              </button>
              <button
                onClick={() => setDeleteConfirmModal({ 
                  show: false, 
                  itemType: 'menu', 
                  itemId: null, 
                  itemName: ''
                })}
                disabled={deletingCategory}
                className="flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black bg-opacity-50">
          <div className="bg-[#F5F1EB] rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden relative">
            <button
              onClick={closeToast}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Colored Header */}
            <div className={`py-8 flex flex-col items-center
              ${toast.type === 'success' ? 'bg-emerald-500' : ''}
              ${toast.type === 'error' ? 'bg-red-500' : ''}
              ${toast.type === 'info' ? 'bg-blue-500' : ''}
            `}>
              {toast.type === 'success' && (
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-6 text-center">
              <p className="font-bold text-xl text-stone-800 mb-2">
                {toast.type === 'success' ? '✓ Success!' : toast.type === 'error' ? '✕ Error!' : 'ℹ Info'}
              </p>
              <p className="text-stone-600 mb-6">{toast.message}</p>
              <button
                onClick={closeToast}
                className={`w-full py-3 rounded-xl font-semibold transition-all
                  ${toast.type === 'success' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
                  ${toast.type === 'error' ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                  ${toast.type === 'info' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                `}
              >
                OK
              </button>
            </div>
          </div>
        </div>
          )}
      </div>
    </div>
  );
}

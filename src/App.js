import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const DEFAULT_INVENTORY = [
  { id: 1, name: "Sugar (Cheeni)", price: 155, category: 'loose', type: 'solid' },
  { id: 2, name: "Basmati Rice", price: 340, category: 'loose', type: 'solid' },
  { id: 3, name: "Milk (Doodh)", price: 220, category: 'loose', type: 'liquid' },
  { id: 4, name: "Red Chilli Powder", price: 1200, category: 'loose', type: 'solid' },
  { id: 5, name: "Daal Mash", price: 520, category: 'loose', type: 'solid' },
  { id: 7, name: "Lipton Tea", price: 1650, category: 'fixed', type: 'solid' },
  { id: 8, name: "Tapal Danedar", price: 1580, category: 'fixed', type: 'solid' },
  { id: 9, name: "Surf Excel 1kg", price: 680, category: 'fixed', type: 'solid' },
  { id: 11, name: "Dalda Ghee", price: 610, category: 'fixed', type: 'liquid' },
  { id: 15, name: "Lux Soap", price: 125, category: 'count' },
  { id: 18, name: "Farm Eggs", price: 35, category: 'count' },
  { id: 19, name: "Dawn Bread (L)", price: 240, category: 'count' },
  { id: 21, name: "Sooper Biscuit", price: 60, category: 'count' },
  { id: 28, name: "Coca Cola 1.5L", price: 200, category: 'count' },
  { id: 30, name: "Olpers 1L", price: 290, category: 'count' },
  { id: 34, name: "Panadol Strip", price: 45, category: 'count' },
  { id: 35, name: "Cooking Oil", price: 580, category: 'loose', type: 'liquid' },
  { id: 36, name: "Atta (Flour)", price: 140, category: 'loose', type: 'solid' },
  { id: 37, name: "Salt (Namak)", price: 60, category: 'loose', type: 'solid' },
  { id: 38, name: "Black Pepper", price: 300, category: 'loose', type: 'solid' },
  { id: 39, name: "Yogurt", price: 220, category: 'loose', type: 'liquid' },
  { id: 40, name: "Nido 1kg", price: 2450, category: 'fixed', type: 'solid' },
  { id: 41, name: "Milo Large", price: 1100, category: 'fixed', type: 'solid' },
  { id: 42, name: "Tang Orange", price: 850, category: 'fixed', type: 'solid' },
  { id: 43, name: "Dettol Liquid", price: 450, category: 'fixed', type: 'liquid' },
  { id: 44, name: "Lifebuoy Soap", price: 110, category: 'count' },
  { id: 45, name: "Colgate Toothpaste", price: 280, category: 'count' },
  { id: 46, name: "Sunsilk Shampoo Sachet", price: 15, category: 'count'},
  { id: 47, name: "Matchbox", price: 5, category: 'count' },
  { id: 48, name: "Green Tea Bag", price: 25, category: 'count' },
  { id: 49, name: "Snickers Bar", price: 180, category: 'count' },
  { id: 50, name: "Mineral Water 1.5L", price: 90, category: 'count' },
  { id: 51, name: "Dishwash Bar", price: 85, category: 'count' },
  { id: 52, name: "Garlic (Lehsan)", price: 400, category: 'loose', type: 'solid' },
  { id: 53, name: "Ginger (Adrak)", price: 600, category: 'loose', type: 'solid' },
  { id: 54, name: "Lays Chips", price: 50, category: 'count' }
];

const getTodayDate = () => new Date().toISOString().split('T')[0];

const calculateTotal = (item, qty, unit) => {
  if (!item) return 0;
  if (item.category === 'fixed') return item.price * qty;
  if (item.category === 'count') return item.price * qty;
  if (unit === 'g' || unit === 'ml') return (item.price / 1000) * qty;
  return item.price * qty;
};

const IrshadStore = () => {
  
  const [page, setPage] = useState('shop');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [toast, setToast] = useState(null);

  
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('irshad_inventory');
    return saved ? JSON.parse(saved) : DEFAULT_INVENTORY;
  });

 
  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('irshad_sales_data');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal states
  const [activeItem, setActiveItem] = useState(null);
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState('');
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSale, setEditingSale] = useState(null);

  
  const [dateRange, setDateRange] = useState('today');
  const [reportSearch, setReportSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('irshad_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('irshad_sales_data', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  const filteredSales = useMemo(() => {
    const today = getTodayDate();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    return sales.filter(sale => {
      if (dateRange === 'today') return sale.date === today;
      if (dateRange === 'week') return sale.date >= weekAgoStr;
      return true;
    }).filter(sale =>
      sale.name.toLowerCase().includes(reportSearch.toLowerCase())
    );
  }, [sales, dateRange, reportSearch]);

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const DAILY_GOAL = 50000;
  const todaySales = sales.filter(s => s.date === getTodayDate());
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const progress = Math.min((todayRevenue / DAILY_GOAL) * 100, 100);

  const getTopItemByQuantity = () => {
    if (filteredSales.length === 0) return "No Sales";
    const qtyMap = new Map();
    filteredSales.forEach(sale => {
      let quantityInBaseUnit = sale.qty;
      if (sale.unit === 'g') quantityInBaseUnit = sale.qty / 1000;
      if (sale.unit === 'ml') quantityInBaseUnit = sale.qty / 1000;
      qtyMap.set(sale.name, (qtyMap.get(sale.name) || 0) + quantityInBaseUnit);
    });
    let topName = '', topQty = -1;
    for (let [name, qty] of qtyMap.entries()) {
      if (qty > topQty) { topQty = qty; topName = name; }
    }
    return topName;
  };

  const avgOrder = filteredSales.length ? (totalRevenue / filteredSales.length).toFixed(0) : 0;

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, activeFilter]);

  const openSaleModal = (item) => {
    setActiveItem(item);
    setQty(1);
    if (item.category === 'count') {
      setUnit('pcs');
    } else if (item.category === 'fixed') {
      setUnit('pkt');
    } else {
      setUnit(item.type === 'solid' ? 'kg' : 'L');
    }
  };

  const saveSale = () => {
    if (!activeItem) return;
    const total = calculateTotal(activeItem, qty, unit);
    const now = new Date();
    const newSale = {
      id: Date.now(),
      name: activeItem.name,
      qty, unit, total,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toISOString().split('T')[0],
      datetime: now.toISOString()
    };
    setSales([newSale, ...sales]);
    setToast(`${activeItem.name} recorded`);
    setActiveItem(null);
    setSearchTerm('');
  };

  const updateSale = () => {
    if (!editingSale) return;
    const total = calculateTotal(activeItem, qty, unit);
    const updatedSale = {
      ...editingSale,
      qty, unit, total,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      datetime: new Date().toISOString()
    };
    setSales(sales.map(s => s.id === editingSale.id ? updatedSale : s));
    setToast(`${activeItem.name} updated`);
    setEditingSale(null);
    setActiveItem(null);
  };

  const deleteSale = (id, name) => {
    if (window.confirm(`Delete sale of ${name}?`)) {
      setSales(sales.filter(s => s.id !== id));
      setToast(`${name} removed`);
    }
  };

  const exportCSV = () => {
    const headers = "Date,Time,Item,Qty,Unit,Total(PKR)\n";
    const data = filteredSales.map(s =>
      `${s.date},${s.time},${s.name},${s.qty},${s.unit},${s.total}`
    ).join("\n");
    const blob = new Blob([headers + data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IrshadStore_${dateRange}_${getTodayDate()}.csv`;
    link.click();
  };

  const addOrUpdateItem = (item) => {
    if (editingItem) {
      setInventory(inventory.map(i => i.id === editingItem.id ? item : i));
      setToast(`${item.name} updated`);
    } else {
      const newId = Math.max(...inventory.map(i => i.id), 0) + 1;
      setInventory([...inventory, { ...item, id: newId }]);
      setToast(`${item.name} added`);
    }
    setShowInventoryModal(false);
    setEditingItem(null);
  };

  const deleteItem = (id, name) => {
    if (window.confirm(`Delete item "${name}"? This will NOT affect past sales.`)) {
      setInventory(inventory.filter(i => i.id !== id));
      setToast(`${name} removed from inventory`);
    }
  };

  return (
    <div className="app-shell">
      {toast && (
        <div className="toast-popup">
          <div className="toast-content">
            <div className="toast-text">
              <strong>✓</strong> <p>{toast}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="glass-nav">
        <h1 className="logo">Irshad<span>Store</span></h1>
        {page === 'shop' && (
          <div className="nav-search-container">
            <input
              type="text" className="search-input" placeholder="Quick search..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <div className="nav-btns">
          <button className={page === 'shop' ? 'active' : ''} onClick={() => setPage('shop')}>POS</button>
          <button className={page === 'report' ? 'active' : ''} onClick={() => setPage('report')}>Report</button>
          <button onClick={() => { setEditingItem(null); setShowInventoryModal(true); }}>
            📦 Items
          </button>
        </div>
      </nav>

      {page === 'shop' ? (
        <main>
          <div className="filter-pills">
            {['all', 'loose', 'fixed', 'count'].map(cat => (
              <button
                key={cat} className={`pill-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="store-grid">
            {filteredInventory.map(item => (
              <div key={item.id} className="item-card" onClick={() => openSaleModal(item)}>
                <div className={`badge ${item.category}`}>{item.category}</div>
                <h4>{item.name}</h4>
                <p style={{ color: '#00d4ff', fontWeight: '800' }}>Rs. {item.price}</p>
                <button className="edit-item-btn" onClick={(e) => { e.stopPropagation(); setEditingItem(item); setShowInventoryModal(true); }}>✏️</button>
                <button className="delete-item-btn" onClick={(e) => { e.stopPropagation(); deleteItem(item.id, item.name); }}>🗑️</button>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <section className="report-view">
          <div className="performance-card">
            <div className="goal-info">
              <span>Today's Target: {DAILY_GOAL.toLocaleString()} PKR</span>
              <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>{progress.toFixed(0)}%</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              Today's revenue: {todayRevenue.toLocaleString()} PKR
            </div>
          </div>

          <div className="report-filters">
            <div className="date-buttons">
              <button className={dateRange === 'today' ? 'active' : ''} onClick={() => setDateRange('today')}>Today</button>
              <button className={dateRange === 'week' ? 'active' : ''} onClick={() => setDateRange('week')}>This Week</button>
              <button className={dateRange === 'all' ? 'active' : ''} onClick={() => setDateRange('all')}>All Time</button>
            </div>
            <input
              type="text" className="search-input" placeholder="Filter sales by product..."
              value={reportSearch} onChange={(e) => setReportSearch(e.target.value)}
            />
            <button className="export-btn" onClick={exportCSV}>📎 CSV</button>
          </div>

          <div className="revenue-glass">
            <div className="stat"><span>Top Item (by qty)</span><h2>{getTopItemByQuantity()}</h2></div>
            <div className="stat"><span>Avg Order</span><h2>{avgOrder}</h2></div>
            <div className="stat accent"><span>Revenue</span><h2>{totalRevenue.toLocaleString()}</h2></div>
            <div className="stat"><span>Transactions</span><h2>{filteredSales.length}</h2></div>
          </div>

          <div className="table-glass">
            <table>
              <thead>
                <tr><th>Date</th><th>Time</th><th>Item</th><th>Qty</th><th>Total</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredSales.map(s => (
                  <tr key={s.id}>
                    <td>{s.date}</td><td>{s.time}</td><td>{s.name}</td>
                    <td>{s.qty}{s.unit}</td><td>Rs. {s.total.toFixed(0)}</td>
                    <td>
                      <button className="edit-sale-btn" onClick={() => {
                        // Find item in current inventory; if not found, use sale data as fallback
                        const item = inventory.find(i => i.name === s.name);
                        if (item) {
                          setActiveItem(item);
                        } else {
                          // Create a temporary item object for editing (missing category/type)
                          setActiveItem({ name: s.name, price: s.total / s.qty, category: 'count' });
                        }
                        setEditingSale(s);
                        setQty(s.qty);
                        setUnit(s.unit);
                      }}>✏️</button>
                      <button className="delete-btn" onClick={() => deleteSale(s.id, s.name)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {(activeItem || editingSale) && (
        <div className="overlay">
          <div className="cool-modal">
            <div className="modal-accent"></div>
            <div className="modal-head">
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#00d4ff' }}>
                {activeItem?.category?.toUpperCase() || editingSale?.category?.toUpperCase()}
              </span>
              <h3>{activeItem?.name || editingSale?.name}</h3>
              <p style={{ fontSize: '1.2rem', color: '#00d4ff', fontWeight: '800' }}>
                Rs. {activeItem?.price}
              </p>
            </div>
            <div className="modal-body">
              {activeItem?.category === 'fixed' ? (
                <div className="pack-grid">
                  <button className={qty === 1 ? 'sel' : ''} onClick={() => setQty(1)}>1 Packet</button>
                  <button className={qty === 2 ? 'sel' : ''} onClick={() => setQty(2)}>2 Packets</button>
                  <button className={qty === 3 ? 'sel' : ''} onClick={() => setQty(3)}>3 Packets</button>
                  <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} style={{ gridColumn: 'span 3' }} />
                </div>
              ) : activeItem?.category === 'count' ? (
                <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} autoFocus />
              ) : (
                <div className="manual-input">
                  <input type="number" value={qty} onChange={(e) => setQty(parseFloat(e.target.value) || 0)} autoFocus />
                  <div className="unit-toggle-container">
                    <div className={`unit-slider ${(unit === 'g' || unit === 'ml') ? 'shift' : ''}`}></div>
                    <button className={`unit-btn ${unit === (activeItem?.type === 'solid' ? 'kg' : 'L') ? 'active' : ''}`}
                      onClick={() => setUnit(activeItem?.type === 'solid' ? 'kg' : 'L')}>
                      {activeItem?.type === 'solid' ? 'KG' : 'LITRE'}
                    </button>
                    <button className={`unit-btn ${unit === (activeItem?.type === 'solid' ? 'g' : 'ml') ? 'active' : ''}`}
                      onClick={() => setUnit(activeItem?.type === 'solid' ? 'g' : 'ml')}>
                      {activeItem?.type === 'solid' ? 'GRAMS' : 'ML'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="confirm-cool" onClick={editingSale ? updateSale : saveSale}>
                {editingSale ? 'Update' : 'Confirm'} – Rs. {calculateTotal(activeItem || editingSale, qty, unit).toFixed(0)}
              </button>
              <button className="cancel-cool" onClick={() => { setActiveItem(null); setEditingSale(null); }}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {showInventoryModal && (
        <InventoryModal
          item={editingItem}
          onSave={addOrUpdateItem}
          onClose={() => { setShowInventoryModal(false); setEditingItem(null); }}
        />
      )}
    </div>
  );
};

const InventoryModal = ({ item, onSave, onClose }) => {
  const [name, setName] = useState(item?.name || '');
  const [price, setPrice] = useState(item?.price || 0);
  const [category, setCategory] = useState(item?.category || 'loose');
  const [type, setType] = useState(item?.type || 'solid');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), price: parseFloat(price), category, type: category === 'loose' ? type : undefined });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="cool-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{item ? 'Edit Item' : 'Add New Item'}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="loose">Loose (by weight/volume)</option>
            <option value="fixed">Fixed (packet)</option>
            <option value="count">Count (per piece)</option>
          </select>
          {category === 'loose' && (
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="solid">Solid (kg/g)</option>
              <option value="liquid">Liquid (L/ml)</option>
            </select>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="confirm-cool" style={{ margin: 0 }}>Save</button>
            <button type="button" className="cancel-cool" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IrshadStore;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/api';
import { 
  Trash2,
  DollarSign,
  Plus,
  Filter,
  Receipt,
  CheckCircle,
  XCircle,
  User,
  MoreHorizontal
} from 'lucide-react';

const statusStyles = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Paid: 'bg-accent/10 text-accent border-accent/20',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const SalesOrders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [form, setForm] = useState({
    client: '',
    amount: '',
    items: [{ name: '', price: '', quantity: 1 }]
  });

  useEffect(() => {
    fetchOrders();
    fetchClients();
    
    // Check if navigating from Clients/Leads with a pre-selected client
    if (location.state?.clientId) {
      setForm(prev => ({ ...prev, client: location.state.clientId }));
      setShowModal(true);
    }
  }, [location]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/salesorders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (err) {
      console.error('Failed to fetch clients', err);
    }
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        amount: form.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0)
      };
      await api.post('/salesorders', payload);
      setShowModal(false);
      setForm({ client: '', amount: '', items: [{ name: '', price: '', quantity: 1 }] });
      fetchOrders();
    } catch (err) {
      alert('Failed to create sales order');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/salesorders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { name: '', price: '', quantity: 1 }] });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const filteredOrders = orders.filter(order => 
    order.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 fade-in bg-background text-textMain transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-textMain tracking-tighter uppercase italic">Sales Terminal</h1>
          <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Transactional ledger and order fulfillment matrix</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-accent text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest flex items-center shadow-lg shadow-accent/25 hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={20} className="mr-3" />
          Create Order
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-accent transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by client name or order ID..."
            className="w-full pl-14 pr-6 py-4 bg-surface border border-border rounded-2xl focus:border-accent outline-none transition-all shadow-sm text-textMain placeholder:text-textMuted/40 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-4 bg-surface border border-border rounded-2xl text-textMuted font-black uppercase tracking-widest text-[10px] flex items-center hover:text-textMain transition-colors shadow-sm active:scale-95">
            <Filter size={16} className="mr-3" />
            Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface rounded-[2.5rem] border border-border shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border text-textMuted transition-colors duration-300">
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] pl-10 text-textMuted">Order Signature</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-textMuted">Client Node</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-textMuted">Capital Value</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-textMuted">Fulfillment</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-right pr-10 text-textMuted">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-background transition-all group cursor-default">
                  <td className="px-8 py-6 pl-10">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-accent/5 border border-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-sm">
                        <Receipt size={22} />
                      </div>
                      <div>
                        <p className="font-black text-textMain text-sm tracking-tight tracking-wider">SEC_{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-[10px] text-textMuted font-medium uppercase tracking-widest mt-0.5 opacity-60">
                          {new Date(order.createdAt).toLocaleDateString()} // {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-9 h-9 bg-background border border-border rounded-full flex items-center justify-center overflow-hidden shadow-inner">
                        <User size={16} className="text-textMuted" />
                      </div>
                      <div>
                        <p className="font-black text-textMain text-sm tracking-tight">{order.client?.name || 'Anonymous'}</p>
                        <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest truncate max-w-[150px] mt-0.5">{order.client?.company || 'Indept. Entity'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xl font-black text-textMain tracking-tighter">${order.amount.toFixed(2)}</p>
                    <p className="text-[9px] text-textMuted font-black uppercase tracking-[0.2em] mt-0.5 opacity-40">{order.items?.length || 0} SECTOR NODES</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all ${
                      order.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      order.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right pr-10">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                       {order.status === 'Pending' && (
                         <button 
                           onClick={() => handleUpdateStatus(order._id, 'Paid')}
                           className="p-2.5 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-500/20"
                           title="Commit Payment"
                         >
                           <CheckCircle size={18} />
                         </button>
                       )}
                       <button className="p-2.5 text-textMuted bg-background border border-border hover:text-accent hover:border-accent rounded-xl transition-all shadow-sm">
                         <MoreHorizontal size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center space-y-4 opacity-10">
                      <Receipt size={72} className="text-textMuted" />
                      <p className="text-xl font-black text-textMuted uppercase tracking-[0.4em] italic">No Transactions Logged</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
          <div className="bg-surface rounded-[2.5rem] w-full max-w-2xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-border overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-emerald-500"></div>
            <div className="px-10 py-8 border-b border-border flex justify-between items-center bg-background/30">
              <div>
                <h3 className="text-2xl font-black text-textMain tracking-tighter uppercase italic">Dispatch Protocol</h3>
                <p className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] mt-1">Initializing new transactional sequence</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-background rounded-full transition-colors text-textMuted hover:text-textMain"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddOrder} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                {/* Client Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Client Selection Node</label>
                  <select 
                    required
                    className="w-full px-6 py-4 bg-background border border-border rounded-2xl focus:border-accent outline-none transition-all font-bold text-textMain shadow-sm appearance-none cursor-pointer"
                    value={form.client}
                    onChange={(e) => setForm({...form, client: e.target.value})}
                  >
                    <option value="" className="bg-surface">Select Target Protocol...</option>
                    {clients.map(c => (
                      <option key={c._id} value={c._id} className="bg-surface">{c.name} // {c.company}</option>
                    ))}
                  </select>
                </div>

                {/* Items Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest ml-1">Fulfillment Sectors</label>
                    <button 
                      type="button" 
                      onClick={addItem}
                      className="text-[10px] font-black text-accent flex items-center hover:opacity-80 transition-all uppercase tracking-widest px-4 py-2 bg-accent/5 rounded-xl border border-accent/10"
                    >
                      <Plus size={14} className="mr-2" /> Add Sector
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {form.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 items-end p-6 bg-background rounded-3xl border border-border shadow-sm animate-in slide-in-from-right-2 duration-300">
                        <div className="col-span-12 md:col-span-6 space-y-2">
                          <label className="text-[9px] font-black text-textMuted uppercase tracking-widest ml-1">Sector Name</label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. CORE INFRASTRUCTURE"
                            className="w-full px-5 py-3.5 bg-surface border border-border rounded-xl text-sm font-bold text-textMain outline-none focus:border-accent transition-all"
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="col-span-6 md:col-span-3 space-y-2">
                          <label className="text-[9px] font-black text-textMuted uppercase tracking-widest ml-1">Unit Weight (Value)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted text-xs font-black">$</span>
                            <input 
                              required
                              type="number" 
                              className="w-full pl-8 pr-4 py-3.5 bg-surface border border-border rounded-xl text-sm font-bold text-textMain outline-none focus:border-accent transition-all"
                              value={item.price}
                              onChange={(e) => updateItem(index, 'price', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-span-4 md:col-span-2 space-y-2">
                          <label className="text-[9px] font-black text-textMuted uppercase tracking-widest ml-1">Units</label>
                          <input 
                            required
                            type="number" 
                            className="w-full px-4 py-3.5 bg-surface border border-border rounded-xl text-sm font-bold text-textMain outline-none focus:border-accent transition-all text-center"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1 flex justify-end pb-1.5">
                          <button 
                            type="button" 
                            onClick={() => removeItem(index)}
                            className="p-2.5 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm border border-red-500/10"
                            title="Purge Sector"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Summary */}
                <div className="p-8 bg-accent/5 rounded-[2.5rem] border border-accent/10 flex justify-between items-center shadow-inner group">
                  <div>
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest">Aggregated Order Value</p>
                    <p className="text-4xl font-black text-textMain mt-1 tracking-tighter transition-transform group-hover:scale-105 inline-block">
                      ${form.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent animate-pulse">
                    <DollarSign size={32} />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 px-6 bg-background border border-border rounded-[1.5rem] text-textMuted font-black uppercase tracking-widest hover:text-textMain transition-all active:scale-95 text-[10px]"
                >
                  Abort Transmission
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 px-6 bg-accent text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-lg shadow-accent/25 hover:opacity-90 transition-all active:scale-95 text-[10px]"
                >
                  Commit Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrders;

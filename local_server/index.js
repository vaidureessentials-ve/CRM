const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xlsx = require('xlsx');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 💿 Hard Disk Storage: Dedicated folder for call recordings
const RECORDINGS_DIR = path.join(__dirname, 'recordings');
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR);
}

// Serve recordings statically so the frontend can play them via audio tags
app.use('/recordings', express.static(RECORDINGS_DIR));

// 📞 Call Log API: Mock data for local testing
app.get('/api/calls', (req, res) => {
  const mockCalls = [
    { _id: '1', client: { name: 'Aditya Singh', phone: '9876543210' }, duration: 125, status: 'Completed', createdAt: new Date(), recordingUrl: '/recordings/sample_call.mp3' },
    { _id: '2', client: { name: 'Priya Sharma', phone: '9123456789' }, duration: 45, status: 'Completed', createdAt: new Date(), recordingUrl: null },
  ];
  res.json(mockCalls);
});

// 🛳️ Dynamic Leads Storage
let leads = [
  { _id: 'lead1', name: 'Nexon Digital', phone: '9888777666', company: 'Nexon', source: 'Website', status: 'Unread', createdAt: new Date() },
  { _id: 'lead2', name: 'Zylus Corp', phone: '9555444333', company: 'Zylus', source: 'Referral', status: 'Read', createdAt: new Date() }
];

// 💰 Dynamic Sales Orders Storage
let salesOrders = [
  { 
    _id: `SO_${Date.now()}_1`, 
    amount: 168000, 
    status: 'Paid', 
    client: { name: 'Initial Revenue', company: 'System Legacy' },
    items: [{ name: 'Onboarding Packages', price: 168000, quantity: 1 }],
    createdAt: new Date('2024-03-31T10:00:00Z') 
  }
];

// 📊 Placeholder stats
app.get('/api/admin/stats', (req, res) => {
  res.json({ totalUsers: 6, totalLeads: leads.length, conversionRate: '27.4%', uptime: process.uptime(), systemStatus: 'Optimal' });
});

// 🗒️ Admin Logs
app.get('/api/admin/logs', (req, res) => {
  const mockLogs = [
    { _id: 'l1', timestamp: new Date(Date.now() - 1000 * 60 * 5), user: 'System', action: 'Lead Synchronization Complete', category: 'lead' },
    { _id: 'l2', timestamp: new Date(Date.now() - 1000 * 60 * 15), user: 'Admin', action: 'New Security Policy Deployed', category: 'system' },
    { _id: 'l3', timestamp: new Date(Date.now() - 1000 * 60 * 60), user: 'Aditya Singh', action: 'Manual Lead Ingest initiated', category: 'lead' },
    { _id: 'l4', timestamp: new Date(Date.now() - 1000 * 60 * 120), user: 'Priya Sharma', action: 'Associate Access Request Approved', category: 'auth' },
    { _id: 'l5', timestamp: new Date(Date.now() - 1000 * 60 * 300), user: 'System', action: 'Auto-Backup Sequence: Terminated Successfully', category: 'system' }
  ];
  res.json(mockLogs);
});

// 👥 Associates API
let mockAssociates = [
  { _id: 'a1', name: 'Aditya Singh', email: 'aditya_amigo', role: 'business_associate', sipExtension: '101', clients: [{}, {}, {}], calls: [{}, {}, {}, {}, {}] },
  { _id: 'a2', name: 'Sagar Kumar', email: 'sagar_amigo', role: 'business_associate', sipExtension: '102', clients: [{}, {}], calls: [{}, {}, {}] },
  { _id: 'a3', name: 'Priya Sharma', email: 'priya_amigo', role: 'team_leader', sipExtension: '103', clients: [{}, {}, {}, {}], calls: [{}, {}, {}, {}, {}, {}, {}] },
  { _id: 'a4', name: 'Rohan Verma', email: 'rohan_amigo', role: 'business_associate', sipExtension: '104', clients: [{}], calls: [{}, {}] },
  { _id: 'a5', name: 'Neha Gupta', email: 'neha_amigo', role: 'business_associate', sipExtension: '105', clients: [{}, {}], calls: [{}, {}, {}, {}] }
];

app.get('/api/auth/associates', (req, res) => {
  res.json(mockAssociates);
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, sipExtension, role } = req.body;
  const newAssoc = {
    _id: `a${Date.now()}`,
    name,
    email,
    password, 
    sipExtension,
    role: role || 'business_associate',
    clients: [],
    calls: []
  };
  mockAssociates.push(newAssoc);
  res.status(201).json(newAssoc);
});

app.delete('/api/auth/associates/:id', (req, res) => {
  mockAssociates = mockAssociates.filter(a => a._id !== req.params.id);
  res.json({ message: 'Associate removed successfully' });
});

// 📁 Excel Import API
app.post('/api/admin/import-leads', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file detected in upload node' });

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const newLeads = data.map(item => ({
      _id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: item.Name || item.name || 'Anonymous Prospect',
      phone: item['Mobile Number'] || item.Phone || item.phone || '9999999999',
      email: item.Email || item.email || '',
      company: item.Company || item.company || 'Direct',
      source: item.Source || item.source || 'XLSX Import',
      notes: `${item.Notes || ''} ${item.City ? `Location: ${item.City}` : ''}${item.State ? `, ${item.State}` : ''}`.trim() || 'Bulk synchronization data',
      segment: item.Segment || item.segment || 'Fresh Pool',
      status: 'Unread',
      createdAt: new Date()
    }));

    leads = [...newLeads, ...leads]; 
    res.json({ message: `${newLeads.length} Leads imported successfully into pool`, count: newLeads.length });
  } catch (err) {
    console.error('Data Ingest Error:', err);
    res.status(500).json({ message: 'System failure during data parsing' });
  }
});

// 💰 Sales Orders API
app.get('/api/salesorders', (req, res) => {
  res.json(salesOrders);
});

app.post('/api/salesorders', (req, res) => {
  const { client, amount, items } = req.body;
  const newOrder = {
    _id: `SO_${Date.now()}`,
    client: client || { name: 'Direct Sale', company: 'N/A' },
    amount: amount || 0,
    items: items || [],
    status: 'Pending',
    createdAt: new Date()
  };
  salesOrders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.put('/api/salesorders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orderIndex = salesOrders.findIndex(o => o._id === id);
  if (orderIndex !== -1) {
    salesOrders[orderIndex].status = status;
    return res.json(salesOrders[orderIndex]);
  }
  res.status(404).json({ message: 'Order not found' });
});

// 📝 Leads API
app.get('/api/leads', (req, res) => {
  res.json(leads);
});

app.post('/api/leads', (req, res) => {
  const newLead = { 
    ...req.body, 
    _id: `lead_${Date.now()}`, 
    status: 'Unread', 
    createdAt: new Date() 
  };
  leads.unshift(newLead);
  res.json(newLead);
});

app.put('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const leadIndex = leads.findIndex(l => l._id === id);
  if (leadIndex !== -1) {
    leads[leadIndex] = { ...leads[leadIndex], ...req.body, updatedAt: new Date() };
    return res.json(leads[leadIndex]);
  }
  res.status(404).json({ message: 'Lead not found' });
});

app.delete('/api/leads/:id', (req, res) => {
  leads = leads.filter(l => l._id !== req.params.id);
  res.json({ message: 'Lead removed successfully' });
});

app.post('/api/leads/:id/convert', (req, res) => {
  const { id } = req.params;
  const leadIndex = leads.findIndex(l => l._id === id);
  if (leadIndex !== -1) {
    leads[leadIndex].status = 'Converted';
    return res.json(leads[leadIndex]);
  }
  res.status(404).json({ message: 'Lead not found' });
});

// ⏰ Follow-ups, Trials
app.get('/api/followups', (req, res) => res.json([]));
app.get('/api/freetrials', (req, res) => res.json([]));

// 🎯 Team Target
let teamTarget = 1600000;
app.get('/api/admin/target', (req, res) => res.json({ target: teamTarget }));
app.post('/api/admin/target', (req, res) => {
  const { target } = req.body;
  if (target && !isNaN(target)) {
    teamTarget = Number(target);
    return res.json({ message: 'Team Target updated successfully', target: teamTarget });
  }
  res.status(400).json({ message: 'Invalid target value' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Local Backend active on http://0.0.0.0:${PORT}`);
    console.log(`📁 Call recordings stored on hard disk at: ${RECORDINGS_DIR}`);
});

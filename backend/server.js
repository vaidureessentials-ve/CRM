const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/calls', require('./routes/calls'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/followups', require('./routes/followup'));
app.use('/api/salesorders', require('./routes/salesorders'));
app.use('/api/freetrials', require('./routes/freetrials'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm', {
}).then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

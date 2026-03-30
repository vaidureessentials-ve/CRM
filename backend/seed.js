const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Client = require('./models/Client');
const Lead = require('./models/Lead');
const FollowUp = require('./models/FollowUp');
const SalesOrder = require('./models/SalesOrder');
const FreeTrial = require('./models/FreeTrial');

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm');
        console.log('Connected to MongoDB for seeding...');

        await User.deleteMany({});
        await Client.deleteMany({});
        await Lead.deleteMany({});
        await FollowUp.deleteMany({});
        await SalesOrder.deleteMany({});
        await FreeTrial.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('12345', salt);
        const assocPassword = await bcrypt.hash('123456', salt);

        // Create Admin
        const admin = await User.create({
            name: "Payal Varma",
            email: "payal_varma",
            password: adminPassword,
            sipExtension: "999",
            role: "admin"
        });

        // Create Associate
        const associate = await User.create({
            name: "Aparna Dwivedi",
            email: "aparna_dwivedi",
            password: assocPassword,
            sipExtension: "101",
            role: "associate"
        });

        console.log('Users created: Payal (Admin), Aparna (Associate)');

        // Create some Leads
        const leads = await Lead.insertMany([
            { name: "Harvindra", phone: "8100000008", source: "Fresh Pool", segment: "Fresh Pool", status: "Unread", assignedTo: associate._id, notes: "Interested in premium plan" },
            { name: "Yashu", phone: "6200000088", source: "Website", segment: "Potential Pool", status: "Read", assignedTo: associate._id, notes: "Requested callback tomorrow" },
            { name: "Siddharth", phone: "9100000011", source: "Referral", segment: "Prime Pool", status: "Converted", assignedTo: associate._id },
            { name: "Priya", phone: "7000000066", source: "Website", segment: "Hot", status: "Disposed", assignedTo: associate._id, notes: "Not interested" }
        ]);

        // Create a Client (from converted lead)
        const client = await Client.create({
            name: "Siddharth",
            phone: "9100000011",
            email: "sidd@example.com",
            company: "Logic Soft",
            assignedTo: associate._id,
            status: "Active"
        });

        // Create Follow-ups
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        await FollowUp.insertMany([
            { lead: leads[0]._id, user: associate._id, followUpDate: new Date(), notes: "Call today!", status: "Pending", clientName: "Harvindra", phone: "8100000008" },
            { lead: leads[1]._id, user: associate._id, followUpDate: tomorrow, notes: "Review doc", status: "Pending", clientName: "Yashu", phone: "6200000088" },
            { lead: leads[2]._id, user: associate._id, followUpDate: yesterday, notes: "Initial talk", status: "Done", clientName: "Siddharth", phone: "9100000011" }
        ]);

        // Create Sales Orders
        await SalesOrder.insertMany([
            { client: client._id, amount: 475, status: "Paid", createdBy: associate._id, items: [{ name: "Enterprise License", price: 475, quantity: 1 }] },
            { client: client._id, amount: 25, status: "Pending", createdBy: associate._id, items: [{ name: "Support Plan", price: 25, quantity: 1 }] }
        ]);

        // Create Free Trial
        await FreeTrial.create({
            lead: leads[0]._id,
            endDate: tomorrow,
            status: "Active",
            notes: "7-day trial started",
            assignedTo: associate._id
        });

        console.log('Database seeded with Leads, Clients, FollowUps, SalesOrders, and FreeTrials!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();

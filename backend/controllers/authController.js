const User = require('../models/User');
const Client = require('../models/Client');
const CallLog = require('../models/CallLog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    const { name, email, password, sipExtension, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name, email, password: hashedPassword, sipExtension, role: role || 'associate'
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                sipExtension: user.sipExtension,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const clients = await Client.find({ assignedTo: user._id });
            const calls = await CallLog.find({ user: user._id });
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                sipExtension: user.sipExtension,
                role: user.role,
                clients,
                calls,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').lean();
        if (!user) return res.status(404).json({ message: 'User not found' });
        const clients = await Client.find({ assignedTo: user._id });
        const calls = await CallLog.find({ user: user._id });
        res.json({ ...user, clients, calls });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAssociates = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').lean();
        
        // Final privacy check: Only admin should see everyone's clients/calls counts
        if (req.user.role === 'admin') {
            const enhancedUsers = await Promise.all(users.map(async (user) => {
                const clients = await Client.find({ assignedTo: user._id });
                const calls = await CallLog.find({ user: user._id });
                return {
                    ...user,
                    clients,
                    calls
                };
            }));
            return res.json(enhancedUsers);
        }

        // For associates, just return the list without sensitive counts
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Restriction: Only admin can delete users, or the user themselves?
        // Usually deletion is admin-only in CRM, but let's allow self-deletion too if needed.
        // For now, let's stick to the plan: restrict to admins or self.
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized to delete this user' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Restriction: Only admin can update other users, or the user themselves can update their profile.
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.sipExtension = req.body.sipExtension || user.sipExtension;
        
        // Only admin can change roles
        if (req.user.role === 'admin') {
            user.role = req.body.role || user.role;
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            sipExtension: updatedUser.sipExtension,
            role: updatedUser.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

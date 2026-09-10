const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database
let registeredUsers = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Register Account with default balance of 1,500 UGX
app.post('/api/signup', (req, res) => {
    const { username, mobile, password } = req.body;
    
    const existingUser = registeredUsers.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ success: false, message: "Username already exists!" });
    }

    registeredUsers.push({ 
        username, 
        mobile, 
        password, 
        balance: 1500, // Starting balance set to 1,500 UGX
        createdAt: new Date() 
    });
    res.json({ success: true, message: "Account registered successfully! You received a starting balance of 1,500 UGX." });
});

// API: Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = registeredUsers.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials or account does not exist." });
    }

    res.json({ 
        success: true, 
        message: "Login successful", 
        user: {
            username: user.username,
            mobile: user.mobile,
            balance: user.balance
        }
    });
});
// BACKEND PANEL API: View all registered accounts
app.get('/api/admin/accounts', (req, res) => {
    res.json({
        totalUsers: registeredUsers.length,
        users: registeredUsers.map(u => ({ username: u.username, mobile: u.mobile, balance: u.balance, registeredAt: u.createdAt }))
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Growvest server running on port ${PORT}`);
});
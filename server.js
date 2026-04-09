const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'shadow_net';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;
let collection;
let logs;

async function connectDB() {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db(DB_NAME);
        collection = db.collection('users');
        logs = db.collection('access_logs');
        
        await collection.deleteMany({});
        await collection.insertMany([
            { username: 'admin', password: 's3cr3t_p4ssw0rd', email: 'admin@shadow.net', role: 'superuser', api_key: 'sk-1337-admin-key-2024' },
            { username: 'ghost', password: 'phantom123', email: 'ghost@darkweb.io', role: 'operative', api_key: 'sk-ghost-ops-789' },
            { username: 'shadow', password: 'invisible99', email: 'shadow@underground.org', role: 'agent', api_key: 'sk-shadow-456' },
            { username: 'zero', password: 'nullpointer', email: 'zero@null.xyz', role: 'user', api_key: 'sk-zero-000' },
            { username: 'cipher', password: 'decode_me', email: 'cipher@hidden.net', role: 'user', api_key: 'sk-cipher-321' }
        ]);
        
        console.log('>>> [SHADOW_NET] Database initialized');
    } catch (err) {
        console.error('>>> [ERROR] Database connection failed:', err.message);
    }
}

async function logAccess(ip, endpoint, data) {
    try {
        await logs.insertOne({ ip, endpoint, data, timestamp: new Date(), status: 'logged' });
    } catch (e) {}
}

app.use((req, res, next) => {
    logAccess(req.ip, req.path, req.body);
    next();
});

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
    <title>SHADOW_NET // Access Point</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0a; color: #00ff00; font-family: 'Courier New', monospace; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .container { text-align: center; padding: 40px; border: 2px solid #00ff00; box-shadow: 0 0 30px #00ff0044; }
        h1 { font-size: 2.5em; text-shadow: 0 0 10px #00ff00; margin-bottom: 20px; }
        .subtitle { color: #ff0000; font-size: 1.2em; margin-bottom: 30px; }
        .status { background: #111; padding: 20px; border: 1px solid #00ff00; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>SHADOW_NET</h1>
        <div class="subtitle">/// UNDERGROUND DATA INTERFACE ///</div>
        <div class="status">
            <p>>> SYSTEM ACTIVE</p>
            <p>>> STATUS: VULNERABLE</p>
        </div>
        <p>Endpoints: /login, /search, /users, /admin/lookup</p>
    </div>
</body>
</html>`);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await collection.findOne({ username: username, password: password });
        if (user) {
            res.json({ status: 'success', message: 'ACCESS GRANTED', user: { username: user.username, role: user.role, api_key: user.api_key } });
        } else {
            res.json({ status: 'failed', message: 'ACCESS DENIED', hint: 'Try NoSQL injection' });
        }
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.post('/search', async (req, res) => {
    const { query } = req.body;
    try {
        const results = await collection.find(query || {}).toArray();
        res.json({ status: 'success', results: results, count: results.length });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/users', async (req, res) => {
    const { filter } = req.query;
    try {
        let query = {};
        if (filter) query = JSON.parse(filter);
        const users = await collection.find(query).toArray();
        res.json({ status: 'success', data: users, count: users.length });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.post('/admin/lookup', async (req, res) => {
    const { user_query } = req.body;
    try {
        const query = eval('(' + user_query + ')');
        const result = await collection.find(query).toArray();
        res.json({ status: 'success', data: result, _debug: 'Direct eval - PWNED' });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.post('/auth', async (req, res) => {
    try {
        const result = await collection.findOne(req.body);
        res.json(result ? { auth: 'valid', user: result.username } : { auth: 'invalid' });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/debug/collection', async (req, res) => {
    try {
        const allData = await collection.find({}).toArray();
        res.json({ collection: 'users', documents: allData });
    } catch (err) {
        res.json({ error: err.message });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('SHADOW_NET SERVER running on port ' + PORT);
    });
});

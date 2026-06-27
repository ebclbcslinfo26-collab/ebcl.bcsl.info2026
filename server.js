/**
 * Ebenezer Baptist Church, Lunsar — Express Server
 * Node.js + Express + MySQL2
 *
 * Install: npm install express mysql2 cors dotenv body-parser
 * Run:     node server.js
 */

const express    = require('express');
const mysql      = require('mysql2/promise');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Database Pool ────────────────────────────────────────────
const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASS     || '',
    database: process.env.DB_NAME     || 'ebenezer_church',
    waitForConnections: true,
    connectionLimit:    10,
});

// ─── Helper ───────────────────────────────────────────────────
const query = async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
};

// ─── Routes: Sermons ──────────────────────────────────────────
app.get('/api/sermons', async (req, res) => {
    try {
        const sermons = await query(
            'SELECT * FROM sermons ORDER BY sermon_date DESC LIMIT 10'
        );
        res.json({ success: true, data: sermons });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/sermons/:id', async (req, res) => {
    try {
        const [sermon] = await query('SELECT * FROM sermons WHERE id = ?', [req.params.id]);
        if (!sermon) return res.status(404).json({ success: false, error: 'Not found' });
        res.json({ success: true, data: sermon });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ─── Routes: Events ───────────────────────────────────────────
app.get('/api/events', async (req, res) => {
    try {
        const events = await query(
            `SELECT * FROM events
             WHERE is_published = TRUE AND event_date >= CURDATE()
             ORDER BY event_date ASC LIMIT 20`
        );
        res.json({ success: true, data: events });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ─── Routes: Prayer Requests ──────────────────────────────────
app.post('/api/prayer-requests', async (req, res) => {
    const { name, email, request, is_anonymous } = req.body;
    if (!name || !request) {
        return res.status(400).json({ success: false, error: 'Name and request are required.' });
    }
    try {
        await query(
            'INSERT INTO prayer_requests (name, email, request, is_anonymous) VALUES (?, ?, ?, ?)',
            [name, email || null, request, is_anonymous ? 1 : 0]
        );
        res.json({ success: true, message: 'Prayer request submitted. We will pray for you.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ─── Routes: Contact ──────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }
    try {
        await query(
            'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone || null, subject || null, message]
        );
        res.json({ success: true, message: 'Your message has been received. We will get back to you shortly.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ─── Routes: Newsletter ───────────────────────────────────────
app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });
    try {
        await query(
            'INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)',
            [email]
        );
        res.json({ success: true, message: 'You have been subscribed to our newsletter!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ─── Routes: Donations ────────────────────────────────────────
app.post('/api/donations', async (req, res) => {
    const { donor_name, amount, purpose, payment_reference } = req.body;
    if (!amount || isNaN(amount)) {
        return res.status(400).json({ success: false, error: 'A valid amount is required.' });
    }
    try {
        await query(
            'INSERT INTO donations (donor_name, amount, purpose, payment_reference) VALUES (?, ?, ?, ?)',
            [donor_name || 'Anonymous', amount, purpose || 'offering', payment_reference || null]
        );
        res.json({ success: true, message: 'Thank you for your generous giving!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ─── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Ebenezer Baptist Church API is running.' });
});

// ─── Catch-all: serve index.html ─────────────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n✝  Ebenezer Baptist Church server running at http://localhost:${PORT}\n`);
});

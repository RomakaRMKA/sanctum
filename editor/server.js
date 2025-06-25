const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

const CHARACTERS_DIR = path.join(__dirname, '../characters');
const ORDER_PATH = path.join(CHARACTERS_DIR, 'order.json');

app.use(express.json());
app.use(fileUpload());
app.use(express.static(__dirname));

// List all character folders in saved order
app.get('/api/characters', (req, res) => {
    fs.readdir(CHARACTERS_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: err.message });
        const dirs = files.filter(f => fs.statSync(path.join(CHARACTERS_DIR, f)).isDirectory());
        if (fs.existsSync(ORDER_PATH)) {
            const order = JSON.parse(fs.readFileSync(ORDER_PATH, 'utf8'));
            // Only include dirs that still exist
            const ordered = order.filter(name => dirs.includes(name));
            // Add any new dirs not in order.json at the end
            const rest = dirs.filter(name => !order.includes(name)).sort();
            return res.json([...ordered, ...rest]);
        } else {
            return res.json(dirs.sort());
        }
    });
});

// Get character data.json
app.get('/api/character/:name', (req, res) => {
    const charDir = path.join(CHARACTERS_DIR, req.params.name);
    const dataPath = path.join(charDir, 'data.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(404).json({ error: 'Character not found' });
        res.json(JSON.parse(data));
    });
});

// Update character data.json
app.post('/api/character/:name', (req, res) => {
    const charDir = path.join(CHARACTERS_DIR, req.params.name);
    const dataPath = path.join(charDir, 'data.json');
    const { id, name, title, race, bio } = req.body;
    const data = { id, name, title, race, bio };
    fs.writeFile(dataPath, JSON.stringify(data, null, 2), err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Upload portrait
app.post('/api/character/:name/portrait', (req, res) => {
    if (!req.files || !req.files.portrait) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const charDir = path.join(CHARACTERS_DIR, req.params.name, 'assets');
    if (!fs.existsSync(charDir)) fs.mkdirSync(charDir, { recursive: true });
    const portrait = req.files.portrait;
    const ext = path.extname(portrait.name).toLowerCase();
    const dest = path.join(charDir, 'portrait' + ext);
    portrait.mv(dest, err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, filename: 'portrait' + ext });
    });
});

// Create new character
app.post('/api/character', (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) return res.status(400).json({ error: 'ID and Name required' });
    const charDir = path.join(CHARACTERS_DIR, name);
    if (fs.existsSync(charDir)) return res.status(400).json({ error: 'Character already exists' });
    fs.mkdirSync(path.join(charDir, 'assets'), { recursive: true });
    const data = { id, name, title: '', race: '', bio: '' };
    fs.writeFileSync(path.join(charDir, 'data.json'), JSON.stringify(data, null, 2));
    res.json({ success: true });
});

// Save character order
app.post('/api/characters/order', (req, res) => {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ error: 'Order must be an array' });
    fs.writeFile(ORDER_PATH, JSON.stringify(order, null, 2), err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Editor server running at http://localhost:${PORT}`);
}); 
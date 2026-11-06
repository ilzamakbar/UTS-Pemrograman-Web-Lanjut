const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 1. Endpoint Pencarian Resep (TheMealDB: search.php?s=chicken)
app.get('/api/recipes/search', async (req, res) => {
    try {
        const query = req.query.s || 'chicken';
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        if (!response.ok) throw new Error('Gagal mengambil data pencarian resep');
        const data = await response.json();

        res.status(200).json({
            success: true,
            data: data.meals
        });
    } catch (error) {
        res.status(502).json({ success: false, message: error.message });
    }
});

// 2. Endpoint Daftar Kategori (TheMealDB: categories.php)
app.get('/api/categories', async (req, res) => {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        if (!response.ok) throw new Error('Gagal mengambil daftar kategori');
        const data = await response.json();

        res.status(200).json({
            success: true,
            data: data.categories
        });
    } catch (error) {
        res.status(502).json({ success: false, message: error.message });
    }
});

// 3. Endpoint Detail Resep berdasarkan ID (TheMealDB: lookup.php?i=52772)
app.get('/api/recipes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        if (!response.ok) throw new Error('Gagal mengambil detail resep');
        const data = await response.json();

        if (!data.meals) {
            return res.status(404).json({ success: false, message: 'Resep tidak ditemukan' });
        }

        res.status(200).json({
            success: true,
            data: data.meals[0]
        });
    } catch (error) {
        res.status(502).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Express berjalan di http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors()); // Svelte mengakses API
app.use(express.json());

// Endpoint 1: Menampilkan daftar resep (kategori Seafood sebagai contoh default)
app.get('/api/recipes', async (req, res) => {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood');
        if (!response.ok) throw new Error('Gagal mengambil data dari TheMealDB');
        const data = await response.json();

        // Format respons agar mudah dibaca frontend
        res.status(200).json({
            success: true,
            data: data.meals
        });
    } catch (error) {
        res.status(502).json({ success: false, message: error.message });
    }
});

// Endpoint 2: Menampilkan detail resep berdasarkan ID
app.get('/api/recipes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        if (!response.ok) throw new Error('Gagal mengambil detail dari TheMealDB');
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
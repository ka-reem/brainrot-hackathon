const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
// Fix config import
const config = global.config || require('./config.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Add health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/generate-image', async (req, res) => {
    console.log('Received request for image generation');
    const account_id = "//";
    const api_token = "//";
    const targetUrl = `https://api.cloudflare.com/client/v4/accounts/${account_id}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`;
    
    try {
        console.log('Sending request to Cloudflare...');
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_token}`
            },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            throw new Error(`Cloudflare API responded with status: ${response.status}`);
        }
        
        const data = await response.blob();
        const buffer = await data.arrayBuffer();
        
        res.send(Buffer.from(buffer));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Make sure to run the frontend on a different port');
});
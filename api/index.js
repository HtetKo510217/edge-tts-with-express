const express = require('express');
const cors = require('cors');
const { EdgeTTS } = require('node-edge-tts');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/tts', async (req, res) => {
    const { text } = req.body;
    try {
        const tts = new EdgeTTS({
            voice: 'km-KH-SreymomNeural',
            lang: 'km-KH',
        });

        const filePath = path.join(__dirname, 'output.mp3');
        await tts.ttsPromise(text, filePath);

        res.sendFile(filePath, () => {
            fs.unlinkSync(filePath);  // Delete the file after sending it
        });
    } catch (error) {
        console.error('Error with TTS:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.options('/tts', cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const fs = require('fs');

let content = fs.readFileSync('server-app.ts', 'utf8');

// Prepend imports
if (!content.includes('multer')) {
  content = `import multer from "multer";\nimport fs from "fs";\n` + content;
}

// Append endpoint
const endpoint = `

const upload = multer({ dest: 'uploads/' });

app.post('/api/analyze-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: 'Gemini API not configured' });
    }

    // Upload using File API
    const uploadResult = await ai.files.upload({
      file: req.file.path,
      mimeType: req.file.mimetype,
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    // Wait for processing
    let fileState = await ai.files.get({ name: uploadResult.name });
    while (fileState.state === 'PROCESSING') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      fileState = await ai.files.get({ name: uploadResult.name });
    }

    if (fileState.state === 'FAILED') {
      return res.status(500).json({ error: 'Video processing failed in Gemini' });
    }

    const prompt = "Watch this video and provide a comprehensive analysis of the key information, main topics, and any notable events or entities discussed.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [
        {
          fileData: {
            fileUri: uploadResult.uri,
            mimeType: uploadResult.mimeType,
          }
        },
        { text: prompt }
      ]
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error('Video Analysis API Error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error?.message || 'Video analysis failed' });
  }
});
`;

if (!content.includes('/api/analyze-video')) {
  content = content.replace('export default app;', endpoint + '\nexport default app;');
}

fs.writeFileSync('server-app.ts', content);

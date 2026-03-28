const fs = require('fs');
const https = require('https');

const envFile = fs.readFileSync('.env.local', 'utf8');
const keyLine = envFile.split('\n').find(line => line.startsWith('GEMINI_API_KEY='));
const key = keyLine ? keyLine.split('=')[1].trim() : null;

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const parsed = JSON.parse(data);
        const embedModels = parsed.models.filter(m => m.name.includes('embed'));
        console.log("MODELS:");
        embedModels.forEach(m => console.log(m.name, m.supportedGenerationMethods.join(',')));
    });
});

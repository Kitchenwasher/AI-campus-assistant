const fs = require('fs');
const https = require('https');

const envFile = fs.readFileSync('.env.local', 'utf8');
const keyLine = envFile.split('\n').find(line => line.startsWith('GEMINI_API_KEY='));
const key = keyLine ? keyLine.split('=')[1].trim() : null;

if (!key) {
    console.error("No key found");
    process.exit(1);
}

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            const embedModels = parsed.models.filter(m => m.name.includes('embed'));
            console.log(JSON.stringify(embedModels, null, 2));
        } catch (e) {
            console.error(e);
        }
    });
});

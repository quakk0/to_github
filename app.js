import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

function isXSS(input) {
  const xssPattern = /<[^>]+>|script|onerror|onload/i;
  return xssPattern.test(input);
}

function isSQLInjection(input) {
  const sqlPattern = /('|--|;|\/\*|\*\/|union|select|insert|drop|delete|update)/i;
  return sqlPattern.test(input);
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/search', (req, res) => {
  const term = req.body.term;

  if (isXSS(term) || isSQLInjection(term)) {
    return res.redirect('/');
  }

  res.redirect('/result?term=' + encodeURIComponent(term));
});

app.get('/result', (req, res) => {
  const term = req.query.term || '';
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Result</title></head>
    <body>
        <h1>Search Term: ${term}</h1>
        <a href="/">Go Back</a>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;

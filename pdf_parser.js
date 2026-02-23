import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractText() {
    const pdfPath = process.argv[2];
    if (!pdfPath) {
        console.error('Specifica il nome del file PDF. Esempio: node pdf_parser.js ./pdf/logica.pdf');
        process.exit(1);
    }

    try {
        const absolutePath = path.resolve(__dirname, pdfPath);
        const dataBuffer = fs.readFileSync(absolutePath);
        const data = await pdf(dataBuffer);

        // Salviamo il testo grezzo per analizzare i pattern
        const outPath = path.resolve(__dirname, 'pdf/raw_output.txt');
        fs.writeFileSync(outPath, data.text);

        console.log(`\n✅ PDF Letto con successo! ${data.numpages} pagine elaborate.`);
        console.log(`Testo grezzo salvato in: ${outPath}`);
        console.log(`\nOra l'IA può leggere il file raw_output.txt e convertire le domande nel JSON formattato.`);
    } catch (error) {
        console.error('\n❌ Errore durante la lettura del PDF:', error.message);
    }
}

extractText();

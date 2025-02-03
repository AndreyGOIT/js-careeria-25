const express = require('express');
const cors = require('cors');
const employees = require('./data/employees.json');
const fs = require('fs').promises;

const app = express();
app.use(cors());

//--staattinen web palvelin-------- 
const path = require('path');
const htmlPath = path.join(path.join(__dirname, '/public'));
app.use(express.static(htmlPath));
//-------------------------------------

//------endpoints-----
app.get('/', (req, res) => {
    res.sendFile(path.join(htmlPath, 'index.html'));
});
app.get('/palvelut', (req, res) => {
    res.sendFile(path.join(htmlPath, '/palvelut.html'));
});
app.get('/yhteystiedot', (req, res) => {
    res.sendFile(path.join(htmlPath, 'yhteystiedot.html'));
});
app.get('/verkkosivuston-kehitys', (req, res) => {
    res.sendFile(path.join(htmlPath, 'pages/verkkosivuston-kehitys.html'));
});
app.get('/sovelluskehitys', (req, res) => {
    res.sendFile(path.join(htmlPath, 'pages/sovelluskehitys.html'));
});
app.get('/hakukoneoptimointi', (req, res) => {
    res.sendFile(path.join(htmlPath, 'pages/hakukoneoptimointi.html'));
});
//----------------------------------------


//--REST API palvelin-----
app.get('/api/employees', (req, res) => {
    res.send(employees);
});

//pinkodin lukeminen txt-tiedostosta palvelimelta ja lähettäminen selaimelle
app.get('/api/getpin', async (req, res) => {
    try {
        const savedPin = await fs.readFile('pin.txt', 'utf8');
        res.json({ pin: savedPin.trim() });
    } catch (error) {
        console.error('Error reading pin from file:', error);
        res.status(500).json({ error: 'Error reading pin from file' }); // Ошибку тоже в JSON
    }
});
//-----------------------------------------

//palvelimen käynnistys
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);    
});
const express = require('express');
const cors = require('cors');
const employees = require('./data/employees.json');

const app = express();
app.use(cors());

//--staattinen web palvelin-------- 
const path = require('path');
const htmlPath = path.join(path.join(__dirname, '/public'));
app.use(express.static(htmlPath));

//--REST API palvelin-----
app.get('/api/employees', (req, res) => {
    res.send(employees);
});

//palvelimen käynnistys
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);    
});
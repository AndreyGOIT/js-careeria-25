// BACK END
const express = require('express');
const cors = require('cors');
const employees = require('./data/employees.json');
const fs = require('fs').promises;

const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);


//-----staattinen web palvelin-------- 
const path = require('path');
const htmlPath = path.join(path.join(__dirname, '/public'));
app.use(express.static(htmlPath));
//-------------------------------------

//-----socket.io-----
io.on('connection', (socket) => {
    console.log('Käyttäjä yhdistetty:', socket.id);

    // Processing the entrance to the chat
  socket.on("join", (name) => {
    socket.username = name; // Save the username
    io.emit("join", name); // We notify all users
  });

  // Processing message sending
  socket.on("message", (data) => {
    io.emit("message", { sender: socket.username, text: data.text });
  });

  // Handling exit from chat
  socket.on("leave", (name) => {
    io.emit("leave", name);
  });

  socket.on("disconnect", () => {
    console.log("Käyttäjä katkaisi yhteyden");
  });
});
//---------endpoints----------
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

//------------REST API palvelin-----------
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
        res.status(500).json({ error: 'Error reading pin from file' }); // Virhe on myös JSONissa
    }
});
//-----------------------------------------

//----------palvelimen käynnistys----------
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Example app listening on port ${PORT}!`);    
});
//-----------------------------------------
//server was deployed on render.com
//https://webworksstudio.onrender.com
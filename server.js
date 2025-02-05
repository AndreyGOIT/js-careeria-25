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

    // Обрабатываем вход в чат
  socket.on("join", (name) => {
    socket.username = name; // Сохраняем имя пользователя
    io.emit("join", name); // Оповещаем всех пользователей
  });

  // Обрабатываем отправку сообщений
  socket.on("message", (data) => {
    io.emit("message", { sender: socket.username, text: data.text });
  });

  // Обрабатываем выход из чата
  socket.on("leave", (name) => {
    io.emit("leave", name);
  });

  socket.on("disconnect", () => {
    console.log("Käyttäjä katkaisi yhteyden");
  });

    // socket.on("message", (text) => {
    //     io.emit("message", { text, sender: socket.id }); // Postitus kaikille asiakkaille
    // });

    // socket.on('disconnect', () => {
    //     console.log('Käyttäjä on katkaissut yhteyden');
    // });
});
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

//------REST API palvelin-----
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

//------palvelimen käynnistys-----
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Example app listening on port ${PORT}!`);    
});
//----------------check pin--------------------
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("pin").addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
          checkPin(); // Вызываем функцию проверки PIN-кода
      }
  });
});

//----------------save pin----------------------
const savedPin = localStorage.getItem("pinEntered");
if (savedPin) {
  // Show hidden elements and hide the PIN input field
  if (
    document.getElementById("pin-div") ||
    document.getElementById("footer-main")
  ) {
    showElements();
  }
}

//-----------------log out------------------------
function logOut() {
  localStorage.clear();
  // Hide hidden elements and show the PIN input field
  window.location.href = "/"; //Ohjaa etusivulle
}

//--------------pin tarkistus----------------------
async function checkPin() {
  const pin = document.getElementById("pin").value;
  try {
    const response = await fetch("https://webworksstudio.onrender.com/api/getpin");
    
    const data = await response.json();
    const correctPin = data.pin;

    if (pin === correctPin) {
      localStorage.setItem("pinEntered", pin);
      // Show the welcome message
      document.getElementById("welcome-message").style.visibility = "visible";
      document.getElementById("input-label").style.display = "none";
      // Hide the welcome message after 3 seconds
      setTimeout(() => {
        document.getElementById("welcome-message").style.visibility = "hidden";
        // Show hidden elements and hide the PIN input field
        if (
          document.getElementById("pin-div") ||
          document.getElementById("footer-main")
        ) {
          showElements();
        }
      }, 3000);
    } else {
      alert("Väärä PIN-koodi!");
      document.getElementById("pin").value = ""; // Tyhjennä PIN-kenttä
    }
  } catch (error) {
    //console.error("Virhe PIN-tarkistuksessa:", error);
    alert("Virhe PIN-tarkistuksessa. Ota yhteyttä ylläpitoon.");
  }
}

//------------------show elements----------------------
function showElements() {
  // Show the hidden elements
  const hiddenElements = document.querySelectorAll(".hidden");
  if (hiddenElements.length > 0) {
    hiddenElements.forEach((element) => {
      element.style.visibility = "visible";
    });
  } else {
    console.warn('ei ole elementtejä joilla on luokka ".hidden"');
  }
  // Hide the PIN input field
  const pinDiv = document.getElementById("pin-div");
  if (pinDiv) {
    pinDiv.style.display = "none";
  } else {
    console.warn('Elementti "pin-div" ei löydy');
  }

  const footer = document.getElementById("footer-main");
  if (footer) {
    footer.style.display = "block";
  } else {
    console.warn('Elementti "footer-main" ei löydy');
  }
}

//---Fetch data from the API and display it in the tab container----
async function fetchData() {
  document.getElementById("tabCont").innerHTML = "<h4>Ladataan...</h4>";
  let x = `<table class="w3-table-all w3-hoverable">
              <thead>
              <tr class="w3-light-grey">
                <th class="w3-center">Avaatar</th>
                <th class="w3-center">Nimi</th>
                <th class="w3-center">Tehtävä</th>
                <th class="w3-center">Sähköposti</th>
                <th class="w3-center">Puhelin</th>
              </tr>
              </thead><tbody>`;
  // Fetch data from the API
  try {
    const response = await fetch("https://webworksstudio.onrender.com/api/employees");

    const data = await response.json();
    const team = data.team;

    x += team
      .map(
        (member) => `
              <tr>
                <td><img src="${member.avatar}" alt="Avatar" class="w3-image w3-circle" style="width: 50px"></td>
                <td>${member.name}</td>
                <td>${member.role}</td>
                <td><a href="mailto:${member.email}">${member.email}</a></td>
                <td><a href="tel:${member.phone}">${member.phone}</a></td>
              </tr>`
      )
      .join("");

    x += "</tbody></table>";
    document.getElementById("tabCont").innerHTML = x;
  } catch (error) {
    //virhetilanteessa näytetään virheilmoitus
    console.error("Error fetching data:", error);
  }
}

// Fetch data when the page is loaded
if (document.getElementById("tabCont")) {
  document.addEventListener("DOMContentLoaded", () => {
    fetchData();
  });
}

//------------Socket.IO client (Chat)----------------------
const socket = io();

// Modaaliikkunan avaaminen/sulkeminen
const chatButton = document.getElementById("chat-button");
const chatModal = document.getElementById("chat-modal");
const closeChat = document.getElementById("close-chat");
let user = "";

// Modaaliikkuna chatkäyttäjän nimen kysymiseksi
function askForUsername() {
  return new Promise((resolve, reject) => {
    const modal = document.getElementById("customPrompt");
    modal.style.display = "flex";

    window.resolvePrompt = function () {
      let userInput = document.getElementById("promptInput").value.trim();
      if (userInput) {
        modal.style.display = "none";
        resolve(userInput);
      } else {
        alert("Enter your name!");
      }
    };

    window.rejectPrompt = function () {
      modal.style.display = "none";
      reject("The user cancelled the name entry.");
    };
  });
}

async function startChat() {
  try {
    // Call the name request before starting the chat
    user = await askForUsername();
    
    // 👇 Here we continue executing the code after entering the name
    chatModal.style.display = "block";
    socket.emit("join", user); // Sending a chat entry event to the server
  } catch (error) {
    console.log(error);
  }
}

// Socket.IO-yhteyden muodostus
chatButton.addEventListener("click", () => {
  startChat();
});

closeChat.addEventListener("click", () => {
  socket.emit("leave", user); // Sending a chat exit event to the server
  user = "";
  chatModal.style.display = "none";
});
// Viestin lähetyskäsittelijä
document.getElementById("send-message").addEventListener("click", sendMessage);

// Sending messages by pressing "Enter"
document.getElementById("chat-input").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Preventing line breaks
    sendMessage();
  }
});
  
function sendMessage() {
  const messageInput = document.getElementById("chat-input");
  const text = messageInput.value.trim();

  if (text) {
    socket.emit("message", { sender: user, text }); // Lähetetään palvelimelle
    messageInput.value = ""; // Syöttökentän tyhjennys
  }
};

// Käsittelijä viestin vastaanottamiseen palvelimelta
if (!window.socketInitialized) {
  window.socketInitialized = true;
  socket.off("message"); // Poistaa edellisen käsittelijän ennen uuden lisäämistä

  socket.on("message", (data) => {
    if (data.sender !== user) {
      addMessage(`${data.sender}: ${data.text}`); // Lisäämme vain muiden ihmisten viestejä
    } else {
      addMessage(`You: ${data.text}`); // Näytämme lähettäjälle "You"
    }
  });

  // Käsitellään käyttäjien sisään-/uloskirjautumisia
  socket.on("join", (name) => {
    addMessage(`🔵 ${name} joined the chat`);
  });

  socket.on("leave", (name) => {
    addMessage(`🔴 ${name} left the chat`);
  });
}

// Toiminto viestien lisäämiseksi chattiin
function addMessage(message) {
  const chatBox = document.getElementById("chat-content");
  const newMessage = document.createElement("p");
  newMessage.textContent = message;
  chatBox.appendChild(newMessage);
  chatBox.scrollTop = chatBox.scrollHeight; // Asettaa viestin viimeisimmäksi
}
//------------end Socket.IO client (Chat)----------------------

//--------------------Custom prompt----------------------------
function openPrompt() {
  document.getElementById("customPrompt").style.display = "flex";
}

function closePrompt() {
  document.getElementById("customPrompt").style.display = "none";
}

function submitPrompt() {
  let userInput = document.getElementById("promptInput").value;
  if (userInput.trim() !== "") {
    closePrompt();
  } else {
    alert("Enter something!");
  }
}
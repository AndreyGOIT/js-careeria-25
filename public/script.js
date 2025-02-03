//------------save pin----------------------
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

//--------------log out----------------------
function logOut() {
  localStorage.clear();
  // Hide hidden elements and show the PIN input field
  window.location.href = "/"; //Ohjaa etusivulle
}

//------------pin tarkistus----------------------
async function checkPin() {
  const pin = document.getElementById("pin").value;
  try {
    const response = await fetch("http://localhost:3000/api/getpin");
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
    }
  } catch (error) {
    console.error("Virhe PIN-tarkistuksessa:", error);
    alert("Virhe PIN-tarkistuksessa. Ota yhteyttä ylläpitoon.");
  }
}

//------------show elements----------------------
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
  // document.getElementsByTagName("footer")[0].style.display = "block";
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
    const response = await fetch("http://localhost:3000/api/employees");
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

chatButton.addEventListener("click", () => {
  chatModal.style.display = "block";
});

closeChat.addEventListener("click", () => {
  chatModal.style.display = "none";
});
// Viestin lähetyskäsittelijä
document.getElementById("send-message").addEventListener("click", function () {
  const messageInput = document.getElementById("chat-input");
  const text = messageInput.value.trim();

  if (text) {
    addMessage(`Вы: ${text}`); // Paikallinen lähtö
    socket.emit("message", text); // Lähetetään palvelimelle
    messageInput.value = ""; // Syöttökentän tyhjennys
  }
});

// Käsittelijä viestin vastaanottamiseen palvelimelta
if (!window.socketInitialized) {
  window.socketInitialized = true;
  socket.off("message"); // Poistaa edellisen käsittelijän ennen uuden lisäämistä

  socket.on("message", (data) => {
    // Tarkista lähettäjä, jotta voit välttää oman viestisi kopioimisen
    if (data.sender !== socket.id) {
      addMessage(`Собеседник: ${data.text}`);
    }
  });
}

// Toiminto viestien lisäämiseksi chattiin
function addMessage(message) {
  const chatBox = document.getElementById("chat-content");
  const newMessage = document.createElement("p");
  newMessage.textContent = message;
  chatBox.appendChild(newMessage);
}
//------------Socket.IO client (Chat)----------------------

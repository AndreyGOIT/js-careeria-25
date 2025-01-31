//------------save pin----------------------
const savedPin = localStorage.getItem("pinEntered");
if (savedPin) {
  // Show hidden elements and hide the PIN input field
  showElements();
}

//--------------log out----------------------
function logOut() {
  localStorage.clear();
  // Hide hidden elements and show the PIN input field
  // window.location.reload();
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
      // Hide the welcome message after 4 seconds
      setTimeout(() => {
        document.getElementById("welcome-message").style.visibility = "hidden";
        // Show hidden elements and hide the PIN input field
        showElements();
      }, 3000);
    } 
    else {
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
  hiddenElements.forEach((element) => {
    element.style.visibility = "visible";
  });
  // Hide the PIN input field
  document.getElementById("pin-div").style.display = "none";
  // document.getElementsByTagName("footer")[0].style.display = "block";
  document.getElementById("footer-main").style.display = "block";
}

// Fetch data from the API and display it in the tab container
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

    x += team.map(
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
fetchData();

export function render() {
    return `
      <div class="w3-content" style="max-width:1100px">
        <header class="w3-container w3-center w3-padding-32">
          <h1><b>WEBWORKS STUDIO</b></h1>
          <p>Modern Web Solutions</p>
        </header>
  
        <div class="w3-row">
          <div class="w3-col l8 s12">
            <div class="w3-card-4 w3-margin w3-white">
              <img src="images/banner.jpg" alt="Banner" style="width:100%">
              <div class="w3-container">
                <h3><b>Welcome to WebWorks Studio</b></h3>
                <h5>Your Reliable Web Development Partner</h5>
              </div>
              <div class="w3-container">
                <p>We create modern and high-performance web applications using the latest technologies.</p>
                <div class="w3-row">
                  <div class="w3-col m8 s12">
                    <button onclick="navigateTo('/palvelut')" class="w3-button w3-padding-large w3-white w3-border"><b>See Our Services »</b></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="w3-col l4">
            <div class="w3-card w3-margin w3-margin-top">
              <div class="w3-container w3-padding">
                <h4>About WebWorks Studio</h4>
              </div>
              <div class="w3-container w3-white">
                <p>We are a full-cycle web development studio specializing in frontend and backend solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
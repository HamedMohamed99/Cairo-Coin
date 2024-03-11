function load_home() {
  document.querySelector('#home').style.display = 'block';
  document.getElementById('reload').style.display = 'flex';
  const elementsToHide = ['#keys', '#usage', '#plan', '#docs', '#account', '#header_data'];
  elementsToHide.forEach(element => document.querySelector(element).style.display = 'none');

  const elementsToReset = ['binanceBuy', 'binanceSell', 'blackMarketBuy', 'blackMarketSell', 'gold24', 'gold21'];
  elementsToReset.forEach(element => {
    document.getElementById(element).innerHTML = `<div class="block-loader pulsate m-1" style="width: 90px;"></div>`;
    document.getElementById(element + 'Rate').innerHTML = ``;
  });

  getHomeSubDate();
}

// Variable to store the previous indicator value
let prevIndicator = null;

async function getHomeSubDate() {
  try {
    const response = await fetch(`/Plus/homeSub`);
    const data = await response.json();

    // Set values for nav
    document.getElementById('binanceBuyNav').textContent = data.binanceBuy;
    document.getElementById('blackMarketBuyNav').textContent = data.blackMarketBuy;
    document.getElementById('gold21Nav').textContent = data.gold21;
    document.getElementById('indicatorValueNav').textContent = data.indicator;

    // Only call updateBars if the indicator value has changed
    if (prevIndicator !== data.indicator) {
      updateBars(data.indicator);
      prevIndicator = data.indicator; // Update the previous indicator value
    }

    // Set values for binance
    document.getElementById('binanceBuy').textContent = data.binanceBuy;
    document.getElementById('binanceBuyRate').textContent = (data.binanceBuyRate === "0.00" || data.binanceBuyRate > "0.00") ? `+${data.binanceBuyRate}%` : `${data.binanceBuyRate}%`;
    document.getElementById('binanceSell').textContent = data.binanceSell;
    document.getElementById('binanceSellRate').textContent = (data.binanceSellRate === "0.00" || data.binanceSellRate > "0.00") ? `+${data.binanceSellRate}%` : `${data.binanceSellRate}%`;

    // Set values for blackMarket
    document.getElementById('blackMarketBuy').textContent = data.blackMarketBuy;
    document.getElementById('blackMarketBuyRate').textContent = (data.blackMarketBuyRate === "0.00" || data.blackMarketBuyRate > "0.00") ? `+${data.blackMarketBuyRate}%` : `${data.blackMarketBuyRate}%`;
    document.getElementById('blackMarketSell').textContent = data.blackMarketSell;
    document.getElementById('blackMarketSellRate').textContent = (data.blackMarketSellRate === "0.00" || data.blackMarketSellRate > "0.00") ? `+${data.blackMarketSellRate}%` : `${data.blackMarketSellRate}%`;

    // Set values for gold
    document.getElementById('gold21').textContent = data.gold21;
    document.getElementById('gold21Rate').textContent = (data.gold21Rate === "0.00" || data.gold21Rate > "0.00") ? `+${data.gold21Rate}%` : `${data.gold21Rate}%`;
    document.getElementById('gold24').textContent = data.gold24;
    document.getElementById('gold24Rate').textContent = (data.gold24Rate === "0.00" || data.gold24Rate > "0.00") ? `+${data.gold24Rate}%` : `${data.gold24Rate}%`;
    // Hide the loader when the page is fully loaded
    endReload();
    document.getElementById("loader").style.display = "none";
  } catch (error) {
    console.error('Error fetching home sub data:', error);
  }
}

function updateTime() {
  const currentTimeElement = document.getElementById('currentTime');
  if (currentTimeElement) {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let timeString = '';

    // Convert hours to 12-hour format and determine AM/PM
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

    // Create the time string with AM/PM
    timeString = hours + ':' + minutes + ' ' + amPm;

    currentTimeElement.textContent = timeString;
  }
}


function showIndicatorDescription() {
  var modal = document.getElementById('indicatorModal');
  modal.style.display = 'block';
}

// Function to close the modal
function closeIndicatorDescription() {
  var modal = document.getElementById('indicatorModal');
  modal.style.display = 'none';
}

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
  var modal = document.getElementById('indicatorModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
  var keyWindow = document.getElementById('keyWindow');
  if (event.target == keyWindow) {
    keyWindow.style.display = 'none';
  }
};


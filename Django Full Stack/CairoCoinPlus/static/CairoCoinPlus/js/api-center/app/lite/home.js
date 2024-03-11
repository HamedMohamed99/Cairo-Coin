function load_dollar() {
    document.querySelector('#dollar').style.display = 'block';
    document.querySelector('#gold').style.display = 'none';
}

function load_gold() {
    document.querySelector('#dollar').style.display = 'none';
    document.querySelector('#gold').style.display = 'block';
}

// Variable to store the previous indicator value
let prevIndicator = null;

async function getHomeSubDate() {
    try {
        loadingData();
        const response = await fetch(`/Plus/homeSub`);
        const data = await response.json();

        // Set values for nav
        document.getElementById('binanceBuyNav').textContent = data.binanceBuy;
        document.getElementById('blackMarketBuyNav').textContent = data.blackMarketBuy;
        document.getElementById('gold21Nav').textContent = data.gold21;

        if (Math.abs(data.indicator) !== 99) {
            document.getElementById('indicatorValueNav').textContent = data.indicator;
        } else {
            document.getElementById('indicatorValueNav').innerHTML = `<i class="bx bx-infinite mt-1" style="font-size: 1.5rem"></i>`;
        }


        // Only call updateBars if the indicator value has changed
        if (prevIndicator !== data.indicator) {
            updateBars(data.indicator);
            prevIndicator = data.indicator; // Update the previous indicator value
        }

        // Set values for bank
        document.getElementById('bankPrice').textContent = data.bankPrice;
        document.getElementById('bankPriceRate').textContent = (data.bankPriceRate === "0.00" || data.bankPriceRate > "0.00") ? `+${data.bankPriceRate}%` : `${data.bankPriceRate}%`;

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

        // Set values for goldDollar
        document.getElementById('goldDollar').textContent = data.goldDollarPrice;
        document.getElementById('goldDollarRate').textContent = (data.goldDollarRate === "0.00" || data.goldDollarRate > "0.00") ? `+${data.goldDollarRate}%` : `${data.goldDollarRate}%`;

        // Set values for gold
        document.getElementById('gold21').textContent = data.gold21;
        document.getElementById('gold21Rate').textContent = (data.gold21Rate === "0.00" || data.gold21Rate > "0.00") ? `+${data.gold21Rate}%` : `${data.gold21Rate}%`;
        document.getElementById('gold24').textContent = data.gold24;
        document.getElementById('gold24Rate').textContent = (data.gold24Rate === "0.00" || data.gold24Rate > "0.00") ? `+${data.gold24Rate}%` : `${data.gold24Rate}%`;

        // Set values for gold ingots
        document.getElementById('g5_buy').textContent = parseInt(data.goldIngotBuy.G5).toLocaleString();
        document.getElementById('g10_buy').textContent = parseInt(data.goldIngotBuy.G10).toLocaleString();
        document.getElementById('g31_buy').textContent = parseInt(data.goldIngotBuy.Ounce).toLocaleString();
        document.getElementById('g50_buy').textContent = parseInt(data.goldIngotBuy.G50).toLocaleString();
        document.getElementById('g100_buy').textContent = parseInt(data.goldIngotBuy.G100).toLocaleString();
        document.getElementById('gp_buy').textContent = parseInt(data.goldIngotBuy.Pound).toLocaleString();

        document.getElementById('g5_sell').textContent = parseInt(data.goldIngotSell.G5).toLocaleString();
        document.getElementById('g10_sell').textContent = parseInt(data.goldIngotSell.G10).toLocaleString();
        document.getElementById('g31_sell').textContent = parseInt(data.goldIngotSell.Ounce).toLocaleString();
        document.getElementById('g50_sell').textContent = parseInt(data.goldIngotSell.G50).toLocaleString();
        document.getElementById('g100_sell').textContent = parseInt(data.goldIngotSell.G100).toLocaleString();
        document.getElementById('gp_sell').textContent = parseInt(data.goldIngotSell.Pound).toLocaleString();

        updateBarplus(data.indicatorB, 'bars-container-plus-b');
        updateBarplus(data.indicatorBi, 'bars-container-plus-bi');
        updateBarplus(data.indicatorBm, 'bars-container-plus-bm');
        updateBarplus(data.indicatorG, 'bars-container-plus-g');


        // Hide the loader when the page is fully loaded
        endReload();
        document.getElementById("loader").style.display = "none";
    } catch (error) {
        console.error('Error fetching home sub data:', error);
    }
}

function updateTime() {
    const currentTimeElement = document.getElementById('currentTime');
    const currentTime12 = document.getElementById('time12');
    if (currentTimeElement) {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        let timeString = '';

        // Convert hours to 12-hour format and determine AM/PM
        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

        // Create the time string with AM/PM
        timeString = hours + ':' + minutes;

        currentTimeElement.textContent = timeString;
        currentTime12.textContent = amPm
    }
}

function loadingData() {
    document.getElementById('gold_ingots_table').innerHTML = `
          <div class="line ingot-container mb-1">
                <div class="column-ingot ">
                    <div class="price_label  mb-2">Grams</div>
                    <div class="price_label ingot-h-line  mb-1">5</div>
                    <div class="price_label ingot-h-line  mb-1">10</div>
                    <div class="price_label ingot-h-line  mb-1">Ounce</div>
                    <div class="price_label ingot-h-line  mb-1">50</div>
                    <div class="price_label ingot-h-line  mb-1">100</div>
                    <div class="price_label ">Pound</div>
                </div>
                <div class="column-ingot">
                    <div class="ingot-v-line"></div>
                </div>
                <div class="column-ingot">
                    <div class="price_label  mb-2">
                        <div class="price">
                            Buy
                        </div>
                    </div>
                    <div class="price_label  mb-1">
                        <div class="price ingot-h-line" id="g5_buy">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                    <div class="price_label  mb-1">
                        <div class="price ingot-h-line" id="g10_buy">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                    <div class="price_label  mb-1">
                        <div class="price ingot-h-line" id="g31_buy">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                    <div class="price_label  mb-1">
                        <div class="price ingot-h-line" id="g50_buy">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                    <div class="price_label  mb-1">
                        <div class="price ingot-h-line" id="g100_buy">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                    <div class="price_label ">
                        <div class="price" id="gp_buy">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                </div>
                <div class="column-ingot">
                    <div class="ingot-v-line"></div>
                </div>
                <div class="column-ingot">
                    <div class="price_label mb-2">
                        <div class="price ">
                            Sell
                        </div>
                    </div>
                    <div class="price_label mb-1">
                        <div class="price ingot-h-line" id="g5_sell">
                            <div class="block-loader pulsate m-1  mb-2" style="width: 70px"></div>
                        </div>
                    </div>
                    <div class="price_label mb-1">
                        <div class="price ingot-h-line" id="g10_sell">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                    <div class="price_label mb-1">
                        <div class="price ingot-h-line" id="g31_sell">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                    <div class="price_label mb-1">
                        <div class="price ingot-h-line" id="g50_sell">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                    <div class="price_label mb-1">
                        <div class="price ingot-h-line" id="g100_sell">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                    <div class="price_label">
                        <div class="price" id="gp_sell">
                            <div class="block-loader pulsate m-1" style="width: 70px"></div>
                        </div>
                    </div>
                </div>
            </div>
  `;



    const elementsToReset = ['binanceBuy', 'binanceSell', 'blackMarketBuy', 'blackMarketSell', 'gold24', 'gold21', 'goldDollar', 'bankPrice'];
    elementsToReset.forEach(element => {
        document.getElementById(element).innerHTML = `<div class="block-loader pulsate m-1" style="width: 90px;"></div>`;
        document.getElementById(element + 'Rate').innerHTML = ``;
    });

    const barssToReset = ['bars-container-plus-b', 'bars-container-plus-bi', 'bars-container-plus-bm', 'bars-container-plus-g'];
    barssToReset.forEach(element => {
        var barsContainer = document.getElementById(element)
        barsContainer.innerHTML = '';
        barsContainer.style.backgroundColor = '#eee';
    });
    
}

function updateBarplus(indicator, container) {
    const activeCount = Math.abs(indicator);
    const barsContainer = document.getElementById(container);
    barsContainer.innerHTML = '';
    if (indicator == 0) {
        barsContainer.style.backgroundColor = '#eee';
        barsContainer.innerHTML = `<i class='bx bx-minus pause'></i>`;
    }else {
        barsContainer.style.backgroundColor = '#1f1f1f';
    
    
    const colorMap = {
        1: '#369bc7',
        2: '#5ac85a',
        3: '#f1ee09',
        4: '#f18709',
        5: '#e20404'
    };

    if (activeCount != 99) {
        // Add bars based on activeCount
        for (let i = 1; i <= 5; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar-plus';
            if (i <= activeCount) {
                // Active bars
                bar.style.backgroundColor = colorMap[activeCount];
                bar.classList.add('flash-plus'); // Add flash animation to the last active bar
                bar.style.setProperty('--flash-box-shadow-color-start', (colorMap[activeCount] + '00'));
                bar.style.setProperty('--flash-box-shadow-color-end', colorMap[activeCount] + String(parseInt(20 + (activeCount ** 2.5)))); // Set the box-shadow color variable only for the last active bar at 0%
                bar.style.setProperty('--flash-speed', String(((2 - (activeCount - 1) / 9) + "s")));
                bar.style.setProperty('--bar-height', String(((2 + ((i ** 1.5) * 1.5)) + "px")));

            } else {
                // Inactive bars
                bar.style.backgroundColor = '#aaaaaa30';
                bar.style.setProperty('--bar-height', String(((2 + ((i ** 1.5) * 1.5)) + "px")));
            }
            barsContainer.appendChild(bar);
        }

        if (indicator > 0) {
            barsContainer.innerHTML += `<i class='bx bx-up-arrow-alt arrow' style="color: ${colorMap[activeCount]};"></i>`;
        } else if (indicator < 0) {
            barsContainer.innerHTML += `<i class='bx bx-down-arrow-alt arrow' style="color: ${colorMap[activeCount]};"></i>`;
        }

    } else {
        barsContainer.innerHTML = `<i class="bx bx-infinite" style="font-size: 1.35rem; color: #e20404;"></i>`;
        if (indicator > 0) {
            barsContainer.innerHTML += `<i class='bx bx-up-arrow-alt arrow-infinity-up ' style="color: #e20404;"></i>`;
        } else if (indicator < 0) {
            barsContainer.innerHTML += `<i class='bx bx-down-arrow-alt arrow-infinity-down ' style="color: #e20404;"></i>`;
        }
    }
}

};

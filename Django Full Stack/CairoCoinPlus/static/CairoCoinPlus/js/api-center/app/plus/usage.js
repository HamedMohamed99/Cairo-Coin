function load_usage() {
    const elementsToHide = ['#home', '#keys', '#plan', '#docs', '#account'];
    elementsToHide.forEach((element) => (document.querySelector(element).style.display = 'none'));
    document.querySelector('#header_data').style.display = 'flex';
    document.getElementById('reload').style.display = 'flex';

    document.querySelector('#usage').innerHTML = `
      <div class="usage-row index-usage pt-1">
        <div class="col-lg-12-usage">
          <div class="usage-main-label px-4 py-2 ">
            <div style="font-size: 1.5rem; font-weight: bold;">Usage</div>
            <div class="info" style="display: flex;">Token Used: <div id="token_used_all_time" class="pl-1" style="font-weight: bold;">0</div>
            </div>
          </div>
        </div>
        <div class="col-lg-6-usage-big">
          <div class="row">
            <div class="col-lg-12">
              <div class="usage-label">
                <div class="pl-4 py-3 " style="font-size: 1.5rem; font-weight: bold;">Daily Limit</div>
              </div>
              <div class="usage-card">
                <div class="pl-4 pr-4 py-2">
                  <div class="row align-items-center" id="day_limit_card">
                    <div class="col-lg-6-usage usage-table-data">
                      <div class="usage-table-card">
                        <div class="p-2">
                          <div class="table-responsive">
                            <table class="table text-nowrap mb-0 align-middle">
                              <div class="usage-day-loader">
                                <div class="line"></div>
                                <div class="line"></div>
                              </div>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6-usage">
                      <div class="d-flex justify-content-center">
                        <div class="usage-day-loader">
                          <div class="circle"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- ----------------------------------------------------------- -->
            <div class="col-lg-12">
              <div class="usage-label pl-4 py-3 ">
                <div style="font-size: 1.5rem; font-weight: bold;">Daily Keys Limit</div>
                <div class="info">Hover for details</div>
              </div>
              <div class="usage-card p-2">
                <div id="keys_container">
                  <div class="usage-keys-loader">
                    <div class="line-keys"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- ----------------------------------------------------------- -->
        <div class="col-lg-6-usage-big">
          <div class="usage-label align-items-center justify-content-between d-flex px-4">
            <div class="py-3 " style="font-size: 1.5rem; font-weight: bold;">History</div>
            <div>
              <select class="form-select" id="history_selector" disabled onchange="changeHistoryChartDuration(this.value)">
                <option value="7">Week</option>
                <option value="30">30 Day</option>
                <option value="90">90 Day</option>
              </select>
            </div>
          </div>
          <div class="usage-card pl-4 py-3">
            <div id="historyWeekChart"></div>
          </div>
        </div>
      </div>`;

    document.querySelector('#usage').style.display = 'block';
    historyWeekChart('', ['#000000']);
    let history_data = null;
    getUsageDate();
};

async function getUsageDate() {
    try {
        const response = await fetch(`/Plus/usage`);
        const data = await response.json();
        endReload();
        replaceLoaderCode();
        allTokenUsed(data.tokenUsedAllTime);
        dayLimitChart(data.dayDate.token_used, data.dayDate.tokken_limit);
        historyWeekChart(historyChartData(data.historyData), historyColorList(data.historyData));
        showKeysData(data.keysData);
        document.getElementById('history_selector').disabled = false;
        history_data = data.historyData;
    } catch (error) {
        console.error('Error fetching usage data:', error);
    }
};

function changeHistoryChartDuration(days) {
    historyWeekChart(historyChartData(history_data, days), historyColorList(history_data, days));
};

function replaceLoaderCode() {
    document.getElementById('keys_container').innerHTML = '';
    document.getElementById('day_limit_card').innerHTML = `<div class="col-lg-6-usage usage-table-data">
        <div class="usage-table-card">  
            <div class="p-2">            
                <div class="table-responsive">
                    <table class="table text-nowrap mb-0 align-middle">
                        <tbody>
                            <tr>
                                <th class="border-bottom-0 border-top-0">
                                    <p class="mb-0" style="font-weight: 900;">Token Used</p>
                                </th>
                                <th class="border-bottom-0 border-top-0">
                                    <p class="mb-0 usage-table-data" id="day_token_used"></p>
                                </th>
                            </tr>
                            <tr>
                                <th class="border-bottom-0">
                                    <p class="mb-0" style="font-weight: 900;">Token Limit</p>
                                </th>
                                <th class="border-bottom-0">
                                    <p class="mb-0 usage-table-data" id="day_token_limit"></p>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
        <div class="col-lg-6-usage">
        <div class="d-flex justify-content-center">
            <div id="dayLimitChart"></div>
        </div>
    </div>`;
};

function historyChartData(historyData, days = 7) {
    const chartData = historyData.date.slice(0, days).map((date, index) => ({
        x: date,
        y: historyData.used[index],
        goals: [
            {
                name: 'Limit this day',
                value: historyData.limit[index],
                strokeHeight: 3,
                strokeColor: '#00000010',
            },
        ],
    }));

    chartData.reverse();

    return [{ name: 'Token used this day', data: chartData }];
};

function historyColorList(historyData, days = 7) {
    const limit = Math.min(historyData.used.length, days);
    const colors = [];
    for (let i = 0; i < limit; i++) {
        const usedValue = historyData.used[i];
        const limitValue = historyData.limit[i];
        const dividedValue = (usedValue / limitValue) * 100;
        const color = colorSwitcher(dividedValue);
        colors.push(color);
    }
    colors.reverse();
    return colors;
};

function allTokenUsed(number) {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const thousand = 1000;

    let index = 0;
    while (number >= thousand && index < suffixes.length - 1) {
        number /= thousand;
        index++;
    }
    document.getElementById('token_used_all_time').innerText = number.toFixed(1).replace(/\.0$/, '') + suffixes[index];
};

function colorSwitcher(value) {
    var color = '#369bc7';

    switch (true) {
        case value <= 10:
            color = '#009feb';
            break;
        case value <= 20:
            color = '#06f500';
            break;
        case value <= 30:
            color = '#e8ff33';
            break;
        case value <= 40:
            color = '#ffef00';
            break;
        case value <= 50:
            color = '#facb00';
            break;
        case value <= 60:
            color = '#ffb414';
            break;
        case value <= 70:
            color = '#ff940f';
            break;
        case value <= 80:
            color = '#ff760a';
            break;
        case value <= 90:
            color = '#f55200';
            break;
        case value < 100:
            color = '#ff4e05';
            break;
        case value === 100:
            color = '#f50800';
            break;
        default:
            console.error('Invalid limit');
    }

    return color;
};

function historyWeekChart(data, colorsList) {
    const colorList = colorsList;
    var chart = {
        series: data.length > 0 ? data : [],

        chart: {
            type: 'bar',
            height: '250%',
            width: '100%',
            toolbar: { show: true },
            foreColor: '#adb0bb',
            zoom: { enabled: true },
            offsetX: -15,
        },

        plotOptions: {
            bar: {
                distributed: true,
                columnWidth: '75%',
            },
        },

        colors: colorList,

        markers: { size: 0 },

        dataLabels: {
            enabled: false,
        },

        legend: {
            show: false,
        },

        noData: {
            text: 'Loading...',
        },

        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
        },

        xaxis: {
            tickPlacement: 'on',
        },

        responsive: [
            {
                breakpoint: 600,
                options: {
                    xaxis: {
                        labels: {
                            rotate: -45,
                            rotateAlways: true,
                        },
                    },
                    chart: {
                        height: '200%',
                    },
                },
            },
        ],
    };

    document.querySelector('#historyWeekChart').innerHTML = '';
    var charthistory = new ApexCharts(document.querySelector('#historyWeekChart'), chart);
    charthistory.render();
};

function dayLimitChart(dayTokenUsed, dayTokenLimit) {
    const currentDayLimit = Math.floor((dayTokenUsed / dayTokenLimit) * 100);
    document.getElementById('day_token_limit').innerText = dayTokenLimit;
    document.getElementById('day_token_used').innerText = dayTokenUsed;

    var options = {
        series: [currentDayLimit],
        chart: {
            height: 220,
            type: 'radialBar',
            offsetY: -10,
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: {
                    margin: 10,
                    size: '70%',
                    background: '#fff',
                    position: 'front',
                    dropShadow: {
                        enabled: true,
                        top: 0,
                        left: 0,
                        blur: 6,
                        opacity: 0.1,
                    },
                },
                track: {
                    background: '#f5f5f5',
                    strokeWidth: '50%',
                    margin: 0, // margin is in pixels
                    dropShadow: {
                        enabled: true,
                        top: 0,
                        left: 0,
                        blur: 1,
                        opacity: 0.2,
                    },
                },

                dataLabels: {
                    show: true,
                    name: {
                        show: false,
                    },
                    value: {
                        offsetY: 10,
                        color: '#929292',
                        fontSize: '30px',
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: '700',
                        show: true,
                    },
                },
            },
        },
        responsive: [
            {
                breakpoint: 1499,
                options: {},
            },
        ],
        fill: {
            colors: [colorSwitcher(currentDayLimit)],
        },
        stroke: {
            lineCap: 'round',
        },
        labels: [''],
    };

    var chart = new ApexCharts(document.querySelector('#dayLimitChart'), options);
    chart.render();
};

function showKeysData(keysData) {
    keysData.forEach((item) => {
        keyLimit(item.label, item.token_used, item.token_limit);
    });
};

function keyLimit(name, usage, limit) {
    const usagePercentage = (usage / limit) * 100;
    const keysContainer = document.getElementById('keys_container');

    const keyContainer = document.createElement('div');
    keyContainer.className = 'usage-key-container';

    const keyname = document.createElement('div');
    keyname.className = 'usage-key-data';
    keyname.innerText = name;
    keyContainer.appendChild(keyname);

    const keyBarContainer = document.createElement('div');
    keyBarContainer.className = 'usage-key-bar-container';

    const keyBar = document.createElement('div');
    keyBar.className = 'usage-key-bar key-icon';
    keyBar.innerHTML = `<div class="tooltiptext"> Used: ${usage} | Limit: ${limit}</div>`;
    keyBar.style.setProperty('--key-bar-width', String(usagePercentage + '%'));
    keyBar.style.setProperty('--key-bar-color', colorSwitcher(usagePercentage));
    keyBarContainer.appendChild(keyBar);

    const keyBarFill = document.createElement('div');
    keyBarFill.className = 'usage-key-bar-fill';
    keyBarContainer.appendChild(keyBarFill);

    keyContainer.appendChild(keyBarContainer);

    keysContainer.appendChild(keyContainer);
};

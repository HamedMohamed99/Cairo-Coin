function updateBars(indicator) {
    const activeCount = Math.abs(indicator);
    const barsContainer = document.getElementById('bars-container');
    barsContainer.innerHTML = '<dev class="bar-over show-bar" id="bar_over"></dev>'
    const colorMapplus = [
        '#424242',
        '#369bc7',
        '#5ac85a',
        '#5ac85a',
        '#f1ee09',
        '#f1ee09',
        '#f1ee09',
        '#f18709',
        '#f18709',
        '#f18709',
        '#e20404'
    ];

    if (activeCount === 99) {
        const bar = document.createElement('div');
        bar.className = 'bar flash';
        bar.style.width = `90%`;
        bar.style.background = colorMapplus[10];
        bar.style.setProperty('--flash-box-shadow-color-start', (colorMapplus[10] + '00'));
        bar.style.setProperty('--flash-box-shadow-color-end', (colorMapplus[10] + '80'));
        bar.style.setProperty('--flash-speed', '0.75s');
        bar.style.borderRadius = '3px 3px 3px 3px';
        bar.style.animationDelay = `2.5s`;
        barsContainer.appendChild(bar);

        const bar_over = document.getElementById('bar_over');
        bar_over.style.setProperty('--speed', "3s");

    } else {
        const bar = document.createElement('div');
        bar.className = 'bar flash';
        bar.style.width = `${activeCount * 9}%`;
        if (activeCount > 1) {
            const gradientColors = colorMapplus.slice(1, activeCount + 1).join(', ');
            bar.style.background = `linear-gradient(to right, ${gradientColors})`;
        }

        else if (activeCount === 1) {
            bar.style.background = colorMapplus[1];
            bar.style.width = `9%`;
        }
        bar.style.setProperty('--flash-box-shadow-color-start', (colorMapplus[activeCount] + '00'));
        bar.style.setProperty('--flash-box-shadow-color-end', colorMapplus[activeCount] + String(parseInt(30 + (activeCount ** 2) / 2))); // Set the box-shadow color variable only for the last active bar at 0%
        bar.style.setProperty('--flash-speed', String(((2 - (activeCount - 1) / 9) + "s")));
        bar.style.animationDelay = `3s`;
        bar.style.borderRadius = '3px 3px 3px 3px';
        barsContainer.appendChild(bar);

        const bar_rest = document.createElement('div');
        bar_rest.style.background = colorMapplus[0];
        bar_rest.className = 'bar';
        bar_rest.style.width = `${(10 - activeCount) * 9}%`;
        bar_rest.style.borderRadius = '0 3px 3px 0';
        barsContainer.appendChild(bar_rest);



        const bar_over = document.getElementById('bar_over');
        bar_over.style.setProperty('--speed', String(((9 - (activeCount + 1) / 2) + "s")));
    }

    if (indicator < 0) {
        barsContainer.style.transform = `scaleX(-1)`;
    }
}
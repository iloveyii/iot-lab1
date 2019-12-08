var data;

function readData(cb) {
    let sensor_data;
    fetch('http://localhost:5555/api/v1/data')
        .then(resp => resp.json())
        .then(d => cb(d));
}

readData((d) => {
    const table = document.getElementById('data-table');
    d.forEach(row => {
        const tr = document.createElement('tr');
        row.heading = row.heading.toFixed(3);
        let td = null;
        Object.keys(row).map(key => {
            if(['temperature', 'pressure', 'humidity', 'eco2', 'tvoc', 'heading', 'color'].includes(key)) {
                td = document.createElement('td');
                if(key === 'color' && row[key]) {
                    const color = rgbToHex(row[key].red % 255, row[key].green % 255, row[key].blue % 255);
                    td.innerHTML = "<div style='background-color: "+color+" '>"+color+"</div>";
                } else {
                    td.innerText = (row[key]);
                }
                tr.appendChild(td);
            }
        });
        table.appendChild(tr);
    })
});

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


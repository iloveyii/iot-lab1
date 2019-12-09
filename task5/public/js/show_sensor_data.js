var data = {};
var historicData = [];
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAD2NGFLbN8DiwjuAknJ8veLSN4LG50VjY",
    authDomain: "iot-sensors-data.firebaseapp.com",
    databaseURL: "https://iot-sensors-data.firebaseio.com",
    projectId: "iot-sensors-data",
    storageBucket: "iot-sensors-data.appspot.com",
    messagingSenderId: "469619601022",
    appId: "1:469619601022:web:d410d8a49049c46f41322f",
    measurementId: "G-55BF16R4Z9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var mydb = firebase.database().ref().child('mydb');
mydb.on("child_added", function (snap) {
    // console.log("added:", snap.val());
    data = snap.val();
    displayData(snap.val());
});

function displayData(data) {
    document.getElementById('temperature').innerHTML = data.temperature;
    document.getElementById('pressure').innerHTML = data.pressure;
    document.getElementById('eco2').innerHTML = data.eco2 ? data.eco2 : 'na';

    document.getElementById('humidity').innerHTML = data.humidity;
    document.getElementById('tvoc').innerHTML = data.tvoc;

    if (data && data.color) {
        const div = document.createElement('h5');
        div.style.backgroundColor = 'rgb(' + data.color.red % 255 + ',' + data.color.green % 255 + ',' + data.color.blue % 255 + ')';
        div.style.display='table-cell';
        document.getElementById('color').innerHTML = '';
        document.getElementById('color').appendChild(div);
        data.color = rgbToHex(data.color.red % 255, data.color.green % 255, data.color.blue % 255);
        div.innerText = data.color;
    }

    if (data && data.heading) {
        document.getElementById('heading').innerHTML = data.heading.toFixed(2);
        data.heading = data.heading.toFixed(2);
        //document.getElementById('rotation').innerHTML = data.rotation.m_11.toFixed(3);
        //data.rotation = data.rotation.m_11.toFixed(3);
    }

    historicData.push(data);
    showDataInTable(historicData.slice(-5).reverse())

    // ['temperature', 'pressure', 'eco2', 'humidity', 'tvoc', 'heading', 'rotation', 'color'].forEach(id => showHistoricData(historicData, id))


}

function showHistoricData(hData, id) {
    var data = hData.slice(-3);
    var temp = document.getElementById(id + '-list');
    temp.innerHTML = '';
    data.forEach(da => {
        console.log(da[id]);
        var li = document.createElement('li');
        li.className = 'list-inline-item';
        if(id==='color') li.style.backgroundColor = da[id];
        li.innerText = da[id];
        temp.appendChild(li);
    })
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function showDataInTable(d) {
    console.log('inside showtable', d);
    const table = document.getElementById('data-table');
    table.innerHTML = '';

    let count = 1;

    d.forEach(row => {
        const tr = document.createElement('tr');
        row.heading = row.heading;// ? parseFloat(Number(row.heading)).toFixed(2) : 'na';
        let td = null;
        td = document.createElement('td');
        td.innerHTML = count++;
        tr.appendChild(td);

        Object.keys(row).map(key => {
            if(['temperature', 'pressure', 'humidity', 'eco2', 'tvoc', 'heading', 'color'].includes(key)) {
                td = document.createElement('td');
                if(key === 'color' && row[key]) {
                    //const color = rgbToHex(row[key].red % 255, row[key].green % 255, row[key].blue % 255);
                    td.innerHTML = "<div style='background-color: "+row[key]+" '>"+row[key]+"</div>";
                } else {
                    td.innerText = (row[key]);
                }
                tr.appendChild(td);
            }
        });
        table.appendChild(tr);
    })
}

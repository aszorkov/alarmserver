const { time } = require('console');
const net = require('net');
const port = 3000;
const host = '0.0.0.0';

const server = net.createServer();

server.listen(port, host, () => {
    addLogMessage(`Alarm server listening on port ${port}!`);
})

server.on('connection', (socket) => {
    addLogMessage(`NEW CONNECTION: ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data', (data) => {
        addLogMessage(`RECEIVED DATA FROM ${socket.remoteAddress}: ${data}`);
        socket.write(data);

        // CSV IP Alarm message format per spec:
        // https://www.alarm100.com/SitePages/Docs/CSV%20IP%20ALARM%20DATA%20specification%20Aii.pdf
        // Message: "Name,Password,1234,18113001003"
        // Account: 1234
        // Event classification: 181
        // Event type: 130
        // Area: 01
        // Zone: 003

        const messageParts = data.split(',');
        const username = messageParts[0];
        const password = messageParts[1];
        const account = messageParts[2];
        const dataMessage = messageParts[3];

        const eventClassCode = dataMessage.slice(0, 3);
        const eventTypeCode = dataMessage.slice(3, 6);
        const areaCode = dataMessage.slice(6, 8);
        const zoneCode = dataMessage.slice(8);

        const eventClass = getEventClass(code);
    });

    socket.on('close', (data) => {
        addLogMessage(`CLOSED CONNECTION WITH ${socket.remoteAddress}`);
    });

    socket.on('error', (error) => {
        addLogMessage(`ERROR ENCOUNTERED WITH ${socket.remoteAddress}: ${error.message}\n Full error: ${error}`);
    })
});

function addLogMessage(message) {
    // sv outputs in ISO format
    const timestamp = new Date().toLocaleString('sv');
    console.log(`${timestamp} ${message}`);
}

function getEventClass(code) {
    switch (eventClassCode) {
        case 111:
            return "New event"
        default:
            return "Undefined"
    };
}

const eventTypes = {
    "100": {
        class: "Medical Alarm",
        subType: "",
    },
    "101": {
        class: "Medical Alarm",
        subType: "Pendant Transmitter",
    },
    "102": {
        class: "Medical Alarm",
        subType: "Fail to report in",
    },
    "110": {
        class: "Fire Alarm",
        subType: "",
    },
    "111": {
        class: "Fire Alarm",
        subType: "Smoke",
    },
    "112": {
        class: "Fire Alarm",
        subType: "Combustion",
    },
    "113": {
        class: "Fire Alarm",
        subType: "Water Flow",
    },
    "114": {
        class: "Fire Alarm",
        subType: "Heat",
    },
    "115": {
        class: "Fire Alarm",
        subType: "Pull Station",
    },
    "116": {
        class: "Fire Alarm",
        subType: "Duct",
    },
    "117": {
        class: "Fire Alarm",
        subType: "Flame",
    },
    "118": {
        class: "Fire Alarm",
        subType: "Near Alarm",
    },
}

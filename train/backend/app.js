require('dotenv').config();

const express = require('express');
const cors = require('cors');
//const morgan = require('morgan');
const bodyParser = require('body-parser');

const trainsModel = require('./models/trains.js');
const ticketsModel = require('./models/tickets.js');
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');
const auth = require('./routes/auth.js');
const register = require('./routes/register.js');
const login = require('./routes/login.js');

const port = process.env.PORT || 6060;

const app = express();
const httpServer = require("http").createServer(app);

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const io = require("socket.io")(httpServer, {
    cors: {
        origin: ["https://www.student.bth.se/~sawr22/editor/", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

const delayedNamespace = io.of('/Delayed');
const ticketNamespace = io.of('/Tickets');
const lockedTrainsNamespace = io.of('/LockedTrains');

app.get('/', (req, res) => {
    res.json({
        data: 'Hello World!',
        port: port
    });
});

app.use("/auth", auth);

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);
app.use("/register", register);
app.use("/login", login);

const server = httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


module.exports = server;

trainsModel.fetchDelayedTrainsPosition(delayedNamespace);
trainsModel.manageTrainLock(lockedTrainsNamespace);
ticketsModel.manageTickets(ticketNamespace);

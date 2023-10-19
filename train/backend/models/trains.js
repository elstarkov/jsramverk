
const fetch = require('node-fetch');
const EventSource = require('eventsource');

const apiKey = process.env.API_KEY;


const trains = {
    fetchTrainPositions: async function fetchTrainPositions(io) {
        const query = `
        <REQUEST>
            <LOGIN authenticationkey="${apiKey}" />
            <QUERY sseurl="true" namespace="järnväg.trafikinfo"
                    objecttype="TrainPosition"
                    schemaversion="1.0" limit="1" >
            </QUERY>
        </REQUEST>`;

        const trainPositions = {};

        const response = await fetch(
            "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" }
            }
        );
        const result = await response.json();
        const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL;

        const eventSource = new EventSource(sseurl);

        eventSource.onopen = function() {
            console.log("Connection to server opened.");
        };

        io.on('connection', (socket) => {
            console.log('a user connected');

            eventSource.onmessage = function (e) {
                try {
                    const parsedData = JSON.parse(e.data);

                    if (parsedData) {
                        const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];

                        const matchCoords = /(\d*\.\d+|\d+),?/g;

                        const position = changedPosition.Position.WGS84
                            .match(matchCoords)
                            .map((t=>parseFloat(t)))
                            .reverse();

                        const trainObject = {
                            trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                            position: position,
                            timestamp: changedPosition.TimeStamp,
                            bearing: changedPosition.Bearing,
                            status: !changedPosition.Deleted,
                            speed: changedPosition.Speed,
                        };

                        const trainNumber = changedPosition.Train.AdvertisedTrainNumber;

                        if (Object.prototype.hasOwnProperty.call(trainPositions, trainNumber)) {
                            socket.emit("message", trainObject);
                        }

                        trainPositions[trainNumber] = trainObject;
                    }
                } catch (e) {
                    console.log(e);
                }

                return;
            };
        });

        eventSource.onerror = function() {
            console.log("EventSource failed.");
        };
    },
    fetchDelayedTrainsPosition: async function fetchDelayedTrainsPosition(namespace) {
        namespace.on('connection', async (socket) => {
            console.log('a user connected');

            const queryDelayed = `
            <REQUEST>
            <LOGIN authenticationkey="${apiKey}" />
            <QUERY objecttype="TrainAnnouncement"
                    orderby='AdvertisedTimeAtLocation'
                    schemaversion="1.8">
                <FILTER>
                    <AND>
                        <EQ name="ActivityType" value="Avgang" />
                        <GT name="EstimatedTimeAtLocation" value="$now" />
                <AND>
                    <GT name='AdvertisedTimeAtLocation' value='$dateadd(-00:15:00)' />
                    <LT name='AdvertisedTimeAtLocation' value='$dateadd(02:00:00)' />
                </AND>
                    </AND>
                </FILTER>
                        <INCLUDE>OperationalTrainNumber</INCLUDE>
                </QUERY>
            </REQUEST>
            `;

            const responseDelayed = await fetch(
                "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                    method: "POST",
                    body: queryDelayed,
                    headers: { "Content-Type": "text/xml" }
                });

            const resultDelayed = await responseDelayed.json();
            const delayedTrains = resultDelayed.RESPONSE.RESULT[0].TrainAnnouncement;
            const tempNumbers = delayedTrains.map((train) => train.OperationalTrainNumber);
            const uniqueNumbers = Array.from(new Set(tempNumbers));
            const uniqueString = uniqueNumbers.join(", ");

            console.log(`total: ${tempNumbers.length}`);
            console.log(`unique: ${uniqueNumbers.length}`);

            const query = `
            <REQUEST>
                <LOGIN authenticationkey="${apiKey}" />
                <QUERY sseurl="true" namespace="järnväg.trafikinfo"
                        objecttype="TrainPosition"
                        schemaversion="1.0" limit="1" >
                    <FILTER>
                        <IN name="Train.OperationalTrainNumber" value="${uniqueString}" />
                    </FILTER>
                </QUERY>
            </REQUEST>`;

            const trainPositions = {};

            const response = await fetch(
                "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                    method: "POST",
                    body: query,
                    headers: { "Content-Type": "text/xml" }
                }
            );
            const result = await response.json();
            const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL;

            const eventSource = new EventSource(sseurl);

            eventSource.onopen = function() {
                console.log("Connection to server opened.");
            };

            eventSource.onmessage = function (e) {
                try {
                    const parsedData = JSON.parse(e.data);

                    if (parsedData) {
                        const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];

                        const matchCoords = /(\d*\.\d+|\d+),?/g;

                        const position = changedPosition.Position.WGS84
                            .match(matchCoords)
                            .map((t=>parseFloat(t)))
                            .reverse();

                        const trainObject = {
                            trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                            position: position,
                            timestamp: changedPosition.TimeStamp,
                            bearing: changedPosition.Bearing,
                            status: !changedPosition.Deleted,
                            speed: changedPosition.Speed,
                        };

                        const trainNumber = changedPosition.Train.AdvertisedTrainNumber;

                        if (Object.prototype.hasOwnProperty.call(trainPositions, trainNumber)) {
                            socket.emit("message", trainObject);
                        }

                        trainPositions[trainNumber] = trainObject;
                    }
                } catch (e) {
                    console.log(e);
                }

                return;
            };
            eventSource.onerror = function() {
                console.log("EventSource failed.");
            };
        });
    },

    manageTrainLock: function manageTrainLock(namespace) {
        let trains = {};

        namespace.on('connection', (socket) => {
            console.log(`A user connected to trainLock with socket id: ${socket.id}`);

            socket.on('disconnect', (reason) => {
                console.log(`${reason}`);
                console.log(`Socket with the following id is now closing: ${socket.id}`);
                socket.disconnect();
            });

            socket.on('lockTrain', (id) => {
                if (id in trains) {
                    trains[id].push(socket.id);
                } else {
                    trains[id] = [socket.id];
                }

                namespace.emit('trains', trains);
            });

            socket.on('unlockTrain', (id) => {
                trains[id] = trains[id].filter((theId) => theId !== socket.id);

                if (trains[id].length === 0) {
                    delete trains[id];
                }

                namespace.emit('trains', trains);
            });
        });
    },
};


module.exports = trains;

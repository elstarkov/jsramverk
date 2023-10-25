import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DelayedTable from '../components/DelayedTable';
import MapComponent from '../components/MapComponent';
import io from 'socket.io-client';
import api from '../api';
import { apiUrl } from '../api';
import './DelayedPage.css';

function DelayedPage() {
    const [delayedTrains, setDelayedTrains] = useState({});
    const [filter, setFilter] = useState(null);
    const [markers, setMarkers] = useState({});
    const [rows, setRows] = useState({});

    const location = useLocation();
    const token = location.state.token;

    useEffect(() => {
        async function fetchData() {
            setMarkers({});
            setRows({});

            const fetchedData = await api.getDelayed(token);
            const uniqueObjects = {};

            if (filter !== null) {
                const train = fetchedData.find((obj) => obj.OperationalTrainNumber === filter);
                uniqueObjects[train.OperationalTrainNumber] = train;
            } else {
                fetchedData.forEach((obj) => {
                    if (!uniqueObjects[obj]) {
                        uniqueObjects[obj.OperationalTrainNumber] = obj;
                    }
                });
            }
            setDelayedTrains(uniqueObjects);
        }

        fetchData();
    }, [filter]);

    useEffect(() => {
        const socket = io(`${apiUrl}Delayed`);

        let trainArr = [];
        for (const trainNr in delayedTrains) {
            trainArr.push(trainNr);
        }

        if (trainArr.length > 0) {
            const trainStr = trainArr.join(', ');
            socket.emit('filter', trainStr);
        }

        socket.on('created sseurl', (url) => {
            socket.emit('start event source', url);
        });

        socket.on('message', (data) => {
            if (delayedTrains[data.trainnumber]) {
                setMarkers((prevMarkers) => ({
                    ...prevMarkers,
                    [data.trainnumber]: {
                        position: data.position,
                        trainnumber: data.trainnumber
                    }
                }));

                setRows((prevRows) => ({
                    ...prevRows,
                    [data.trainnumber]: {
                        ...delayedTrains[data.trainnumber]
                    }
                }));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [delayedTrains]);

    const handleFilterButton = (newFilter) => {
        const theFilter = typeof filter === 'string' ? null : newFilter;
        setFilter(theFilter);
    };

    return (
        <>
            <div className="container">
                <MapComponent data={markers} handleFilter={handleFilterButton} />
                <DelayedTable data={rows} handleFilter={handleFilterButton} />
            </div>
        </>
    );
}

export default DelayedPage;

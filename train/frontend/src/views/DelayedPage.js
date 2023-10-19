import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DelayedTable from '../components/DelayedTable';
import MapComponent from '../components/MapComponent';
import io from 'socket.io-client';
import api from '../api';
import { apiUrl } from '../api';
import './DelayedPage.css';

function DelayedPage() {
    const [delayedTrains, setData] = useState({});
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
            setData(uniqueObjects);
        }

        fetchData();
    }, [filter]);

    useEffect(() => {
        const socket = io(`${apiUrl}/Delayed`);

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
    }, [delayedTrains, filter]);

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

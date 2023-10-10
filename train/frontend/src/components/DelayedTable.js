import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import outputDelay from '../Utils';
import api from '../api';
import './DelayedTable.css';

function DelayedTable() {
    const [data, setData] = useState([]);
    const location = useLocation();
    const token = location.state.token;

    useEffect(() => {
        async function fetchData() {
            const fetchedData = await api.getDelayed(token);
            setData(fetchedData);
        }

        fetchData();
    }, [token]);

    return (
        <div className="delayed" data-testid="DelayedTable">
            <h1>Försenade tåg</h1>
            <div className="delayed-trains">
                <h3>Tågnummer</h3>
                <h3>Station</h3>
                <h3>Försening</h3>
            </div>
            {data.map((item) => (
                <div
                    key={item.ActivityId}
                    data-testid={item.ActivityId}
                    className="delayed-trains-container">
                    <Link
                        to="/Ticket"
                        className="delayed-trains"
                        state={{
                            data: item,
                            token: token
                        }}>
                        <div className="train-number">{item.OperationalTrainNumber}</div>
                        <div className="current-station">
                            <div>{item.LocationSignature}</div>
                            <div>
                                {item.FromLocation
                                    ? `${item.FromLocation[0].LocationName} -> `
                                    : ''}{' '}
                                {item.ToLocation ? item.ToLocation[0].LocationName : ''}
                            </div>
                        </div>
                        <div className="delay">{outputDelay(item)}</div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default DelayedTable;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import outputDelay from "../Utils";
import api from "../api.js";
import "./DelayedTable.css";

function DelayedTable() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const fetchedData = await api.getDelayed();
            setData(fetchedData);
		}

        fetchData();
    }, []);

    return (
        <div className="delayed">
            <h1>Försenade tåg</h1>
            <div className="delayed-trains">
                <h3>Tågnummer</h3>
                <h3>Station</h3>
                <h3>Försening</h3>
            </div>
            {data.map((item) => (
                <div key={item.ActivityId} className="delayed-trains-container">
                    <Link to="/Ticket" className="delayed-trains" state={{ data: item }}>
                        <div className="train-number">{item.OperationalTrainNumber}</div>
                        <div className="current-station">
                            <div>{item.LocationSignature}</div>
                            <div>
                                {item.FromLocation ? `${item.FromLocation[0].LocationName} -> ` : ''}{' '}
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

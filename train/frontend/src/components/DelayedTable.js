import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import outputDelay from '../Utils';
import './DelayedTable.css';

function DelayedTable(props) {
    const data = props.data;
    const location = useLocation();
    const token = location.state.token;

    return (
        <div className="delayed" data-testid="DelayedTable">
            <h1>Försenade tåg</h1>
            <div className="delayed-trains-header">
                <h3>Tågnummer</h3>
                <h3>Station</h3>
                <h3>Försening</h3>
            </div>
            {Object.values(data).map((item) => (
                <div
                    key={item.ActivityId}
                    data-testid={item.ActivityId}
                    value={item.OperationalTrainNumber}
                    onClick={() => props.handleFilter(item.OperationalTrainNumber)}
                    className="delayed-trains-container delayed-trains">
                    <div className="train-number">{item.OperationalTrainNumber}</div>
                    <div className="current-station">
                        <div>{item.LocationSignature}</div>
                        <div>
                            {item.FromLocation ? `${item.FromLocation[0].LocationName} -> ` : ''}{' '}
                            {item.ToLocation ? item.ToLocation[0].LocationName : ''}
                        </div>
                    </div>
                    <div className="delay">{outputDelay(item)} minuter</div>
                    <Link to="/Ticket" className="filter-btn" state={{ data: item, token: token }}>
                        Nytt ärende
                    </Link>
                </div>
            ))}
        </div>
    );
}

DelayedTable.propTypes = {
    data: PropTypes.object.isRequired,
    handleFilter: PropTypes.func
};

export default DelayedTable;

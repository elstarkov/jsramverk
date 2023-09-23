import { useEffect, useState } from 'react';
import api from '../api';
import './TicketForm.css';
import PropTypes from 'prop-types';

function TicketForm(props) {
    const [codes, setCodes] = useState([]);
    const [currentCode, setCurrentCode] = useState('');

    useEffect(() => {
        async function fetchData() {
            const fetchedData = await api.getCodes();
            setCodes(fetchedData);
        }

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentCode === '') {
            alert('Välj en orsakskod.');
        } else {
            let newTicket = {
                code: currentCode,
                trainnumber: props.data.OperationalTrainNumber,
                traindate: props.data.EstimatedTimeAtLocation.substring(0, 10)
            };

            const res = await api.createTicket(newTicket);

            if (res.status < 300) {
                setCurrentCode('');
                props.handleTicketList();
            }
        }
    };

    return (
        <form data-testid="TicketForm" onSubmit={handleSubmit}>
            <label htmlFor="TicketSelect" className="input-label">
                Orsakskod
            </label>
            <select
                id="TicketSelect"
                className="input"
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}>
                <option value="">Välj orsakskod</option>
                {codes.map((code) => (
                    <option key={code.Code} value={code.Code}>
                        {code.Code} - {code.Level3Description}
                    </option>
                ))}
            </select>
            <button className="form-btn">Skapa ärende</button>
        </form>
    );
}

TicketForm.propTypes = {
    data: PropTypes.shape({
        OperationalTrainNumber: PropTypes.string,
        EstimatedTimeAtLocation: PropTypes.string
    }).isRequired,
    handleTicketList: PropTypes.func.isRequired
};

export default TicketForm;

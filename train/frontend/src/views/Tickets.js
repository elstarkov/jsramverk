import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import outputDelay from '../Utils';
import api from '../api';

import './Tickets.css';

function TicketPageTest() {
    let { state } = useLocation();
    const trainData = state.data;
    const [tickets, setTickets] = useState([]);

    const location = useLocation();
    const token = location.state.token;

    const [codes, setCodes] = useState([]);
    const [currentCode, setCurrentCode] = useState('');
    const [newCode, setNewCode] = useState('');
    const [openTicketId, setOpenTicketId] = useState('');

    useEffect(() => {
        async function fetchTickets() {
            const theTickets = await api.getTickets(token);
            setTickets(theTickets);
        }

        async function fetchCodes() {
            const fetchedCodes = await api.getCodes(token);
            setCodes(fetchedCodes);
        }

        fetchTickets();
        fetchCodes();
    }, []);

    const handleUpdate = async (ticketId) => {
        console.log(ticketId);
        setOpenTicketId(ticketId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentCode === '') {
            alert('Välj en orsakskod.');
        } else {
            let newTicket = {
                code: currentCode,
                trainnumber: trainData.OperationalTrainNumber,
                traindate: trainData.EstimatedTimeAtLocation.substring(0, 10)
            };

            const res = await api.createTicket(newTicket);
            console.log(newTicket);

            if (res.status < 300) {
                setCurrentCode('');
                const theTickets = await api.getTickets(token);
                setTickets(theTickets);
            }
        }
    };

    const handleUpdatedTicket = async (e) => {
        e.preventDefault();

        if (newCode === '') {
            alert('Välj en orsakskod.');
        } else {
            let editedTicket = {
                my_id: openTicketId,
                code: newCode
            };

            const res = await api.updateTicket(editedTicket);

            if (res.status < 300) {
                setOpenTicketId('');
                const theTickets = await api.getTickets(token);
                setTickets(theTickets);
                setNewCode('');
            }
        }
    };

    return (
        <>
            <div className="ticket-container" data-testid="TicketPage">
                <h4>
                    <Link
                        to="/Delayed"
                        state={{
                            token: token
                        }}>
                        Tillbaka
                    </Link>
                </h4>
                <h1>Nytt ärende #{tickets.length + 1}</h1>
                {trainData.FromLocation ? (
                    <h3>
                        Tåg från {trainData.FromLocation[0].LocationName} till{' '}
                        {trainData.ToLocation[0].LocationName}. Just nu i{' '}
                        {trainData.LocationSignature}.
                    </h3>
                ) : (
                    ''
                )}
                <h4>Försenad: {outputDelay(trainData)} minuter</h4>

                <form data-testid="TicketForm" onSubmit={handleSubmit}>
                    <label className="input-label" htmlFor="TicketSelect">
                        Orsakskod
                    </label>
                    <select
                        className="input"
                        id="TicketSelect"
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

                <div>
                    <h2>Befintliga ärenden</h2>
                    {tickets.map((ticket) => (
                        <div key={ticket.my_id}>
                            <p>
                                <button
                                    className="update-btn"
                                    onClick={() => handleUpdate(ticket.my_id)}>
                                    Uppdatera
                                </button>{' '}
                                {ticket.my_id} - {ticket.code} - {ticket.trainnumber} -{' '}
                                {ticket.traindate}
                            </p>

                            {openTicketId === ticket.my_id && (
                                <form
                                    data-testid="TicketForm2"
                                    className="update-form"
                                    onSubmit={handleUpdatedTicket}>
                                    <label className="input-label" htmlFor="TicketSelect2">
                                        Uppdatera ärende {ticket.my_id}
                                    </label>

                                    <select
                                        className="update-input"
                                        id="TicketSelect2"
                                        value={newCode}
                                        onChange={(e) => setNewCode(e.target.value)}>
                                        <option value="">Välj ny kod</option>
                                        {codes.map((code) => (
                                            <option key={code.Code} value={code.Code}>
                                                {code.Code} - {code.Level3Description}
                                            </option>
                                        ))}
                                    </select>

                                    <button className="approve-btn">Godkänn ärende</button>
                                </form>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default TicketPageTest;

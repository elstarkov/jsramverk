import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import io from 'socket.io-client';
import outputDelay from '../Utils';
import api from '../api';
import { apiUrl } from '../api';

import './Tickets.css';

function TicketPage() {
    let { state } = useLocation();
    const trainData = state.data;
    const [socket, setSocket] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [owner, setOwner] = useState(false);

    const location = useLocation();
    const token = location.state.token;

    const [codes, setCodes] = useState([]);
    const [currentCode, setCurrentCode] = useState('');
    const [newCode, setNewCode] = useState('');
    const [openTicketId, setOpenTicketId] = useState('');

    useEffect(() => {
        async function fetchCodes() {
            const fetchedCodes = await api.getCodes(token);
            setCodes(fetchedCodes);
        }

        fetchCodes();

        const trainSocket = io(`${apiUrl}LockedTrains`);

        trainSocket.emit('lockTrain', trainData.OperationalTrainNumber);

        trainSocket.on('trains', (data) => {
            if (data[trainData.OperationalTrainNumber][0] === trainSocket.id) {
                setOwner(true);
            }
        });

        const handleTrainUnload = () => {
            trainSocket.emit('unlockTrain', trainData.OperationalTrainNumber);
        };

        window.addEventListener('beforeunload', handleTrainUnload);

        return () => {
            trainSocket.emit('unlockTrain', trainData.OperationalTrainNumber);
            window.removeEventListener('beforeunload', handleTrainUnload);
            setTimeout(() => {
                trainSocket.disconnect();
            }, 2000);
        };
    }, []);

    useEffect(() => {
        const socket = io(`${apiUrl}Tickets`);
        setSocket(socket);

        socket.on('tickets', (data) => {
            setTickets(data);
        });

        const handleTicketUnload = () => {
            socket.emit('unlocked', openTicketId);
        };

        window.addEventListener('beforeunload', handleTicketUnload);

        return () => {
            socket.emit('unlocked', openTicketId);
            window.removeEventListener('beforeunload', handleTicketUnload);
            setTimeout(() => {
                socket.disconnect();
            }, 2000);
        };
    }, [openTicketId]);

    const handleUpdate = (ticketId) => {
        socket.emit('locked', ticketId);
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

            socket.emit('create', newTicket);
            setCurrentCode('');
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

            socket.emit('update', editedTicket);

            socket.on('updated', (res) => {
                if (res === 'OK') {
                    socket.emit('unlocked', openTicketId);
                    setOpenTicketId('');
                    setNewCode('');
                }
            });
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
                <h3>Tågnummer: {trainData.OperationalTrainNumber}</h3>
                {trainData.FromLocation ? (
                    <h3>
                        Tåg från {trainData.FromLocation[0].LocationName} till{' '}
                        {trainData.ToLocation[0].LocationName}.
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
                    <button disabled={owner ? false : true} className="update-btn">
                        Skapa ärende
                    </button>
                </form>

                <div>
                    <h2>Befintliga ärenden</h2>
                    {tickets.map((ticket) => (
                        <div key={ticket.my_id}>
                            <p>
                                <button
                                    disabled={ticket.locked ? true : false}
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

export default TicketPage;

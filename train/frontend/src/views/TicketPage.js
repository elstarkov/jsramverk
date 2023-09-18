import { useEffect, useState } from 'react';
import { useLocation, Link } from "react-router-dom";
import outputDelay from "../Utils";
import api from '../api';
import TicketForm from '../components/TicketForm';
import "./TicketPage.css";

function TicketPage() {
	let { state } = useLocation();
	const trainData = state.data;
	const [tickets, setTickets] = useState([]);

	useEffect(() => {
		async function fetchTickets() {
			const theTickets = await api.getTickets();
			setTickets(theTickets);
		}

		fetchTickets();
	}, []);

	const handleTicketSubmit = async () => {
		const theTickets = await api.getTickets();
		setTickets(theTickets);
	};

	return (
	<>
		<div className='ticket-container'>
			<h4><Link to="/">Tillbaka</Link></h4>
			<h1>Nytt ärende #{tickets.length + 1}</h1>
			{trainData.FromLocation ?
				<h3>
					Tåg från {trainData.FromLocation[0].LocationName} till {trainData.ToLocation[0].LocationName}. Just nu i {trainData.LocationSignature}.
				</h3>
			: ""}
			<h4>Försenad: {outputDelay(trainData)}</h4>
			<TicketForm data={trainData} handleTicketList={handleTicketSubmit}/>
			<div>
				<h2>Befintliga ärenden</h2>
				{tickets.map((ticket) => (
					<p key={ticket.my_id}>{ticket.my_id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}</p>
				))}
			</div>
		</div>
	</>
	);
}

export default TicketPage;

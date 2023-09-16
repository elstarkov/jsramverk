import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DelayedPage from './views/DelayedPage';
import TicketPage from './views/TicketPage';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<DelayedPage />} />
                <Route path="/Ticket" element={<TicketPage />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;

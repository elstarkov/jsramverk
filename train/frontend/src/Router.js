import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DelayedPage from './views/DelayedPage';
import TicketPage from './views/TicketPage';

function getBaseName() {
    if (window.location.hostname === 'localhost' && window.location.port === '3000') {
        return '';
    } else {
        return '/~sawr22/editor';
    }
}

function AppRouter() {
    const basename = getBaseName();

    return (
        <Router basename={basename}>
            <Routes>
                <Route exact path="/" element={<DelayedPage />} />
                <Route path="/Ticket" element={<TicketPage />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;

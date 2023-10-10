import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DelayedPage from './views/DelayedPage';
import Tickets from './views/Tickets';
import Login from './views/Login';

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
                <Route exact path="/" element={<Login />} />
                <Route exact path="/Delayed" element={<DelayedPage />} />
                <Route path="/Ticket" element={<Tickets />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;

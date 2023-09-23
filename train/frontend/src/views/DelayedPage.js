import DelayedTable from '../components/DelayedTable';
import MapComponent from '../components/MapComponent';
import './DelayedPage.css';

function DelayedPage() {
    return (
        <>
            <div className="container">
                <MapComponent />
                <DelayedTable />
            </div>
        </>
    );
}

export default DelayedPage;

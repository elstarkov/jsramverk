import { render, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DelayedTable from '../DelayedTable';
import api from '../../api';

jest.mock('../../api');

const uniqueData = {
    46700: {
        ActivityId: 'e006ddd4-a1bd-bd50-2a26-6fb9f18297e8',
        ActivityType: 'Avgang',
        AdvertisedTimeAtLocation: '2023-09-20T15:13:00.000+02:00',
        Canceled: false,
        EstimatedTimeAtLocation: '2023-09-20T15:27:50.000+02:00',
        FromLocation: [{ LocationName: 'Åp', Priority: 1, Order: 0 }],
        LocationSignature: 'Mdn',
        OperationalTrainNumber: '46700',
        TimeAtLocation: '2023-09-20T15:26:00.000+02:00',
        ToLocation: [{ LocationName: 'M', Priority: 1, Order: 0 }],
        TrainOwner: 'HR'
    }
};

const uniqueDataMultiple = {
    46700: {
        ActivityId: 'e006ddd4-a1bd-bd50-2a26-6fb9f18297e8',
        ActivityType: 'Avgang',
        AdvertisedTimeAtLocation: '2023-09-20T15:13:00.000+02:00',
        Canceled: false,
        EstimatedTimeAtLocation: '2023-09-20T15:27:50.000+02:00',
        FromLocation: [{ LocationName: 'Åp', Priority: 1, Order: 0 }],
        LocationSignature: 'Mdn',
        OperationalTrainNumber: '46700',
        TimeAtLocation: '2023-09-20T15:26:00.000+02:00',
        ToLocation: [{ LocationName: 'M', Priority: 1, Order: 0 }],
        TrainOwner: 'HR'
    },
    35685: {
        ActivityId: 'a34b1fa9-3725-b7fe-2a18-b92fe7906996',
        ActivityType: 'Avgang',
        AdvertisedTimeAtLocation: '2023-09-20T15:36:00.000+02:00',
        AdvertisedTrainIdent: '5684',
        Canceled: false,
        EstimatedTimeAtLocation: '2023-09-20T16:01:24.000+02:00',
        LocationSignature: 'Fv',
        OperationalTrainNumber: '35685'
    }
};

describe('DelayedTable Component', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should render a delayed train when api responds', async () => {
        api.getDelayed.mockResolvedValue([
            {
                ActivityId: 'e006ddd4-a1bd-bd50-2a26-6fb9f18297e8',
                ActivityType: 'Avgang',
                AdvertisedTimeAtLocation: '2023-09-20T15:13:00.000+02:00',
                Canceled: false,
                EstimatedTimeAtLocation: '2023-09-20T15:27:50.000+02:00',
                FromLocation: [{ LocationName: 'Åp', Priority: 1, Order: 0 }],
                LocationSignature: 'Mdn',
                OperationalTrainNumber: '46700',
                TimeAtLocation: '2023-09-20T15:26:00.000+02:00',
                ToLocation: [{ LocationName: 'M', Priority: 1, Order: 0 }],
                TrainOwner: 'HR'
            }
        ]);

        render(
            <Router>
                <DelayedTable data={uniqueData} handleFilter={jest.fn()} />
            </Router>
        );

        await waitFor(() => {
            const trainDiv = screen.getByTestId('e006ddd4-a1bd-bd50-2a26-6fb9f18297e8');
            expect(trainDiv).toContainHTML(
                '<div data-testid="e006ddd4-a1bd-bd50-2a26-6fb9f18297e8" value="46700" class="delayed-trains-container delayed-trains">' +
                    '<div class="train-number">46700</div>' +
                    '<div class="current-station"><div>Mdn</div><div>Åp -&gt;  M</div></div>' +
                    '<div class="delay">14 minuter</div><a class="filter-btn" href="/Ticket">Nytt ärende</a></div>'
            );
        });
    });

    it('should render a delayed train without locations when api responds', async () => {
        api.getDelayed.mockResolvedValue([
            {
                ActivityId: 'a34b1fa9-3725-b7fe-2a18-b92fe7906996',
                ActivityType: 'Avgang',
                AdvertisedTimeAtLocation: '2023-09-20T15:36:00.000+02:00',
                AdvertisedTrainIdent: '5684',
                Canceled: false,
                EstimatedTimeAtLocation: '2023-09-20T16:01:24.000+02:00',
                LocationSignature: 'Fv',
                OperationalTrainNumber: '35685'
            }
        ]);

        render(
            <Router>
                <DelayedTable data={uniqueDataMultiple} handleFilter={jest.fn()} />
            </Router>
        );

        await waitFor(() => {
            const trainDiv = screen.getByTestId('a34b1fa9-3725-b7fe-2a18-b92fe7906996');
            expect(trainDiv).toContainHTML(
                '<div data-testid="a34b1fa9-3725-b7fe-2a18-b92fe7906996" value="35685" class="delayed-trains-container delayed-trains">' +
                    '<div class="train-number">35685</div>' +
                    '<div class="current-station"><div>Fv</div><div> </div></div>' +
                    '<div class="delay">25 minuter</div><a class="filter-btn" href="/Ticket">Nytt ärende</a></div>'
            );
        });
    });

    it('should render multiple delayed trains when api responds', async () => {
        api.getDelayed.mockResolvedValue([
            {
                ActivityId: 'e006ddd4-a1bd-bd50-2a26-6fb9f18297e8',
                ActivityType: 'Avgang',
                AdvertisedTimeAtLocation: '2023-09-20T15:13:00.000+02:00',
                Canceled: false,
                EstimatedTimeAtLocation: '2023-09-20T15:27:50.000+02:00',
                FromLocation: [{ LocationName: 'Åp', Priority: 1, Order: 0 }],
                LocationSignature: 'Mdn',
                OperationalTrainNumber: '46700',
                TimeAtLocation: '2023-09-20T15:26:00.000+02:00',
                ToLocation: [{ LocationName: 'M', Priority: 1, Order: 0 }],
                TrainOwner: 'HR'
            },
            {
                ActivityId: 'a34b1fa9-3725-b7fe-2a18-b92fe7906996',
                ActivityType: 'Avgang',
                AdvertisedTimeAtLocation: '2023-09-20T15:36:00.000+02:00',
                AdvertisedTrainIdent: '5684',
                Canceled: false,
                EstimatedTimeAtLocation: '2023-09-20T16:01:24.000+02:00',
                LocationSignature: 'Fv',
                OperationalTrainNumber: '35685'
            }
        ]);

        render(
            <Router>
                <DelayedTable data={uniqueDataMultiple} handleFilter={jest.fn()} />
            </Router>
        );

        await waitFor(() => {
            const firstTrainDiv = screen.getByTestId('e006ddd4-a1bd-bd50-2a26-6fb9f18297e8');
            expect(firstTrainDiv).toContainHTML(
                '<div data-testid="e006ddd4-a1bd-bd50-2a26-6fb9f18297e8" value="46700" class="delayed-trains-container delayed-trains">' +
                    '<div class="train-number">46700</div>' +
                    '<div class="current-station"><div>Mdn</div><div>Åp -&gt;  M</div></div>' +
                    '<div class="delay">14 minuter</div><a class="filter-btn" href="/Ticket">Nytt ärende</a></div>'
            );

            const secondTrainDiv = screen.getByTestId('a34b1fa9-3725-b7fe-2a18-b92fe7906996');
            expect(secondTrainDiv).toContainHTML(
                '<div data-testid="a34b1fa9-3725-b7fe-2a18-b92fe7906996" value="35685" class="delayed-trains-container delayed-trains">' +
                    '<div class="train-number">35685</div>' +
                    '<div class="current-station"><div>Fv</div><div> </div></div>' +
                    '<div class="delay">25 minuter</div><a class="filter-btn" href="/Ticket">Nytt ärende</a></div>'
            );
        });
    });

    it('should render a delayed train with a clickable link and the link should take us to /train', async () => {
        api.getDelayed.mockResolvedValue([
            {
                ActivityId: 'a34b1fa9-3725-b7fe-2a18-b92fe7906996',
                ActivityType: 'Avgang',
                AdvertisedTimeAtLocation: '2023-09-20T15:36:00.000+02:00',
                AdvertisedTrainIdent: '5684',
                Canceled: false,
                EstimatedTimeAtLocation: '2023-09-20T16:01:24.000+02:00',
                LocationSignature: 'Fv',
                OperationalTrainNumber: '35685'
            }
        ]);

        render(
            <Router>
                <DelayedTable data={uniqueDataMultiple} handleFilter={jest.fn()} />
            </Router>
        );

        await waitFor(() => {
            const trainDiv = screen.getByTestId('a34b1fa9-3725-b7fe-2a18-b92fe7906996');

            expect(trainDiv).toContainHTML(
                '<div data-testid="a34b1fa9-3725-b7fe-2a18-b92fe7906996" value="35685" class="delayed-trains-container delayed-trains">' +
                    '<div class="train-number">35685</div>' +
                    '<div class="current-station"><div>Fv</div><div> </div></div>' +
                    '<div class="delay">25 minuter</div>' +
                    '<a class="filter-btn" href="/Ticket">Nytt ärende</a></div>'
            );

            const link = trainDiv.getElementsByClassName('filter-btn')[0];

            link.click();

            expect(window.location.pathname).toBe('/Ticket');
        });
    });
});

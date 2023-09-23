import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TicketForm from '../TicketForm';
import api from '../../api';
import { act } from 'react-dom/test-utils';

jest.mock('../../api');

const mockedProps = {
    data: {
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
    handleTicketList: jest.fn()
};

describe('TicketForm Component', () => {
    const mockedData = [
        {
            Code: 'ANA002',
            Level1Description: 'Avvikelse',
            Level2Description: 'Nationell',
            Level3Description: 'Bakre tåg'
        },
        {
            Code: 'ANA004',
            Level1Description: 'Avvikelse',
            Level2Description: 'Nationell',
            Level3Description: 'Brofel'
        },
        {
            Code: 'ANA003',
            Level1Description: 'Avvikelse',
            Level2Description: 'Nationell',
            Level3Description: 'Banarbete'
        }
    ];

    beforeEach(() => jest.clearAllMocks());

    it('should render a select form with options when api responds', async () => {
        api.getCodes.mockResolvedValue(mockedData);

        render(
            <Router>
                <TicketForm />
            </Router>
        );

        await waitFor(() => {
            const form = screen.getByTestId('TicketForm');
            expect(form).toContainHTML(
                '<form data-testid="TicketForm">' +
                    '<label class="input-label">Orsakskod</label>' +
                    '<select class="input">' +
                    '<option value="">Välj orsakskod</option>' +
                    '<option value="ANA002">ANA002 - Bakre tåg</option>' +
                    '<option value="ANA004">ANA004 - Brofel</option>' +
                    '<option value="ANA003">ANA003 - Banarbete</option>' +
                    '</select>' +
                    '<button class="form-btn">Skapa ärende</button>' +
                    '</form>'
            );
        });
    });

    it('should show an alert when clicking button without selecting option with value', async () => {
        api.getCodes.mockResolvedValue(mockedData);

        render(
            <Router>
                <TicketForm />
            </Router>
        );

        await waitFor(() => {
            const form = screen.getByTestId('TicketForm');
            const formBtn = form.getElementsByClassName('form-btn')[0];
            const spy = jest.spyOn(window, 'alert').mockImplementation(() => {});

            expect(form).toContainHTML(
                '<form data-testid="TicketForm">' +
                    '<label class="input-label">Orsakskod</label>' +
                    '<select class="input">' +
                    '<option value="">Välj orsakskod</option>' +
                    '<option value="ANA002">ANA002 - Bakre tåg</option>' +
                    '<option value="ANA004">ANA004 - Brofel</option>' +
                    '<option value="ANA003">ANA003 - Banarbete</option>' +
                    '</select>' +
                    '<button class="form-btn">Skapa ärende</button>' +
                    '</form>'
            );

            act(() => {
                formBtn.click();
            });

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('Välj en orsakskod.');
        });
    });

    it('should create a new ticket when form is submitted with value', async () => {
        api.getCodes.mockResolvedValue(mockedData);
        const mockCreateTicket = jest.spyOn(api, 'createTicket').mockResolvedValue({ status: 200 });

        render(
            <Router>
                <TicketForm {...mockedProps} />
            </Router>
        );

        const form = screen.getByTestId('TicketForm');
        const formBtn = form.getElementsByClassName('form-btn')[0];
        const formSelect = form.getElementsByClassName('input')[0];

        await waitFor(() => {
            act(() => {
                fireEvent.change(formSelect, { target: { value: 'ANA004' } });
            });

            expect(formSelect.value).toBe('ANA004');

            act(() => {
                fireEvent.click(formBtn);
            });

            expect(mockCreateTicket).toHaveBeenCalledWith({
                code: 'ANA004',
                trainnumber: '46700',
                traindate: '2023-09-20'
            });

            expect(mockedProps.handleTicketList).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(formSelect.value).toBe('');
        });
    });
});

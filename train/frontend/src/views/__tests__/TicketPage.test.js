import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TicketPage from '../TicketPage';
import api from "../../api";
import { act } from 'react-dom/test-utils';

jest.mock('../../api');

const stateMock = {
    data: {
        ActivityId: "e006ddd4-a1bd-bd50-2a26-6fb9f18297e8",
        ActivityType: "Avgang",
        AdvertisedTimeAtLocation: "2023-09-20T15:13:00.000+02:00",
        Canceled: false,
        EstimatedTimeAtLocation: "2023-09-20T15:27:50.000+02:00",
        FromLocation: [{LocationName: 'Åp', Priority: 1, Order: 0}],
        LocationSignature: "Mdn",
        OperationalTrainNumber: "46700",
        TimeAtLocation: "2023-09-20T15:26:00.000+02:00",
        ToLocation: [{LocationName: 'M', Priority: 1, Order: 0}],
        TrainOwner: "HR"
    },
}

const mockedCodes = [
    {
        Code: "ANA002",
        Level1Description: "Avvikelse",
        Level2Description: "Nationell",
        Level3Description: "Bakre tåg",
    },
    {
        Code: "ANA004",
        Level1Description: "Avvikelse",
        Level2Description: "Nationell",
        Level3Description: "Brofel",
    },
    {
        Code: "ANA003",
        Level1Description: "Avvikelse",
        Level2Description: "Nationell",
        Level3Description: "Banarbete",
    },
];

describe("TicketPage view", () => {

    beforeEach(() => jest.clearAllMocks());

    it('should render the TicketPage', async () => {
        api.getTickets.mockResolvedValue([
            {
                code: "ANA005",
                my_id: 1,
                traindate: "2023-09-16",
                trainnumber: "8137",
                _id: "1234567",
            },
        ]);

        api.getCodes.mockResolvedValue(mockedCodes);

        await act(async () => {
            render(
                <MemoryRouter initialEntries={[{pathname: "/Ticket", state: stateMock}]}>
                    <TicketPage/>
                </MemoryRouter>
            );
        });

        await act(async () => {
            const pageView = screen.getByTestId("TicketPage");
            const form = screen.getByTestId("TicketForm");

            expect(pageView).toBeInTheDocument();
            expect(form).toBeInTheDocument();
            expect(screen.getByText("Tillbaka"));
            expect(screen.getByText("Nytt ärende #2"));
            expect(screen.getByText("Försenad: 14 minuter"));
            expect(screen.getByText("Befintliga ärenden"));
        });
    });

    it('Should call getTickets on form submit', async () => {
        api.getTickets.mockResolvedValue([
            {
                code: "ANA005",
                my_id: 1,
                traindate: "2023-09-16",
                trainnumber: "8137",
                _id: "1234567",
            },
        ]);

        api.getCodes.mockResolvedValue(mockedCodes);

        const mockCreateTicket = jest.spyOn(api, 'createTicket').mockResolvedValue({ status: 200 });

        await act(async () => {
            render(
                <MemoryRouter initialEntries={[{pathname: "/Ticket", state: stateMock}]}>
                    <TicketPage/>
                </MemoryRouter>
            );
        });

        expect(api.getTickets).toHaveBeenCalledTimes(1);

        const form = screen.getByTestId("TicketForm");
        const formSelect = form.getElementsByClassName("input")[0];
        const formBtn = screen.getByText('Skapa ärende');

        act(() => {
            fireEvent.change(formSelect, { target: { value: "ANA004" } });
        });

        act(() => {
            fireEvent.click(formBtn);
        });

        expect(mockCreateTicket).toHaveBeenCalledWith({
            code: "ANA004",
            trainnumber: "46700",
            traindate: "2023-09-20"
        });

        await waitFor (() => {
            expect(formSelect.value).toBe("");
            expect(api.getTickets).toHaveBeenCalledTimes(2);
        });
    });
});
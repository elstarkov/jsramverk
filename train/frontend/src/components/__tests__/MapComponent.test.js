import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import MapComponent from "../MapComponent";
import io from 'socket.io-client';

jest.mock('socket.io-client');

describe("Map Component", () => {
    beforeEach(() => jest.clearAllMocks());

    it("should render a div with the id of map and a map inside of it", () => {

        const mockSocket = {
            on: jest.fn(),
            emit: jest.fn(),
            disconnect: jest.fn(),
        }

        io.mockReturnValue(mockSocket);

        render(
            <Router>
                <MapComponent/>
            </Router>
        );

        const mapContainer = screen.getByTestId("MapCon");
        const leafletMap = mapContainer.getElementsByClassName('leaflet-container')[0];

        expect(mapContainer).toBeInTheDocument();
        expect(leafletMap).toBeInTheDocument();
    });
});

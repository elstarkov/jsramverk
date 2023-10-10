// import { render, screen } from '@testing-library/react';
// import DelayedPage from '../DelayedPage';
// import io from 'socket.io-client';

// jest.mock('socket.io-client');

// const mockSocket = {
//     on: jest.fn(),
//     emit: jest.fn(),
//     disconnect: jest.fn()
// };

// describe('DelayedPage view', () => {
//     beforeEach(() => jest.clearAllMocks());

//     it('renders the Map component', () => {
//         io.mockReturnValue(mockSocket);

//         render(<DelayedPage />);
//         const mapComponent = screen.getByTestId('MapCon');
//         expect(mapComponent).toBeInTheDocument();
//     });

//     it('renders the DelayedTable component', () => {
//         io.mockReturnValue(mockSocket);

//         render(<DelayedPage />);
//         const delayedTable = screen.getByTestId('DelayedTable');
//         expect(delayedTable).toBeInTheDocument();
//     });

//     it('renders the DelayedTable component and Map component', () => {
//         io.mockReturnValue(mockSocket);

//         render(<DelayedPage />);
//         const mapComponent = screen.getByTestId('MapCon');
//         const delayedTable = screen.getByTestId('DelayedTable');

//         expect(mapComponent).toBeInTheDocument();
//         expect(delayedTable).toBeInTheDocument();
//     });
// });

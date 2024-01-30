import React from 'react';
import {
  act,
  fireEvent,
  render,
  renderHook,
  waitFor,
} from '@testing-library/react-native';
import {RecoilRoot, RecoilState, useRecoilState, useRecoilValue} from 'recoil';
import axios from 'axios';
import {
  ParkingObject,
  initializeParkingState,
  parkingState,
} from '../src/atoms/parkingState';
import ParkingLot from '../src/Screens/Parkinglot';
import {Alert} from 'react-native';
import {parkingSpace} from '../src/atoms/parkingSpacesvalue';

jest.mock('axios'); // Mock axios for HTTP requests

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('ParkingLot Component', () => {
  it('renders and interacts correctly', async () => {
    // Mock navigation object
    const mockNavigation = {
      navigate: jest.fn(),
    };

    // Mock parkingData state
    const mockParkingData = [
      {
        id: 1,
        reg_no: 'ABC123',
        parked_at: new Date().toLocaleTimeString(),
        parked: true,
      },
      {id: 2, reg_no: 'XYZ789', parked_at: '', parked: false},
      {id: 3, reg_no: 'ABC123', parked_at: '10:21:00 PM', parked: true},
      {id: 4, reg_no: 'ABC123', parked_at: '12:00:00 AM', parked: true},
      {id: 5, reg_no: 'ABC123', parked_at: '11:00:00 AM', parked: true},
      // Add more mock data if needed
    ];
    const mockedResponse = {code: 200, description: 'OK'};

    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);

    // Mock RecoilRoot and provide initial parkingData state
    const {getByText, queryByText} = render(
      <RecoilRoot
        initializeState={({set}) => set(parkingState, mockParkingData)}>
        <ParkingLot navigation={mockNavigation} />
      </RecoilRoot>,
    );

    // Check if Parking Lot title is rendered
    expect(getByText('Parking Lot')).toBeTruthy();

    // Simulate closing the modal

    // Simulate selecting a parked car
    const parkedCar1 = getByText('1'); // Assuming the car with ID 1 is parked
    fireEvent.press(parkedCar1);

    // Check if the modal is opened for the selected parked car
    expect(queryByText('Parking Details!')).toBeTruthy();

    const closeButton1 = getByText('Close');
    fireEvent.press(closeButton1);

    expect(queryByText('Parking Details!')).toBeFalsy();

    const parkedCar3 = getByText('3'); // Assuming the car with ID 3 is parked
    fireEvent.press(parkedCar3);
    expect(queryByText('Parking Details!')).toBeTruthy();
    const closeButton3 = getByText('Close');
    fireEvent.press(closeButton3);
    expect(queryByText('Parking Details!')).toBeFalsy();

    const parkedCar4 = getByText('4'); // Assuming the car with ID 3 is parked
    fireEvent.press(parkedCar4);
    expect(queryByText('Parking Details!')).toBeTruthy();
    const closeButton4 = getByText('Close');
    fireEvent.press(closeButton4);
    expect(queryByText('Parking Details!')).toBeFalsy();

    const parkedCar5 = getByText('5'); // Assuming the car with ID 3 is parked
    fireEvent.press(parkedCar5);
    expect(queryByText('Parking Details!')).toBeTruthy();
    const closeButton5 = getByText('Close');
    fireEvent.press(closeButton5);
    expect(queryByText('Parking Details!')).toBeFalsy();
    // Wait for the payment process to complete
    // await waitFor(() => {
    //   // Check if the modal is closed after payment
    //   expect(queryByText('Parking Details!')).toBeFalsy();
    // });
    // expect(setParkingDataMock).toHaveBeenCalledTimes(1); // Ensure setParkingData is called
    // expect(setLoadingMock).toHaveBeenCalledWith(false); // Ensure setLoading is called with false
    // expect(setShowModalMock).toHaveBeenCalledTimes(1); // Ensure setShowModal is called
    // expect(setShowModalMock).toHaveBeenCalledWith(false); // Ensure setShowModal is called with false
  });

  it('calls payDone function when Pay button is pressed', async () => {
    // Mock navigation object
    const mockNavigation = {
      navigate: jest.fn(),
    };

    // Mock parkingData state
    const mockParkingData = [
      {
        id: 1,
        reg_no: 'ABC123',
        parked_at: new Date().toLocaleTimeString(),
        parked: true,
      },
      {id: 2, reg_no: 'XYZ789', parked_at: '', parked: false},
      // Add more mock data if needed
    ];
    const mockedResponse = {code: 200, description: 'OK'};

    jest.spyOn(axios, 'post').mockResolvedValueOnce(mockedResponse);

    // Mock RecoilRoot and provide initial parkingData state
    const {getByText, findByText, queryByText} = render(
      <RecoilRoot
        initializeState={({set}) => set(parkingState, mockParkingData)}>
        <ParkingLot navigation={mockNavigation} />
      </RecoilRoot>,
    );

    // Simulate selecting a parked car
    const parkedCar1 = getByText('1'); // Assuming the car with ID 1 is parked
    fireEvent.press(parkedCar1);

    // Check if the modal is opened for the selected parked car
    expect(await findByText('Parking Details!')).toBeTruthy();

    const payButton = getByText('Pay');
    act(() => {
      fireEvent.press(payButton);
    });

    // Fast forward until all timers have been executed
    jest.runAllTimers();

    // Wait for the payment process to complete
    await waitFor(() => {
      // Check if the modal is closed after payment
      expect(queryByText('Parking Details!')).toBeFalsy();
    });
  });

  it('should navigate to ParkingDetailsForm when a parking spot is available', () => {
    const mockNavigation = {
      navigate: jest.fn(),
    };

    // Mock parkingData state
    const mockParkingData = [
      {
        id: 1,
        reg_no: 'ABC123',
        parked_at: new Date().toLocaleTimeString(),
        parked: true,
      },
      {id: 2, reg_no: 'XYZ789', parked_at: '', parked: false},
      // Add more mock data if needed
    ];

    const {getByTestId, getByText} = render(
      <RecoilRoot
        initializeState={({set}) => set(parkingState, mockParkingData)}>
        <ParkingLot navigation={mockNavigation} />
      </RecoilRoot>,
    );

    act(() => {
      fireEvent.press(getByText('+'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ParkingDetailsForm', {
      data: expect.any(Number),
    });
  });

  it('should throw error when no parking spot is available', () => {
    const mockNavigation = {
      navigate: jest.fn(),
    };

    // Mock parkingData state
    const mockParkingData = [
      {
        id: 1,
        reg_no: 'ABC123',
        parked_at: new Date().toLocaleTimeString(),
        parked: true,
      },
      // Add more mock data if needed
    ];

    const mockAlert = jest.spyOn(Alert, 'alert');

    const {getByTestId, getByText} = render(
      <RecoilRoot
        initializeState={({set}) => set(parkingState, mockParkingData)}>
        <ParkingLot navigation={mockNavigation} />
      </RecoilRoot>,
    );

    fireEvent.press(getByText('+'));

    expect(mockAlert).toHaveBeenCalledWith(
      'Alert',
      'No available parking spots',
    );
  });
});

describe('initializeParkingState', () => {
  it('returns an array of parking objects', () => {
    const mockParkingSpace = 5; // Replace with the value you want to test

    const {result} = renderHook(() => useRecoilValue(initializeParkingState), {
      wrapper: ({children}) => (
        <RecoilRoot
          initializeState={({set}) => set(parkingSpace, mockParkingSpace)}>
          {children}
        </RecoilRoot>
      ),
    });

    expect(result.current).toEqual(
      Array.from({length: mockParkingSpace}, (_, index) => ({
        id: index + 1,
        parked: false,
        parked_at: '',
        reg_no: null,
      })),
    );
  });
});

import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {RecoilRoot} from 'recoil';
import ParkingDetailsForm from '../src/Screens/ParkingDetailsForm';
import {parkingState} from '../src/atoms/parkingState';
import {Alert} from 'react-native';

// Mock navigation and route
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockRoute = {
  params: {
    data: 1, // Assuming the id of the parking object you want to test with
  },
};

describe('ParkingDetailsForm', () => {
  it('Shows alert on wrong Reg No.', async () => {
    const mockAlert = jest.spyOn(Alert, 'alert');
    const {getByText, getByPlaceholderText} = render(
      <RecoilRoot
        initializeState={({set}) => {
          set(parkingState, [
            {id: 1, parked: false, parked_at: '', reg_no: null},
            {id: 2, parked: false, parked_at: '', reg_no: null},
            {id: 3, parked: false, parked_at: '', reg_no: null},
          ]);
        }}>
        <ParkingDetailsForm route={mockRoute} />
      </RecoilRoot>,
    );
    // Simulate entering car registration
    const input = getByPlaceholderText('like : MP09NA4466');

    fireEvent.changeText(input, 'ABC123');

    await waitFor(() => {
      expect(input.props.value).toBe('ABC123');
    });
    // Simulate pressing the "Get Time" button
    const getTimeButton = getByText('Get Time');
    fireEvent.press(getTimeButton);

    // Simulate pressing the "Let's Park" button
    fireEvent.press(getByText("Let's Park"));

    expect(mockAlert).toHaveBeenCalledWith(
      'Alert',
      'Enter valid Registration number',
    );
  });
  
  it('submits parking details correctly', async () => {
    const {getByText, getByPlaceholderText} = render(
      <RecoilRoot
        initializeState={({set}) => {
          set(parkingState, [
            {id: 1, parked: false, parked_at: '', reg_no: null},
            {id: 2, parked: false, parked_at: '', reg_no: null},
            {id: 3, parked: false, parked_at: '', reg_no: null},
          ]);
        }}>
        <ParkingDetailsForm
          navigation={{navigate: mockNavigate, goBack: mockGoBack}}
          route={mockRoute}
        />
      </RecoilRoot>,
    );

    // Simulate entering car registration
    const input = getByPlaceholderText('like : MP09NA4466');

    fireEvent.changeText(input, 'MP09NA4466');

    await waitFor(() => {
      expect(input.props.value).toBe('MP09NA4466');
    });

    // Simulate pressing the "Get Time" button
    const getTimeButton = getByText('Get Time');
    fireEvent.press(getTimeButton);

    // Simulate pressing the "Let's Park" button
    fireEvent.press(getByText("Let's Park"));

    // Check if navigation function was called to navigate back to the ParkingLot screen
    expect(mockNavigate).toHaveBeenCalledWith('ParkingLot');
  });

  it('navigates back correctly', () => {
    const {getByText} = render(
      <RecoilRoot>
        <ParkingDetailsForm
          navigation={{navigate: mockNavigate, goBack: mockGoBack}}
          route={mockRoute}
        />
      </RecoilRoot>,
    );

    // Simulate pressing the go back button
    fireEvent.press(getByText('<'));

    // Check if navigation.goBack was called
    expect(mockGoBack).toHaveBeenCalled();
  });
});

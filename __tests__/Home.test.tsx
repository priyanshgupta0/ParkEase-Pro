import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import HomeScreen from '../src/Screens/Home';
import {RecoilRoot} from 'recoil';

const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen Component', () => {
  it('allows user to enter parking spaces and press Lets Go', async () => {
    const mockNavigation = {
      reset: jest.fn(),
    };
    const {getByPlaceholderText, getByText} = render(
      <RecoilRoot>
        <HomeScreen navigation={mockNavigation} />
      </RecoilRoot>,
    );
    const input = getByPlaceholderText('Enter Parking Spaces you have');

    fireEvent.changeText(input, '10');
  
    await waitFor(() => {
      expect(input.props.value).toBe('10');
    });

    const button = getByText('Lets Go');
    fireEvent.press(button);

    fireEvent.changeText(input, '');

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
    act(() => {
      fireEvent.press(button);
    });

    fireEvent.changeText(input, '   ');

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
    act(() => {
      fireEvent.press(button);
    });
  });
});

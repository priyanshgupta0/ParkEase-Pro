import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './Screens/Home';
import {RecoilRoot} from 'recoil';
import ParkingDetailsForm from './Screens/ParkingDetailsForm';
import ParkingLot from './Screens/Parkinglot';

const Stack = createStackNavigator();

const App = () => {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ParkingLot"
            component={ParkingLot}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ParkingDetailsForm"
            component={ParkingDetailsForm}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
};

export default App;

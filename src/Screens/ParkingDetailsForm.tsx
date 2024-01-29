import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {ParkingObject, parkingState} from '../atoms/parkingState';

const mobileW = Dimensions.get('window').width;
const mobileH = Dimensions.get('window').height;

function ParkingDetailsForm({navigation, route}: any) {
  const [parkingData, setParkingData] = useRecoilState(parkingState);
  // console.log(parkingData, 'Parking Data');
  const {data} = route.params;
  // console.log(data, 'id');22
  const [carRegistration, setCarRegistration] = useState('');
  const [parkingTime, setParkingTime] = useState('');

  // Function to handle button click event to set current time
  const handleSetCurrentTime = () => {
    const currentTime = new Date().toLocaleTimeString();
    setParkingTime(currentTime);
  };

  const handleSubmit = () => {
    // setParkingData()
    setParkingData(prevParkingData => {
      // Map through the previous parking data and update the specific object by id
      return prevParkingData.map(parkingObj =>
        parkingObj.id === data
          ? {
              ...parkingObj,
              parked_at: parkingTime,
              reg_no: carRegistration,
              parked: true,
            }
          : parkingObj,
      );
    });
    navigation.navigate('ParkingLot');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Text style={styles.goBackText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={[styles.title, {flex: 6}]}>Parking Form</Text>
      <Text style={styles.text}>Car Registration Number:</Text>
      <TextInput
        style={styles.input}
        value={carRegistration}
        onChange={value => setCarRegistration(value.nativeEvent.text)}
        placeholder="like : MP09NA4466"
        placeholderTextColor="white"
      />
      <Text style={styles.text}>Parking Time:</Text>
      <View style={{flexDirection: 'row'}}>
        <TextInput
          style={[styles.input, {flex: 5}]}
          value={parkingTime}
          placeholder="Current Time"
          editable={false}
          placeholderTextColor="white"
        />
        <TouchableOpacity style={styles.button} onPress={handleSetCurrentTime}>
          <Text style={styles.buttonText}>Get Time</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={carRegistration.length == 0 || parkingTime === ''}>
        <Text style={styles.buttonText}>Let's Park</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ParkingDetailsForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'white',
    color: 'white',
    borderWidth: mobileW * 0.005,
    borderRadius: 3,
    marginBottom: 16,
    padding: mobileW * 0.01,
    margin: mobileW * 0.02,
  },
  card: {
    borderWidth: mobileW * 0.005,
    margin: mobileW * 0.005,
    padding: mobileW * 0.01,
  },
  title: {
    position: 'absolute',
    fontSize: mobileW * 0.1,
    top: mobileW * 0.005,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: mobileW * 0.05,
  },
  auther: {
    fontSize: mobileW * 0.04,
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    fontSize: mobileW * 0.035,
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: mobileW * 0.02,
  },
  button: {
    backgroundColor: 'cyan',
    // height: mobileW * 0.1,
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 5,
    height: 40,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    alignSelf: 'center',
    padding: 5,
  },
  image: {
    width: mobileW * 0.5,
    height: mobileW * 0.4,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: mobileW * 0.05,
  },
  Slot: {
    height: mobileW * 0.2,
    width: mobileW * 0.2,
    // backgroundColor: 'cyan',
    marginLeft: mobileW * 0.05,
    marginRight: mobileW * 0.05,
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
  },
  SlotText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  goBackButton: {
    position: 'absolute',
    top: mobileW * 0.005,
    left: mobileW * 0.005,
    padding: mobileW * 0.02,
  },
  goBackText: {
    color: 'white',
    fontSize: mobileW * 0.05,
    fontWeight: 'bold',
  },
});

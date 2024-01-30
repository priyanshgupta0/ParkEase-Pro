import React, {useEffect, useState} from 'react';
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
  Modal,
} from 'react-native';
import {useRecoilState} from 'recoil';
import axios from 'axios';
import {ParkingObject, parkingState} from '../atoms/parkingState';

const mobileW = Dimensions.get('window').width;
const mobileH = Dimensions.get('window').height;

function ParkingLot({navigation}: any) {
  const [parkingData, setParkingData] = useRecoilState(parkingState);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [index, setIndex] = useState(0);
  const [fare, setFare] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString(),
  );
  const [loading, setLoading] = useState<boolean>(false);

  // console.log(parkingData, 'Parking Data');

  const renderSlot = ({item}: {item: ParkingObject}) => {
    return (
      <TouchableOpacity
        disabled={!item.parked}
        onPress={() => {
          setIndex(item.id - 1);
          setShowModal(!showModal);
        }}
        style={[
          styles.Slot,
          {
            backgroundColor: item.parked ? 'gray' : 'green',
          },
        ]}>
        <Text style={styles.SlotText}>{item.id}</Text>
      </TouchableOpacity>
    );
  };

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: mobileW * 0.05,
        }}
      />
    );
  };

  const fetchPay = async () => {
    const response = await axios.post('https://httpstat.us/200', {
      'car-registration': parkingData[index].reg_no,
      charge: fare,
    });
  };

  const payDone = () => {
    setParkingData(prevParkingData => {
      // Map through the previous parking data and update the specific object by id
      return prevParkingData.map(parkingObj =>
        parkingObj.id === index + 1
          ? {
              ...parkingObj,
              parked: false,
              parked_at: '',
              reg_no: null,
            }
          : parkingObj,
      );
    });
    setLoading(false);
    setShowModal(!showModal);
  };

  const handlePay = () => {
    setLoading(true);
    fetchPay();
    setTimeout(payDone, 2000);
  };

  useEffect(() => {
    const calculateTimeDifference = () => {
      const givenTime = parkingData[index].parked_at;
      const currentTime = new Date(); // Get the current time
      const givenTimeString = givenTime.replace(' ', ''); // Remove any special characters like ' ' from the given time
      const givenTimeParts = givenTimeString.split(':'); // Split the given time into hours, minutes, and seconds
      const givenHour = parseInt(givenTimeParts[0]);
      const givenMinute = parseInt(givenTimeParts[1]);
      const givenSecond = parseInt(givenTimeParts[2]);

      if (givenTime.includes('PM')) {
        givenTimeParts[0] = (givenHour + 12).toString();
      } else if (givenTime.includes('AM') && givenHour === 12) {
        givenTimeParts[0] = '0';
      }

      const givenDateTime = new Date();
      givenDateTime.setHours(parseInt(givenTimeParts[0]));
      givenDateTime.setMinutes(givenMinute);
      givenDateTime.setSeconds(givenSecond);

      const differenceInMillis =
        currentTime.getTime() - givenDateTime.getTime();

      const hours = differenceInMillis / (1000 * 60 * 60);

      const formattedTimeDifference = hours;
      if (formattedTimeDifference <= 2) {
        setFare(10);
      } else {
        const extraHours = Math.ceil(formattedTimeDifference - 2); // Exclude the first two hours
        setFare(10 + extraHours * 10);
      }
    };

    calculateTimeDifference();

    let intervalId: NodeJS.Timeout | null = null;

    if (showModal) {
      intervalId = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString());
      }, 1000);
    }
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [showModal]);

  const handleAdd = () => {
    const availableParking = parkingData.filter(obj => !obj.parked);

    if (availableParking.length === 0) {
      // Throw an error if there are no available parking spots
      Alert.alert('Alert', 'No available parking spots');
      return;
    }
    // Select a random object from availableParking
    const randomIndex = Math.floor(Math.random() * availableParking.length);
    const selectedParkingSpot = availableParking[randomIndex];

    console.log('Selected Parking Spot:', selectedParkingSpot.id);
    navigation.navigate('ParkingDetailsForm', {
      data: selectedParkingSpot.id,
    });
  };

  return (
    <View style={styles.container} testID="parking-lot">
      <View
        style={{
          marginHorizontal: mobileW * 0.05,
          marginTop: mobileW * 0.01,
          flexDirection: 'row',
        }}>
        <Text style={[styles.title, {flex: 6}]}>Parking Lot</Text>
        <TouchableOpacity
          style={[styles.button, {flex: 1}]}
          onPress={handleAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={parkingData}
        renderItem={renderSlot}
        keyExtractor={item => String(item.id)}
        ItemSeparatorComponent={FlatListItemSeparator}
        numColumns={3}
        style={{alignSelf: 'center'}}
        columnWrapperStyle={{}}
      />
      <Modal animationType={'slide'} transparent={false} visible={showModal}>
        <View style={styles.container}>
          <Text style={styles.auther}>Parking Details!</Text>
          <View style={{marginHorizontal: 20}}>
            <Text style={styles.text}>
              Car Registration Number : {parkingData[index].reg_no}
            </Text>
            <Text style={styles.text}>
              Parked At : {parkingData[index].parked_at}
            </Text>
            <Text style={styles.text}>
              Current Time : {currentTime.toString()}{' '}
            </Text>
            <Text style={styles.text}>Fare : ${fare} </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {loading ? (
              <View style={styles.modalbutton}>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <TouchableOpacity style={styles.modalbutton} onPress={handlePay}>
                <Text style={styles.modalbuttontext}>Pay</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.modalbutton}
              onPress={() => {
                setShowModal(!showModal);
              }}>
              <Text style={styles.modalbuttontext}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ParkingLot;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'white',
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
    fontSize: mobileW * 0.1,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: mobileW * 0.05,
  },
  auther: {
    fontSize: mobileW * 0.1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: mobileW * 0.05,
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
    width: mobileW * 0.1,
    // margin: mobileW * 0.01,
    // alignSelf: 'center',
    marginBottom: mobileW * 0.05,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    borderRadius: 50,
    // padding: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: mobileW * 0.1,
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
  modalbutton: {
    backgroundColor: 'cyan',
    height: mobileW * 0.1,
    width: mobileW * 0.2,
    justifyContent: 'center',
    alignSelf: 'center',
    margin: mobileW * 0.05,
    borderWidth: 2,
    borderRadius: 5,
  },
  modalbuttontext: {
    color: 'black',
    fontWeight: '700',
    alignSelf: 'center',
  },
});

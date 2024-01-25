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

function ParkingLot({navigation}: any) {
  const [parkingData, setParkingData] = useRecoilState(parkingState);
  console.log(parkingData, 'Parking Data');

  const renderSlot = ({item}: {item: ParkingObject}) => {
    return (
      <TouchableOpacity
        disabled={!item.parked}
        onPress={() => {
          //   if (item.book) {
          //     setIndex(item.id - 1);
          //     setShowModal(!showModal);
          //     console.log(index);
          //   }
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
    <View style={styles.container}>
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
    width: mobileW * 0.01,
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
});

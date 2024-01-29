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
import {parkingSpace} from '../atoms/parkingSpacesvalue';

const mobileW = Dimensions.get('window').width;
const mobileH = Dimensions.get('window').height;

function HomeScreen({navigation, route}: any) {
  const [parkingData, setParkingData] = useRecoilState(parkingSpace);
  const [noOfIds, setNoOfIds] = useState('');

  const handelLetsGo = () => {
    setParkingData(Number(noOfIds));
    navigation.reset({
      index: 0,
      routes: [{name: 'ParkingLot'}],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ParkEase Pro</Text>
      <Image
        source={require('./../../assets/Image/parking.png')}
        style={styles.image}
      />
      <Text style={styles.text}>Parking Spaces you have:</Text>
      <TextInput
        style={styles.input}
        value={noOfIds}
        keyboardType="numeric"
        onChange={value => setNoOfIds(value.nativeEvent.text)}
        placeholder="Enter Parking Spaces you have"
        placeholderTextColor="white"
      />
      <TouchableOpacity style={styles.button} onPress={handelLetsGo}>
        <Text style={styles.buttonText}>Lets Go</Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;

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
    height: mobileW * 0.1,
    width: mobileW * 0.2,
    justifyContent: 'center',
    alignSelf: 'center',
    margin: mobileW * 0.05,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    alignSelf: 'center',
  },
  image: {
    width: mobileW * 0.5,
    height: mobileW * 0.4,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: mobileW * 0.05,
  },
});

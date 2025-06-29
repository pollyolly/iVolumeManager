import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { VolumeManager,
  useRingerMode,
  RINGER_MODE,
  RingerModeType
 } from 'react-native-volume-manager';
import Slider from '@react-native-community/slider';
import { useState, useEffect, useRef } from "react";

const modeText = {
  [RINGER_MODE.silent]: 'DoNotDisturb', //0 //DoNotDisturb
  [RINGER_MODE.vibrate]: 'Vibrate', //1
  [RINGER_MODE.normal]: 'Normal', //2
}

function App() {
  const [notificationVolume, setNotificationVolume] = useState(0)
  const [systemVolume, setSystemVolume] = useState(0)
  const [musicVolume, setMusicVolume] = useState(0)
  const [ringVolume, setRingVolume] = useState(0)
  const [alarmVolume, setAlarmVolume] = useState(0)

  const { mode, error, setMode } = useRingerMode();

  const applyNotificationVolume =(notificationVolume: number)=>{
    VolumeManager.setVolume(notificationVolume, {
      type: 'notification',
      showUI: false,
      playSound: false,
    });
  }
  const applySystemVolume =(systemVolume: number)=>{
    VolumeManager.setVolume(systemVolume, {
      type: 'system',
      showUI: false,
      playSound: false,
    });
  }
  const applyMusicVolume =(musicVolume: number)=>{
    VolumeManager.setVolume(musicVolume, {
      type: 'music',
      showUI: false,
      playSound: false,
    });
  }
  const applyRingVolume =(ringVolume: number)=>{
    VolumeManager.setVolume(ringVolume, {
      type: 'ring',
      showUI: false,
      playSound: false,
    });
  }
  const applyAlarmVolume =(alarmVolume: number)=>{
    VolumeManager.setVolume(alarmVolume , {
      type: 'alarm',
      showUI: false,
      playSound: false,
    });
  }

  const applyDonotDisturb = async () => {
    const hasDndAccess = await VolumeManager.checkDndAccess();
    if (!hasDndAccess) {
      console.warn('Do Not Disturb access is required to change ringer mode.');
      await VolumeManager.requestDndAccess();
    } else {
        await setMode(RINGER_MODE.silent);
    }
    setVolumeZero()
  }
  const applySilent = async () => {
    const hasDndAccess = await VolumeManager.checkDndAccess();
    if (!hasDndAccess) {
      console.warn('Do Not Disturb access is required to change ringer mode.');
      await VolumeManager.requestDndAccess();
    } else {
        setVolumeZero()
        await setMode(3);
      }
  }
  const applyNormal = async () => {
    //Check "Do Not Disturb" Permissions
    const hasDndAccess = await VolumeManager.checkDndAccess();
    if (!hasDndAccess) {
      console.warn('Do Not Disturb access is required to change ringer mode.');
      await VolumeManager.requestDndAccess();
    } else {
      await setMode(RINGER_MODE.normal);
    }
    // console.log('Silent:',RINGER_MODE.silent)//0
    // console.log('Vibrate:',RINGER_MODE.vibrate)//1
    // console.log('Normal:',RINGER_MODE.normal)//2
    // console.log('Current Mode:',mode)
  }
  const applyVibrate = async () => {
    //Check "Do Not Disturb" Permissions
    const hasDndAccess = await VolumeManager.checkDndAccess();
    if (!hasDndAccess) {
      console.warn('Do Not Disturb access is required to change ringer mode.');
      await VolumeManager.requestDndAccess();
    } else {
        await setMode(RINGER_MODE.vibrate);
    }
  }

  const setVolumeZero = async ()=>{
      setNotificationVolume(0)
      setSystemVolume(0)
      setMusicVolume(0)
      setRingVolume(0)
      setAlarmVolume(0)

      applyNotificationVolume(0)
      applySystemVolume(0)
      applyMusicVolume(0)
      applyRingVolume(0)
      applyAlarmVolume(0)
    }

const getCurrentVolume = async () =>{
  try {
    // const result = await VolumeManager.getVolume();
     const { notification, ring, alarm, volume, system, music, call } = await VolumeManager.getVolume();
      setNotificationVolume(notification) 
      setSystemVolume(system)
      setMusicVolume(music)
      setRingVolume(ring)
      setAlarmVolume(alarm)
    //  console.log('System Set:',result);
  } catch(error){
    console.log(error)  
  }
}

const checkIfSilent = async ()=>{
  const result = await VolumeManager.isAndroidDeviceSilent();
    Alert.alert(
      'Info',
      result
      ? 'Device is silent. This is a silent mode or muted volume or vibrate mode or do not disturb mode.'
      : 'Device is not silent. This is a normal mode.'
    );
}

  const checkSilentNormalVibrate = (setmode: string) => {
    switch(setmode){
      case 'Normal':
        return(
          <TouchableOpacity
          onPress={applyVibrate}
          style={styles.button}>
          <Text style={styles.buttonText}>Normal</Text>
        </TouchableOpacity> 
        )
      case 'Vibrate':
        return(
          <TouchableOpacity
            onPress={applySilent}
            style={styles.button}>
            <Text style={styles.buttonText}>Vibrate</Text>
          </TouchableOpacity>
        )
      default:
        return (
          <TouchableOpacity
            onPress={applyNormal}
            style={styles.button}>
            <Text style={styles.buttonText}>Silent</Text>
          </TouchableOpacity>
        )
    }
  }

  useEffect(() => {
    getCurrentVolume();
    // const ringerListener = VolumeManager.addRingerListener((result) => {
    //   console.log('Ringer listener changed', result); //{ mode: 'NORMAL', status: false }
    //   // setRingerStatus(result);
    // });
    // return () => {
    //   VolumeManager.removeRingerListener(ringerListener);
    // };
  }, []);

  return (
    <View style={styles.container}>
     <Text style={styles.appTitle}>
        iVolume Manager
      </Text>
     <Text style={styles.textTitle}>
        System Volume
      </Text>
     <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={1}
      // step={0.1} //Increment by 0.1
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#000000"
      value={systemVolume}
      onValueChange={setSystemVolume}
      onSlidingComplete={applySystemVolume}
      // inverted={true}
    />
     <Text style={styles.textTitle}>
        Music Volume
      </Text>
     <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={1}
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#000000"
      value={musicVolume}
      onValueChange={setMusicVolume}
      onSlidingComplete={applyMusicVolume}
    />
    <Text style={styles.textTitle}>
        Ring Volume
      </Text>
     <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={1}
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#000000"
      value={ringVolume}
      onValueChange={setRingVolume}
      onSlidingComplete={applyRingVolume}
    />
     <Text style={styles.textTitle}>
        Alarm Volume
      </Text>
     <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={1}
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#000000"
      value={alarmVolume}
      onValueChange={setAlarmVolume}
      onSlidingComplete={applyAlarmVolume}
    />
     <Text style={styles.textTitle}>
        Notification Volume
      </Text>
     <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={1}
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#000000"
      value={notificationVolume}
      onValueChange={setNotificationVolume}
      onSlidingComplete={applyNotificationVolume}
    />
      { checkSilentNormalVibrate(modeText[mode]) }
      <TouchableOpacity
        onPress={applyDonotDisturb}
        style={styles.button}>
        <Text style={styles.buttonText}>Do Not Disturb</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  appTitle:{
    textAlign:'center',
    fontSize: 30,
    fontWeight: 'bold',
    paddingVertical:20,
    color: '#252525'
  },
  container: {
    marginTop:20,
    flex: 1, //Use Flex
    backgroundColor:'white',
    marginLeft:10,
    marginRight:10
  },
  textTitle:{
    marginTop:10,
    marginLeft:10
  },
  slider:{
    //Use Flex to make width: 100% , 
     height: 50,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    marginLeft:10,
    marginRight:10,
    paddingVertical:10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems:'center',
    justifyContent:'center'
  },
  buttonText:{
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default App;

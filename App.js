import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from './Pages/Dashboard'
import Members from './Pages/Members';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Member from './Pages/Member';
import GlobalService from './Services/GlobalService';
function BottomNav(){
  return(
    <BottomNavigation.Navigator screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if(route.name === 'Dashboard') {
          iconName = 'home'
        }else if (route.name === 'Members'){
          iconName = 'users';
        } else if (route.name == 'Member'){
          iconName = 'user';
        }

        return <Icon name={iconName} size={size} color={color = (focused) ? '#125488': 'black'}></Icon>
      }
    })}>
      <BottomNavigation.Screen name='Dashboard' component={Dashboard}/>
      <BottomNavigation.Screen name='Members' component={Members}/>
      <BottomNavigation.Screen name='Member' component={Member} options={{tabBarItemStyle: {display:'none'}}}/>
    </BottomNavigation.Navigator>
  )
}
const stack = createNativeStackNavigator();

const BottomNavigation = createBottomTabNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <BottomNav/>
    </NavigationContainer>
  )
}
  
export default App;
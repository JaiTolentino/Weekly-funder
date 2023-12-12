import { Text, View, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MembersService from '../Services/MembersService';
import GlobalService from '../Services/GlobalService';
import TransactionsService from '../Services/TransactionsService';
import maincontroller from '../Controllers/maincontroller';
import Functions from '../Functions/Functions';
import Alerts from '../Components/Alerts';
function Dashboard(){
    const navigation = useNavigation();
    const [members, setMembers] = useState([]);
    const isFocused = useIsFocused();
    const [totalFunds, setTotalFunds] = useState(0);
    const [lastTransactionList, setLastTransactionList] = useState([]);
    const [update, setUpdate] = useState(false);
    useEffect(() => {
      if(!isFocused){
        return;
      }
      const fetchData = async () => {
        let totalFunds = 0;
        const memberList = await maincontroller.getMembers();
        setMembers((memberList));
        const userLastTransactions = await Promise.all(
          memberList.map(async (data) => {
            let pendingContribution = 0;
            const userTransactions = await maincontroller.getMemberTransactions(data[0].name);
            userTransactions.map((datas) => {
              if(datas.isDebit == false){
                totalFunds = totalFunds + datas.amount;
                pendingContribution = pendingContribution + datas.amount;
              }else {
                pendingContribution = pendingContribution - datas.amount;

              }
            })
            const lastTransaction = await maincontroller.getLastTransaction(data[0].name);
            return {name: data[0].name, lastTransaction: lastTransaction, pendingTransaction: pendingContribution}
          })
        )
        setLastTransactionList(userLastTransactions)
        setTotalFunds(totalFunds)
      };
      fetchData();
      setUpdate(false)
    }, [isFocused, update])
    return(
      <View style={{backgroundColor: 'white', flex: 1, paddingTop: "5%", paddingHorizontal: "5%", display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
        <View style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', height: "15%", width: "100%"}}>
          <View style={{height: "100%", width: "49%", borderColor: 'black', borderRadius: 15, backgroundColor: 'transparent', borderWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Total Funds</Text>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>₱{totalFunds}</Text>
          </View>
          <TouchableOpacity style={{height: "100%", width: "49%", borderColor: 'black', borderRadius: 15, backgroundColor: 'transparent', borderWidth: 1, alignItems: 'center', justifyContent:'center'}}
          onPress={async () => {
            Alerts()
            const memberList = await maincontroller.getMembers()
            memberList.map(async (data) => {
                await maincontroller.createWeeklyBilling(data[0].name, data[0].contributionAmount)
            })
            setUpdate(true);
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>Add Weekly Billing</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: "80%", width: "100%",borderWidth: 1, borderColor: 'black', borderRadius: 15, padding: '5%'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Members</Text>
          <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
            <View style={{width: '100%', height: '10%', borderRadius: 9, borderWidth:1, borderColor: 'black', marginVertical: "5%", display: 'flex', justifyContent:  'space-around', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Contributor{"\n"}Name</Text>
              <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Last{"\n"}Contribution</Text>
              <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Pending{"\n"}Contribution</Text>
            </View>
            {
              lastTransactionList.map((data, index) => (
                <TouchableOpacity key={index} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '8%'}} onPress={() =>{
                  // MembersService.clear()
                  // TransactionsService.clear()
                  GlobalService.setSelectedUser(data.name);
                  navigation.navigate('Member')
                  }}>
                    <Text>{data.name}</Text>
                    <Text>{data.lastTransaction}</Text>
                    <Text>₱{data.pendingTransaction}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
      </View>
    )
}

export default Dashboard;
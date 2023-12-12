import { Text, View, TouchableOpacity, Modal, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import React, {useEffect, useState} from 'react';
import DismissKeyboard from '../Components/DismissKeyboard';
import { useIsFocused, useRoute } from '@react-navigation/native';
import maincontroller from '../Controllers/maincontroller';
import Functions from '../Functions/Functions';
import BlankAlert from '../Components/AlertBlank';


function Member() {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [user, setUser] = useState([{}])
  const [transactions, setTransactions] = useState([{isDebit: true, amount: 0, dateAdded: "00/00/00",}])
  const isFocused = useIsFocused();
  let runningTotal = 0;
  const [totalContribution, setTotalContribution] = useState(0);
  useEffect(() => {
    if(!isFocused){
        return;
    }
    const fetchedDatabaseData = async () => {
            let total = 0;
            const User = await maincontroller.getSelectedMember();
            setUser(User);
            const userTransactions = await maincontroller.getMemberTransactions(User[0].name);
            setTransactions(userTransactions)
            userTransactions.map((data) => {
                if(data.isDebit == false){
                    total = total + data.amount
                }
            })
            setTotalContribution(total)
        }
        fetchedDatabaseData();
    }, [amount, isFocused]);

    return(
        <View style={{backgroundColor: 'white', flex: 1, paddingTop: "5%", paddingHorizontal: "5%", display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
            <View style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', height: "15%", width: "100%"}}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                    }}>
                    <DismissKeyboard>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: '100%', width: '100%'}}>
                            <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 250, width: '70%', borderColor:'black', borderWidth: 1, borderRadius: 15, justifyContent: 'space-around', padding: '3%'}}>
                                <View style={{height: '15%', alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Add Transaction</Text>
                                </View>
                                <View style={{height: '60%',width: '90%', alignItems: 'center', justifyContent: 'center', justifyContent: 'space-around'}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%', height: '30%' , alignItems: 'center'}}>
                                            <Text style={{fontWeight: 'bold'}}>Contribution{'\n'}Amount:</Text>
                                            <View
                                            style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', width: '50%'}}>
                                                <TextInput
                                                style={{ textAlign: 'center', height: '100%', width: '100%', borderColor: 'black', borderWidth: 1, borderRadius: 7}}
                                                inputMode='numeric'
                                                onChangeText={(text) => setAmount(text)}
                                                value={amount}/>
                                                <Text style={{ fontSize: 11}}>min ₱{user[0].contributionAmount}.00</Text>
                                            </View>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%' , height: '30%', alignItems: 'center'}}>
                                        <Text style={{fontWeight: 'bold'}}>Date:</Text>
                                            <TextInput
                                            readOnly={true}
                                            placeholder='29/11/23' placeholderTextColor={'black'}
                                            style={{ textAlign: 'center', height: '60%',width: '50%', borderColor: 'black', borderWidth: 1, borderRadius: 7}}/>
                                    </View>
                                </View>
                                <View
                                style={{height: '15%', width: '100%',flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                    <TouchableOpacity
                                    style={{padding: 5, borderColor: 'black', borderWidth: 1, borderRadius: 7, width: '40%', justifyContent:'center', alignItems: 'center'}}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                    style={{padding: 5, borderColor: 'black', borderWidth: 1, borderRadius: 7, width: '40%', justifyContent:'center', alignItems: 'center'}}
                                    onPress={async () => {
                                        if(amount != ''){
                                            setModalVisible(!modalVisible);
                                            maincontroller.createMemberTransaction(user[0].name, parseInt(amount));
                                            setAmount('')
                                        }else{
                                            BlankAlert()
                                        }
                                        
                                        }}>
                                    <Text>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </DismissKeyboard>
                </Modal>
                <View style={{height: "100%", width: "49%", borderColor: 'black', borderRadius: 15, backgroundColor: 'transparent', borderWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Total Contribution</Text>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>₱{totalContribution}.00</Text>
                </View>
                <TouchableOpacity style={{height: "100%", width: "49%", borderColor: 'black', borderRadius: 15, backgroundColor: 'transparent', borderWidth: 1, alignItems: 'center', justifyContent:'center'}}
                onPress={() => {
                    setModalVisible(!modalVisible)
                }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15}}>ADD TRANSACTION</Text>
                </TouchableOpacity>
            </View>
            <View style={{ height: "80%", width: "100%", padding: '1%'}}>
                <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', display: 'flex', flexDirection: 'row'}}>
                    <Text style={{fontSize: 15}}>Name: <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user[0].name}</Text></Text>
                    <Text style={{fontSize: 15}}>Date Joined:  <Text style={{fontSize: 20, fontWeight: 'bold'}}>{Functions.formatDate(user[0].dateAdded)}</Text></Text>
                </View>
                <View style={{width: '100%', height: '85%', alignItems: 'center'}}>
                    <View style={{width: '100%', height: '10%', borderRadius: 15, borderWidth:1, borderColor: 'black', marginVertical: "5%", display: 'flex', justifyContent:  'space-around', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Date</Text>
                    <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Debit</Text>
                    <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Credit</Text>
                    <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Total</Text>
                    </View>
                    <ScrollView contentContainerStyle={{alignItems:'center', width:'95%', height: '100%'}} >
                        {
                            transactions.map((datas,index) => (
                                <View key={index} style={{width: '100%',display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',height: '8%', marginVertical: '1%'}}>
                                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%', borderRadius: 15}}>
                                        <Text>{Functions.formatDate(datas.dateAdded)}</Text>
                                        {
                                            datas.isDebit &&
                                            <>
                                            <Text>₱{datas.amount}</Text>
                                            <Text></Text>
                                            <Text>₱{runningTotal = runningTotal + datas.amount}</Text>
                                            </>
                                        }
                                        {
                                            datas.isDebit == false &&
                                            <>
                                                <Text></Text>
                                                <Text>₱{datas.amount}</Text>
                                                <Text>₱{runningTotal = runningTotal - datas.amount}</Text>
                                            </>
                                        }
                                    </View>
                                </View>
                            ))
                        }
                    </ScrollView>
                    

                    
                </View>
                <View style={{height: '100%', width: '100%'}}>
                    <View style={{width: '100%', backgroundColor: 'black', height: 1}}></View>
                    <View style={{width: '100%',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '2%'}}>
                        <View style={{width: '50%'}}></View>
                        <View style={{width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Text>Total</Text>
                            <Text style={{marginLeft: '30%',fontWeight: 'bold'}}>₱{runningTotal}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Member;
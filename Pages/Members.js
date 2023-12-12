import { AsyncStorage, Text, View, TouchableOpacity, TouchableOpacityBase, Modal, TextInput, KeyboardAvoidingView, FlatList, ScrollView } from 'react-native';
import React, {useEffect, useState} from 'react';
import DismissKeyboard from '../Components/DismissKeyboard';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MembersService from '../Services/MembersService';
import GlobalService from '../Services/GlobalService';
import maincontroller from '../Controllers/maincontroller';
import TransactionsService from '../Services/TransactionsService';
import Functions from '../Functions/Functions';

function Members() {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setText] = useState('')
    const [amount, setAmount] = useState('');
    const navigation = useNavigation();
    const [members, setMembers] = useState([]);
    const [transactions, setTransactions] = useState([{}]);
    const [monthlyGoal, setMonthlyGoal] = useState(0);
    let Focused = useIsFocused()

    useEffect(() => {
        const fetchData = async () => {
            let total = 0;
            let MonthlyGoal = 0;
            let userGoal = 0;
            const memberList = await maincontroller.getMembers();
            setMembers(memberList);
            const fetchedTransactions = await Promise.all(
                memberList.map(async (data) => {
                    userGoal = data[0].contributionAmount * 4;
                    MonthlyGoal = MonthlyGoal +userGoal;
                    const lastTransaction = await maincontroller.getLastTransaction(data[0].name)
                    const userTransactions = await maincontroller.getMemberTransactions(data[0].name)
                    userTransactions.map((datas) => {
                        if(datas.isDebit == false){
                            total = total + datas.amount
                        }

                    })
                    return {name: data[0].name, lastTransaction: lastTransaction, totalContribution: total}
                })
            )
            setTransactions(fetchedTransactions)
            setMonthlyGoal(MonthlyGoal)
          };
          fetchData();
    }, [Focused, amount])

    return(
        <View style={{backgroundColor: 'white', flex: 1, paddingTop: "5%", paddingHorizontal: "5%", display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}> 
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                        }}>
                        <DismissKeyboard>
                            <View style={{flex: 1,alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 320, width: '80%', borderColor:'black', borderWidth: 1, borderRadius: 15, justifyContent: 'space-around', padding: '3%'}}>
                                        <View style={{height: '15%', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Add Member</Text>
                                        </View>
                                        <View style={{height: '60%',width: '90%', alignItems: 'center', justifyContent: 'center', justifyContent: 'space-around'}}>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%', height: '30%', alignItems: 'center'}}>
                                                    <Text style={{fontWeight: 'bold'}}>Name:</Text>
                                                    <TextInput
                                                    style={{ textAlign: 'center', height: '40%', width: '50%', borderColor: 'black', borderWidth: 1, borderRadius: 7}}
                                                    onChangeText={(text) => setText(text)}
                                                    value={name}
                                                    />
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%', height: '30%' , alignItems: 'center'}}>
                                                        <Text style={{fontWeight: 'bold'}}>Contribution{'\n'}Amount:</Text>
                                                            <TextInput
                                                            style={{ textAlign: 'center', height: '40%', width: '50%', borderColor: 'black', borderWidth: 1, borderRadius: 7}}
                                                            inputMode='numeric'
                                                            onChangeText={(text) => setAmount(text)}
                                                            value={amount}/>
                                                </View>
                                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%' , height: '20%', alignItems: 'center'}}>
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
                                            onPress={() => {
                                                setModalVisible(!modalVisible)
                                                }}>
                                            <Text>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                            style={{padding: 5, borderColor: 'black', borderWidth: 1, borderRadius: 7, width: '40%', justifyContent:'center', alignItems: 'center'}}
                                            onPress={() => {
                                                setModalVisible(!modalVisible);
                                                    MembersService.createMember(name, amount);
                                                    TransactionsService.createInitTransaction(name, amount);
                                                    setAmount('');
                                                    setText('');
                                            }}>
                                            <Text>Add</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </KeyboardAvoidingView>
                            </View>
                        </DismissKeyboard>
                    </Modal>
                </View>
            <View style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', height: "15%", width: "100%"}}>
                <View style={{height: "100%", width: "49%", borderColor: 'black', borderRadius: 15, backgroundColor: 'transparent', borderWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Monthly Goal</Text>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>₱{monthlyGoal}</Text>
                </View>
                <TouchableOpacity style={{height: "100%", width: "49%", borderColor: 'black', borderRadius: 15, backgroundColor: 'transparent', borderWidth: 1, alignItems: 'center', justifyContent:'center'}}
                onPress={()=> {
                    setModalVisible(!modalVisible);
                    console.log("Add Member Pressed!");
                }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20}}>ADD MEMBER</Text>
                </TouchableOpacity>
            </View>
            <View style={{ height: "80%", width: "100%", padding: '1%'}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <View style={{width: '100%', height: '12%', borderRadius: 15, borderWidth:1, borderColor: 'black', marginVertical: "1%", display: 'flex', justifyContent:  'space-around', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Contributor{"\n"}Name</Text>
                        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Past{"\n"}Contribution</Text>
                        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Total{"\n"}Contribution</Text>
                    </View>
                    <ScrollView contentContainerStyle={{alignItems: 'center', height: "85%", width: "100%"}}>
                            {transactions.map((datas, index) => (
                                <View key={index} style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'space-around', width: '100%', borderColor: 'black', borderWidth: 1, borderRadius: 7, marginVertical: "1%"}}>
                                    <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '2%'}}
                                    onPress={()=>{
                                        GlobalService.setSelectedUser(datas.name)
                                        navigation.navigate('Member')
                                    }}>
                                        <Text>{datas.name}</Text>
                                        <Text>{datas.lastTransaction}</Text>
                                        <Text>₱{datas.totalContribution}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    )
    
}

export default Members;

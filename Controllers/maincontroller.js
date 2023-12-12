import Functions from "../Functions/Functions";
import Transaction from "../Models/Transaction";
import GlobalService from "../Services/GlobalService";
import MembersService from "../Services/MembersService"
import TransactionsService from "../Services/TransactionsService";

export default MainController = {
    getMembers: async () => {
        const members = await MembersService.getMembers();
        const membersDetails = await Promise.all(
            Object.values(members).map(async (key) => {
                const member = await MembersService.getMember(key);
                return Object.values(member);
        }))
        return membersDetails;
    },
    getSelectedMember: async () => {
        const selectedUser = await GlobalService.getSelectedUser();
        const memberData = await MembersService.getMember(Functions.removeQuotes(selectedUser));
        return Object.values(memberData)
    },
    getMemberTransactions: async (name) => {
        try {
            const transactions = await TransactionsService.getMemberTransactions([name]);
            const sortedTransactions = Functions.sortAscByDate(Object.values(Object.values(transactions)[0])[0]);
            return sortedTransactions[0];
        } catch (error) {
            console.log('Error retrieving Member Transactions', error);
        }
        
    },
    createMemberTransaction: async (name, amount) =>{
        const newTransaction = new Transaction(false, amount, new Date())
        const transactions = await TransactionsService.getMemberTransactions([name]);
        let listedTransaction = Object.values(Object.values(Object.values(transactions))[0])[0];
        let newList=[];
        listedTransaction.map((data) => {
            const obj = {
                isDebit: data.isDebit,
                amount: data.amount,
                dateAdded: new Date(data.dateAdded)
            }
            newList.push(obj)
        })
        newList.push(newTransaction);

        TransactionsService.createTransaction(name ,newList);
    },
    getLastTransaction: async (name) => {
        let creditList = []
        const alltransactions = Object.values(Object.values(await TransactionsService.getMemberTransactions([name]))[0]);
        alltransactions.map((data) => {
            data.map((singleTransac) => {
                if(singleTransac.isDebit == false){
                    creditList.push((singleTransac.dateAdded));
                }
            })
        })
        let sortedCreditList = Functions.sortAscByDate(creditList);
        let lastTransaction = Functions.formatDate(sortedCreditList[0][sortedCreditList.length -1]);
        return lastTransaction;
    },
    createWeeklyBilling: async (name, amount) =>{
        const newTransaction = new Transaction(true, amount, new Date())
        const transactions = await TransactionsService.getMemberTransactions([name]);
        let listedTransaction = Object.values(Object.values(Object.values(transactions))[0])[0];
        let newList=[];
        listedTransaction.map((data) => {
            const obj = {
                isDebit: data.isDebit,
                amount: data.amount,
                dateAdded: new Date(data.dateAdded)
            }
            newList.push(obj)
        })
        newList.push(newTransaction);
        TransactionsService.createTransaction(name ,newList);
    },
}
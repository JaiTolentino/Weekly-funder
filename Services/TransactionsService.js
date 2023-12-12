import createStorage from 'typed-async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Transaction from '../Models/Transaction';
import PropTypes from 'prop-types';

const TransactionsSchema = PropTypes.objectOf(PropTypes.exact({
    transactions: PropTypes.arrayOf(PropTypes.exact({
        isDebit: PropTypes.bool.isRequired,
        amount: PropTypes.number.isRequired,
        dateAdded: PropTypes.instanceOf(Date).isRequired
    })).isRequired
}))

const TransactionsStorage = createStorage({
  name: 'transactions',
  schema: TransactionsSchema,
  AsyncStorage,
  isMultiple: true
})

export default TransactionService = {
    getTransactions: () => {
        return TransactionsStorage.getAllKeys()
    },
    createInitTransaction: (name, contributionAmount) => {
        const newTransaction = new Transaction(true, parseInt(contributionAmount), new Date())
        try {
            TransactionsStorage.set({
                [name]: {transactions: [newTransaction]}
            })
            console.log("Init transaction Added!")
        } catch (error) {
            console.log('Error creating init transaction:', error)
        }

    },
    createTransaction: (id, list) => {
        console.log('List',list);
        try {
        TransactionsStorage.merge({
            [id]: {transactions: list}
        })
        console.log('Transaction Added!')
        } catch (error) {
            console.log('Error Adding Transaction : ', error)
        }
    },
    getMemberTransactions: async (name) => {
        return await TransactionsStorage.get([name]);
    },
    clear: () => {
        TransactionsStorage.clear();
    }
}
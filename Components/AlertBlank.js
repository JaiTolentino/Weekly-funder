import { Alert } from "react-native"
import MembersService from "../Services/MembersService";
import TransactionsService from "../Services/TransactionsService";

const BlankAlert = () => {
    Alert.alert('Error Submission', 'Please fill up the form', [
        {text: 'OK'}
    ])
}

export default BlankAlert;
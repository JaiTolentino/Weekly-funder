import { Alert } from "react-native"
import maincontroller from "../Controllers/maincontroller"

const Alerts = () => {
    Alert.alert('Weekly Billing', 'All members are billed', [
        {text: 'OK'}
    ])
}

export default Alerts
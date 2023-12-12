import { Alert } from "react-native"

const AlertBilling = () => {
    Alert.alert('Weekly Billing', 'Every member is billed by their contribution amount', [
        {text: 'OK'}
    ])
}

export default AlertBilling;
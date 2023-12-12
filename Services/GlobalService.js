import createStorage from 'typed-async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import Global from '../Models/Globals';

const GlobalSchema = {
    selectedUser: PropTypes.string.isRequired
}

const GlobalStorage = createStorage({
    name: 'global',
    schema: GlobalSchema,
    AsyncStorage,
})

export default GlobalService = {
    setSelectedUser: async (name) => {
        const newSelectedUser = new Global(name);
        try {
            await GlobalStorage.set('selectedUser', JSON.stringify(newSelectedUser.selectedUser))
        } catch (error) {
            console.log('Error setting selected User', error);
        }
    },
    getSelectedUser: async () => {
        try {
            const user = await GlobalStorage.get('selectedUser');
            return user
        } catch (error) {
            console.log('Error Retrieveing Data:', error)
        }
    },
    removeSelectedUser: async (name) => {
        try {
            await GlobalStorage.remove('selectedUser')
        } catch (error) {
            console.log('Error removing selected user:', error)
        }
    },
    updateSelecteddUser: async (name) => {
        try {
            await GlobalStorage.merge('selectedUser', JSON.stringify(name));
        } catch (error) {
            console.log('Error updating seelected user', error)
        }
    }
}
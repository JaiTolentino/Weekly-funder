import createStorage from 'typed-async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import Member from '../Models/Member'
import Functions from '../Functions/Functions';

const MembersSchema = PropTypes.objectOf(PropTypes.exact({
    name: PropTypes.string.isRequired,
    contributionAmount: PropTypes.number.isRequired,
    dateAdded: PropTypes.instanceOf(Date).isRequired,
}));

const MembersStorage = createStorage({
  name: 'members',
  schema: MembersSchema,
  AsyncStorage,
  isMultiple: true
})

export default MembersService = {
    createMember: async (name, contributionAmount) => {
        const key = name;
        const newMember = new Member(name.replace(/^"(.*)"$/, '$1'), parseInt(contributionAmount), new Date())
        try {
            await MembersStorage.set({
                [key]: {
                    name: newMember.name,
                    contributionAmount: newMember.contributionAmount,
                    dateAdded: newMember.date
                }})
            console.log('Member '+ newMember.name +' Added!')

        } catch (error) {
            console.log('Error Adding Member ' + newMember.name + ': ', error)
        }
    },
    getMembers: async () => {
        try {
            return await MembersStorage.getAllKeys();
        } catch (error) {
            console.log('Error retreiving Members : ', error);
        }
    },
    getMember: async (name) => {
        try {
            return await MembersStorage.get([name]);
        } catch (error) {
            console.log('Error retreiving ', name, ' : ', error);
            
        }
    },
    clear: async () => {
        await MembersStorage.clear();
    }
}
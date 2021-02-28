import store from 'store'

const USER_KEY = 'user_key'
const storageUtils = {
    saveUser(user) {
        return store.set(USER_KEY, user)
    },
    getUser() {
        return store.get(USER_KEY) || {}
    },
    removeUser() {
        return store.remove(USER_KEY)
    }
}
export default storageUtils
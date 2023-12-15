import { createPinia } from 'pinia'
// 引入持久化插件
import { createPersistedState } from 'pinia-plugin-persistedstate'

const piniaPluginPersistedstate = createPersistedState()

const store = createPinia()
store.use(piniaPluginPersistedstate)

export default store

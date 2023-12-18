import './assets/styles/index.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/stores/index.js'
import plugin from '@/plugins/index.js'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(plugin)

app.mount('#app')

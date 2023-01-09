import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

const app = createApp(App);
app.mount('#app')
app.config.globalProperties.apiUrl = "https://webapi-temp-lzvwplmatd.cn-shanghai.fcapp.run/";

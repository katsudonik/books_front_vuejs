import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws:localhost:3000/cable');
Vue.prototype.$cable = cable;

Vue.use(VueAxios, axios)

new Vue({
  render: h => h(App),
}).$mount('#app')

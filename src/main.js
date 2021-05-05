import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')


import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws:localhost:3000/cable');
Vue.prototype.$cable = cable;

import Chat from './Chat.vue';
new Vue({
  render: h => h(Chat),
}).$mount('#app')

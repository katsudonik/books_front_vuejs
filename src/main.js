import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws:localhost:3000/cable');
Vue.prototype.$cable = cable;

new Vue({
  render: h => h(App),
}).$mount('#app')

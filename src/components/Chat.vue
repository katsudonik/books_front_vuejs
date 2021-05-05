<template>
  <div>
    <ul>
      <li v-for="item in messages" :key="item.message">
        <p>{{ item.content }}</p>
      </li>  
    </ul>
    <input v-model="msgBox" placeholder="message here"  @keydown.enter="speak" />
    <button v-if="messageChannel" @click="speak">送信</button>    
  </div>
</template>

<script>
export default {
  data() {
    return {
      msgBox: "",
      messages: [],
      messageChannel: null,
    };
  },
  created() {
    this.messageChannel = this.$cable.subscriptions.create( "MessageChannel",{
      received: (data) => {
        this.messages.push(data)
      },
    })
    this.fetchMessages()
  },
  methods: {
    speak() {
      this.messageChannel.perform('speak', { 
        message: this.msgBox, 
      });
      this.msgBox = '';
    },
    fetchMessages() {
      // TODO sign in at login display & save response headers in local storage
      this.axios({
        method: 'post',
        url: 'http://localhost:3000/auth/sign_in', // TODO domain
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          email: "example@example.com", // TODO from input
          password: "password" // TODO from input
        },
        timeout: 15000
      }).then((response) => {
        console.log(response);
        console.log(response.headers);
        const uid = response.headers['uid'];
        const client = response.headers['client'];
        const token = response.headers['access-token'];


        this.axios({
          method: 'get',
          url: 'http://localhost:3000/chat_messages', // TODO domain
          headers: {
            'Content-Type': 'application/json',
            'uid': uid,
            'client': client,
            'access-token': token,
          },
          data: {
          },
          timeout: 15000
        }).then((response) => {
          console.log(response);
          this.messages = response.data['chat_messages']
        }).catch((e) => {
          alert(e);
        });


      }).catch((e) => {
        alert(e);
      });
    },
  },
}
</script>
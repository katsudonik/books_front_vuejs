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
    this.sign_in();
    this.fetchMessages();
  },
  methods: {
    speak() {
      this.messageChannel.perform('speak', { 
        message: this.msgBox, 
      });
      this.msgBox = '';
    },
    sign_in() {
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
        localStorage.setItem("client", response.headers["client"]);
        localStorage.setItem("uid", response.headers["uid"]);
        localStorage.setItem("access-token", response.headers["access-token"]);
      }).catch((e) => {
        alert(e);
      });
    },
    fetchMessages() {
      this.axios({
        method: 'get',
        url: 'http://localhost:3000/chat_messages', // TODO domain
        headers: {
          'Content-Type': 'application/json',
          'uid': localStorage.getItem("uid"),
          'client': localStorage.getItem("client"),
          'access-token': localStorage.getItem("access-token"),
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
    },
  },
}
</script>
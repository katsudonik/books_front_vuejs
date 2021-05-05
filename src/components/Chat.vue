<template>
  <div>
    <div v-if="client == ''">
      <h1>SignIn</h1>
      <label for="email">email</label>
      <input id="email" type="email" v-model="email" />
      <label for="password">password</label>
      <input id="password" type="password" v-model="password" />
      <button @click="sign_in">SignIn</button>
    </div>

    <div v-if="client != ''">
      <ul>
        <li v-for="item in messages" :key="item.message">
          <p>{{ item.content }}</p>
        </li>  
      </ul>
      <input v-model="msgBox" placeholder="message here"  @keydown.enter="speak" />
      <button v-if="messageChannel" @click="speak">送信</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      client: "",

      msgBox: "",
      messages: [],
      messageChannel: null,
    };
  },
  created() {
    this.client = localStorage.getItem("client");
    if (this.client != "") {
      this.fetchMessages();
      this.messageChannel = this.$cable.subscriptions.create( "MessageChannel",{
        received: (data) => {
          this.messages.push(data)
        },
      });
    }
  },
  methods: {
    speak() {
      this.messageChannel.perform('speak', { 
        message: this.msgBox, 
      });
      this.msgBox = '';
    },
    async sign_in() {
      await this.axios({
        method: 'post',
        url: 'http://localhost:3000/auth/sign_in', // TODO domain
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          email: this.email,
          password: this.password
        },
        timeout: 15000
      }).then((response) => {
        console.log(response);
        localStorage.setItem("client", response.headers["client"]);
        localStorage.setItem("uid", response.headers["uid"]);
        localStorage.setItem("access-token", response.headers["access-token"]);
        this.client = response.headers["client"];
        this.fetchMessages();
        this.messageChannel = this.$cable.subscriptions.create( "MessageChannel",{
          received: (data) => {
            this.messages.push(data)
          },
        });
      }).catch((e) => {
        console.log(e);
        localStorage.removeItem("client");
        localStorage.removeItem("uid");
        localStorage.removeItem("access-token");
        this.client = '';
      });
    },
    async fetchMessages() {
      await this.axios({
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
        localStorage.setItem("client", response.headers["client"]);
        localStorage.setItem("uid", response.headers["uid"]);
        localStorage.setItem("access-token", response.headers["access-token"]);
        this.messages = response.data['chat_messages']
      }).catch((e) => {
        console.log(e);
        localStorage.removeItem("client");
        localStorage.removeItem("uid");
        localStorage.removeItem("access-token");
        this.client = '';
      });
    },
  },
}
</script>
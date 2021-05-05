<template>
  <div>
    <input v-model="msgBox" placeholder="message here"  @keydown.enter="speak" />
    <button v-if="messageChannel" @click="speak">送信</button>
    <ul>
      <li v-for="item in messages" :key="item.message">
        <p>{{ item.message }}</p>
      </li>  
    </ul>
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
  },
  methods: {
    speak() {
      this.messageChannel.perform('speak', { 
        message: this.msgBox, 
      });
    },
  },
}
</script>
<template>
  <div>
    <div>
      <select v-model="cipher">
        <option v-for="o in options" :key="o.name" :value="o.name"> {{o.name}}
        </option>
      </select>
      <hr>
      <textarea v-model="plainText" />
      <div>
        <button @click="this.updateEncoder">Update</button>
      </div>
      <hr>
      <pre><code>{{result}}</code></pre>
      <hr>
      <pre><code>{{decodeResult}}</code></pre>
    </div>

  </div>
</template>

<script>
import Core from '../core';

export default {
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      cipher: 'Ascii Armored',
      plainText: 'Hello World',
      result: 'Apply Cipher First',
      decodeResult: 'Apply Cipher First',
      options: Core.Encoder.encoders,
    };
  },
  methods: {
    updateEncoder() {
      const encoder = Core.Encoder.getEncoder(this.cipher);
      if (!encoder) {
        this.result = 'no valid encoder found';
        return;
      }
      const text = this.plainText;
      this.result = encoder.encode(Uint8Array.from(text.split('').map(s => s.charCodeAt(0))));
      this.decodeResult = Array.from(encoder.decode(this.result)).map(i => String.fromCharCode(i)).join('');
    },
  },

  render() {
    console.log('update');
  },
};
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
pre {
  margin: 0 20%;
  text-align: left;

 
 border: solid 1px #ccc;


}

</style>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>

<script>
// import jwt_decode
import jwt_decode from 'jwt-decode';
// Vue
export default {
  name:"app",
  components:{},
  created(){
    if(localStorage.eleToken){
      const decoded = jwt_decode(localStorage.eleToken);
      this.$store.dispatch("setAuthenticated",!this.isEmpty(decoded));
      this.$store.dispatch("setUser",decoded);

    }
  },
  methods:{
    isEmpty(value){
      return(
         value === undefined ||
                value === null ||
                (typeof value === "object" && Object.keys(value).length === 0)||
                (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>

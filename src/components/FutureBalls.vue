<template>
  <div class='futureBall'>
    <div class='ball' :class=[color] ></div>
  </div>
</template>

<script>
  export default{
    name: 'FutureBalls',
    props: ['color'],
    data () {
      return {
        color: this.color
      }
    }
  }
</script>

<style lang='scss'>
.futureBall{
  border: 1px solid #eee;
  width: 50px;
  height: 50px;
  float: left;
  .ball{
    margin: 10% auto;
    width: 80%;
    height: 80%;
    border-radius: 50%;
  }
}
</style>

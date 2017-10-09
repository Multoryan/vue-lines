<template>
  <div class="square" @click={choose()}>
    <transition name='fade'>
      <div class='ball' :class="[color, isChosen]" v-show="[isVisible]">
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'ball',
    props: ['color', 'isFocused', 'index'],
    data () {
      return {
        color: this.color
      }
    },
    computed: {
      isVisible: function () {
        return this.color !== 'none'
      },
      isChosen: function () {
        if (this.isFocused === this.index) {
          return 'chose'
        }
        return
      }
    },
    methods: {
      choose: function () {
        this.$emit('chosen')
      }
    }
  }
</script>

<style lang="scss">
$size: 50px;
@keyframes bounceAn {
  from, to {
    margin: 20% auto;
    width: 85%;
    height: 75%;
  }
  80% {
    margin: 5% auto;
    width: 80%;
    height: 80%;
  }
}

.square{
  border: 1px solid #eee;
  float: left;
  width: $size;
  height: $size;
  .ball{
    margin: 10% auto;
    transition: background-color .3s ease-in-out;
    border-radius: 50%;
    width: 80%;
    height: 80%;
    &.chose{
      animation: bounceAn 0.7s cubic-bezier(0.30, 2.40, 0.85, 2.50) infinite;
    }
  }
}
.none{/*
  border-radius: 0 !important;
  margin: 0px !important;
  opacity: 0;*/
}

.red{
  background-color: #f00;
}
.green{
  background-color: #0f0;
}
.yellow{
  background-color: #ff0;
}
.blue{
  background-color: #00f;
}
.violet{
  background-color: #f0f;
}
.brown{
  background-color: #fb0;
}
.orange{
  background-color: #f50;
}
</style>

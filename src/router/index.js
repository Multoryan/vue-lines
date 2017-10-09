import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Ball from '@/components/Ball'
import FutureBalls from '@/components/FutureBalls'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      components: {
        default: Hello,
        Ball: Ball,
        FutureBalls: FutureBalls
      }
    }
  ]
})

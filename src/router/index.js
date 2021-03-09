import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Register from '@/components/register/register.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/User/user.vue'
import Rights from '@/components/rights/rights.vue'
import Roles from '@/components/rights/roles.vue'
import Goods from '@/components/goods/goods.vue'
import GoodsAdd from '@/components/goods/goodsAdd.vue'
import Params from '@/components/goods/params.vue'
import Categories from '@/components/goods/categories.vue'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: Home,
    children: [{
      name: 'user',
      path: '/users',
      component: User
    }, 
    {
      name: 'rights',
      path: '/rights',
      component: Rights
    },
     {
      name: 'roles',
      path: '/roles',
      component: Roles
    },
    {
      name: 'goods',
      path: '/goods',
      component: Goods
    },
     {
      name: 'goodsAdd',
      path: '/goods/add',
      component: GoodsAdd
    },
     {
      name: 'params',
      path: '/params',
      component: Params
    }, 
    {
      name: 'categories',
      path: '/categories',
      component: Categories
    }
  ]
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    name: 'register',
    path: '/register',
    component: Register
  }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' & to.path !== '/register') {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push({ name: 'login' })
      Message.warning('请先登录')
      return
    }
  }
  next()
})

export default router

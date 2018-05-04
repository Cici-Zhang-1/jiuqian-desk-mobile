import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Apps from '@/views/Apps'
import App from '@/views/App'
/* import OrderOrderRead from '@/views/order/order/Read'
import Order from '@/views/Order'
import OrderIndexRead from '@/views/order/index/Read'
import OrderIndexAdd from '@/views/order/index/Add'
import OrderEdit from '@/views/order/Edit'
import OrderAdd from '@/views/order/Add'
import OrderRemove from '@/views/order/Remove' */
import Read from '@/views/Read'
import Edit from '@/views/Edit'
import Add from '@/views/Add'
import Remove from '@/views/Remove'
import Myself from '@/views/Myself'
import Funcs from '@/views/Funcs'
import FuncLocation from '@/views/func/FuncLocation'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      name: 'index',
      path: '/',
      redirect: '/home'
    },
    {
      name: 'Home',
      path: '/home',
      component: Home
    },
    {
      name: 'Apps',
      path: '/apps',
      component: Apps
    },
    {
      name: 'App',
      path: '/app',
      component: App
    },
    {
      name: 'Read',
      path: '/:f/:c/index/read',
      // :f folder :c controller
      component: Read,
      props: true
    },
    {
      name: 'Edit',
      path: '/:f/:c/edit',
      component: Edit,
      props: true
    },
    {
      name: 'Add',
      path: '/:f/:c/Add',
      component: Add,
      props: true
    },
    {
      name: 'Remove',
      path: '/:f/:c/remove',
      component: Remove,
      props: true
    },
    /* {
      name: 'OrderOrderIndexRead',
      path: '/order/order/index/read',
      component: Read
    },
    {
      name: 'OrderOrderEdit',
      path: '/order/order/edit',
      component: Edit
    },
    {
      name: 'OrderOrderAdd',
      path: '/order/order/add',
      component: Add
    },
    {
      name: 'OrderOrderRemove',
      path: '/order/order/remove',
      component: Remove
    }, */
    /* {
      name: 'Order',
      path: '/order',
      component: Order,
      children: [
        {
          name: 'OrderIndexRead',
          path: 'order/index/read',
          component: OrderIndexRead
        },
        {
          name: 'OrderIndexAdd',
          path: 'order/index/add',
          component: OrderIndexAdd
        },
        {
          name: 'OrderAdd',
          path: 'order/add',
          component: OrderAdd,
          meta: {
            showNavbars: false,
            showHeaderbar: false,
            showFuncbars: true
          }
        },
        {
          name: 'OrderEdit',
          path: 'order/edit',
          component: OrderEdit,
          meta: {
            showNavbars: false,
            showHeaderbar: false,
            showFuncbars: true
          }
        },
        {
          name: 'OrderRemove',
          path: 'order/remove',
          component: OrderRemove
        }
      ]
    }, */
    {
      name: 'Myself',
      path: '/myself',
      component: Myself
    },
    {
      name: 'Funcs',
      path: '/funcs',
      component: Funcs,
      children: [
        {
          name: 'FuncLocation',
          path: 'location/:action',
          component: FuncLocation,
          props: true
        }
      ],
      props: true
    }
  ]
})

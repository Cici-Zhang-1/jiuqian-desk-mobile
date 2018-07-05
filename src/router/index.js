import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Apps from '@/views/Apps'
import App from '@/views/App'
import Read from '@/views/Read'
import Edit from '@/views/Edit'
import Add from '@/views/Add'
import Remove from '@/views/Remove'
import Myself from '@/views/Myself'
/* import Funcs from '@/views/Funcs'
import FuncLocation from '@/views/func/FuncLocation' */
import SignIn from '@/views/SignIn'
import Upload from '@/views/Upload'
import PickSheet from '@/views/print/PickSheet'
import UnqrcodeLabel from '@/views/label/UnqrcodeLabel'

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
      name: 'Upload',
      path: '/upload',
      component: Upload
    },
    {
      name: 'SignIn',
      path: '/sign/index/in',
      component: SignIn
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
    {
      name: 'UnqrcodeLabel',
      path: '/warehouse/unqrcode_label',
      component: UnqrcodeLabel,
      props: true
    },
    {
      name: 'PickSheet',
      path: '/warehouse/pick_sheet_print',
      component: PickSheet,
      props: true
    },
    {
      name: 'Myself',
      path: '/myself',
      component: Myself
    }/* ,
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
    } */
  ]
})

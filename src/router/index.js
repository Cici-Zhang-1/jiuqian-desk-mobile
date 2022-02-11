import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Read from '@/views/Read'
import Edit from '@/views/Edit'
import Add from '@/views/Add'
import Remove from '@/views/Remove'
// import Myself from '@/views/Myself'
// import SignIn from '@/views/SignIn'
// import Upload from '@/views/Upload'
// import PickSheet from '@/views/print/PickSheet'
// import UnqrcodeLabel from '@/views/label/UnqrcodeLabel'
// import OrderDetail from '@/views/order/detail/OrderDetail'
// import OrderDismantle from '@/views/order/dismantle/OrderDismantle'
// import PostSale from '@/views/order/post_sale/PostSale'
// import OrderQuote from '@/views/order/quote/Quote'
// import Valuate from '@/views/order/valuate/Valuate'
// import WaitDelivery from '@/views/order/wait_delivery/WaitDelivery'
// import WorkOut from '@/views/order/wait_delivery/WorkOut'
// import ScanBoard from '@/views/scan/ScanBoard'
// import PrintOrderProductBoardPlate from '@/views/print/PrintOrderProductBoardPlate'
// import PrintOrderProductBoardDoor from '@/views/print/PrintOrderProductBoardDoor'
// import PrintOrderProductBoardWood from '@/views/print/PrintOrderProductBoardWood'
// import PrintOrderProductFitting from '@/views/print/PrintOrderProductFitting'
// import PrintOrderProductOther from '@/views/print/PrintOrderProductOther'

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
      component: () => import(/* webpackChunkName: "upload" */ '@/views/Upload')
    },
    {
      name: 'SignIn',
      path: '/sign/index/in',
      component: () => import(/* webpackChunkName: "signin" */ '@/views/SignIn')
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
      path: '/:f/:c/index/add',
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
      name: 'ScanBoard',
      path: '/order/scan_board',
      component: () => import(/* webpackChunkName: "scan_board" */ '@/views/scan/ScanBoard')
    },
    {
      name: 'UnqrcodeLabel',
      path: '/warehouse/unqrcode_label',
      component: () => import(/* webpackChunkName: "unqrcode_label" */ '@/views/label/UnqrcodeLabel')
    },
    {
      name: 'Myself',
      path: '/myself',
      component: () => import(/* webpackChunkName: "myself" */ '@/views/Myself')
    }
  ]
})

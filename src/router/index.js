import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Read from '@/views/Read'
import Edit from '@/views/Edit'
import Add from '@/views/Add'
import Remove from '@/views/Remove'
import Myself from '@/views/Myself'
import SignIn from '@/views/SignIn'
import Upload from '@/views/Upload'
import PickSheet from '@/views/print/PickSheet'
import UnqrcodeLabel from '@/views/label/UnqrcodeLabel'
import OrderDetail from '@/views/order/detail/OrderDetail'
import OrderDismantle from '@/views/order/dismantle/OrderDismantle'
import PostSale from '@/views/order/post_sale/PostSale'
import OrderQuote from '@/views/order/quote/Quote'
import Valuate from '@/views/order/valuate/Valuate'
import WaitDelivery from '@/views/order/wait_delivery/WaitDelivery'
// import WorkOut from '@/views/order/wait_delivery/WorkOut'
// import ScanBoard from '@/views/scan/ScanBoard'
// import PrintOrderProductBoardPlate from '@/views/print/PrintOrderProductBoardPlate'
// import PrintOrderProductBoardDoor from '@/views/print/PrintOrderProductBoardDoor'
// import PrintOrderProductBoardWood from '@/views/print/PrintOrderProductBoardWood'
// import PrintOrderProductFitting from '@/views/print/PrintOrderProductFitting'
// import PrintOrderProductOther from '@/views/print/PrintOrderProductOther'
// const PickSheet = () => import(/* webpackChunkName: "print" */ '@/views/print/PickSheet')
// const UnqrcodeLabel = () => import('@/views/label/UnqrcodeLabel')
// const OrderDetail = () => import(/* webpackChunkName: "order" */ '@/views/order/detail/OrderDetail')
// const OrderDismantle = () => import(/* webpackChunkName: "order" */ '@/views/order/dismantle/OrderDismantle')
// const PostSale = () => import(/* webpackChunkName: "order" */ '@/views/order/post_sale/PostSale')
// const OrderQuote = () => import(/* webpackChunkName: "order" */ '@/views/order/quote/Quote')
// const Valuate = () => import(/* webpackChunkName: "order" */ '@/views/order/valuate/Valuate')
// const WaitDelivery = () => import(/* webpackChunkName: "order" */ '@/views/order/wait_delivery/WaitDelivery')
const WorkOut = () => import(/* webpackChunkName: "order" */ '@/views/order/wait_delivery/WorkOut')
const ScanBoard = () => import('@/views/scan/ScanBoard')
const PrintOrderProductBoardPlate = () => import(/* webpackChunkName: "print" */ '@/views/print/PrintOrderProductBoardPlate')
const PrintOrderProductBoardDoor = () => import(/* webpackChunkName: "print" */ '@/views/print/PrintOrderProductBoardDoor')
const PrintOrderProductBoardWood = () => import(/* webpackChunkName: "print" */ '@/views/print/PrintOrderProductBoardWood')
const PrintOrderProductFitting = () => import(/* webpackChunkName: "print" */ '@/views/print/PrintOrderProductFitting')
const PrintOrderProductOther = () => import(/* webpackChunkName: "print" */ '@/views/print/PrintOrderProductOther')

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
      name: 'OrderDetail',
      path: '/order/order_detail',
      component: OrderDetail
    },
    {
      name: 'OrderDismantle',
      path: '/order/dismantle',
      component: OrderDismantle
    },
    {
      name: 'PostSale',
      path: '/order/post_sale',
      component: PostSale
    },
    {
      name: 'OrderQuote',
      path: '/order/quote',
      component: OrderQuote
    },
    {
      name: 'Valuate',
      path: '/order/valuate',
      component: Valuate
    },
    {
      name: 'WaitDelivery',
      path: '/order/wait_delivery',
      component: WaitDelivery
    },
    {
      name: 'WorkOut',
      path: '/wait_delivery/work_out',
      component: WorkOut
    },
    {
      name: 'PrintOrderProductBoardPlate',
      path: '/print/print_order_product_board_plate',
      component: PrintOrderProductBoardPlate
    },
    {
      name: 'PrintOrderProductBoardDoor',
      path: '/print/print_order_product_board_door',
      component: PrintOrderProductBoardDoor
    },
    {
      name: 'PrintOrderProductBoardWood',
      path: '/print/print_order_product_board_wood',
      component: PrintOrderProductBoardWood
    },
    {
      name: 'PrintOrderProductFitting',
      path: '/print/print_order_product_fitting',
      component: PrintOrderProductFitting
    },
    {
      name: 'PrintOrderProductOther',
      path: '/print/print_order_product_other',
      component: PrintOrderProductOther
    },
    {
      name: 'PickSheet',
      path: '/warehouse/pick_sheet_print',
      component: PickSheet
    },
    {
      name: 'ScanBoard',
      path: '/order/scan_board',
      component: ScanBoard
    },
    {
      name: 'UnqrcodeLabel',
      path: '/warehouse/unqrcode_label',
      component: UnqrcodeLabel
    },
    {
      name: 'Myself',
      path: '/myself',
      component: Myself
    }
  ]
})

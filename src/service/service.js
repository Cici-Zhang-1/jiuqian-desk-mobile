/**
 * Created by chuangchuangzhang on 2018/2/6.
 */
import fetch from '@/api/fetch'

export const postData = (uri, data) => fetch(uri, data, 'POST')

export const getData = (uri, data) => fetch(uri, data, 'GET')

import {instance_api} from "./axios";

// 获取前端public下的静态文件
export function frontStatic(path) {
  return instance_api({
    url: '/static/'+path,
    method: 'get',
  })
}

// 获取后端提供静态文件
export function backendStatic(path) {
  return instance_api({
    url: path,
    method: 'get',
  })
}
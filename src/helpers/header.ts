import { Method } from './../types'
import { deepMerge, isPlainObject } from "./util"

function noramlizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }

  Object.keys(headers).forEach((name) => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data?: any): any {

  noramlizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseHeaders(header: string): any {
  let parsed = Object.create(null)
  if (!header) {
    return parsed
  }

  header.split('\r\n').forEach((line) => {

    // date 在这里截取会丢失后面的数据
    let [key, ...val] = line.split(':')
    key = key.trim().toLowerCase()
    let values

    if (!key) {
      return
    }
    if (val) {
      values = val.join(':').trim()
    }

    parsed[key] = values

  })

  return parsed

}


export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common, headers[method], headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
import request from '../utils/request'

export function createBook(data) {
  return request({
    url: '/book/create',
    method: 'POST',
    data
  })
}

export function getBook(fileName) {
  return request({
    url: '/book/get',
    method: 'GET',
    params: {
      fileName
    }
  })
}

export function updateBook(book) {
  return request({
    url: '/book/update',
    method: 'POST',
    data: book
  })
}

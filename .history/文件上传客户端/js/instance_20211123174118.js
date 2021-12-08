// 创建新的实例，防止影响其他axios
var instance = axios.create()
// 配置默认的URl
instance.defaults.baseURL = ('http://127.0.0.1:8888')
// 配置默认发送的文件格式
instance.defaults.headers['Content-Type'] = 'multipart/form-data'
// 将请求数据改为xx=xx&xxx=xxx的格式
instance.defaults.transformRequest = (data, headers) => {
    const contentType = headers['Content-Type']
    if (contentType === 'application/x-www-form-urlencoded') return Qs.stringify(data)
    return data
}
// 对响应体直接返回响应数据
instance.interceptors.response.use(response => {
    return response.data
})
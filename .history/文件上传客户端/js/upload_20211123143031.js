/* 基于FORM-DATA实现文件上传 */
(function() {
    var fm = new FormData();
    fm.append('file', '')
    fm.append('filename', '')

    instance.post('/upload_single', fm).then(data => {

    })

    // xxx=xxx&xx=xx
    instance.post('/upload_single_base64', {
        file: '',
        filename: ''
    }, { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
    })
})()
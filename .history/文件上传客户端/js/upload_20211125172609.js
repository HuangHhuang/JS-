/* 基于FORM-DATA实现文件上传 */
(function() {
    let upload = document.querySelector('#upload1');
    let upload_inp = upload.querySelector('.upload_inp');
    let upload_button_select = upload.querySelector('.upload_button.select');
    let upload_button_upload = upload.querySelector('.upload_button.upload');
    let upload_tip = upload.querySelector('.upload_tip');
    let upload_list = upload.querySelector('.upload_list');

    let _file = null;

    upload_button_upload.addEventListener('click', function() {
        if(upload_button_upload.classList.contains('disable') || upload_button_upload.classList.contains('loading')) return;
        if (!_file) {
            alert('请选择需要上传的文件！')
            return;
        }
        let fm = new FormData();
        fm.append('file', _file);
        fm.append('filename', _file.name);
        console.log(fm)
        changeDisable(true);
        instance.post('/upload_single', fm).then(data => {
            if(+data.code === 0) {
                alert(`文件上传成功，您可以前往 ${data.servicePath} 查看该文件！`)
                return;
            }
            return Promise.reject(data.codeText);
        }).catch(err => {
            alert('文件上传失败，请您稍后再试！')
        }).finally(() => {
            clearHandle();
            changeDisable(false);
        })
    })

    function changeDisable(flag) {
        if(flag) {
            upload_button_select.classList.add('disable');
            upload_button_upload.classList.add('loading');
        } else {
            upload_button_select.classList.remove('disable');
            upload_button_upload.classList.remove('loading');
        }
    }

    function clearHandle() {
        _file = null;
        upload_tip.style.display = 'block';
        upload_list.style.display = 'none';
        upload_list.innerHTML = '';
    }

    upload_list.addEventListener('click', function(e) {
        let target = e.target;
        if(target.tagName === 'EM') {
            clearHandle();
        }
    })

    upload_inp.addEventListener('change', function() {
        let file = upload_inp.files[0];
        if(!file) return;
        if(file.size > 2 * 1024 * 1024) {
            alert('上传图片不能超过2M');
            return;
        }
        _file = file;
        upload_tip.style.display = 'none';
        upload_list.style.display = 'block';
        upload_list.innerHTML = `
        <li>
            <span>文件：${file.name}</span>
            <span><em>移除</em></span>
        </li>
        `;
    })

    upload_button_select.addEventListener('click', function() {
        if(upload_button_select.classList.contains('disable') || upload_button_select.classList.contains('loading')) return;
        upload_inp.click();
    })
})();

/* 基于BASE64实现文件上传 */
(function() {
    let upload = document.querySelector('#upload2');
    let upload_inp = upload.querySelector('.upload_inp');
    let upload_button_select = upload.querySelector('.upload_button.select');

    function checkIsDisable(element) {
        let classList = element.classList;
        return classList.contains('disable') || classList.contains('loading');
    }

    function changeBASE64(file) {
        return new Promise(resolve => {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = ev => {
                resolve(ev.target.result);
            }
        })
    }

    upload_inp.addEventListener('change', async function() {
        let file = upload_inp.files[0];
        let BASE64;
        if(!file) return;
        if(file.size > 2 * 1024 * 1024) {
            alert('上传图片不能超过2M');
            return;
        }
        BASE64 = await changeBASE64(file);
        console.log(BASE64)
    })

    upload_button_select.addEventListener('click', function() {
        if(checkIsDisable(this)) return;
        upload_inp.click();
    })
})();
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
        upload_button_select.classList.add('loading');
        BASE64 = await changeBASE64(file);
        try {
            let data = await instance.post('/upload_single_base64', {
                file: encodeURIComponent(BASE64),
                filename: file.name
            }, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            })
            if(+data.code === 0) {
                alert(`恭喜您，文件上传成功，您可以基于 ${data.servicePath} 地址去访问~~`);
                return;
            }
            throw data.codeText;
        } catch (e) {
            alert('很遗憾，文件上传失败，请您稍后再试~~');
        } finally {
            upload_button_select.classList.remove('loading');
        }
    })

    upload_button_select.addEventListener('click', function() {
        if(checkIsDisable(this)) return;
        upload_inp.click();
    })
})();

/* 文件缩略图 & 自动生成名字 */
(function() {
    let upload = document.querySelector('#upload3');
    let upload_inp = upload.querySelector('.upload_inp');
    let upload_button_select = upload.querySelector('.upload_button.select');
    let upload_button_upload = upload.querySelector('.upload_button.upload');
    let upload_abbre = upload.querySelector('.upload_abbre');
    let upload_abbre_img = upload_abbre.querySelector('img');

    let BASE64;

    // 检查文件是否处于可操作状态
    function checkIsDisable(element) {
        let classList = element.classList;
        return classList.contains('disable') || classList.contains('loading');
    }

    // 把选择的文件读取成BASE64
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
        
        if(!file) return;
        if(file.size > 2 * 1024 * 1024) {
            alert('上传图片不能超过2M');
            return;
        }
        upload_button_select.classList.add('disable');
        BASE64 = await changeBASE64(file);

        upload_abbre.style.display = 'block';
        upload_abbre_img.src = BASE64;
        upload_button_select.classList.remove('disable');
    })

    upload_button_select.addEventListener('click', function() {
        console.log(1)
        if(checkIsDisable(this)) return;
        console.log(2)
        upload_inp.click();
    })

    upload_button_upload.addEventListener('click', function() {
        if(!BASE64) {
            alert('请先选择需要上传的文件');
            return;
        }
        try {
            let data = await instance.post('/upload_single_base64', {
                file: encodeURIComponent(BASE64),
                filename: file.name
            }, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            })
            if(+data.code === 0) {
                alert(`恭喜您，文件上传成功，您可以基于 ${data.servicePath} 地址去访问~~`);
                return;
            }
            throw data.codeText;
        } catch (e) {
            alert('很遗憾，文件上传失败，请您稍后再试~~');
        } finally {
            upload_button_select.classList.remove('loading');
        }
    })
})();
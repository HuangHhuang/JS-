(function() {
    let upload = document.querySelector('#upload');
    let upload_inp = document.querySelector('.upload_inp');
    let upload_button_select = document.querySelector('.upload_button.select');
    let upload_button_upload = document.querySelector('.upload_button.upload');
    let upload_tip = document.querySelector('.upload_tip');
    let upload_list = document.querySelector('.upload_list');

    let _file = null;

    upload_button_upload.addEventListener('click', function() {
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
        upload_inp.click();
    })
})();
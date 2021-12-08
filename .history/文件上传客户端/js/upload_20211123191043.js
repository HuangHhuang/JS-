(function() {
    let upload = document.querySelector('#upload');
    let upload_inp = document.querySelector('.upload_inp');
    let upload_button_select = document.querySelector('.upload_button.select');
    let upload_button_upload = document.querySelector('.upload_button.upload');
    let upload_tip = document.querySelector('.upload_tip');
    let upload_list = document.querySelector('.upload_list');

    upload_list.addEventListener('click', function(e) {
        let target = e.target;
        if(target.tagName === 'EM') {
            upload_tip.style.display = 'block';
            upload_list.style.display = 'none';
            upload_list.innerHTML = '';
        }
    })

    upload_inp.addEventListener('change', function() {
        let file = upload_inp.files[0];
        if(!file) return;
        if(file.size > 2 * 1024 * 1024) {
            alert('上传图片不能超过2M');
            return;
        }
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
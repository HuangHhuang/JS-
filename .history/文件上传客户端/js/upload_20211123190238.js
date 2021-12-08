(function() {
    let upload = document.querySelector('#upload');
    let upload_inp = document.querySelector('.upload_inp');
    let upload_button_select = document.querySelector('.upload_button.select');
    let upload_button_upload = document.querySelector('.upload_button.upload');
    let upload_tip = document.querySelector('.upload_tip');
    let upload_list = document.querySelector('.upload_list');

    upload_inp.addEventListener('change', function() {
        let file = upload_inp.files[0]
        console.log(upload_inp.files)
    })

    upload_button_select.addEventListener('click', function() {
        upload_inp.click();
    })
})();
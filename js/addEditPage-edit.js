$(function () {
    var token = GetRequest().token;
    var activity_id = GetRequest().activityId;

    // 获取编辑的cat_data, 若cat_data为空则为新增猫咪的页面
    var cat_data = window.sessionStorage.getItem('cat_data');

    // 若cat_data不为空，则渲染已有的猫咪数据
    if (cat_data) {
        cat_data = JSON.parse(cat_data);
        console.log(cat_data)
        $('#activityTopArea').attr('src', cat_data.image_url);

        var genderInput = $('input[type=radio][name=sex][value=' + cat_data.gender + ']');
        if (genderInput.length) {
            genderInput.prop('checked', true);
        }
        $('#number').val(cat_data.number);
        $('#age').val(cat_data.age);
        $('#race').val(cat_data.race);
        $('#color').val(cat_data.color);
        $('.detail-item-box').val(cat_data.username);
        $('#character').val(cat_data.character);
        $('.skills-box').val(cat_data.specialty);
        $('.story-box').val(cat_data.story);

        //渲染已有猫咪相册数据
        if (cat_data.album.length) {
            cat_data.album.map(function (item) {
                addAlbumImg(item);
            });
        }
        

    }

// 文件上传
    $('.img-upload').on('change',function () {
        $('.upload-title').text('上传中');
        $('.img-upload').attr('disabled',true);
        var file = new FormData();
        file.append('file',this.files[0])
        var fileInput = $(this);
        $.ajax({
            type : 'post',
            contentType : false,
            processData : false,
            dataType : 'json',
            url:  apiDomain + '/file/upload-file',
            data : file,
            error:function () {
                alert('图片上传失败')
            },
            success : function (res) {
                if(res.status = 2000){
                    $('#upload-pic').attr('src',res.data);
                    fileInput.prev('img').attr('src',res.data);
                    $('.upload-title').text('点击上传图片');
                    $('.img-upload').attr('disabled',false);
                }
                else {
                    alert('图片上传失败')
                }
            }
        })
    })

    var token = GetRequest().token;
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    // 表单上传
    $('.submit').on('click',function () {
        var data = {
            image_url : $('#activityTopArea').attr('src'),
            gender : $('input[type=radio][name=sex]:checked').val(),
            number : $('#number').val(),
            age : $('#age').val(),
            race : $('#race').val(),
            color : $('#color').val(),
            username : $('.detail-item-box').val(),
            character : $('#character').val(),
            specialty : $('.skills-box').val(),
            story : $('.story-box').val(),
            token : token,
        }
        // 校验
        for (var v in data) {
            if (data[v] == '') {
                alert(v + '不能为空');
                return;
            }
        }
        var postUrl = '';
        if (cat_data) {
            // 编辑
            postUrl = apiDomain + '/postcard-cat/update';
            data.postcard_cat_id = cat_data.id;
        } else {
            // 添加
            postUrl = apiDomain + '/postcard-cat/create';
        }
        $.ajax({
            url : postUrl,
            type : 'post',
            data : data,
            success:function (res) {
                if (res.status == 2000){
                    var cat_id = res.data.id;
                    bindCatToList(cat_id);

                } else {
                    alert(res.message);
                }
            }
        })
    })


    // $('#activityItem').on('change',function () {
    //     var file = new FormData();
    //     file.append('file',this.files[0])
    //     console.log(file)
    //     $.ajax({
    //         type : 'post',
    //         contentType : false,
    //         processData : false,
    //         dataType : 'json',
    //         url: apiDomain+'/postcard-album/create',
    //         data : file,
    //         success : function (res) {
    //             console.log(res)
    //             if(res.status = 2000){
    //                 $('#upload-pic').attr('src',res.data);
    //             }
    //         }
    //     })
    // })



    function bindCatToList(cat_id) {
        $.ajax({
            url: apiDomain + '/postcard-activity/add-cat',
            type: 'post',
            data: {
                "postcard_cat_id": cat_id,
                "postcard_activity_id": activity_id,
                "token": token
            },
            success:function (res) {
                console.log(res)
                if (res.status == 2000) {
                    window.location.href='./postcardList.html?activityId=' + activity_id + '&token=' + token;
                }
            }
        })
    }

    
    /**************************** 猫咪相册 ****************************/
    $('.cancel').on('click',function () {
        $('.unit-upload').addClass('active');
    });

    $('.confirm').on('click',function () {
        if (!cat_data) {
            alert('猫咪信息还没有注册，请点击上方提交按钮');
            return;
        }

        var data = {
            image_url : $('#upload-pic').attr('src'),
            overview : $('#activityBox').val(),
            token : token,
            'postcard_cat_id': cat_data.id
        }
        if (!data.image_url) {
            alert('图片不能为空');
            return;
        }
            $.ajax({
                url : apiDomain + '/postcard-album/create',
                type : 'post',
                data : data,
                success:function (res) {
                    if(res.status = 2000){
                        console.log(res)
                        cat_data.album.push(data)
                        addAlbumImg(data);
                        $('#upload-pic').attr('src', '');
                        $('#activityBox').val('');
                        $('.unit-upload').addClass('active');
                    }
                    else {
                        alert('图片上传失败')
                    }
                }
            })
    })

    // 提交图文
    $('.addBtn').on('click',function () {
        $('.unit-upload').removeClass('active');
    })

    function addAlbumImg(imgData) {
        var imgItem = '<div class="unit"> ' +
            '<div class="pets-photo"> ' +
            '<img src="' + imgData.image_url + '"> ' +
            '</div> ' +
            '<div class="notes">' + imgData.overview + '</div> ' +
            '</div>'

        $('#albumContainer').append(imgItem);
    }
})


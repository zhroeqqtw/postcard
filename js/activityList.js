$(function () {
    $('.cancel-btn').on('click',function () {
        pageChange();
    });

    function pageChange() {
        $('.wrap').removeClass('active');
        $('.public-container').addClass('active');
    }
// 加载活动列表
    var token = GetRequest().token;
    renderActivityList();

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

        // 新增活动弹窗
    $('.attach-btn').on('click', function () {
        $('.wrap').addClass('active');
        $('.public-container').removeClass('active');
    });

    $('.confirm-btn').on('click',function () {
        var data = {
            title : $('#activityName').val(),
            image_url : $('#activityPic').attr('src'),
            overview : $('#activityArea').val(),
            token : token
        }
        // 校验
        for (var v in data) {
            if (data[v] == '') {
                alert(v + '不能为空');
                return;
            }
        }
        $.ajax({
            url: apiDomain + '/postcard-activity/create',
            type:'post',
            data:data,
            success:function (res) {
                if(res.status = 2000){
                    pageChange();
                    renderActivityList();
                }
            }
        })
    })
    
    // 文件上传
    $('#activityItem').on('change', function () {
        $('.upload-title').text('上传中');
        $('#activityItem').attr('disabled',true);
        var file = new FormData();
        file.append('file', this.files[0])
        $.ajax({
            type: 'post',
            contentType: false,
            processData: false,
            dataType: 'json',
            url:  apiDomain + '/file/upload-file',
            data: file,
            error:function () {
                alert('图片上传失败')
            },
            success: function (res) {
                console.log(res)
                if (res.status == 2000) {
                    $('#activityPic').attr('src', res.data);
                    $('.upload-title').text('点击上传图片');
                    $('#activityItem').attr('disabled',false);
                }
                else (
                    alert('图片上传失败')
                )
            }
        })
    });
    //请求列表数据
    function renderActivityList() {
        $.ajax({
            url: apiDomain + '/postcard-activity/get-list',
            type:'post',
            data:
                {
                    "token" : token,
                },
            success:function (res) {
                console.log(res)
                if(res.status = 2000){
                    renderList(res.data)
                }
            }
        })
    }
    function renderList(data) {
        var listHtml = '';
        if (data.length) {
            $(data).each(function () {
               listHtml +=
                   '<div class="activity-list-item" data-id="' + this.id + '">' +
                   '<img src="' + this.image_url + '" class="theme-picture">' +
                   '<h3>' + this.title + '</h3>' +
                   '</div>';
            });
            $('#listContainer').html(listHtml);
        }
    }
    // 进入活动详情  明信片列表
    $('#listContainer').on('click', '.activity-list-item', function () {
        var activityId = $(this).data('id');
        window.location.href = './postcardList.html?activityId=' + activityId+'&token='+token;
    });
})





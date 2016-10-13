/**
 * Created by 3water on 16/9/30.
 */
$(function () {
    // 取到token
    var token = GetRequest().token;
    var activity_id = GetRequest().activityId;


    // 添加、跳转到addEditPage
    $('.add-btn').on('click', function () {
        window.sessionStorage.removeItem('cat_data');
        window.location.href = './addEditPage-edit.html?token=' + token + '&activityId=' + activity_id;
    })

    renderActivityCardList()

    function renderActivityCardList() {
        $.ajax({
            url:  apiDomain + '/postcard-activity/get-activity-cat-list',
            type: 'post',
            data: {
                "token": token,
                "postcard_activity_id": activity_id

            },
            success: function (res) {
                console.log(res)
                if (res.status = 2000) {
                    renderCardList(res.data);
                }
            }
        })
    }

// 页面渲染
    function renderCardList(data) {
        var cardArray = [];
        if (data.length) {
            $(data).each(function () {
                 var cardHtml = '<div class="item">' +
                    '<img src="' + this.image_url + '" class="sample-pic">' +
                    '<div class="user-code">用户编号:' + this.number + '号</div>' +
                    '<div class="edit-btn">编辑</div>' +
                    '</div>';
                cardHtml = $(cardHtml).data('cat', this);
                cardArray.push(cardHtml);
            })

            $('.list-container').html(cardArray);
        }
    }

// 编辑跳转
    $('.list-container').on('click', '.edit-btn', function () {
        var cat_data = $(this).closest('.item').data('cat');
        window.sessionStorage.removeItem('car_data');
        window.sessionStorage.setItem('cat_data', JSON.stringify(cat_data));
        window.location.href = './addEditPage-edit.html?activityId=' + activity_id + '&token=' + token;
    })

    // 查看完整效果
    $('.list-container').on('click','.sample-pic', function () {
        var cat_data = $(this).closest('.item').data('cat');
        var card_id = cat_data.id;
        window.sessionStorage.removeItem('car_data');
        window.sessionStorage.setItem('cat_data', JSON.stringify(cat_data));
        window.location.href = './addEditPage.html?activityId=' + card_id + '&token=' + token;
    })

})





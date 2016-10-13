$(function () {
    $('#loginBtn').on('click',function () {
        var data = {
            username : $('#username').val(),
            password : $('#password').val()
        }
        $.ajax({
            url: apiDomain + '/user/login',
            type:'post',
            data:data,
            success:function (res) {
                console.log(res)
                if(res.status == 2000){
                    window.location.href = './activityList.html?token='+res.data.token;
                }
            }
        })

    })
})



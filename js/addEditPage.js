/**
 * Created by 3water on 16/10/4.
 */
$(function () {
    var token = GetRequest().token;
    var card_id = GetRequest().activityId;

    $.ajax({
        type: 'post',
        url: apiDomain + '/postcard-cat/get-info',
        dataType: 'json',
        data: {
            'postcard_cat_id': card_id
        },
        success: function (res) {
            console.log(res)
            renderCatData(res.data);
        }
    })

    function renderCatData(cat_data) {
        // 若cat_data不为空，则渲染已有的猫咪数据
        if (cat_data) {
            // cat_data = JSON.parse(cat_data);
            console.log(cat_data)
            //公猫
            if(cat_data.gender == 1){
                $('.pink').addClass('active');
            }
            //母猫
            if(cat_data.gender == 2) {
                $('.blue').addClass('active');
            }
            $('.activity-top-pic').attr('src', cat_data.image_url);
            $('.username').text(cat_data.username);
            $('.name').text(cat_data.username);
            $('.number').text(cat_data.number);
            $('.age').text(cat_data.age);
            $('.race').text(cat_data.race);
            $('.color').text(cat_data.color);
            $('.character').text(cat_data.character);
            $('.skillsItem').text(cat_data.specialty);
            $('.storyItem').text(cat_data.story);
            $('.pets-photo-item').attr('src',cat_data.image_url);
            if (cat_data.albums.length) {
                cat_data.albums.map(function (item) {
                    addAlbumImg(item, cat_data.gender);
                });
            }
        }
    }
    function addAlbumImg(imgData, gender) {
            var imgItem = '<div class="unit"> ' +
                '<div class="pets-photo"> ' +
                '<img src="' + imgData.image_url + '"> ' +
                '</div> ' +
                '<div class="' + (gender == 2 ? 'notes' : 'notes-blue') + '">' + imgData.overview + '</div> ' +
                '</div>'
            $('.unit-border').append(imgItem);
    }
})

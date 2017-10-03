
Mock.mock(
    /\.json/, {    //匹配.json文件，可执行匹配成功的参数
        'User':[{
            'Id': /\d{9}/,
            'Name': '@cword(2, 10)',
            'Avater': '@dataImage(60x60)',
            'Desc': '@cparagraph(1)'
        }],
        'Video':[{
            'Id': /\d{9}/,
            'Title': '@cword(2, 25)',
            'Img': '@dataImage(60x60)',
            'Desc': '@cparagraph()',
            'Time': '@datetime("yyyy-MM-dd")',
            'c': '@pick(["美国", "英国", "日本", "韩国", "俄罗斯","法国", "德国", "西班牙","巴葡", "意大利", "泰国"])',
            'f': '@pick(["兴趣", "娱乐", "音乐", "影视", "科技","人文", "运动", "广告"])',
            's': '@pick(["搞笑", "美食", "游戏", "摄影", "其余"])',
            'Tag|1-5':[{
                'Tagspan': '@ctitle(2, 3)'
            }]
        }],
        'otherVideo|1-8':[{
            'Id': /\d{9}/,
            'Img': '@dataImage(220x132)',
            'Time': '@datetime("HH:mm:ss")',
            'Title': '@sentence(3, 10)',
            'Avatar': '@dataImage("28x28")',
            'User': '@word(4, 16)',
            'c': '@pick(["美国", "英国", "日本", "韩国", "俄罗斯","法国", "德国", "西班牙","巴葡", "意大利", "泰国"])',
            'f': '@pick(["兴趣", "娱乐", "音乐", "影视", "科技","人文", "运动", "广告"])',
            's': '@pick(["搞笑", "美食", "游戏", "摄影", "其余"])'
        }]
    });
sendData("hello.json");

function sendData(url) {
    $.ajax({
        url: url,
        dataType: 'json'
    }).done(function (data, status, jqXHR) {
        //获得mock数据模板中的数据，打印到body上
        /*$('<pre>').text(JSON.stringify(data, null, 4)).appendTo('body');*/

        //视频和发布人数据绑定
        $(".info1-l").children('.v-title').text(data.Video[0].Title);  //视频标题
        $(".info1-l").children('.v-country').text(data.Video[0].c);  //视频国家分类
        $(".info1-l").children('.v-class-f').text(data.Video[0].f);  //视频一级分类
        $(".info1-l").children('.v-time').text('发布于 '+data.Video[0].Time);  //视频发布时间

        $(".info1-r-w").children('.v-avatar').find('img').attr('src', data.User[0].Avater);    //视频发布人头像
        $(".info1-r-w").children('.v-username').find('a').text(data.User[0].Name);    //视频发布人
        $(".info1-r-w").children('.v-desc').text(data.User[0].Desc);    //视频发布人描述

        $(".info2").children('.v-img').find('img').attr('src', data.Video[0].Img);    //视频图片
        $(".info2").children('.v-title').text(data.Video[0].Title);    //视频标题
        $(".info2").children('.v-desc').text('视频简介：'+ data.Video[0].Desc);    //视频描述


        if(data.Video[0].Tag.length>0){
            for(var i=0;i<data.Video[0].Tag.length;i++){
                $(".info2").children('.v-tag').append("<span>"+data.Video[0].Tag[i].Tagspan+"</span>");    //视频标签
            }

        }



//推荐页面数据绑定
        var OtherVideoLength=data.otherVideo.length;
        if(OtherVideoLength<4){
            $('.other-index').hide();
            $('.other-left-btn').hide();
            $('.other-right-btn').hide();
        }

        for(var i=0;i<OtherVideoLength;i++){
            $(".swiper-wrapper").append('<div class="swiper-slide"><a href="" class="v-img"><img src=""><span></span></a><div class="v-info"><div class="v-title"></div><div class="v-l"><a href="" class="v-avatar"><img src=""></a></div><div class="v-r"><a href="" class="v-user"></a><div class="v-time">2天前</div><div class="v-class"><div class="v-c"><a href=""></a></div><span>-</span><div class="v-f"><a href=""></a></div><span>-</span><div class="v-s"><a href=""></a></div></div></div></div></div>')
        }
        $(".swiper-slide").each(function (index) {
            $(this).children('.v-img').find("img").attr('src', data.otherVideo[index].Img);
            $(this).children('.v-img').find('span').text(data.otherVideo[index].Time);
            $(this).children('.v-info').children('.v-title').text(data.otherVideo[index].Title);
            $(this).children('.v-info').find('img').attr('src', data.otherVideo[index].Avatar);
            $(this).children('.v-info').children('.v-r').children('.v-user').text(data.otherVideo[index].User);
            $(this).children('.v-info').children('.v-r').children('.v-class').children('.v-c').find('a').text(data.otherVideo[index].c);
            $(this).children('.v-info').children('.v-r').children('.v-class').children('.v-f').find('a').text(data.otherVideo[index].f);
            $(this).children('.v-info').children('.v-r').children('.v-class').children('.v-s').find('a').text(data.otherVideo[index].s);
        });

        if(OtherVideoLength>3){
            var mySwiper = new Swiper('.swiper-container', {
                slidesPerView : 3,
                spaceBetween : 90,
                prevButton:'.other-right-btn',
                nextButton:'.other-left-btn',
                pagination : '.other-index',
                paginationClickable:true,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
            })
        }else {
            var mySwiper = new Swiper('.swiper-container', {
                slidesPerView : 3,
                spaceBetween : 90,
                prevButton:'.other-right-btn',
                nextButton:'.other-left-btn',
                pagination : '.other-index',
                paginationClickable:true,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
                onlyExternal : true
            })
        }
    })
}






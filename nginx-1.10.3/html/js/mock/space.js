Mock.mock(
    /\.json/, {    //匹配.json文件，可执行匹配成功的参数
        'v-color':'@color',
        'header':[{
            'bg': '@Image(1920x335)'
        }],
        'index|20':[{
            'vid': /\d{9}/,
            'vimg': '@dataImage(924x324)'
        }],
        'video|24':[{
            'vid': /\d{9}/,
            'vimg': '@dataImage(220x132)',
            'vlong': '@datetime("HH:mm:ss")',
            'vtitle': '@sentence(3, 10)'
        }],
        'movie|16':[{
            'mid':/\d{9}/,
            'mimg': '@dataImage(160x240)',
            'mtitle': '@sentence(3, 10)',
            'mscore':'@float(0, 9, 1, 1)'
        }],
        'sub|25':[{
            'uid':/\d{9}/,
            'uimg': '@dataImage(80x80)',
            'username': '@sentence(3, 10)'
        }],
        'collectionV|20':[{
            'vid': /\d{9}/,
            'vimg': '@dataImage(220x132)',
            'vlong': '@datetime("HH:mm:ss")',
            'vtitle': '@sentence(3, 10)'
        }],
        'collectionM|30':[{
            'mid': /\d{9}/,
            'mimg': '@dataImage(160x240)',
            'mtitle': '@sentence(3, 10)'
        }]
    });

function sendData(url) {
    $.ajax({
        url: url,
        dataType: 'json'
    }).done(function (data, status, jqXHR) {
        //获得mock数据模板中的数据，打印到body上
        //$('<pre>').text(JSON.stringify(data, null, 4)).appendTo('body');
        //beader背景部分
        /*$(".header-wrapper").css({"background-image": "url("+data.header[0].bg+") " });
        $(".header").css({"background-image": "url("+data.header[0].bg+") " });
        $(".banner").css({"background-image": "url("+data.header[0].bg+") " });*/
        //数据绑定

        //首页
        $('.Text-main .index-list li').each(function (i) {
            $(this).children('.index-img').find("img").attr('src', data.index[i].vimg);
        });


        //短视频
        $('.Text-main>.v-box .v-list li').each(function (i) {
            $(this).children('.v-img').find("img").attr('src', data.video[i].vimg);
            $(this).children('.v-img').find('span').text(data.video[i].vlong);
            $(this).children('.v-info').children('.v-title').text(data.video[i].vtitle);
        });

        //影视剧集
        $('.m-box .m-list>li').each(function (i) {
            $(this).children('.m-img').find("img").attr('src', data.movie[i].mimg);
            $(this).children('.title').text(data.movie[i].mtitle);
            $(this).children('.score').text(data.movie[i].mscore);
        });

        //订阅
        $('.s-box .s-list>li').each(function (i) {
            $(this).find("img").attr('src', data.sub[i].uimg);
            $(this).children('.s-list-bg').children('.o-UserName').text(data.sub[i].username);
        });

        //收藏 短视频
        $('.c-v-list .v-list li').each(function (i) {
            $(this).children('.v-img').find("img").attr('src', data.collectionV[i].vimg);
            $(this).children('.v-img').find('span').text(data.collectionV[i].vlong);
            $(this).children('.v-info').children('.v-title').text(data.collectionV[i].vtitle);
        });

        //收藏 影视剧集
        $('.c-m-list .n-list li').each(function (i) {
            $(this).find("img").attr('src', data.collectionM[i].mimg);
            $(this).children('.title').text(data.collectionM[i].mtitle);
        });
    })
}
sendData("hello.json");


$(function () {
    $(".Nav-l li").click(function () {
        $(this).addClass("Nav-active").siblings().removeClass("Nav-active");
        $(".Text-main>div").eq($(this).index()).show().siblings().hide();
    });
    $(".c-top-wrapper>div").click(function () {
        $(".c-top-wrapper>div").removeClass("active");
        $(this).addClass("active");
        $(".c-list-wrapper>div").hide().eq($(this).index()).show()
    });
});

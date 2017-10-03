
var Header = {
    //检测是否登录
    TestLogin: function () {
        var username = sessionStorage.getItem("username");
        return username;
    },
    //显示用户信息盒子
    ShowUserBox: function (portrait, username, email, userId) {
        //移除登录界面
        $(".topNav-login").empty();
        //判断是否没有头像
        if(portrait==="null"){
            portrait="../image/userCenter/avatar-up.png"
        }
        //添加个人信息盒子
        $(".topNav-login").append('<img src="' + portrait + '" class="avatar left">' +
            '<p class="nickname left">' + username + '</p>' +
            '<div class="user-box">' +
            '<p class="email">' + email + '</p>' +
            '<div class="info">' +
            '<a href="space.html?id=' + userId + '"><img src="' + portrait + '" class="avatar left"></a>' +
            '<p class="nickname left">' + username + '</p>' +
            '<a href="space.html?id=' + userId + '" class="toSpace">进入我的频道主页</a>' +
            '</div>' +
            '<ul>' +
            '<li class="goSpace"><a href="userCenter.html">个人中心</a></li>' +
            '<li class="exitLogin"><a href="">退出登录</a></li>' +
            '</ul>' +
            '</div>');

        //hover事件
        var loginshowtime;
        $(".topNav-login").hover(function () {
            $(".user-box").show();
        }, function () {
            loginshowtime=setTimeout(function () {
                $(".user-box").hide();
            }, 3000)
        });
        $(".user-box").hover(function () {
            clearTimeout(loginshowtime)
        },function () {
            $(this).hide()
        });
        //退出登录
        $(".exitLogin").click(function () {
            Header.ExitLogin();
        });
    },
    //退出登录
    ExitLogin: function () {
        //删除sessionstorage
        sessionStorage.removeItem('username');

        //刷新首页
        window.location.href = 'index.html';
    },
    //搜索
    Search: function () {
        var toSearchBtn = $("#toSearch")
        toSearchBtn.click(function () {
            var keyword = searchText.value;
            if (keyword != "") {
                window.open("searchALL.html?keyword=" + keyword)
            }
        });
        $(".searchText").keydown(function (event) {
            if (event.which == 13) {
                var keyword = searchText.value;
                if (keyword != "") {
                    window.open("searchALL.html?keyword=" + keyword)
                }
            }
        });
    },
    //登录时header部分改变
    headerChange: function () {
        Header.Search();
        if (Header.TestLogin() === null) {
            //我的订阅
            $("#MySubscribe").attr("href", "login.html");

            //个人中心
            $("#userCenter").attr("href", "login.html");

            //上传
            $("#upLoad").attr("href", "login.html");
            //添加登录和注册
            $(".topNav-login").empty();

            //添加个人信息盒子
            $(".topNav-login").append('<a class="register left" href="register.html">注册</a>' +
                '<a class="login left" href="login.html">登陆</a>')

        } else {
            //我的订阅
            $("#MySubscribe").attr("href", "subscribe.html");

            //个人中心
            $("#userCenter").attr("href", "userCenter.html");

            //上传
            $("#upLoad").attr("href", "upLoad.html");

            //获取所有信息
            var userId = sessionStorage.getItem("userId");
            var username = sessionStorage.getItem("username");
            var portrait = sessionStorage.getItem("portrait");
            var email = sessionStorage.getItem("email");

            //顶部右侧用户信息盒子
            Header.ShowUserBox(portrait, username, email, userId);

        }
    }

};

var youtuVedio = {
    headershow: function () {
        $(window).scroll(function () {
            if ($("html").scrollTop() > 0) {
                $(".topNav-wrapper").css({"background-color": "#4ca5bb"})
            }
            $(window).scroll(function () {
                if ($("html").scrollTop() > 0) {
                    $(".topNav-wrapper").css({"background-color": "#4ca5bb"})
                } else {
                    $(".topNav-wrapper").css({"background-color": "rgba(0,0,0,0)"})
                }
            });
        });
    },
    toTime: function (timeStamp) {
        var date = new Date(parseInt(timeStamp));
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'); // 2015-1-2
    },
    VedeoCreatTime: function (value) {
        var nowTime = Date.parse(new Date());
        var creattime;
        //获取分钟
        var minute = (Math.round(Math.round(((nowTime - value)) / 1000) / 60));
        if (minute < 60) {
            creattime = minute + "分钟前";
        } else {
            //获取小时
            var hour = Math.round(minute / 60);
            if (hour < 24) {
                creattime = hour + "小时前"
            } else {
                //获取天
                var day = Math.round(hour / 24);
                if (day < 365) {
                    creattime = day + "天前"
                } else {
                    var year = Math.floor(day / 365);
                    creattime = year + "年前"
                }
            }
        }
        return creattime
    },
    shareBtn: function () {
        var share = true;
        var canshare = true;
        $('.share').click(function () {
            if (share && canshare) {
                canshare = false;
                $(".share-list").show();
                $('.collect').animate({
                    top: "450px"
                }, 500);
                $(".wechat").animate({
                    top: "240px"
                }, 100);
                $(".qq").animate({
                    top: "290px"
                }, 200);
                $(".qzone").animate({
                    top: "340px"
                }, 300);
                $(".weibo").animate({
                    top: "390px"
                }, 400);
                setTimeout(function () {
                    share = false;
                    canshare = true;
                },500)
            } else if(!share && canshare){
                canshare = false;

                $(".wechat").animate({
                    top: "240px"
                }, 100);
                $(".qq").animate({
                    top: "240px"
                }, 200);
                $(".qzone").animate({
                    top: "240px"
                }, 300);
                $(".weibo").animate({
                    top: "240px"
                }, 400);
                $('.collect').animate({
                    top: "240px"
                }, 500);
                setTimeout(function () {
                    $(".share-list").hide();
                    share = true;
                    canshare = true;
                },500)
            }
        });

    },
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    getAV: function (av) {
        var number=(av.indexOf("av")+2);
        return av.substr(number)
    },
    //详细信息
    VInfo:function () {
        var videoId = youtuVedio.getUrlParam("id");
        $.ajax({
            type: "GET",
            url: "youtu/front/video/" + videoId,
            success: function (data) {
                //数据绑定
                //视频和发布人数据绑定
                var infoL = $(".info1-l");
                infoL.children('.v-title').text(data.data.videoTitle);  //视频标题
                infoL.children('.v-country').text(data.data.videoCountryDesc);  //视频国家分类
                infoL.children('.v-class-f').text(data.data.videoClassDesc);  //视频一级分类
                infoL.children('.v-time').text('发布于 ' + youtuVedio.toTime(data.data.videoCreatedate));  //视频发布时间

                var info1RW = $(".info1-r-w");

                info1RW.children('.v-avatar').find('img').attr('src', data.data.userPortrait);    //视频发布人头像
                info1RW.children('.v-avatar').find('a').attr('href', "space.html?id=" + data.data.userId);    //视频发布人空间地址
                info1RW.children('.v-username').find('a').attr('href', "space.html?id=" + data.data.userId);    //视频发布人空间地址
                info1RW.children('.v-username').find('a').text(data.data.userName);    //视频发布人
                info1RW.children('.v-desc').text(data.data.userDescrib);    //视频发布人描述

                var info2 = $(".info2");
                info2.children('.v-img').find('img').attr('src', data.data.videoCover);    //视频图片
                info2.children('.v-title').text(data.data.videoTitle);    //视频标题
                info2.children('.v-desc').text('视频简介：' + data.data.videoDescrib);    //视频描述

                //标签数据绑定
                if (data.data.videoTags.length > 0) {
                    for (var i = 0; i < data.data.videoTags.length; i++) {
                        info2.children('.v-tag').append("<a href='searchAll.html?keyword=" + data.data.videoTags[i] + "' target='_blank'><span>" + data.data.videoTags[i] + "</span></a>");    //视频标签
                    }
                }
                var AVnumber=youtuVedio.getAV(data.data.videoResurl);
                //视频播放
                $.ajax({
                    type: "GET",
                    url: "youtu/front/video/bilih5/"+AVnumber,
                    success: function (data) {
                        var vid=$("#videoPlay").text();
                        dp = new DPlayer({
                            element: document.getElementById('player1'),                       // Optional, player element
                            autoplay: false,                                                   // Optional, autoplay video, not supported by mobile browsers
                            theme: '#FADFA3',                                                  // Optional, theme color, default: #b7daff
                            loop: false,                                                        // Optional, loop play music, default: true
                            lang: 'zh',                                                        // Optional, language, `zh` for Chinese, `en` for English, default: Navigator language
                            screenshot: false,                                                  // Optional, enable screenshot function, default: false, NOTICE: if set it to true, video and video poster must enable Cross-Origin
                            hotkey: true,                                                      // Optional, binding hot key, including left right and Space, default: true
                            preload: 'auto',                                                   // Optional, the way to load music, can be 'none' 'metadata' 'auto', default: 'auto'
                            video: {                                                           // Required, video info
                                url: data.data.mp4                                       // Required, video url
                                //pic: 'http://devtest.qiniudn.com/若能绽放光芒.png'                                          // Optional, music picture
                            }
                        });
                    }
                });
            }
        });
    },
    //相关视频
    OtherVideo:function () {
        var videoId = youtuVedio.getUrlParam("id");
        $.ajax({
            type: "GET",
            url: "youtu/front/video/similar/" + videoId,
            success: function (data) {
                var OtherVideoLength = data.data.length;
                if (OtherVideoLength < 4) {
                    $('.other-index').hide();
                    $('.other-left-btn').hide();
                    $('.other-right-btn').hide();
                }

                for (var i = 0; i < OtherVideoLength; i++) {
                    $(".swiper-wrapper").append('<div class="swiper-slide">' +
                        '<a href="v.html?id=' + data.data[i].videoId + '" class="v-img" target="_blank"><img src="' + data.data[i].videoCover + '"><span>' + data.data[i].videoDuration + '</span></a>' +
                        '<div class="v-info"><a href="v.html?id=' + data.data[i].videoId + '" target="_blank"><div class="v-title">' + data.data[i].videoTitle + '</div></a><div class="v-l">' +
                        '<a href="space.html?id=' + data.data[i].userId + '" target="_blank" class="v-avatar"><img src="' + data.data[i].userPortrait + '"></a></div><div class="v-r">' +
                        '<a href="space.html?id=' + data.data[i].userId + '" target="_blank" class="v-user">' + data.data[i].userName + '</a>' +
                        '<div class="v-time">' + youtuVedio.VedeoCreatTime(data.data[i].videoCreatedate) + '</div><div class="v-class"><div class="v-c"><a href="">' + data.data[i].videoCountryDesc + '</a></div>' +
                        '<span>-</span><div class="v-f"><a href="">' + data.data[i].videoClassDesc + '</a></div></div></div></div></div></div>')
                }

                var otherVideoSwiper;
                if (OtherVideoLength > 3) {
                    otherVideoSwiper = new Swiper('.swiper-container', {
                        slidesPerView: 3,
                        spaceBetween: 90,
                        prevButton: '.other-right-btn',
                        nextButton: '.other-left-btn',
                        pagination: '.other-index',
                        paginationClickable: true,
                        observer: true,//修改swiper自己或子元素时，自动初始化swiper
                        observeParents: true,//修改swiper的父元素时，自动初始化swiper
                    })
                } else {
                    otherVideoSwiper = new Swiper('.swiper-container', {
                        slidesPerView: 3,
                        spaceBetween: 90,
                        prevButton: '.other-right-btn',
                        nextButton: '.other-left-btn',
                        pagination: '.other-index',
                        paginationClickable: true,
                        observer: true,//修改swiper自己或子元素时，自动初始化swiper
                        observeParents: true,//修改swiper的父元素时，自动初始化swiper
                        onlyExternal: true
                    })
                }



            }
        });
    }
};

var Collection ={
    //判断是否收藏
    collectionTrue:function () {
        var videoId = youtuVedio.getUrlParam("id");
        $.ajax({
            type: "GET",
            url: "youtu/front/collection/hitsCollection?vedioId="+videoId+"&col_flag=0",
            success: function (data) {
                var data=data.data;
                //获取是否已经收藏
                var collectiontrue=data;
                if(collectiontrue===1){
                    //改变收藏图标
                    //改变title标题
                    $(".collect").css("background-image","url(../image/v-play/collect-T.png)").attr("title","已收藏").click(function () {
                        if(collectiontrue===1){
                            $.ajax({
                                type: "GET",
                                url: "youtu/front/collection/hitsCollection?vedioId=" + videoId + "&col_flag=-1",
                                success: function (data) {
                                    //判断登陆状态
                                    if(data.code===-1){
                                        window.location.href = 'login.html';
                                    }
                                    //取消收藏
                                    if (data.data === 1) {
                                        $(".collect").css("background-image", "url(../image/v-play/collect.png)").attr("title", "未收藏");
                                        alert("已取消收藏");
                                        collectiontrue = -1;
                                    }
                                }
                            })
                        }else {
                            $.ajax({
                                type: "GET",
                                url: "youtu/front/collection/hitsCollection?vedioId=" + videoId + "&col_flag=1",
                                success: function (data) {
                                    //判断登陆状态
                                    if(data.code===-1){
                                        window.location.href = 'login.html';
                                    }
                                    if (data.data === 1) {
                                        $(".collect").css("background-image", "url(../image/v-play/collect-T.png)").attr("title", "已收藏");
                                        alert("已收藏");
                                        collectiontrue = 1;
                                    }
                                }
                            })
                        }
                    })
                }else {
                    //不改变收藏图标
                    //不改变title标题
                    $(".collect").click(function () {
                        if(collectiontrue===1){
                            $.ajax({
                                type: "GET",
                                url: "youtu/front/collection/hitsCollection?vedioId=" + videoId + "&col_flag=-1",
                                success: function (data) {
                                    //判断登陆状态
                                    if(data.code===-1){
                                        window.location.href = 'login.html';
                                    }
                                    //取消收藏
                                    if (data.data === 1) {
                                        $(".collect").css("background-image", "url(../image/v-play/collect.png)").attr("title", "未收藏");
                                        alert("已取消收藏");
                                        collectiontrue = -1;
                                    }
                                }
                            })
                        }else {
                            $.ajax({
                                type: "GET",
                                url: "youtu/front/collection/hitsCollection?vedioId=" + videoId + "&col_flag=1",
                                success: function (data) {
                                    //判断登陆状态
                                    if(data.code===-1){
                                        window.location.href = 'login.html';
                                    }
                                    if (data.data === 1) {
                                        $(".collect").css("background-image", "url(../image/v-play/collect-T.png)").attr("title", "已收藏");
                                        alert("已收藏");
                                        collectiontrue = 1;
                                    }
                                }
                            })
                        }
                    })
                }
            }
        });
    },
    //检测是否登录
    CollectionChange: function () {
        if (Header.TestLogin() === null) {
            //未登录时跳转
            $(".collect").click(function () {
                window.location.href = 'login.html';
            })

        } else {
            Collection.collectionTrue();
        }
    }
};



$(function () {
    Header.headerChange();



    youtuVedio.headershow();

    youtuVedio.shareBtn();


    youtuVedio.VInfo();
    youtuVedio.OtherVideo();



    var videoId = youtuVedio.getUrlParam("id");
    //点赞
    $(".like").click(function () {
        $.ajax({
            type: "GET",
            url: "youtu/front/video/like/" + videoId,
            success: function (data) {
                alert("点赞成功 点赞数：" + data.data.like)
            }
        });
    });
    //倒赞
    $(".dislike").click(function () {
        $.ajax({
            type: "GET",
            url: "youtu/front/video/hate/" + videoId,
            success: function (data) {
                alert("倒赞成功 倒赞数：" + data.data.hate)
            }
        });
    })

    //收藏
    Collection.CollectionChange();


});
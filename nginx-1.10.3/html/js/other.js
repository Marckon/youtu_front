

var youtuVedio = {
    /*导航下标移动*/
    Nav: function (navClassName, subscriptClassName) {
        var oldLeft = parseInt($("." + subscriptClassName).css("left"));
        var oldLiIndex = (oldLeft) / 60;
        var timeA = 0;
        $("." + navClassName).find("li").mouseenter(function () {
            var arg = $(this).index();
            if (timeA == 1) {
                clearTimeout(NavTime);
                $("." + subscriptClassName).animate({
                    "left": (arg * 60) + "px"
                }, 50);
                setTimeout(function () {
                    timeA = 1;
                }, 50)
            } else {
                $("." + subscriptClassName).animate({
                    "left": (arg * 60) + "px"
                }, 50);
                setTimeout(function () {
                    timeA = 1;
                }, 50)
            }
        });
        $("." + navClassName).find("li").mouseleave(function () {
            NavTime = setTimeout(function () {
                $("." + subscriptClassName).animate({
                    "left": (oldLiIndex * 60 ) + "px"
                }, 50);
            }, 2000)
        });
    },
    headershow: function () {
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
    },
    getByteLen: function (val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var length = val.charCodeAt(i);
            if (length >= 0 && length <= 128) {
                len += 1;
            }
            else {
                len += 2;
            }
        }
        return len;
    },
    VedioLength: function (val) {
        var hour = Math.floor(val / 60 / 60)>10?Math.floor(val / 60 / 60):"0"+Math.floor(val / 60 / 60);
        var minute = Math.floor(val / 60 % 60)>10?Math.floor(val / 60 % 60):"0"+Math.floor(val / 60 % 60);
        var second = Math.floor(val % 60)>10?Math.floor(val % 60):"0"+Math.floor(val % 60);

        return (hour + ":" + minute + ":" + second)
    },
    VedioCreatTime: function (value) {
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
    randomsort:function (a,b) {
        return Math.random()>.5 ? -1 : 1;
    },
    ResetVedio: function (pagenum,leng,classID,channel) {
        pagenum += 1;
        $.ajax({
            type: "GET",
            url: "youtu/front/vedio/hots?countryId=1&classId="+classID+"&pageNum=" + pagenum + "&pageSize=" + leng,
            success: function (data) {
                //判断
                if (leng > data.data.length ) {
                    //数据绑定
                    pagenum = 1;
                    $.ajax({
                        type: "GET",
                        url: "youtu/front/vedio/hots?countryId=1&classId="+classID+"&pageNum=" + pagenum + "&pageSize="+leng,
                        success: function (data) {
                            //数据重新排序
                            data.data=data.data.sort(youtuVedio.randomsort);
                            //数据绑定
                            $('.'+channel+'-channel .v-list li').each(function (index) {
                                $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                                $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                                $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                                $(this).children('.v-info').find('img').attr('src', data.data[index].userPortrait);
                                $(this).find($('.v-user')).attr('href', "space.html?" + data.data[index].u).text(data.data[index].userName);
                                $(this).find($('.v-c a')).text(data.data[index].vedioCountry);
                                $(this).find($('.v-f a')).text(data.data[index].vedioClass);
                                $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                            });
                        }
                    });
                }else {

                    //数据重新排序
                    data.data=data.data.sort(youtuVedio.randomsort);
                    //数据绑定
                    $('.'+channel+'-channel .v-list li').each(function (index) {
                        $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                        $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                        $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                        $(this).children('.v-info').find('img').attr('src', data.data[index].userPortrait);
                        $(this).find($('.v-user')).attr('href', "space.html?" + data.data[index].u).text(data.data[index].userName);
                        $(this).find($('.v-c a')).text(data.data[index].vedioCountry);
                        $(this).find($('.v-f a')).text(data.data[index].vedioClass);
                        $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                    });
                }
            }
        });
    },
    Vedioajax: function () {
        $.ajax({
            type: "GET",
            url: "youtu/front/vedio/hots?orderSort=likes&countryId=1&classId=&pageNum=1&pageSize=10",
            success: function (data) {
                //数据绑定
                $('.rank-list .v-list li').each(function (index) {
                    $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                    $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                    $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                    $(this).children('.v-info').find('.v-avatar').attr({'href':"space.html?id=" + data.data[index].userId}).find('img').attr({'src':data.data[index].userPortrait});
                    $(this).find($('.v-user')).attr('href', "space.html?id=" + data.data[index].userId).text(data.data[index].userName);
                    $(this).find($('.v-c a')).text(data.data[index].vedioCountry).attr({'href':"videolib.html?countryId=" + data.data[index].userId});
                    $(this).find($('.v-f a')).text(data.data[index].vedioClass).attr({'href':"videolib.html?classIdId=" + data.data[index].userId});
                    $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                });
            }
        });
        $.ajax({
            type: "GET",
            url: "youtu/front/vedio/hots?countryId=1&classId=16&pageNum=1&pageSize=5",
            success: function (data) {
                //数据绑定
                $('.yl-channel .v-list li').each(function (index) {
                    $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                    $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                    $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                    $(this).children('.v-info').find('.v-avatar').attr({'href':"space.html?id=" + data.data[index].userId}).find('img').attr({'src':data.data[index].userPortrait});
                    $(this).find($('.v-user')).attr('href', "space.html?id=" + data.data[index].userId).text(data.data[index].userName);
                    $(this).find($('.v-c a')).text(data.data[index].vedioCountry);
                    $(this).find($('.v-f a')).text(data.data[index].vedioClass);
                    $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                });
            }
        });
        $.ajax({
            type: "GET",
            url: "youtu/front/vedio/hots?countryId=1&classId=21&pageNum=1&pageSize=10",
            success: function (data) {
                //数据绑定
                $('.yy-channel .v-list li').each(function (index) {
                    $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                    $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                    $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                    $(this).children('.v-info').find('.v-avatar').attr({'href':"space.html?id=" + data.data[index].userId}).find('img').attr({'src':data.data[index].userPortrait});
                    $(this).find($('.v-user')).attr('href', "space.html?id=" + data.data[index].userId).text(data.data[index].userName);
                    $(this).find($('.v-c a')).text(data.data[index].vedioCountry);
                    $(this).find($('.v-f a')).text(data.data[index].vedioClass);
                    $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                });
            }
        });
        $.ajax({
            type: "GET",
            url: "youtu/front/vedio/hots?countryId=1&classId=18&pageNum=1&pageSize=10",
            success: function (data) {
                //数据绑定
                $('.ys-channel .v-list li').each(function (index) {
                    $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                    $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                    $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                    $(this).children('.v-info').find('.v-avatar').attr({'href':"space.html?id=" + data.data[index].userId}).find('img').attr({'src':data.data[index].userPortrait});
                    $(this).find($('.v-user')).attr('href', "space.html?id=" + data.data[index].userId).text(data.data[index].userName);
                    $(this).find($('.v-c a')).text(data.data[index].vedioCountry);
                    $(this).find($('.v-f a')).text(data.data[index].vedioClass);
                    $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                });
            }
        });
        $.ajax({
            type: "GET",
            url: "youtu/front/vedio/hots?countryId=1&classId=20&pageNum=1&pageSize=10",
            success: function (data) {
                //数据绑定
                $('.kj-channel .v-list li').each(function (index) {
                    $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                    $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                    $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                    $(this).children('.v-info').find('.v-avatar').attr({'href':"space.html?id=" + data.data[index].userId}).find('img').attr({'src':data.data[index].userPortrait});
                    $(this).find($('.v-user')).attr('href', "space.html?id=" + data.data[index].userId).text(data.data[index].userName);
                    $(this).find($('.v-c a')).text(data.data[index].vedioCountry);
                    $(this).find($('.v-f a')).text(data.data[index].vedioClass);
                    $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                });
            }
        });
        $.ajax({
            type: "GET",
            url: "youtu/front/vedio/hots?countryId=1&classId=17&pageNum=1&pageSize=10",
            success: function (data) {
                //数据绑定
                $('.xq-channel .v-list li').each(function (index) {
                    $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                    $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                    $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                    $(this).children('.v-info').find('.v-avatar').attr({'href':"space.html?id=" + data.data[index].userId}).find('img').attr({'src':data.data[index].userPortrait});
                    $(this).find($('.v-user')).attr('href', "space.html?id=" + data.data[index].userId).text(data.data[index].userName);
                    $(this).find($('.v-c a')).text(data.data[index].vedioCountry);
                    $(this).find($('.v-f a')).text(data.data[index].vedioClass);
                    $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                });
            }
        });
        $.ajax({
            type: "GET",
            url: "youtu/front/vedio/hots?countryId=1&classId=23&pageNum=1&pageSize=5",
            success: function (data) {
                //数据绑定
                $('.rw-channel .v-list li').each(function (index) {
                    $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                    $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                    $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                    $(this).children('.v-info').find('.v-avatar').attr({'href':"space.html?id=" + data.data[index].userId}).find('img').attr({'src':data.data[index].userPortrait});
                    $(this).find($('.v-user')).attr('href', "space.html?id=" + data.data[index].userId).text(data.data[index].userName);
                    $(this).find($('.v-c a')).text(data.data[index].vedioCountry);
                    $(this).find($('.v-f a')).text(data.data[index].vedioClass);
                    $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                });
            }
        });
        $.ajax({
            type: "GET",
            url: "youtu/front/vedio/hots?countryId=1&classId=22&pageNum=1&pageSize=5",
            success: function (data) {
                //数据绑定
                $('.yd-channel .v-list li').each(function (index) {
                    $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                    $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                    $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                    $(this).children('.v-info').find('.v-avatar').attr({'href':"space.html?id=" + data.data[index].userId}).find('img').attr({'src':data.data[index].userPortrait});
                    $(this).find($('.v-user')).attr('href', "space.html?id=" + data.data[index].userId).text(data.data[index].userName);
                    $(this).find($('.v-c a')).text(data.data[index].vedioCountry);
                    $(this).find($('.v-f a')).text(data.data[index].vedioClass);
                    $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                });
            }
        });
        $.ajax({
            type: "GET",
            url: "youtu/front/vedio/hots?countryId=1&classId=19&pageNum=1&pageSize=5",
            success: function (data) {
                //数据绑定
                $('.gg-channel .v-list li').each(function (index) {
                    $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                    $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                    $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                    $(this).children('.v-info').find('.v-avatar').attr({'href':"space.html?id=" + data.data[index].userId}).find('img').attr({'src':data.data[index].userPortrait});
                    $(this).find($('.v-user')).attr('href', "space.html?id=" + data.data[index].userId).text(data.data[index].userName);
                    $(this).find($('.v-c a')).text(data.data[index].vedioCountry);
                    $(this).find($('.v-f a')).text(data.data[index].vedioClass);
                    $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                });
            }
        });
    }
};
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
$(function () {
    Header.headerChange();

    youtuVedio.Nav("Nav", "NavSpan");
    youtuVedio.headershow();
    youtuVedio.Vedioajax();

    var pageNumYL=1,pageNumYY=1,pageNumYS=1,pageNumKJ=1,pageNumXQ=1,pageNumRW=1,pageNumYD=1,pageNumGG=1;
    $("#yl-change").click(function () {
        $(this).hide();
        $(".yl-channel li").hide("slow");
        youtuVedio.ResetVedio(pageNumYL,5,16,"yl");
        setTimeout(function () {
            var widthscreen = window.matchMedia('(min-width: 0px) and (max-width: 1359px)');
            if (widthscreen.matches){
                for (var i=0;i<4;i++){
                    $(".yl-channel li").eq(i).show("slow");
                }

            }
            else{
                for (var i=0;i<5;i++){
                    $(".yl-channel li").eq(i).show("slow");
                }
            }
        },1000)
        setTimeout(function () {
            $("#yl-change").show();
        },1200)

    });
    $("#yy-change").click(function () {
        $(this).hide();
        $(".yy-channel li").hide("slow");
        youtuVedio.ResetVedio(pageNumYY,9,21,"yy");
        setTimeout(function () {
            var widthscreen = window.matchMedia('(min-width: 0px) and (max-width: 1359px)');
            if (widthscreen.matches){
                for (var i=0;i<7;i++){
                    $(".yy-channel li").eq(i).show("slow");
                }
            }
            else{
                for (var i=0;i<9;i++){
                    $(".yy-channel li").eq(i).show("slow");
                }
            }
        },1000)
        setTimeout(function () {
            $("#yy-change").show();
        },1200)
    });
    $("#ys-change").click(function () {
        $(this).hide();
        $(".ys-channel li").hide("slow");
        youtuVedio.ResetVedio(pageNumYS,9,18,"ys");
        setTimeout(function () {
            var widthscreen = window.matchMedia('(min-width: 0px) and (max-width: 1359px)');
            if (widthscreen.matches){
                for (var i=0;i<7;i++){
                    $(".ys-channel li").eq(i).show("slow");
                }
            }
            else{
                for (var i=0;i<9;i++){
                    $(".ys-channel li").eq(i).show("slow");
                }
            }
        },1000)
        setTimeout(function () {
            $("#ys-change").show();
        },1200)
    });
    $("#kj-change").click(function () {
        $(this).hide();
        $(".kj-channel li").hide("slow");
        youtuVedio.ResetVedio(pageNumKJ,5,20,"kj");
        setTimeout(function () {
            var widthscreen = window.matchMedia('(min-width: 0px) and (max-width: 1359px)');
            if (widthscreen.matches){
                for (var i=0;i<4;i++){
                    $(".kj-channel li").eq(i).show("slow");
                }
            }
            else{
                for (var i=0;i<5;i++){
                    $(".kj-channel li").eq(i).show("slow");
                }
            }
        },1000)
        setTimeout(function () {
            $("#kj-change").show();
        },1200)
    });
    $("#xq-change").click(function () {
        $(this).hide();
        $(".xq-channel li").hide("slow");
        youtuVedio.ResetVedio(pageNumXQ,9,17,"xq");
        setTimeout(function () {
            var widthscreen = window.matchMedia('(min-width: 0px) and (max-width: 1359px)');
            if (widthscreen.matches){
                for (var i=0;i<7;i++){
                    $(".xq-channel li").eq(i).show("slow");
                }
            }
            else{
                for (var i=0;i<9;i++){
                    $(".xq-channel li").eq(i).show("slow");
                }
            }
        },1000)
        setTimeout(function () {
            $("#xq-change").show();
        },1200)
    });
    $("#rw-change").click(function () {
        $(this).hide();
        $(".rw-channel li").hide("slow");
        youtuVedio.ResetVedio(pageNumRW,5,23,"rw");
        setTimeout(function () {
            var widthscreen = window.matchMedia('(min-width: 0px) and (max-width: 1359px)');
            if (widthscreen.matches){
                for (var i=0;i<4;i++){
                    $(".rw-channel li").eq(i).show("slow");
                }
            }
            else{
                for (var i=0;i<5;i++){
                    $(".rw-channel li").eq(i).show("slow");
                }
            }
        },1000)
        setTimeout(function () {
            $("#rw-change").show();
        },1200)
    });
    $("#yd-change").click(function () {
        $(this).hide();
        $(".yd-channel li").hide("slow");
        youtuVedio.ResetVedio(pageNumYD,5,22,"yd");
        setTimeout(function () {
            var widthscreen = window.matchMedia('(min-width: 0px) and (max-width: 1359px)');
            if (widthscreen.matches){
                for (var i=0;i<4;i++){
                    $(".yd-channel li").eq(i).show("slow");
                }
            }
            else{
                for (var i=0;i<5;i++){
                    $(".yd-channel li").eq(i).show("slow");
                }
            }
        },1000)
        setTimeout(function () {
            $("#yd-change").show();
        },1200)
    });
    $("#gg-change").click(function () {
        $(this).hide();
        $(".gg-channel li").hide("slow");
        youtuVedio.ResetVedio(pageNumGG,5,19,"gg");
        setTimeout(function () {
            var widthscreen = window.matchMedia('(min-width: 0px) and (max-width: 1359px)');
            if (widthscreen.matches){
                for (var i=0;i<4;i++){
                    $(".gg-channel li").eq(i).show("slow");
                }
            }
            else{
                for (var i=0;i<5;i++){
                    $(".gg-channel li").eq(i).show("slow");
                }
            }
        },1000)
        setTimeout(function () {
            $("#gg-change").show();
        },1200)
    });

});



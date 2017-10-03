

var youtuVedio= {
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
        var hour = Math.floor(val / 60 / 60) > 10 ? Math.floor(val / 60 / 60) : "0" + Math.floor(val / 60 / 60);
        var minute = Math.floor(val / 60 % 60) > 10 ? Math.floor(val / 60 % 60) : "0" + Math.floor(val / 60 % 60);
        var second = Math.floor(val % 60) > 10 ? Math.floor(val % 60) : "0" + Math.floor(val % 60);

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
    listChange: function () {
        /*选项卡*/
        $(".header-list div").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
            $(".y-body>div").eq($(this).index()).show().siblings().hide();
        });
    },
    collectionVideoAjax: function (collectionVideoPage) {
        $.ajax({
            type:"GET",
            url:"/youtu/front/collection/vedio?pageNum="+collectionVideoPage+"&pageSize=20",
            success: function (data) {

                //移除视频
                $('.c-v-list>.v-list li').remove();

                data=data.data;

                //获取视频数量
                var vedioLen = data.total;
                if(vedioLen>0){
                        for (var i = 0; i < (data.data.length); i++) {
                            $(".c-v-list>.v-list").append('' +
                                '<li>' +
                                '<a href="" class="v-img" target="_blank"><img src="image/country/lazyimg.png"><span></span></a>' +
                                '<div class="v-info">' +
                                '<a  href="" class="v-title" target="_blank"></a>' +
                                '<div class="v-l">' +
                                '<a href="" class="v-avatar" target="_blank"><img src=""></a>' +
                                '</div>' +
                                '<div class="v-r">' +
                                '<a href="" class="v-user" target="_blank"></a>' +
                                '<div class="v-time"></div>' +
                                '<div class="v-class">' +
                                '<div class="v-c"><a href="" ></a></div>' +
                                '<span>-</span>' +
                                '<div class="v-f"><a href=""></a></div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</li>')
                        }

                        $('.c-v-list>.v-list li').each(function (index) {
                            $(this).children('.v-img').attr('href', "v.html?id=" + data.data[index].vedioCode).find("img").attr('src', data.data[index].vedioCover);
                            $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.data[index].vedioLength));
                            $(this).find($('.v-title')).attr('href', "v.html?id=" + data.data[index].vedioCode).html(youtuVedio.getByteLen(data.data[index].vedioTitle) > 26 ? data.data[index].vedioTitle : data.data[index].vedioTitle + "<span></span>");
                            $(this).children('.v-info').find('.v-avatar').attr({'href': "space.html?id=" + data.data[index].userId}).find('img').attr({'src': data.data[index].userPortrait});
                            $(this).find($('.v-user')).attr('href', "space.html?id=" + data.data[index].userId).text(data.data[index].userName);
                            $(this).find($('.v-c a')).text(data.data[index].vedioCountry).attr({'href': "videolib.html?countryId=" + data.data[index].userId});
                            $(this).find($('.v-f a')).text(data.data[index].vedioClass).attr({'href': "videolib.html?classIdId=" + data.data[index].userId});
                            $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.data[index].vedioCreateTime));
                        });
                        if (vedioLen > 20) {
                            if (vedioLen > 20) {
                                youtuVedio.collectionVideoPage("c-v-list", vedioLen, collectionVideoPage , 20, 5)
                            }
                        }
                    }
            }
        });
    },
    collectionVideoPage: function (address, commentLength, pageIndex, eventCount, navigateCount) {
        // address        添加分页器的地址
        // commentLength  得到数量
        // pageIndex      当前页
        // eventCount     每页显示多少个
        // navigateCount  分页显示多少个

        var pageCount = Math.ceil(commentLength / eventCount);  //共有多少页
        //生成分页并给所在分页的添加current
        function pagehtml(pageCount, pageIndex, navigateCount) {
            $("."+address+">.list-page").remove();
            var pageListhtml = '<div class="list-page">';
            pageListhtml += '<a href="javascript:;" class="prev">上一页</a>'
            for (var i = 1; i <= pageCount; i++) {
                pageListhtml += '<a href="javascript:;" class="pageNumber">' + i + '</a>'
            }
            pageListhtml += '<a href="javascript:;" class="next">下一页</a>'
            pageListhtml += '</div>'
            $("." + address).append(pageListhtml)
            //给所在分页的添加current
            $("."+address+">.list-page>.pageNumber").eq(pageIndex - 1).addClass("current");
            //判断是否为第一页 如果为是隐藏上一页按钮
            if (pageIndex == 1) {
                $("."+address+">.list-page>.prev").hide();
            }
            //判断是否为最后一页 如果为是隐藏下一页按钮
            if (pageIndex == pageCount) {
                $("."+address+">.list-page>.next").hide();
            }
            //分页显示并添加...
            if (pageCount > navigateCount + 1) {
                $("."+address+">.list-page>.pageNumber").hide();
                if (pageIndex == 1) {
                    for (var i = 0; i < (navigateCount); i++) {
                        $("."+address+">.list-page>.pageNumber").eq(i).show();
                    }
                    $("."+address+">.list-page>.pageNumber").eq(navigateCount).after('<span class="dian">...</span>');
                    $("."+address+">.list-page>.pageNumber").eq(-1).show();
                } else if (pageIndex == pageCount) {
                    $("."+address+">.list-page>.pageNumber").eq(0).show();
                    $("."+address+">.list-page>.pageNumber").eq(0).after('<span class="dian">...</span>');
                    for (var i = pageCount; i > pageCount - (navigateCount + 1); i--) {
                        $("."+address+">.list-page>.pageNumber").eq(i + 1).show();
                    }
                } else {
                    $("."+address+">.list-page>.pageNumber").eq(0).show();
                    if (pageIndex > navigateCount - 1) {
                        $("."+address+">.list-page>.pageNumber").eq(0).after('<span class="dian">...</span>');
                    }
                    for (var i = pageIndex - ((navigateCount - 1) / 2) - 1; i < pageIndex - ((navigateCount - 1) / 2) - 1 + navigateCount; i++) {
                        $("."+address+">.list-page>.pageNumber").eq(i).show();
                    }
                    $("."+address+">.list-page>.pageNumber").eq(-1).show();
                    if (pageIndex < pageCount - 3) {
                        $("."+address+">.list-page>.pageNumber").eq(-1).before('<span class="dian">...</span>');
                    }

                }
            }
        }


        //执行生成分页并给所在分页的添加current
        pagehtml(pageCount, pageIndex, navigateCount);


        //添加点击跳转页面
        $("."+address+">.list-page>.pageNumber").click(function () {
            if ($(this).text() != pageIndex) {
                pageIndex = ($(this).text()-0);
                $('html,body').animate({scrollTop: 0}, 'slow');
                youtuVedio.collectionVideoAjax(pageIndex);
            }
        });
        $("."+address+">.list-page>.prev").click(function () {
            pageIndex = pageIndex - 1;
            $('html,body').animate({scrollTop: 0}, 'slow');
            youtuVedio.collectionVideoAjax(pageIndex);
        });
        $("."+address+">.list-page>.next").click(function () {
            pageIndex = pageIndex + 1;
            $('html,body').animate({scrollTop: 0}, 'slow');
            youtuVedio.collectionVideoAjax(pageIndex);
        });
    },
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

    youtuVedio.headershow();
    youtuVedio.listChange();

    //检测登陆
    $.ajax({
        type:"GET",
        url:"/youtu/front/collection/vedio?pageNum=1&pageSize=20",
        success: function (data) {
            //判断是否登录
            if(data.code===0){
                //判断为登陆状态
                var collectionVideoPage=1;
                youtuVedio.collectionVideoAjax(collectionVideoPage);
            }else {
                //跳转登录
                window.location.href = 'login.html';
            }
        }
    });

});
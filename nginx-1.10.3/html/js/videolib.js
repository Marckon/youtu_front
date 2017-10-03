var youtuVedio = {
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
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
    SearchToMaster: function () {
        $("#searchMaster").click(function () {
            var keyword = escape(youtuVedio.getUrlParam("keyword").toString());
            window.location.href = ("searchMaster.html?keyword=" + keyword)
        })
    },
    SearchToVedio: function () {
        $("#searchVideo").click(function () {
            var keyword = escape(youtuVedio.getUrlParam("keyword").toString());
            window.location.href = ("searchVideo.html?keyword=" + keyword)
        })
    },
    Page: function (address, commentLength, pageIndex, eventCount, navigateCount, Country, Class, Sort) {
        // address        添加分页器的地址
        // commentLength  得到评论数量
        // pageIndex      当前页
        // eventCount     每页显示多少个
        // navigateCount  分页显示多少个
        // keyword        搜索关键词

        var overCount = commentLength % eventCount; //剩下的评论
        var pageCount = Math.ceil(commentLength / eventCount);  //共有多少页


        //生成分页并给所在分页的添加current
        function pagehtml(pageCount, pageIndex, navigateCount) {
            var pageListhtml = '<div class="list-page">';
            pageListhtml += '<a href="javascript:;" class="prev">上一页</a>'
            for (var i = 1; i <= pageCount; i++) {
                pageListhtml += '<a href="javascript:;" class="pageNumber">' + i + '</a>'
            }
            pageListhtml += '<a href="javascript:;" class="next">下一页</a>'
            pageListhtml += '</div>'
            $("." + address).append(pageListhtml)
            //给所在分页的添加current
            $(".pageNumber").eq(pageIndex - 1).addClass("current")
            //判断是否为第一页 如果为是隐藏上一页按钮
            if (pageIndex == 1) {
                $(".list-page>.prev").hide();
            }
            //判断是否为最后一页 如果为是隐藏下一页按钮
            if (pageIndex == pageCount) {
                $(".list-page>.next").hide();
            }
            //分页显示并添加...
            if (pageCount > navigateCount + 1) {
                $(".pageNumber").hide();
                if (pageIndex == 1) {
                    for (var i = 0; i < (navigateCount); i++) {
                        $(".pageNumber").eq(i).show();
                    }
                    $(".pageNumber").eq(navigateCount).after('<span class="dian">...</span>');
                    $(".pageNumber").eq(-1).show();
                } else if (pageIndex == pageCount) {
                    $(".pageNumber").eq(0).show();
                    $(".pageNumber").eq(0).after('<span class="dian">...</span>');
                    for (var i = pageCount; i > pageCount - (navigateCount + 1); i--) {
                        $(".pageNumber").eq(i + 1).show();
                    }
                } else {
                    $(".pageNumber").eq(0).show();
                    if (pageIndex > navigateCount - 1) {
                        $(".pageNumber").eq(0).after('<span class="dian">...</span>');
                    }
                    for (var i = pageIndex - ((navigateCount - 1) / 2) - 1; i < pageIndex - ((navigateCount - 1) / 2) - 1 + navigateCount; i++) {
                        $(".pageNumber").eq(i).show();
                    }
                    $(".pageNumber").eq(-1).show();
                    if (pageIndex < pageCount - 3) {
                        $(".pageNumber").eq(-1).before('<span class="dian">...</span>');
                    }

                }
            }
        }


        //执行生成分页并给所在分页的添加current
        pagehtml(pageCount, pageIndex, navigateCount)

        //添加点击跳转页面
        $(".pageNumber").click(function () {
            if ($(this).text() != pageIndex) {
                window.location.href = ("videolib.html?country=" + Country + "&class=" + Class + "&sort=" + Sort + "&page=" + $(this).text())
            }
        });
        $(".list-page>.prev").click(function () {
            window.location.href = ("videolib.html?country=" + Country + "&class=" + Class + "&sort=" + Sort + "&page=" + (pageIndex - 1))

        });
        $(".list-page>.next").click(function () {
            window.location.href = ("videolib.html?country=" + Country + "&class=" + Class + "&sort=" + Sort + "&page=" + (pageIndex - 0 + 1))
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

    youtuVedio.SearchToMaster();
    youtuVedio.SearchToVedio();

    //获取地址栏城市值
    var Country = escape(youtuVedio.getUrlParam("country"));
    //获取地址栏类型值
    var Class = escape(youtuVedio.getUrlParam("class"));
    //获取地址栏类型值
    var Sort = youtuVedio.getUrlParam("sort") === null ? 1 : escape(youtuVedio.getUrlParam("sort"));
    //获取地址栏分页值
    var pageNumber = youtuVedio.getUrlParam("page") === null ? 1 : escape(youtuVedio.getUrlParam("page").toString());

    //隐式转换
    Country = Country - 0;
    Class = Class - 0;
    //给类别选择赋值
    //国家
    switch (Country) {
        case 0:
            $(".videolib-country > li").eq(0).addClass("active");
            break;
        case 1:
            $(".videolib-country > li").eq(12).addClass("active");
            break;
        case 2:
            $(".videolib-country > li").eq(1).addClass("active");
            break;
        case 3:
            $(".videolib-country > li").eq(2).addClass("active");
            break;
        case 4:
            $(".videolib-country > li").eq(4).addClass("active");
            break;
        case 5:
            $(".videolib-country > li").eq(6).addClass("active");
            break;
        case 6:
            $(".videolib-country > li").eq(11).addClass("active");
            break;
        case 7:
            $(".videolib-country > li").eq(9).addClass("active");
            break;
        case 8:
            $(".videolib-country > li").eq(10).addClass("active");
            break;
        case 9:
            $(".videolib-country > li").eq(3).addClass("active");
            break;
        case 10:
            $(".videolib-country > li").eq(5).addClass("active");
            break;
        case 11:
            $(".videolib-country > li").eq(7).addClass("active");
            break;
        case 12:
            $(".videolib-country > li").eq(8).addClass("active");
            break;
    }
    //类别
    switch (Class) {
        case 0:
            $(".videolib-class > li").eq(0).addClass("active");
            break;
        case 16:
            $(".videolib-class > li").eq(1).addClass("active");
            break;
        case 17:
            $(".videolib-class > li").eq(5).addClass("active");
            break;
        case 18:
            $(".videolib-class > li").eq(3).addClass("active");
            break;
        case 19:
            $(".videolib-class > li").eq(8).addClass("active");
            break;
        case 20:
            $(".videolib-class > li").eq(4).addClass("active");
            break;
        case 21:
            $(".videolib-class > li").eq(2).addClass("active");
            break;
        case 22:
            $(".videolib-class > li").eq(7).addClass("active");
            break;
        case 23:
            $(".videolib-class > li").eq(6).addClass("active");
            break;
    }
    //搜索方式
    switch (Sort) {
        case "time":
            $(".videolib-sort > li").eq(0).addClass("active");
            break;
        case "hot":
            $(".videolib-sort > li").eq(1).addClass("active");
            break;
        case "likes":
            $(".videolib-sort > li").eq(2).addClass("active");
            break;
    }

    //按搜索方式跳转页面
    $(".videolib-country > li").click(function () {
        function change(val) {
            var value = val;
            switch (value) {
                case 0:
                    value = 0;
                    break;
                case 1:
                    value = 2;
                    break;
                case 2:
                    value = 3;
                    break;
                case 3:
                    value = 9;
                    break;
                case 4:
                    value = 4;
                    break;
                case 5:
                    value = 10;
                    break;
                case 6:
                    value = 5;
                    break;
                case 7:
                    value = 11;
                    break;
                case 8:
                    value = 12;
                    break;
                case 9:
                    value = 7;
                    break;
                case 10:
                    value = 8;
                    break;
                case 11:
                    value = 6;
                    break;
                case 12:
                    value = 1;
                    break;
            }
            return value
        }
        var Country2 = change($(this).index());
            if(Country2 != Country){
                window.location.href = ("videolib.html?country=" + Country2 + "&class=" + Class + "&sort=" + Sort + "&page=1")
            }
        }
    );
    $(".videolib-class > li").click(function () {
            function change(val) {
                var value = val;
                switch (value) {
                    case 0:
                        value = 0;
                        break;
                    case 1:
                        value = 16;
                        break;
                    case 2:
                        value = 21;
                        break;
                    case 3:
                        value = 18;
                        break;
                    case 4:
                        value = 20;
                        break;
                    case 5:
                        value = 17;
                        break;
                    case 6:
                        value = 23;
                        break;
                    case 7:
                        value = 22;
                        break;
                    case 8:
                        value = 19;
                        break;
                }
                return value
            }
            var Class2 = change($(this).index());
            if(Class2 != Class){
                window.location.href = ("videolib.html?country=" + Country + "&class=" + Class2 + "&sort=" + Sort + "&page=1")
            }
        }
    );
    $(".videolib-sort > li").click(function () {
            function change(val) {
                var value = val;
                switch (value) {
                    case 0:
                        value = "time";
                        break;
                    case 1:
                        value = "hot";
                        break;
                    case 2:
                        value = "likes";
                        break;
                }
                return value
            }
            var Sort2 = change($(this).index());
            if(Sort2 != Sort){
                window.location.href = ("videolib.html?country=" + Country + "&class=" + Class + "&sort=" + Sort2 + "&page=1")
            }
        }
    );

    //接受搜索数据
    $.ajax({
        type: "GET",
        url: "youtu/front/vedioSearch/vedioByMaster?countryId=" + Country + "&classId=" + Class + "&pageNum=" + pageNumber + "&pageSize=20&orderSort=" + Sort,
        success: function (data) {
            //获取视频数量
            var vedioLen = data.data[(data.data.length - 1)].totalSize;

            //创建视频html
            for (var i = 0; i < (data.data.length - 1); i++) {
                $(".v-list").append('' +
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
            //赋值视频html
            $('.v-list li').each(function (index) {
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
                youtuVedio.Page("videolib-wrapper", vedioLen, pageNumber, 20, 5, Country, Class, Sort)
            }


        }
    });

});
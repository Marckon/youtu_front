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
    SearchMain: function () {
        var toSearchBtn = $("#to-Search")
        toSearchBtn.click(function () {
            var keyword = $("#search-Text").val();
            if (keyword != "") {
                window.location.href = ("searchMaster.html?keyword=" + keyword)
            }
        });
        $("#search-Text").keydown(function (event) {
            if (event.which == 13) {
                var keyword = $("#search-Text").val();
                if (keyword != "") {
                    window.location.href = ("searchMaster.html?keyword=" + keyword)
                }
            }
        });
    },
    SearchToAll: function () {
        $("#searchAll").click(function () {
            var keyword = escape(youtuVedio.getUrlParam("keyword").toString());
            window.location.href = ("searchAll.html?keyword=" + keyword)
        })
    },
    SearchToVedio: function () {
        $("#searchVideo").click(function () {
            var keyword = escape(youtuVedio.getUrlParam("keyword").toString());
            window.location.href = ("searchVideo.html?keyword=" + keyword)
        })
    },
    Page: function (address, commentLength, pageIndex, eventCount, navigateCount, keyword) {
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
            $(".search-wrapper").append(pageListhtml)
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
                window.location.href = ("searchMaster.html?keyword=" + keyword + "&page=" + $(this).text())
            }
        });
        $(".list-page>.prev").click(function () {
            window.location.href = ("searchMaster.html?keyword=" + keyword + "&page=" + (pageIndex - 1))

        });
        $(".list-page>.next").click(function () {
            window.location.href = ("searchMaster.html?keyword=" + keyword + "&page=" + (pageIndex - 0 + 1))
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

    youtuVedio.SearchMain();
    youtuVedio.SearchToAll();
    youtuVedio.SearchToVedio();
    var keyword = escape(youtuVedio.getUrlParam("keyword").toString());
    var pageNumber = youtuVedio.getUrlParam("page") === null ? 1 : escape(youtuVedio.getUrlParam("page").toString());

    //给搜索栏赋值
    $("#search-Text").val(decodeURI((keyword)))

    //接受搜索数据
    $.ajax({
        type: "GET",
        url: "youtu/front/user/likeMaster?describ=" + keyword + "&pageNum=" + pageNumber + "&pageSize=12",
        success: function (data) {

            //获取搜索到的频道主数量
            var masterLen = (data.data === null ? 0 : data.data[(data.data.length - 1)].totalSize);
            //如果大于0先移除搜索失败的界面


            //绑定数据
            if (masterLen > 0) {
                $(".search-wrapper").append('' +
                    '<div class="search-title"><span></span>频道主</div>' +
                    '<div class="channelmaster-box">' +
                    '<ul class="channelmaster-list clearfloat">' +
                    '</ul>' +
                    '</div>');

                for (var i = 0; i < (data.data.length - 1); i++) {
                    $(".channelmaster-list").append('' +
                        '<li>' +
                        '<a href=space.html?id=' + data.data[i].uid + ' target="_blank">' +
                        '<img class="channelmaster-avatar" src="' + data.data[i].icon + '">' +
                        '</a>' +
                        '<div class="channelmaster-info">' +
                        '<a class="name" href=space.html?id=' + data.data[i].uid + ' target="_blank">' + data.data[i].uname + '</a>' +
                        '<div class="desc">' + data.data[i].desc + '</div>' +
                        '<div class="sub">订阅</div>' +
                        '</div>' +
                        '</li>'
                    )
                }

                if (masterLen > 12) {
                    youtuVedio.Page("search-wrapper", masterLen, pageNumber, 12, 5, keyword)
                }
            } else {
                $(".search-wrapper").append('<div class="no-search">您搜索的内容好像不在这个星球上</div>')
            }
        }
    });

});
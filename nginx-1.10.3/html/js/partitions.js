var youtuVedio={
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
    youtuVedio.headershow();

    Header.headerChange();
});


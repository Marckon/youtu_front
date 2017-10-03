var youtuVedio = {
    //更换图片验证码
    ResetCodeImg: function () {
        $(".I-Code-img").click(function () {
            $(".I-Code-img>img").attr('src', 'youtu/kaptcha.jpg')
        })
    },
    SendMail: function () {
        var sendemail = false;
        $(".E-Code-img").click(function () {
            if (sendemail === false) {
                if($(".Mail").val() != ""){
                    var email = $(".Mail").val();
                    sendemail = true;
                    $.ajax({
                        type: "POST",
                        url: "youtu/front/register/email/code",
                        data: {email: email},
                        success: function (data) {

                        }
                    });
                    var i = 30 ;
                    $(".E-Code-img").css("line-height","21px").html("重新发送（" + i + "s）");
                    var itime=setInterval(function () {
                        i=i-1;
                        if (i === 0) {
                            clearInterval(itime);
                            $(".E-Code-img").css("line-height","41px").html("点击获取");
                            sendemail = false;
                        }else {
                            $(".E-Code-img").html("重新发送（" + i + "s）")
                        }
                    },1000);
                }else {
                    $(".E-Code-wrapper>.message").html("邮箱不能为空");
                }
            }
        })
    },
    EmailTest: function (EmailTest) {
        var email = $(".Mail").val();
        if (email != "") {
            //邮箱正则检测
            var testemail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

            if (testemail.test(email)) {
                //ajax判断是否注册过
                $(".Mail-wrapper>.message").html("");
                return EmailTest = true;
            } else {
                $(".Mail-wrapper>.message").html("请输入邮箱名");
                return EmailTest = false;
            }
        } else {
            $(".Mail-wrapper>.message").html("请输入邮箱名");
            return EmailTest = false;
        }

    },
    NickNameTest: function (UserNameTest) {
        var nickname = $(".UserName").val();

        if (nickname != "" && 2 < nickname.length && nickname.length < 17) {
            //昵称违规词检测
            //昵称重复判断

            $(".UserName-wrapper>.message").html("");
            return UserNameTest = true;
        } else {
            $(".UserName-wrapper>.message").html("昵称长度为3-16");
            return UserNameTest = false;
        }

    },
    PassWordTest: function (PassWordTest) {
        var password = $(".PassWord").val();

        if (password != "" && 5 < password.length && password.length < 17) {
            //密码检测正则
            var textPassWord = /^[a-zA-Z][0-9a-zA-Z]{5,15}/;
            if (textPassWord.test(password)) {
                $(".PassWord-wrapper>.message").html("");
                return PassWordTest = true;
            } else {
                $(".PassWord-wrapper>.message").html("字母开头，只能包含字符、数字");
                return PassWordTest = false;
            }
        } else {
            $(".PassWord-wrapper>.message").html("字母开头，长度在6-16之间，只能包含字符、数字");
            return PassWordTest = false;
        }
    },
    ConfirmPassWordTest: function (ConfirmPassWordTest) {
        var password = $(".PassWord").val();
        var passwordC = $(".PassWord-C").val();
        if (passwordC != "") {
            if (passwordC === password) {
                $(".PassWord-C-wrapper>.message").html("");
                return ConfirmPassWordTest = true;
            } else {
                $(".PassWord-C-wrapper>.message").html("与之前密码不一致");
                return ConfirmPassWordTest = false;
            }
        } else {
            $(".PassWord-C-wrapper>.message").html("请输入确认密码");
            return ConfirmPassWordTest = false;
        }

    },
    ICodeTest: function (ICodeTest) {
        var icode = $(".I-Code").val();
        if (icode != "") {
            $(".I-Code-wrapper>.message").html("");
            return ICodeTest = true;
        } else {
            $(".I-Code-wrapper>.message").html("请输入图片验证码");
            return ICodeTest = false;
        }
    },
    ECodeTest: function (ECodeTest) {
        var ecode = $(".E-Code").val();
        if (ecode != "") {
            $(".E-Code-wrapper>.message").html("");
            return ECodeTest = true;
        } else {
            $(".E-Code-wrapper>.message").html("请输入邮箱验证码");
            return ECodeTest = false;
        }
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
    //添加图片验证码
    $(".I-Code-img>img").attr('src', 'youtu/kaptcha.jpg');
    youtuVedio.ResetCodeImg();

    //判断是否为true
    var EmailTest, UserNameTest, PassWordTest, ConfirmPassWordTest, ICodeTest, ECodeTest;


    youtuVedio.SendMail();

    $(".Mail").blur(function () {
        youtuVedio.EmailTest(EmailTest);
    });
    $(".UserName").blur(function () {
        youtuVedio.NickNameTest(UserNameTest);
    });
    $(".PassWord").blur(function () {
        youtuVedio.PassWordTest(PassWordTest);
    });
    $(".PassWord-C").blur(function () {
        youtuVedio.ConfirmPassWordTest(ConfirmPassWordTest);
    });
    $(".I-Code").blur(function () {
        youtuVedio.ICodeTest(ICodeTest);
    });
    $(".E-Code").blur(function () {
        youtuVedio.ECodeTest(ECodeTest);
    });





    $(".M-registerGO").click(function (EmailTest, UserNameTest, PassWordTest, ConfirmPassWordTest, ICodeTest, ECodeTest) {
        if (youtuVedio.EmailTest(EmailTest) === true && youtuVedio.NickNameTest(UserNameTest) === true && youtuVedio.PassWordTest(PassWordTest) === true &&  youtuVedio.ConfirmPassWordTest(ConfirmPassWordTest) === true && youtuVedio.ICodeTest(ICodeTest) === true && youtuVedio.ECodeTest(ECodeTest) === true) {
            var email = $(".Mail").val();
            var UserName = $(".UserName").val();
            var PassWord = $(".PassWord").val();
            var ICode = $(".I-Code").val();
            var ECode = $(".E-Code").val();
            $.ajax({
                type: "POST",
                url: "/youtu/front/register/email",
                data: {
                    name: UserName,
                    nickname: UserName,
                    mailbox: email,
                    pwd: PassWord,
                    imgCode: ICode,
                    mailCode: ECode
                },
                success: function (data) {
                    alert("注册成功");
                    window.location.href = 'login.html';
                }
            })
        }else {
            alert("不满足注册条件")
        }
    })
});
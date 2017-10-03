var youtuVedio = {
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
    randomsort: function (a, b) {
        return Math.random() > .5 ? -1 : 1;
    },
    SwitchAjax: function (userId) {
        $.ajax({
            type: "GET",
            url: "youtu/front/personspace/switch?userId=" + userId + "&pageNum=1&pageSize=1",
            success: function (data) {
                //修改标题
                document.title = data.data.userName + '的个人主页';
                //修改背景
                $(".header").css({"background-image": "url(" + data.data.backPic + ")"});
                $(".header-wrapper").css({"background-image": "url(" + data.data.backPic + ")"});
                //修改banner背景
                $(".banner").css({"background-image": "url(" + data.data.backPic + ")"});
                //修改头像
                $(".info>.avatar>img").attr("src", data.data.portrait);
                //修改昵称
                $(".info>.nickName").text(data.data.userName);
                //修改第二昵称
                $(".info>.e-nickName").text(data.data.otherName);
                //添加描述
                $(".banner-r-bg>.desc").text(data.data.describ);
                //根据开关添加分页
                if (data.data.homePageSwitch) {
                    $(".Nav-l").append("<li id='homepage'>首页</li>");
                    //首页数据载入
                    youtuVedio.IndexAjaxShow(userId);
                }
                if (data.data.shortVSwitch) {
                    $(".Nav-l").append("<li id='shortV'>短视频</li>");
                    //短视频数据载入
                    var pageV = 1;
                    youtuVedio.VAjaxShow(userId, pageV);
                }
                if (data.data.subcrSwitch) {
                    $(".Nav-l").append("<li id='subscription'>订阅</li>");
                    //订阅数据载入
                    var pageSub = 1;
                    youtuVedio.SubAjaxShow(userId, pageSub);
                }
                if (data.data.collectionSwitch) {
                    $(".Nav-l").append("<li id='collection'>收藏</li>");
                    //收藏数据载入
                    var pageColV = 1;
                    youtuVedio.ColVAjaxShow(userId, pageColV);
                }


                //给第一个元素加active
                var NavLi = $(".Nav-l li");
                NavLi.eq(0).addClass("Nav-active");
                //添加点击事件
                NavLi.click(function () {
                    //移除所有class
                    NavLi.removeClass("Nav-active");
                    //给当前点击的添加class
                    NavLi.eq($(this).index()).addClass("Nav-active");
                    //隐藏所有内容
                    $(".Text-main>div").hide();
                    //搜索条隐藏
                    $(".Nav-r").hide();
                    var indexfirst = 1;
                    switch ($(this).text()) {
                        case "首页":
                            $(".Text-main>.index-box").show();
                            break;
                        case "短视频":
                            pageV=1;
                            youtuVedio.VAjaxShow(userId,pageV);
                            $(".Text-main>.v-box").show();
                            $(".Nav-r").show();
                            break;
                        case "影视剧集":
                            break;
                        case "订阅":
                            pageSub=1;
                            youtuVedio.SubAjaxShow(userId,pageSub);
                            $(".Text-main>.s-box").show();
                            break;
                        case "收藏":
                            pageColV=1;
                            youtuVedio.ColVAjaxShow(userId,pageColV);
                            $(".Text-main>.c-box").show();
                            break;
                    }
                });
            }
        })
    },
    IndexAjaxShow: function (userId) {
        $.ajax({
            type: "GET",
            url: "youtu/front/personspace/homepage?userId=" + userId + "&pageNum=1&pageSize=5",
            success: function (data) {
                for (var i = 0; i < data.data.length; i++) {
                    $(".index-list").append('<li><a href="' + data.data[i].url + '" class="index-img" target="_blank"><img src="' + data.data[i].coverUrl + '"><span></span></a></li>')
                }
            }
        })
    },
    VAjaxShow: function (userId, pageV) {
        $.ajax({
            type: "GET",
            url: "youtu/front/personspace/shortVedio?userId=" + userId + "&pageNum=" + pageV + "&pageSize=20",
            success: function (data) {
                //移除视频
                $(".v-box>.v-list li").remove();
                //获取搜索到的视频数量
                var data = data.data[0];
                var vedioLen = (data.totalSize === null ? 0 : data.totalSize);

                //如果大于0先移除搜索失败的界面
                if (vedioLen > 0) {
                    for (var i = 0; i < (data.info.length); i++) {
                        $(".v-box>.v-list").append('' +
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

                    $('.v-box>.v-list li').each(function (index) {
                        $(this).children('.v-img').attr('href', "v.html?id=" + data.info[index].vedioCode).find("img").attr('src', data.info[index].vedioCover);
                        $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.info[index].vedioLength));
                        $(this).find($('.v-title')).attr('href', "v.html?id=" + data.info[index].vedioCode).html(youtuVedio.getByteLen(data.info[index].vedioTitle) > 26 ? data.info[index].vedioTitle : data.info[index].vedioTitle + "<span></span>");
                        $(this).children('.v-info').find('.v-avatar').attr({'href': "space.html?id=" + data.info[index].userId}).find('img').attr({'src': data.info[index].userPortrait});
                        $(this).find($('.v-user')).attr('href', "space.html?id=" + data.info[index].userId).text(data.info[index].userName);
                        $(this).find($('.v-c a')).text(data.info[index].vedioCountry).attr({'href': "videolib.html?countryId=" + data.info[index].userId});
                        $(this).find($('.v-f a')).text(data.info[index].vedioClass).attr({'href': "videolib.html?classIdId=" + data.info[index].userId});
                        $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.info[index].vedioCreateTime));
                    });

                    if (vedioLen > 20) {
                        youtuVedio.PageV("v-box", vedioLen, pageV, 20, 5, userId)
                    }
                }
            }
        })
    },
    SubAjaxShow: function (userId, pageSub) {
        $.ajax({
            type: "GET",
            url: "youtu/front/personspace/subscription?userId=" + userId + "&pageNum=" + pageSub + "&pageSize=25",
            success: function (data) {
                //移除订阅
                $(".s-list li").remove();
                //获取搜索到的订阅数量
                var data = data.data[0];
                var SubLen = (data.totalSize === null ? 0 : data.totalSize);

                //如果大于0先移除搜索失败的界面
                if (SubLen > 0) {
                    for (var i = 0; i < (data.info.length); i++) {
                        $(".s-list").append('' +
                            '<li>' +
                            '<img src="' + data.info[i].icon + '" class="">' +
                            '<img src="' + data.info[i].icon + '" class="">' +
                            '<a href=space.html?id=' + (data.info[i].uid) + ' class="s-list-bg">' +
                            '<img src="' + data.info[i].icon + '">' +
                            '<div class="o-UserName">' + data.info[i].uname + '</div>' +
                            '</a>' +
                            '</li>')
                    }
                    if (SubLen > 20) {
                        youtuVedio.PageSub("s-box", SubLen, pageSub, 25, 5, userId)
                    }
                }
            }
        })
    },
    ColVAjaxShow:function (userId, pageColV) {
        $.ajax({
            type: "GET",
            url: "youtu/front/personspace/collection/vedio?userId=" + userId + "&pageNum=" + pageColV + "&pageSize=20",
            success: function (data) {
                //移除视频
                $(".c-v-list>.v-list li").remove();
                //获取搜索到的视频数量
                var data = data.data[0];
                var vedioLen = (data.totalSize === null ? 0 : data.totalSize);

                //如果大于0先移除搜索失败的界面
                if (vedioLen > 0) {
                    for (var i = 0; i < (data.info.length); i++) {
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
                        $(this).children('.v-img').attr('href', "v.html?id=" + data.info[index].vedioCode).find("img").attr('src', data.info[index].vedioCover);
                        $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.info[index].vedioLength));
                        $(this).find($('.v-title')).attr('href', "v.html?id=" + data.info[index].vedioCode).html(youtuVedio.getByteLen(data.info[index].vedioTitle) > 26 ? data.info[index].vedioTitle : data.info[index].vedioTitle + "<span></span>");
                        $(this).children('.v-info').find('.v-avatar').attr({'href': "space.html?id=" + data.info[index].userId}).find('img').attr({'src': data.info[index].userPortrait});
                        $(this).find($('.v-user')).attr('href', "space.html?id=" + data.info[index].userId).text(data.info[index].userName);
                        $(this).find($('.v-c a')).text(data.info[index].vedioCountry).attr({'href': "videolib.html?countryId=" + data.info[index].userId});
                        $(this).find($('.v-f a')).text(data.info[index].vedioClass).attr({'href': "videolib.html?classIdId=" + data.info[index].userId});
                        $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.info[index].vedioCreateTime));
                    });

                    if (vedioLen > 20) {
                        youtuVedio.PageColV("c-v-list", vedioLen, pageColV, 20, 5, userId)
                    }
                }
            }
        })
    },
    PageV: function (address, commentLength, pageIndex, eventCount, navigateCount, userId) {
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
                $('html,body').animate({scrollTop: 300}, 'slow');
                youtuVedio.VAjaxShow(userId, pageIndex);
            }
        });
        $("."+address+">.list-page>.prev").click(function () {
            pageIndex = pageIndex - 1;
            $('html,body').animate({scrollTop: 300}, 'slow');
            youtuVedio.VAjaxShow(userId, pageIndex);
        });
        $("."+address+">.list-page>.next").click(function () {
            pageIndex = pageIndex + 1;
            $('html,body').animate({scrollTop: 300}, 'slow');
            youtuVedio.VAjaxShow(userId, pageIndex);
        });
    },
    PageSearchV: function (address, commentLength, pageIndex, eventCount, navigateCount, userId,keyword) {
        // address        添加分页器的地址
        // commentLength  得到数量
        // pageIndex      当前页
        // eventCount     每页显示多少个
        // navigateCount  分页显示多少个
        // keyword        搜索关键词
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
                pageIndex = $(this).text();
                $('html,body').animate({scrollTop: 300}, 'slow');
                youtuVedio.VsearchAjax(userId,keyword,pageIndex);
            }
        });
        $("."+address+">.list-page>.prev").click(function () {
            pageIndex = pageIndex - 1;
            $('html,body').animate({scrollTop: 300}, 'slow');
            youtuVedio.VsearchAjax(userId,keyword,pageIndex);
        });
        $("."+address+">.list-page>.next").click(function () {
            pageIndex = pageIndex + 1;
            $('html,body').animate({scrollTop: 300}, 'slow');
            youtuVedio.VsearchAjax(userId,keyword,pageIndex);
        });
    },
    PageSub: function (address, commentLength, pageIndex, eventCount, navigateCount, userId) {
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
                $('html,body').animate({scrollTop: 300}, 'slow');
                youtuVedio.SubAjaxShow(userId, pageIndex);
            }
        });
        $("."+address+">.list-page>.prev").click(function () {
            pageIndex = pageIndex - 1;
            $('html,body').animate({scrollTop: 300}, 'slow');
            youtuVedio.SubAjaxShow(userId, pageIndex);
        });
        $("."+address+">.list-page>.next").click(function () {
            pageIndex = pageIndex + 1;
            $('html,body').animate({scrollTop: 300}, 'slow');
            youtuVedio.SubAjaxShow(userId, pageIndex);
        });
    },
    PageColV: function (address, commentLength, pageIndex, eventCount, navigateCount, userId) {
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
                $('html,body').animate({scrollTop: 300}, 'slow');
                youtuVedio.ColVAjaxShow(userId, pageIndex);
            }
        });
        $("."+address+">.list-page>.prev").click(function () {
            pageIndex = pageIndex - 1;
            $('html,body').animate({scrollTop: 300}, 'slow');
            youtuVedio.ColVAjaxShow(userId, pageIndex);
        });
        $("."+address+">.list-page>.next").click(function () {
            pageIndex = pageIndex + 1;
            $('html,body').animate({scrollTop: 300}, 'slow');
            youtuVedio.ColVAjaxShow(userId, pageIndex);
        });
    },
    VSearch:function (userId) {
        var toSearchBtn = $("#toVsearch");
        var Vsearch=$("#Vsearch");
        Vsearch.focus(function () {
           $(".Nav-search-wrapper").css("box-shadow","0 3px 10px 3px #999999")
        });
        Vsearch.blur (function () {
            $(".Nav-search-wrapper").css("box-shadow","0 3px 10px 0 #999999")
        });
        toSearchBtn.click(function () {
            var keyword = Vsearch.val();
            var pageSearchV=1;
            if (keyword != "") {
                youtuVedio.VsearchAjax(userId,keyword,pageSearchV);
                Vsearch.val("");
            }
        });
        Vsearch.keydown(function (event) {
            if (event.which == 13) {
                var keyword = Vsearch.val();
                var pageSearchV=1;
                if (keyword != "") {
                    youtuVedio.VsearchAjax(userId,keyword,pageSearchV);
                    Vsearch.val("");
                }
            }
        });
    },
    VsearchAjax:function (userId,keyword,pageSearchV) {
        $.ajax({
            type: "GET",
            url: "youtu/front/personspace/shortVedio/search?describ="+keyword+"&userId="+userId+"&pageNum="+pageSearchV+"&pageSize=20",
            success: function (data) {
                //移除视频
                $(".v-box>.v-list li").remove();
                //获取搜索到的视频数量
                var data = data.data[0];
                var vedioLen = (data.totalSize === null ? 0 : data.totalSize);

                //如果大于0先移除搜索失败的界面
                if (vedioLen > 0) {
                    for (var i = 0; i < (data.info.length); i++) {
                        $(".v-box>.v-list").append('' +
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

                    $('.v-box>.v-list li').each(function (index) {
                        $(this).children('.v-img').attr('href', "v.html?id=" + data.info[index].vedioCode).find("img").attr('src', data.info[index].vedioCover);
                        $(this).children('.v-img').find('span').text(youtuVedio.VedioLength(data.info[index].vedioLength));
                        $(this).find($('.v-title')).attr('href', "v.html?id=" + data.info[index].vedioCode).html(youtuVedio.getByteLen(data.info[index].vedioTitle) > 26 ? data.info[index].vedioTitle : data.info[index].vedioTitle + "<span></span>");
                        $(this).children('.v-info').find('.v-avatar').attr({'href': "space.html?id=" + data.info[index].userId}).find('img').attr({'src': data.info[index].userPortrait});
                        $(this).find($('.v-user')).attr('href', "space.html?id=" + data.info[index].userId).text(data.info[index].userName);
                        $(this).find($('.v-c a')).text(data.info[index].vedioCountry).attr({'href': "videolib.html?countryId=" + data.info[index].userId});
                        $(this).find($('.v-f a')).text(data.info[index].vedioClass).attr({'href': "videolib.html?classIdId=" + data.info[index].userId});
                        $(this).find($('.v-time')).text(youtuVedio.VedioCreatTime(data.info[index].vedioCreateTime));
                    });

                    if (vedioLen > 20) {
                        youtuVedio.PageSearchV("v-box", vedioLen, pageSearchV, 20, 5, userId,keyword)
                    }else {
                        $(".v-box>.list-page").remove();
                    }
                }
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

    youtuVedio.headershow();
    var userId = escape(youtuVedio.getUrlParam("id").toString());
    //开关添加分页
    youtuVedio.SwitchAjax(userId);
    youtuVedio.VSearch(userId);
});
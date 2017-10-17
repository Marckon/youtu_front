var videoComment = {
    //登录

    // 获取参数
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    //切换评论tab标签
    commentTab: function () {
        var tabs = $('.tabs-order>li');
        tabs.each(function () {
            $(this).click(function () {
                tabs.removeClass('on');
                $(this).addClass('on');
            });
        });
    },
    //获取评论时间
    toTime: function (timeStamp) {
        var date = new Date(parseInt(timeStamp));
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes()].join(':'); // 2015-1-2
    },
    // 创建评论区模块
    createCommentArea: function (itemNo, typeNo, pageSize, pageNum) {
        // 获取评论数据
        $.ajax({
            type: "GET",
            url: "youtu/front/comment/queryComments?itemNo=" + itemNo + "&typeNo=" + typeNo + "&pageSize=" + pageSize + "&pageNum=" + pageNum,
            success: function (data) {
                // 若当前没有数据，则可添加第一条评论
                if(data.code===120){
                    $('.comment-btn:first').click(function () {
                        var createtime=new Date();
                        var describe = $('.comment-send:first').find('.comment-text').val();
                        var storey = 1;
                        var commentNo = 0;
                        var styleNo = videoComment.getUrlParam('id');
                        var replyNo = 0;
                        var userNo = videoComment.getCurrentUser().id;
                        if (userNo === null) {
                            alert('您貌似还没有登录');
                            window.location.href='login.html';
                        } else if (describe === '') {
                            alert('您貌似什么都没有说');
                        } else {
                            $.ajax({
                                type: 'POST',
                                url: 'youtu/front/comment/addcomment',
                                data: {
                                    commentNo: commentNo,
                                    userNo: userNo,
                                    describe: describe,
                                    createtime: createtime,
                                    storey: storey,
                                    replyNo: replyNo,
                                    styleNo: styleNo
                                },
                                success: function (data) {
                                    alert(data.message);
                                    videoComment.createCommentArea();
                                }
                            })
                        }
                    });
                }
                var comment_list = $(".comment-list");
                var comment_num = data.data.data.length;   // 当前页评论数量
                var total_comments = data.data.total;// 该视频下的总评论
                data.data.data.sort(function (v1,v2) {
                    return v1.floors-v2.floors;
                });// 按楼层排序
                if (comment_num > 0) {
                    for (var i = 0; i < comment_num; i++) {
                        // 创建评论区
                        var comment = $('<div class="list-item clearfloat" id="' + data.data.data[i].id + '">\n' +
                            '                <div class="u-face" >\n' +
                            '                    <a href="space.html?id=' + data.data.data[i].userId + '" target="_blank" data-id="' + data.data.data[i].id + '">\n' +
                            '                        <img src="' + data.data.data[i].userPortrait + '">\n' +
                            '                    </a>\n' +
                            '                </div>\n' +
                            '                <div class="con">\n' +
                            '                    <div class="user clearfloat">\n' +
                            '                        <a href="space.html?id=' + data.data.data[i].userId + '" target="_blank" data-id="' + data.data.data[i].id + '">' + data.data.data[i].username + '</a>\n' +
                            '                        <div class="time">' + videoComment.toTime(data.data.data[i].createdate) + '</div>\n' +
                            '                    </div>\n' +
                            '                    <p class="text" >\n' + data.data.data[i].content +
                            '                    </p>\n' +
                            '            <div class="comment-info " >\n' +
                            '                <span class="floor"> #' + data.data.data[i].floors + '</span>\n' +
                            '                <div class="up"><span>' + data.data.data[i].goodHits + '</span></div>\n' +
                            '                <div class="down"><span>' + data.data.data[i].badHits + '</span></div>\n' +
                            '                <span class="reply " data-id="' + data.data.data[i].id + '">回复</span>\n' +
                            '            </div>\n' +
                            '                    <div class="comment-send reply-input">\n' +
                            '                        <textarea class="comment-text" placeholder="快来说说你的想法..."></textarea>\n' +
                            '                        <input class="comment-btn" type="button" value="发送" data-uid="">\n' +
                            '                    </div>\n' +
                            '              </div>\n' +
                            '      </div>');
                        $(comment_list).append($(comment));

                        // 该评论回复数
                        var reply_num = data.data.data[i].commentSeconds.length;
                        //创建回复区
                        if (reply_num > 0) {
                            //为回复内容添加@符号
                            for (var j = 0; j < reply_num; j++) {
                                var reply_id = data.data.data[i].commentSeconds[j].replyId;
                                if (reply_id != data.data.data[i].id) {// 若不是回复层主
                                    data.data.data[i].commentSeconds[j].content = "回复 @" + data.data.data[i].commentSeconds[j].replyUserName + " " + data.data.data[i].commentSeconds[j].content;
                                }
                            }
                            $('.text:last').after('<div class="reply-box" ></div>');
                            var reply_wrapper = $('.reply-box:last');
                            for (var j = 0; j < reply_num; j++) {
                                var reply = $('   <div class="reply-item reply-border" >\n' +
                                    '                            <div class="reply-con clearfloat">\n' +
                                    '                                <div class="reply-user"><a href="space.html?id=' + data.data.data[i].commentSeconds[j].userId + '" target="_blank" data-id="' + data.data.data[i].commentSeconds[j].id + '">' + data.data.data[i].commentSeconds[j].username + '</a></div>\n' +
                                    '                                <div class="reply-time">' + videoComment.toTime(data.data.data[i].commentSeconds[j].createdate) + '</div>\n' +
                                    '                            </div>\n' +
                                    '                            <div class="reply-info" >\n' +
                                    '                                <span class="reply " data-id="' + data.data.data[i].commentSeconds[j].id + '">回复</span>\n' +
                                    '                                <div class="up"><span>' + data.data.data[i].commentSeconds[j].goodHits + '</span></div>\n' +
                                    '                                <div class="down"><span>' + data.data.data[i].commentSeconds[j].badHits + '</span></div>\n' +
                                    '                            </div>\n' +
                                    '                            <p class="reply-text">\n' + data.data.data[i].commentSeconds[j].content +
                                    '                               </p>\n' +
                                    '                        </div>\n'
                                );
                                $(reply_wrapper).append($(reply));
                            }
                            var reply_eleArr = $('#' + data.data.data[i].id).find('.reply-item');// 找到该评论下的所有回复
                            var reply_box = $('#' + data.data.data[i].id).find('.reply-box');// 找到该评论下的回复区
                            videoComment.fullText(reply_box, reply_num, 2, reply_eleArr);
                        }

                    }
                }
                videoComment.makeReply(data);
                videoComment.Page('comment-list', total_comments, pageNum, pageSize, 5, itemNo, typeNo);
            },
            error:function () {
                alert('error');
            }
        });
    },// createCommentArea
    // 回复，点赞，点踩功能
    makeReply: function (data) {
        // 回复
        $('.reply').click(function () {
            var reply_type_ele = $(this).parent().prev();
            if ($(reply_type_ele).attr('class') === 'reply-con clearfloat') {
                $('.reply-input').hide();
                var reply_stamp = '回复@' + $(reply_type_ele).find('.reply-user>a').html();
                $('.reply-input').find('.comment-text').attr('placeholder', reply_stamp);
                var reply_input = $(this).parents().eq(4).find('.reply-input');
                $(reply_input).show();
                $(reply_input).find('.comment-btn').attr('data-id', $(this).attr('data-id'));// 给发送按钮绑定回复对象的id
            }
            else {
                $('.reply-input').hide();
                $('.reply-input').find('.comment-text').attr('placeholder', '请自觉遵守互联网相关的政策法规，发布友善内容');
                var reply_input = $(this).parents().eq(2).find('.reply-input');
                $(reply_input).show();
                $(reply_input).find('.comment-btn').attr('data-id', $(this).attr('data-id'));// 给发送按钮绑定回复对象的id
            }
        });
        $('.comment-btn').click(function () {
            var current_btn = this;
            var Post_data = {
                current_btn: $(current_btn),
                createtime: new Date(),
                // var describe = $('.comment-send:first').find('.comment-text').val();
                describe: $(this).parent().find('.comment-text:first').val(),// 内容
                styleNo: Number(videoComment.getUrlParam('id')),// 当前视频id
                userNo: Number(videoComment.getCurrentUser().id),// 当前用户的id
                storey: function () {
                    if (typeof (Post_data.current_btn.attr('data-id') == 'undefined')){  // 如果为添加评论
                        return data.data.data.length + 1;// 楼层数，回复的为当前楼层，评论的为总楼层加一
                    } else {
                        return Post_data.current_btn.attr('data-id');
                    }
                },
                replyNo: function () {
                    if (typeof (Post_data.current_btn.attr('data-id') == 'undefined')){  // 如果为添加评论
                        return 0;// 回复对象的内容id，若为评论则该值为0
                    } else {
                        return Number(Post_data.current_btn.attr('data-id'));
                    }
                },

                commentNo: function () {
                    if (typeof (Post_data.current_btn.attr('data-id') == 'undefined')){  // 如果为添加评论
                        return data.data.data.length;//  当前评论或回复的内容id，评论的id为总评论数的先前长度（从0开始）
                    } else {
                        var cmt_id=Post_data.current_btn.attr('data-id');
                        return cmt_id+data.data.data[Number(cmt_id)].commentSeconds.length;// 回复的id为该评论id与总回复数数组的长度字符串拼接
                    }
                }
            };
            // alert(Post_data.createtime+' '+Post_data.describe+' '+Post_data.styleNo+' '+Post_data.storey()+' '+Post_data.replyNo()+' '+Post_data.commentNo())
            if (Post_data.userNo === null) {
                alert('您貌似还没有登录');
                window.location.href = 'login.html';
            } else if (Post_data.describe === '') {
                alert('您貌似什么都没有说');
            } else {
                /*var data1= {
                    commentNo: Post_data.commentNo(),
                        userNo: Post_data.userNo,
                        describe: Post_data.describe,
                        createtime: Post_data.createtime,
                        storey: Post_data.storey(),
                        replyNo: Post_data.replyNo(),
                        styleNo: Post_data.styleNo
                };
                var datastring=JSON.stringify(data1);
                alert(datastring);*/
                $.ajax({
                    type: 'POST',
                    url: 'youtu/front/comment/addcomment',
                    data: {
                        commentNo: Post_data.commentNo(),
                        userNo: Post_data.userNo,
                        describe: Post_data.describe,
                        createtime: Post_data.createtime,
                        storey: Post_data.storey(),
                        replyNo: Post_data.replyNo(),
                        styleNo: Post_data.styleNo
                        // style:1
                    },
                    success: function (data) {
                        var datastring=JSON.stringify(data);
                        alert(datastring)
                        // alert('错误代码：'+data.code+' '+data.message);
                        videoComment.createCommentArea();
                    }
                })
            }
        });
        // 点赞
        $('.up').click(function () {
            var current_up = Number($(this).find('span').html());
            $(this).find('span').html(current_up + 1);
        });
        //点踩
        $('.down').click(function () {
            var current_up = Number($(this).find('span').html());
            $(this).find('span').html(current_up + 1);
        })
    },//makereply
    // 分页功能
    Page: function (address, commentLength, pageIndex, eventCount, navigateCount, itemNo, typeNo) {
        // address        添加分页器的地址
        // commentLength  得到评论数量
        // pageIndex      当前页
        // eventCount     每页显示多少个
        // navigateCount  分页显示多少个（页码数字）
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
                if (pageIndex == 1) {// 首页情况
                    for (var i = 0; i < (navigateCount); i++) {
                        $(".pageNumber").eq(i).show();
                    }
                    $(".pageNumber").eq(navigateCount).after('<span class="dian">...</span>');// 在其后追加一个span
                    $(".pageNumber").eq(-1).show();
                } else if (pageIndex == pageCount) {// 尾页情况
                    $(".pageNumber").eq(0).show();
                    $(".pageNumber").eq(0).after('<span class="dian">...</span>');
                    for (var i = pageCount; i > pageCount - (navigateCount + 1); i--) {
                        $(".pageNumber").eq(i + 1).show();
                    }
                } else {// 其他页情况
                    $(".pageNumber").eq(0).show();// 显示第一页页码
                    if (pageIndex > navigateCount - 1) {// 当前页大于显示页数倒数第二个位置
                        $(".pageNumber").eq(0).after('<span class="dian">...</span>');
                    }
                    for (var i = pageIndex - ((navigateCount - 1) / 2) - 1; i < pageIndex - ((navigateCount - 1) / 2) - 1 + navigateCount; i++) {
                        $(".pageNumber").eq(i).show();
                    }
                    $(".pageNumber").eq(-1).show();
                    if (pageIndex < pageCount - 3) {// 当前页小于总页数倒数第三个时
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
                // window.location.href = ("videolib.html?country=" + Country + "&class=" + Class + "&sort=" + Sort + "&page=" + $(this).text())
                videoComment.createCommentArea(itemNo, typeNo, eventCount, $(this).text());
            }
        });
        $(".list-page>.prev").click(function () {
            // window.location.href = ("videolib.html?country=" + Country + "&class=" + Class + "&sort=" + Sort + "&page=" + (pageIndex - 1))
            videoComment.createCommentArea(itemNo, typeNo, eventCount, pageIndex - 1);


        });
        $(".list-page>.next").click(function () {
            // window.location.href = ("videolib.html?country=" + Country + "&class=" + Class + "&sort=" + Sort + "&page=" + (pageIndex - 0 + 1))
            videoComment.createCommentArea(itemNo, typeNo, eventCount, pageIndex + 1);

        });
    },// page
    // 展开全文功能
    fullText: function (address, replyLength, showNum, replyEleArr) {
        // address: 添加展开全文功能的元素
        // replyLength：该层楼的总回复数
        // showNum：展示的回复数
        // replyEleArr: 需要被操作的元素对象数组
        if (replyLength <= showNum) {
            return;
        } else {
            $(replyEleArr).hide();
            $(replyEleArr).filter(':lt(' + showNum + ')').show();
            var fullTextButton = $('<div class="reply-more"><span></span>展开更多评论</div>');
            $(address).append($(fullTextButton));
            $(fullTextButton).click(function () {
                if ($(this).hasClass('reply-fold')) {
                    $(replyEleArr).hide();
                    $(replyEleArr).filter(':lt(' + showNum + ')').show();
                    $(this).removeClass('reply-fold');
                    $(this).html('<span></span>展开更多评论');
                } else {
                    $(this).addClass('reply-fold');
                    $(this).html('<span></span>收起');
                    $(replyEleArr).show();
                }
            })
        }

    },// fullText
    // 获取当前用户信息
    getCurrentUser: function () {
        var userNo = sessionStorage.getItem('userId');
        var userName = sessionStorage.getItem('nickname');
        if (userNo != null) {
            user = {'id': userNo, 'name': userName};
            return user;
        } else {
            return user = {'id': null, 'name': null};
            // return user=undefined;
        }
    }
};// videoComment

$(function () {
        $('.comment-list-load').hide();// 加载完成隐藏loading效果
        videoComment.commentTab();

        var videoId = videoComment.getUrlParam('id');
        videoComment.createCommentArea(videoId, 1, 22, 1);

        // 评论数据返回
         /*$('.comment-send:first').find('.comment-btn').click(function () {
             $.ajax({
                 type: 'GET',
                 url: "youtu/front/comment/queryComments?itemNo=" + videoId + "&typeNo=1&pageSize=22&pageNum=1",
                 success: function (data) {
                     // var createtime = Date.parse(new Date());
                     var createtime=new Date();
                     var describe = $('.comment-send:first').find('.comment-text').val();
                     var storey = data.data.data.length + 1;
                     var commentNo = data.data.data.length;
                     var styleNo = videoComment.getUrlParam('id');
                     var replyNo = 0;
                     var userNo = videoComment.getCurrentUser().id;
                     if (userNo === null) {
                         alert('您貌似还没有登录');
                         window.location.href='login.html';
                     } else if (describe === '') {
                         alert('您貌似什么都没有说');
                     } else {
                         $.ajax({
                             type: 'POST',
                             url: 'youtu/front/comment/addcomment',
                             data: {
                                 commentNo: commentNo,
                                 userNo: userNo,
                                 describe: describe,
                                 createtime: createtime,
                                 storey: storey,
                                 replyNo: replyNo,
                                 styleNo: styleNo
                             },
                             success: function (data) {
                                 alert(data.message);
                                 videoComment.createCommentArea();
                             }
                         })
                     }
                 }
             });
         });*/


    }
);

Mock.mock(
    /\.json/, {    //匹配.json文件，可执行匹配成功的参数
        'comment|30-80': [{
            'textInfo': [{
                'Floor|+1': 1,
                'Text': '@cparagraph(1, 3)',
                'Time': '@datetime("yyyy-MM-dd HH:mm")',
                'Up': '@natural(0, 100)',
                'Down': '@natural(0, 100)'
            }],
            'User': [{
                'Id': /\d{9}/,
                'Name': '@cword(2, 10)',
                'Avater': '@dataImage(60x60)'
            }],
            'reply|1-10': [{
                'Id': /\d{9}/,
                'Name': '@cword(2, 10)',
                'Text': '@cparagraph(1, 3)',
                'Time': '@datetime("yyyy-MM-dd HH:mm")',
                'Up': '@natural(0, 100)',
                'Down': '@natural(0, 100)'
            }]
        }]
    });


/*判断是否滚轮大于可视区*/
/*var isTrue=false;

 $(window).scroll( function() {
 var otherVideo=$(".otherVideo-wrapper").offset().top;  //元素距离顶部的高度
 var docutop=$(document).scrollTop();  //当前滚动条的高度
 var otherVideoToTop=$(".otherVideo-wrapper").offset().top-$(document).scrollTop(); //这个是元素距离

 if(otherVideoToTop+300<docutop &&
 isTrue==false){
 isTrue= true;
 sendData("hello2.json");
 }
 } );*/


if (sendData("hello.json")) {
    sendData("hello2.json")
}
function sendData(url) {
    $.ajax({
        url: url,
        dataType: 'json'
    }).done(function (data, status, jqXHR) {
        //获得mock数据模板中的数据，打印到body上
        $('<pre>').text(JSON.stringify(data, null, 4)).appendTo('body');
        console.log(JSON.stringify(data, null, 4)).appendTo('body')
        //将数据生成数组
        var commentJson = eval(data);

        //参数
        var commentLength = commentJson.comment.length; //得到评论数量
        var pageIndex = 1;  //当前页
        var eventCount = 10; //每页显示多少个
        var navigateCount = 5; //导航栏显示多少个
        var overCount = commentLength % eventCount; //剩下的评论
        var pageCount = Math.ceil(commentJson.comment.length / eventCount);  //共有多少页

        ResetComment();

        //重置全部评论
        function ResetComment() {
            tcdhtml(); //分页
            $('.tcd-number').eq(0).addClass("current");
            toPageIndex(pageIndex); //跳转到index的评论
        }


        function toPageIndex(thisIndex) {
            //判断是否为最后一页
            if (pageCount > 1 && thisIndex == pageCount && overCount != 0) {
                //移除容器内所有评论
                $('.comment-list').empty();
                //放入index对应的评论
                for (var i = overCount,k=0; i > 0; i--,k++) {
                    $(".comment-list").append('' +
                        '<div class="list-item clearfloat" data-id="123456789">' +
                        '<div class="u-face" data-usercard-mid="1234567">' +
                        '<a href="" target="_blank">' +
                        '<img src="' + data.comment[i - 1].User[0].Avater + '">' +
                        '</a> ' +
                        '</div> ' +
                        '<div class="con"> ' +
                        '<div class="user clearfloat"> ' +
                        '<a href="">' + data.comment[i - 1].User[0].Name + '</a> ' +
                        '<div class="time">' + commentJson.comment[i - 1].textInfo[0].Time + '</div> ' +
                        '</div> ' +
                        '<p class="text">' + commentJson.comment[i - 1].textInfo[0].Text + '</p>' +
                        '<div class="reply-box"></div>' +
                        '<div class="comment-info">' +
                        '<span class="floor">' + '#' + commentJson.comment[i - 1].textInfo[0].Floor + '</span>' +
                        '<div class="up"><span>(' + commentJson.comment[i - 1].textInfo[0].Up + ')</span></div> ' +
                        '<div class="down"><span>(' + commentJson.comment[i - 1].textInfo[0].Down + ')</span></div> ' +
                        '<span class="reply ">回复</span> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ')

                    //回复数据绑定
                    for (var l = 0; l < commentJson.comment[i-1].reply.length; l++) {
                        $(".reply-box").eq(k).append(
                            '<div class="reply-item" data-id="123456789"> ' +
                            '<div class="reply-con clearfloat"> ' +
                            '<div class="reply-user"><a href="" target="_blank">' + commentJson.comment[i-1].reply[l].Name + '</a></div> ' +
                            '<div class="reply-time">2017-04-29 16:27</div> ' +
                            '</div> ' +
                            '<div class="reply-info"> ' +
                            '<span class="reply ">回复</span> ' +
                            '<div class="up"><span>(' + commentJson.comment[i-1].reply[l].Up + ')</span></div> ' +
                            '<div class="down"><span>(' + commentJson.comment[i-1].reply[l].Down + ')</span></div> ' +
                            '</div> ' +
                            '<p class="reply-text">' + commentJson.comment[i-1].reply[l].Text + '</p>' +
                            '</div>'
                        )
                    }
                }
            } else {
                //移除容器内所有评论
                $('.comment-list').empty();
                //放入index对应的评论

                //评论数量
                for (var i = (commentLength - (eventCount * (thisIndex - 1))) ,k=0; i > ((commentLength - eventCount * (thisIndex))>0?(commentLength - eventCount * (thisIndex)):0); i--,k++) {
                    $(".comment-list").append('' +
                        '<div class="list-item clearfloat" data-id="123456789">' +
                        '<div class="u-face" data-usercard-mid="1234567">' +
                        '<a href="" target="_blank">' +
                        '<img src="' + commentJson.comment[i-1].User[0].Avater + '">' +
                        '</a> ' +
                        '</div> ' +
                        '<div class="con"> ' +
                        '<div class="user clearfloat"> ' +
                        '<a href="">' + commentJson.comment[i-1].User[0].Name + '</a> ' +
                        '<div class="time">' + commentJson.comment[i-1].textInfo[0].Time + '</div> ' +
                        '</div> ' +
                        '<p class="text">' + commentJson.comment[i-1].textInfo[0].Text + '</p>' +
                        '<div class="reply-box"></div>' +
                        '<div class="comment-info">' +
                        '<span class="floor">' + '#' + commentJson.comment[i-1].textInfo[0].Floor + '</span>' +
                        '<div class="up"><span>' + '(' + commentJson.comment[i-1].textInfo[0].Up + ')' + '</span></div> ' +
                        '<div class="down"><span>' + '(' + commentJson.comment[i-1].textInfo[0].Down + ')' + '</span></div> ' +
                        '<span class="reply ">回复</span> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ')


                    //回复数据绑定

                        for (var l = 0; l < commentJson.comment[i-1].reply.length; l++) {
                            $(".reply-box").eq(k).append(
                                '<div class="reply-item" data-id="123456789"> ' +
                                '<div class="reply-con clearfloat"> ' +
                                '<div class="reply-user"><a href="" target="_blank">' + commentJson.comment[i-1].reply[l].Name + '</a></div> ' +
                                '<div class="reply-time">2017-04-29 16:27</div> ' +
                                '</div> ' +
                                '<div class="reply-info"> ' +
                                '<span class="reply ">回复</span> ' +
                                '<div class="up"><span>(' + commentJson.comment[i-1].reply[l].Up + ')</span></div> ' +
                                '<div class="down"><span>(' + commentJson.comment[i-1].reply[l].Down + ')</span></div> ' +
                                '</div> ' +
                                '<p class="reply-text">' + commentJson.comment[i-1].reply[l].Text + '</p>' +
                                '</div>'
                            )
                        }
                }




            }

            $(".header-page>.dian").remove();
            if (pageCount > navigateCount + 1) {
                $(".tcd-number").hide();
                if (thisIndex == 1) {
                    for (var i = 0; i < (navigateCount); i++) {
                        $(".tcd-number").eq(i).show();
                    }
                    $(".tcd-number").eq(navigateCount).after('<span class="dian">...</span>');
                    $(".tcd-number").eq(-1).show();
                } else if (thisIndex == pageCount) {
                    $(".tcd-number").eq(0).show();
                    $(".tcd-number").eq(0).after('<span class="dian">...</span>');
                    for (var i = pageCount; i > pageCount - (navigateCount + 1); i--) {
                        $(".tcd-number").eq(i + 1).show();
                    }
                } else {
                    $(".tcd-number").eq(0).show();
                    if (thisIndex > navigateCount - 1) {
                        $(".tcd-number").eq(0).after('<span class="dian">...</span>');
                    }
                    for (var i = thisIndex - ((navigateCount - 1) / 2) - 1; i < thisIndex - ((navigateCount - 1) / 2) - 1 + navigateCount; i++) {
                        $(".tcd-number").eq(i).show();
                    }
                    $(".tcd-number").eq(-1).show();
                    if (thisIndex < pageCount - 3) {
                        $(".tcd-number").eq(-1).before('<span class="dian">...</span>');
                    }

                }
            }


        }

        //分页
        function tcdhtml() {
            var tcdhtml = '<span class="result">共' + pageCount + '页</span>';
            tcdhtml += '<a href="javascript:void(0)" class="prep">上一页</a>';
            for (var i = 1; i <= pageCount; i++) {
                tcdhtml += '<a href="javascript:;" class="tcd-number">' + i + '</a>';
            }
            tcdhtml += '<a href="javascript:void(0)" class="next">下一页</a>';
            $(".header-page").html(tcdhtml);
        }

        //跳转页面
        $(".tcd-number").click(function () {
            if ($(this).text() != pageIndex) {
                $(".tcd-number").removeClass("current");
                $(this).addClass("current");
                pageIndex = ($(this).text()) - 0;
                toPageIndex(pageIndex);
            }
        });
        $(".header-page>.prep").click(function () {
            if (pageIndex != 1) {
                $(".tcd-number").removeClass("current");

                pageIndex = pageIndex - 1;
                $(".tcd-number").eq(pageIndex - 1).addClass("current")
                toPageIndex(pageIndex);
            }
        });
        $(".header-page>.next").click(function () {
            if (pageIndex != pageCount) {
                $(".tcd-number").removeClass("current");
                $(".tcd-number").eq(pageIndex).addClass("current")
                pageIndex = pageIndex + 1;
                toPageIndex(pageIndex);
            }
        });


        console.log('评论数量' + commentJson.comment.length);
        console.log('评论页数量' + pageCount);
        console.log('剩余评论' + overCount);


    })
}




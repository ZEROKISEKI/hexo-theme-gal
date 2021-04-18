if ($('#comments-template')) {
    var gitalk = new Gitalk({
        clientID: window.commentConfig.client_id,
        clientSecret: window.commentConfig.client_secret,
        repo: window.commentConfig.repo,
        owner: window.commentConfig.owner,
        admin: [window.commentConfig.owner],
        id: window.commentConfig.id,
        proxy: window.commentConfig.proxy
    })
    gitalk.render('comments-template')
}

if ($('#sidebar-recent_comments')) {
    const $recentComments = $('#sidebar-recent_comments')
    const $listGroup = $recentComments.find('ul.list-group')
    const owner = window.commentConfig.owner
    const repo = window.commentConfig.repo
    $.ajax({
        url: "https://api.github.com/repos/" + owner + '/' + repo + '/issues/comments',
        data: {
            sort: 'created',
            direction: 'desc'
        },
        beforeSend: function (request) {
            request.setRequestHeader("Accept", "application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json");
        },
    }).done(function (comments) {
        if (comments.length === 0) {
            $recentComments.css('display', 'none')
        }
        $listGroup.each(function () {
            const recentComments = comments.slice(0, 5)
            const that = this
            for (var m = 0; m < recentComments.length; m++) {
                // 不用let, 就只能用立即执行的匿名函数了
                (function (index) {
                    $.ajax({
                        url: recentComments[index].issue_url
                    }).done(function (issue) {

                        const li = document.createElement('li')
                        li.className = 'list-group-item'

                        const span = document.createElement('span')
                        span.className = 'author-avatar'
                        const img = document.createElement('img')
                        img.className = 'avatar'
                        img.setAttribute('width', '40')
                        img.setAttribute('height', '40')
                        img.setAttribute('src', recentComments[index].user.avatar_url)
                        span.appendChild(img)
                        li.appendChild(span)

                        const content = document.createElement('div')
                        content.className = 'hint--left hint--rounded'
                        content.setAttribute('data-hint2', '《' + issue.title + '》' + recentComments[index].user.login + ':')
                        content.onclick = function () {
                            window.location.href = decodeURIComponent(issue.body)
                        }
                        const log = document.createElement('div')
                        log.className = 'comment-log'
                        log.innerHTML = recentComments[index].body_html
                        content.appendChild(log)

                        li.appendChild(content)
                        that.appendChild(li)
                    })
                })(m)
            }

        })
    }).fail(function (error) {
        console.log(error)
    });
}

if ($('.article-excerpt').length >= 1) {
    const $excerpts = $('.article-excerpt')
    const owner = window.commentConfig.owner
    const repo = window.commentConfig.repo
    $.ajax({
        url: "https://api.github.com/repos/" + owner + '/' + repo + '/issues',
        data: {
            creator: owner
        }
    }).done(function (issues) {
        console.log(issues)
        $excerpts.each(function () {
            const that = $(this)
            that.find('h1 > a > span').each(function () {
                const title = $(this).text()
                const tags = that.find('div.tag-article')
                const issue = issues.filter(function (issue) {
                    return issue.title === title
                })
                const comments = issue.length > 0 ? issue[0].comments : 0
                tags.each(function () {
                    $(this).append('<span class="label label-gal"><i class="fa fa-comments"></i><a> ' + comments + '</a></span>')
                })
            })
        })
    }).fail(function (error) {
        console.log(error)
    });
}
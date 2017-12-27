(function ($) {

	var hotPostsContainer = $('#sidebar-hot_posts')
	var hotPostsList = hotPostsContainer.find('ul.list-group-flush')
	var randPostsContainer = $('#sidebar-rand_posts')

	function addCount (Counter) {
		var article = $('#article')
		var url = $('.title-article').find('a').attr('href').trim()
		var title = $($('.title-article').find('a')[0]).text().trim()
		var query = new AV.Query(Counter)
		query.equalTo('url', url)
		query.find().then(function (results) {
			if (results.length > 0) {
				var counter = results[0]
				article.find('i.fa-eye').each(function () {
					$(this).after(' ' + counter.get('time') + ' ℃')
				})
				counter.save({
					fetchWhenSave: true
				})
				counter.increment('time')
				counter.save().then(function (counter) {
				}).then(function (counter, error) {
					console.log('Failed to save Visitor num, with error message: ' + error.message);
				})
			}
			else {
				article.find('i.fa-eye').each(function () {
					$(this).after(' 0 ℃')
				})
				var newcounter = new Counter()
				var acl = new AV.ACL();
				acl.setPublicReadAccess(true);
				acl.setPublicWriteAccess(true);
				newcounter.setACL(acl);
				newcounter.set('title', title)
				newcounter.set('url', url)
				newcounter.set('time', 1)
				newcounter.save().then(function (newcounter) {
				}).then(function (newcounter, error) {
					console.log('Failed to create');
				});
			}
		}).then(function (error) {
			console.log('Error:' + error.code + ' ' + error.message)
		})
	}

	// 展示每篇文章热度

	function showPostsTime(Counter) {
		var entries = []
		var excerpts = $('.article-excerpt')
		excerpts.each(function () {
			entries.push($(this).find('.title-article').first().find('a').attr('href').trim())
		})
		var query = new AV.Query(Counter)
		query.containedIn('url', entries)
		query.find().then(function (result) {
			excerpts.each(function () {
				var href = $(this).find('.title-article').first().find('a').attr('href').trim()
				var r = result.filter(function (e) {
					return e.get('url') === href
				})
				if(r.length > 0) {
					$(this).find('i.fa-eye').each(function () {
						$(this).after(' ' + r[0].get('time') + ' ℃')
					})
				} else {
					$(this).find('i.fa-eye').each(function () {
						$(this).after(' 0 ℃')
					})
				}
			})
		}).then(function (error) {
			console.log('Error:' + error.code + ' ' + error.message)
		})
	}

	// 侧边栏展示随机文章热度

	function showRandPosts(randList, randListUrl, Counter) {
		var query = new AV.Query(Counter)
		query.containedIn('url', randListUrl)
		query.find().then(function (result) {
			randList.each(function () {
				var href = $(this).find('a').attr('href').trim()
				var r = result.filter(function (e) {
					return e.get('url') === href
				})
				if(r.length > 0) {
					$(this).append('<span class="badge">' + r[0].get('time') + ' ℃</span>')
				} else {
					$(this).append('<span class="badge">0 ℃</span>')
				}
			})
		}).then(function (error) {
			console.log('Error:' + error.code + ' ' + error.message)
		})
	}

	// 侧边栏展示最热文章

	function showHotPosts(Counter) {
		var query = new AV.Query(Counter)
		query.descending('time')
		query.limit(window.hot_posts_count)
		query.find().then(function (results) {
			for(var i = 0; i < results.length; i++) {
				var counter = results[i]
				var title = counter.get('title')
				var url = counter.get('url')
				var time = counter.get('time')
				hotPostsList.each(function () {
					$(this).append(`<li class="list-group-item">
                							<span class="post-title">
                    						<a href="${url}">${title}</a>
                							</span>
                							<span class="badge">${time}℃</span>
            							</li>`)
				})
			}
		}).then(function (error) {
			console.log('Error:' + error.code + ' ' + error.message)
		})
	}

	$(function() {
		var Counter = AV.Object.extend('Counter')

		// 进入文章页面(包括自定义文章)
		if ($('#article').length === 1) {
			addCount(Counter)
		} else if ($('.article-excerpt').length >= 1) {
			showPostsTime(Counter)
		}

		if (hotPostsContainer.length === 1) {
			var HotCounter = AV.Object.extend('Counter')
			showHotPosts(HotCounter)
		}

		if (randPostsContainer.length === 1) {
			var randList = randPostsContainer.find('li.list-group-item')
			var randListUrl = []
			randList.each(function () {
				randListUrl.push($(this).find('a').attr('href').trim())
			})
			var RandCounter = AV.Object.extend('Counter')
			showRandPosts(randList, randListUrl, RandCounter)
		}

	})

})($)
var galTheme = {
	render(state, instance) {
		const container = document.createElement('div')
		container.lang = "zh-CN"
		container.className = 'gitment-container gitment-root-container'
		container.appendChild(instance.renderHeader(state, instance))
		container.appendChild(instance.renderComments(state, instance))
		container.appendChild(instance.renderEditor(state, instance))
		container.appendChild(instance.renderFooter(state, instance))
		return container
	},
	renderHeader(state, instance) {
		const container = document.createElement('h3')
		container.lang = "zh-CN"
		container.className = 'gitment-header-container alert alert-info'
		if(state.comments) {
			if(state.comments.length > 0) {
				$(container).append(`<i class="fa fa-comments"></i> ${state.comments.length}条评论`)
			} else {
				$(container).append('<i class="fa fa-comments"></i> 暂无评论')
			}
		}
		return container
	},
	renderComments(state, instance) {
		const { error } = state
		if (error) {
			const container = document.createElement('ol')
			container.lang = "zh-CN"
			container.className = 'gitment-comments-container comment-list'
			const errorBlock = document.createElement('div')
			errorBlock.className = 'gitment-comments-error'
			if (error.message === 'Comments Not Initialized'
				&& state.user.login
				&& state.user.login.toLowerCase() === instance.owner.toLowerCase()) {
				const initHint = document.createElement('div')
				const initButton = document.createElement('button')
				initButton.className = 'gitment-comments-init-btn'
				initButton.onclick = () => {
					initButton.innerText = '正在初始化中...'
					initButton.setAttribute('disabled', true)
					instance.init()
						.then(() => {
							alert('初始化成功')
						})
						.catch(e => {
							initButton.removeAttribute('disabled')
							alert(e)
						})
				}
				initButton.innerText = '初始化评论系统'
				initHint.appendChild(initButton)
				errorBlock.appendChild(initHint)
			} else {
				errorBlock.innerText = error
			}
			container.appendChild(errorBlock)
			return container
		}

		const container = document.createElement('ol')
		container.lang = "zh-CN"
		container.className = 'gitment-comments-container comment-list'
		const $container = $(container)
		const isLogin = !!state.user.login
		if (state.comments) {
			for(let i = 0; i < state.comments.length; i++) {
				let comment = state.comments[i]
				let commentDate = new Date(comment.created_at)
				let replylink = document.createElement('a')
				replylink.className = 'comment-reply-' + (isLogin ? 'link' : 'login')
				replylink.innerText = isLogin ? '回复' : '登录以回复'
				replylink.onclick = function () {
					goReply(state, comment)
				}
				$container.append(`<li>
														<article class="comment-body">
																<footer class="comment-meta">
																		<div class="comment-author vcard">
																				<img src="${comment.user.avatar_url}" alt="" width="54" height="54">
																				<b class="fn">${comment.user.login}</b>
																				<span class="says">说道：</span>
																		</div>
																		<div class="comment-metadata">
																				<a>
																						<time datetime="${commentDate.toDateString()}">${formatDate(commentDate)}</time>
																				</a>
																		</div>
																</footer>
																<div class="comment-content">
																	${comment.body_html}
																</div>
																<div class="reply"></div>
														</article>
												</li>`)
				$container.last('li').find('.reply').each(function () {
					$(this).append(replylink)
				})
			}
		}

		if (state.meta) {
			const { meta, currentPage } = state
			const pageCount = Math.ceil(meta.comments / instance.perPage)
			if (pageCount > 1) {
				const pagination = document.createElement('nav')
				pagination.className = 'comment-nav clearfix'
				const paginationList = document.createElement('ul')
				paginationList.className = 'pagination pagination-gal pull-right'
				pagination.appendChild(paginationList)

				if (currentPage > 1) {
					const previousButton = document.createElement('li')
					const previousLink = document.createElement('a')
					previousLink.className = 'page-numbers'
					previousLink.innerText = '«'
					previousButton.appendChild(previousLink)
					previousLink.onclick = () => instance.goto(currentPage - 1)
					paginationList.appendChild(previousButton)
				}

				if (currentPage > 7) {
					const first = document.createElement('li')
					const firstLink = document.createElement('a')
					firstLink.className = 'page-numbers'
					firstLink.innerText = '1'
					first.appendChild(firstLink)
					firstLink.onclick = () => instance.goto(1)
					paginationList.appendChild(firstLink)

					const ellipsis = document.createElement('li')
					const ellipsisSpan = document.createElement('span')
					ellipsisSpan.className = 'page-numbers dots'
					ellipsisSpan.innerText = '...'
					ellipsis.appendChild(ellipsis)
					paginationList.appendChild(ellipsis)

					for (let i = currentPage - 3; i < currentPage; i++) {
						const linkButton = document.createElement('li')
						const link = document.createElement('a')
						link.className = 'page-numbers'
						link.innerText = i
						linkButton.appendChild(link)
						link.onclick = () => instance.goto(i)
						paginationList.appendChild(linkButton)
					}

				} else {
					for (let i = 1; i < currentPage; i++) {
						const linkButton = document.createElement('li')
						const link = document.createElement('a')
						link.className = 'page-numbers'
						link.innerText = i
						linkButton.appendChild(link)
						link.onclick = () => instance.goto(i)
						paginationList.appendChild(linkButton)
					}
				}

				const current = document.createElement('li')
				const currentSpan = document.createElement('span')
				currentSpan.className = 'page-numbers current'
				currentSpan.innerText = currentPage
				current.appendChild(currentSpan)
				paginationList.appendChild(current)

				if (currentPage + 7 < pageCount) {
					for (let i = currentPage + 1; i <= currentPage + 3; i++) {
						const linkButton = document.createElement('li')
						const link = document.createElement('a')
						link.className = 'page-numbers'
						link.innerText = i
						linkButton.appendChild(link)
						link.onclick = () => instance.goto(i)
						paginationList.appendChild(linkButton)
					}
					const ellipsis = document.createElement('li')
					const ellipsisSpan = document.createElement('span')
					ellipsisSpan.className = 'page-numbers dots'
					ellipsisSpan.innerText = '...'
					ellipsis.appendChild(ellipsis)
					paginationList.appendChild(ellipsis)
				} else {
					for (let i = currentPage + 1; i <= pageCount; i++) {
						const linkButton = document.createElement('li')
						const link = document.createElement('a')
						link.className = 'page-numbers'
						link.innerText = i
						linkButton.appendChild(link)
						link.onclick = () => instance.goto(i)
						paginationList.appendChild(linkButton)
					}
				}

				if (currentPage < pageCount) {
					const nextButton = document.createElement('li')
					const nextLink = document.createElement('a')
					nextLink.className = 'page-numbers'
					nextLink.innerText = '»'
					nextButton.appendChild(nextLink)
					nextLink.onclick = () => instance.goto(currentPage + 1)
					paginationList.appendChild(nextButton)
				}

				container.appendChild(pagination)
			}
		}

		return container
	},
	// 版权问题, 这个东西还是加上比较好
	renderEditor(state, instance) {
		const container = document.createElement('div')
		const $container = $(container)
		container.lang = "zh-CN"
		container.className = 'gitment-editor-container'
		$container.append('<h3 class="comment-reply-title"><i class="fa fa-pencil"></i> 欢迎留言</h3>')
		if (state.user.login) {
			const smilelink = document.createElement('div')
			const $smilelink = $(smilelink)
			smilelink.id = 'smilelink'
			for(var k = 1; k <= 25; k++) {
				const emoji = document.createElement('img')
				const $emoji = $(emoji)
				$emoji.attr('src', '/imgs/smilies/' + k + '.png')
				$emoji.on('click', (function (index) {
					return function () {
						addEmoji(index)
					}
				})(k))
				$smilelink.append($emoji)
			}

			$container.append($smilelink)

			const logoutContainer = document.createElement('div')
			const $logoutContainer = $(logoutContainer)
			logoutContainer.className = 'pull-right'
			logoutContainer.style.display = 'inline-block'
			const logoutLink = document.createElement('a')
			logoutLink.innerText = '退出登录'
			logoutLink.onclick = () => instance.logout()
			logoutContainer.appendChild(logoutLink)
			$container.append($logoutContainer)

			$container.append(`<div class="gitment-editor-write-field">
													<textarea id="comment" placeholder="赶快发表你的见解吧！" cols="45" rows="7"></textarea>
												 </div>`)
			$container.append(`<p class="form-submit">
													<a class="gitment-editor-submit">发表评论</a>
												 </p>`)

			const submitButton = container.querySelector('.gitment-editor-submit')
			const writeField = container.querySelector('.gitment-editor-write-field')
			const textarea = writeField.querySelector('textarea')

			submitButton.onclick = function () {
				if(!submitButton.hasAttribute('disabled')) {
					submitButton.innerText = '正在提交评论中...'
					submitButton.setAttribute('disabled', true)
					instance.post(textarea.value.trim())
						.then(data => {
							textarea.value = ''
							submitButton.removeAttribute('disabled')
							submitButton.innerText = '发表评论'
						})
						.catch(error => {
							console.log(error)
							submitButton.removeAttribute('disabled')
							submitButton.innerText = '发表评论'
						})
				}
			}

		} else {
			$container.append(`<p class="must-log-in">
													要发表评论，您必须先
													<a href="${loginLink()}">登录</a>
													。
												 </p>`)
		}
		return container
	},
	renderFooter(state, instance) {
		const container = document.createElement('div')
		container.lang = "zh-CN"
		container.className = 'gitment-footer-container'
		const $container = $(container)
		$container.append('Powered by <a href="https://github.com/imsun/gitment" target="_blank">Gitment</a>')
		return container
	},
	// 编辑的模板
	renderRespond(state, instance) {
		const container = document.createElement('div')
		container.lang = "zh-CN"
		container.className = 'gitment-container gitment-response-container'
		return container
	}
}

var gitment = new Gitment({
	owner: window.commentConfig.owner,
	repo: window.commentConfig.repo,
	oauth: {
		client_id: window.commentConfig.client_id,
		client_secret: window.commentConfig.client_secret
	},
	perPage: 10,
	theme: galTheme
})

gitment.render('comments-template')

function formatDate(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
	var day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
	var timeZone
	if(date.getHours() === 12) {
		timeZone = '中午'
	} else if(date.getHours() > 12) {
		timeZone = '下午'
	} else {
		timeZone = '上午'
	}
	var minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
	return year + '年' + month + '月' + day + '日 ' + timeZone + date.getHours() + ':' + minutes
}

// goLoginLink
function loginLink() {
	const oauthUri = 'https://github.com/login/oauth/authorize?scope=public_repo'
	const redirect_uri = window.commentConfig.redirect_uri || window.location.href
	const client_id = window.commentConfig.client_id
	const client_secret = window.commentConfig.client_secret
	return oauthUri + '&redirect_uri=' + redirect_uri + '&client_id=' + client_id + '&client_secret=' + client_secret
}

// 添加表情字符串
function addEmoji(index) {
	var myField
	var myCommentTextarea = "comment"
	index = '![:' + (index >= 10 ? '0' + index : '00' + index) + ':](' + window.location.origin + '/imgs/smilies/' + index + '.png)'
	if (document.getElementById(myCommentTextarea) && document.getElementById(myCommentTextarea).type === 'textarea') {
		myField = document.getElementById(myCommentTextarea)
	} else {
		return false
	}
	if (document.selection) {
		myField.focus()
		var sel = document.selection.createRange()
		sel.text = index
		myField.focus()
	} else if (myField.selectionStart || myField.selectionStart === '0') {
		var startPos = myField.selectionStart
		var endPos = myField.selectionEnd
		var cursorPos = endPos
		myField.value = myField.value.substring(0, startPos) + index + myField.value.substring(endPos, myField.value.length)
		cursorPos += index.length
		myField.focus()
		myField.selectionStart = cursorPos
		myField.selectionEnd = cursorPos
	} else {
		myField.value += index
		myField.focus()
	}
}

function goReply(state, comment) {
	if(!state.user.login) {
		window.location.href = loginLink()
	} else {
		var myField = document.getElementById('comment')
		var text = '[@' + comment.user.login + '](https://github.com/' + comment.user.login + ')'
		myField.value = text + myField.value.substring(0, myField.value.length)
		myField.focus()
		myField.selectionStart += text.length
		myField.selectionEnd += text.length
	}
}
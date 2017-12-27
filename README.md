# hexo-theme-gal

# 前言

当我刚刚成为一名gal的萌新时, 忧郁的弟弟已经结婚了(恭喜弟弟君)

弟弟站点的主题感觉挺好看的, 不过是wordpress的主题, 在弟弟的站点也看出很多人喜欢这个站点

甚至有挺多人在问如何做出这种站点

正好我注册了个新的blog域名, 要重新弄个hexo博客(太久没写过博文了), 而又不想用其他主题, 又听贴吧说弟弟站点好像要关了

于是乎就有了这次的hexo移植版

还原度不说100%(也不可能), 也有90%了(毕竟hexo跟wordpress是两个不同的东西)

下面的**配置说明**一定要先做好, 因为包含了主题的依赖(反正很重要就是了)

主题示例博客[sora3.coding.me](http://sora3.coding.me)

我的blog[myau.moe](http://myau.moe)

PS: 第一次加载可能会慢一些, 毕竟图片还是挺多的, 而且有好几个是几百k的, 不过你可以用你自己的图片(迟些搞个资源图片指向cdn空间的把, 虽然那样第一次还是会慢的)
再PS: slide下面我放的六张图片总大小为478 + 104 + 192 + 209 + 356 + 376 = 1.7mb, 迟些我看看能不能用懒加载搞定 
    
# 更新 2017.12.27

进度:

    - 评论系统集成配置[]
    - 404页面[]
    - 文章代码采用SyntaxHighlighter高亮[]
    - 文章样式[x]
    - 文章顶部标签[x]
    - 文章统计[x]
    - 侧边栏
        - 搜索功能[x]
        - 个人简介[x]
        - 最热文章[x]
        - 最新文章[x]
        - 随机文章[x]
        - 最新评论[]
        - 热门标签, 友情链接, 个人链接[x]
    - 背景图特效[x]
    - 滚动条样式[x]    
    - 欧尼酱功能[x]
    - 标签集合[x]
    - 目录集合[x]
    - 归档[x]
    - 标签页[x]
    - 目录页[x]
    
# 配置说明

    git clone https://github.com/ZEROKISEKI/hexo-theme-gal.git themes/gal
    
    or 
    
    git clone https://github.com/ZEROKISEKI/hexo-theme-gal.git themes/gal --depth 1

## 使用该主题前要安装的东西:

    更改主题为: gal

    在你的hexo站点目录(非主题目录)下安装 hexo-renderer-sass 和 hexo-renderer-scss
    
    npm install hexo-renderer-sass --save 
    
    npm install hexo-renderer-scss --save
    
    or 
    
    cnpm install hexo-renderer-sass --save
    
    cnpm install hexo-renderer-scss --save
    
    or 
    
    yarn add hexo-renderer-sass(推荐)
    
    yarn add hexo-renderer-scss(推荐)
    
    
    上面的一步是将.scss样式文件渲染成最后的style.css文件
    
    然后, 在你的hexo站点目录下安装 hexo-generator-json-content
    
    npm install hexo-generator-json-content --save
    
    or 
    
    cnpm install hexo-generator-json-content --save
    
    如果后面你hexo g的时候有问题, 注意看看是不是这个json-content的问题, 如果是的话就是你的node比较老
    
    接着在hexo站点目录的_config.yml下进行配置:
    
    jsonContent:
      dateFormat: MM-DD
      pages:
        title: true
        text: true
        path: true
        date: true
        excerpt: true
        preview: true
      posts:
        title: true
        text: true
        path: true
        date: true
        excerpt: true
        preview: true
    
    接着, 进行下面的步骤:
    
    hexo new page "search"              // 搜索功能的必须步骤
    hexo new page "404"                 // 开启404页面
    
    至于tags和categories页面的设置, 百度或google就有对应的方法了, 这里就不多说了
    
    对了, hexo站点目录的_config.yml的title, description, author和url要自己正确配置
    
    下面进行主题的_config.yml配置的说明, 其实在_config.yml已经有大量的注释说明了。。。
    所以具体主题的配置请看_config.yml注释

## 使用建议:

    1. 建议每一篇文章都要在front-matter设置preview图片地址, 这个地址是url地址(本地的也要写完整的url)
    2. 每一篇文章的excerpt部分(即<!--more-->之前的部分)是纯文本而不要是markdown
    3. 作为背景用的图片大小都应该差不多, 比如示例用的几张背景图片都是1920 * 1080那样的

# 吐槽 && 痛点:

hexo只能采用第三方的评论系统, 目前只采用了gitment这个评论系统, 并且自定义了样式, 暂不考虑其他评论系统了(disqus如果没有fq根本看不了)

挺多hexo主题的搜索功能是直接链接到搜索引擎的site或者出现搜索框ajax出现搜索内容, 主题的搜索功能为了尽可能达到完全一致, 采用的方法并不是很妥当(用了带url参数的方式), 不过静态博客系统应该问题不大(也没什么可以打):grin:

原主题采用了shortcode(短代码), 比如说`[warning]blablabla[/waring]`是对应解析成警告框的, 这点在hexo上可以实现, 但是这样就要求hexo用户也知道对应的规则, 不是很好, 所以在文章的markdown解析样式上是参照了其他一些主题的样式, 这点我无法做到完全的还原:disappointed:, 如果有人可以的话, 也可以做一下这个功能, 不过要对zanblog的解析规则了解才好

侧边栏标签云那里的字体随机大小, wordpress 直接有个方法`change_tag_cloud_font_sizes()`, 直接设定最大最小就行了, 每次刷新页面都是固定的值, 我用hexo取随机值每次都会变大小, 这点以后再改好些吧

在部分js文件中使用了\`....${}....\`的语法, 可能有些浏览器不兼容

反正近期有空的话就继续做





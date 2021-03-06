// 设置项目属性
fis.set('project.name', '12348-advice');
fis.set('project.static', '/static');
fis.set('project.files', ['*.html', 'map.json', '/test/*']);

// 引入模块化开发插件，设置规范为 commonJs 规范。

fis.hook('commonjs', {
    baseUrl: './modules',
    extList: ['.js', '.jsx', '.es', '.ts', '.tsx']
});

/*************************目录规范*****************************/

// 开启同名依赖
fis.match('/{node_modules, modules}/**', {
    isMod: true,
    useSameNameRequire: true
});

fis.match('*.html', {
  parser: fis.plugin('html-uri')
});



// ------ 配置lib
fis.match('/lib/**.js', {
    release: '${project.static}/$&'
});


// ------ 配置components
fis.match('/node_modules/**', {
    release: '${project.static}/$&'
});
fis.match('/node_modules/**.css', {
    isMod: true,
    release: '${project.static}/$&'
});
fis.match('/node_modules/**.js', {
    release: '${project.static}/$&'
});


// ------ 配置modules
fis.match('/modules/(**)', {
    release: '${project.static}/$1'
});

// 配置css
fis.match(/^\/modules\/(.*\.scss)$/i, {
    parser: fis.plugin('node-sass', {
        include_paths: ['modules/css', 'node_modules'] // 加入文件查找目录
    }),
    rExt: '.css',
    isMod: true,
    release: '${project.static}/$1',
    postprocessor: fis.plugin('autoprefixer')
});
fis.match(/^\/modules\/(.*\.css)$/i, {
    isMod: true,
    release: '${project.static}/$1'
});
fis.match(/^\/modules\/(.*\.(?:png|jpg|gif))$/i, {
    release: '${project.static}/$1'
});

// 配置js
fis.match(/^\/modules\/(.*\.es)$/i, {
    parser: fis.plugin('babel-5.x'),
    rExt: 'js',
    isMod: true,
    release: '${project.static}/$1'
});
fis.match(/^\/modules\/(.*\.js)$/i, {
    isMod: true,
    release: '${project.static}/$1'
});


/*************************打包规范*****************************/

// 因为是纯前段项目，依赖不能自动被加载进来，所以这里需要借助一个 loader 来完成，
// 注意：与后端结合的项目不需要此插件!!!
fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    })
});

// 禁用components
fis.unhook('components');
fis.hook('node_modules');


// 公用js
var map = {
  'prod': {
    host: '',
    path: '/prototype/${project.name}'
  }
};

fis.util.map(map, function (k, v) {
  var domain = v.host + v.path;

  fis.media(k)
  .match('**.{es,js}', {
      useHash: true,
      domain: domain
  })
  .match('**.{scss,css}', {
      useSprite: true,
      useHash: true,
      domain: domain
  })
  .match('::image', {
      useHash: true,
      domain: domain
  })
  .match('**/(*_{x,y,z}.png)', {
      release: '/pkg/$1'
  })
  // 启用打包插件，必须匹配 ::package
  .match('::package', {
      spriter: fis.plugin('csssprites', {
          layout: 'matrix',
          // scale: 0.5, // 移动端二倍图用
          margin: '10'
      }),
      postpackager: fis.plugin('loader', {
          allInOne: true,
      })
  })
  .match('/lib/es5-{shim,sham}.js', {
      packTo: '/pkg/es5-shim.js'
  })
  .match('/node_modules/**.css', {
      packTo: '/pkg/components.css'
  })
  .match('/node_modules/**.js', {
      packTo: '/pkg/components.js'
  })
  .match('/modules/**.{scss,css}', {
      packTo: '/pkg/modules.css'
  })
  .match('/modules/css/advice.scss', {
      packTo: '/pkg/advice.css'
  })
  .match('/modules/**.{es,js}', {
      packTo: '/pkg/modules.js'
  })
  .match('/modules/css/common.scss', {
      packTo: '/pkg/common.css'
  })
  .match('/modules/app/**.{es,js}', {
      packTo: '/pkg/aio.js'
  })
});

// 发布产品库
fis.media('prod')
.match('**.{es,js}', {
    optimizer: fis.plugin('uglify-js',{
      
    }),
    useHash: false
})
.match('*.min.js', {
  optimizer: null
})
.match('app.js',{
  optimizer: null
})
.match('::image', {
    useHash: false
})
.match('**.{scss,css}', {
    optimizer: fis.plugin('clean-css', {
        'keepBreaks': true //保持一个规则一个换行
    }),
    relative: true,
    useHash: false
});

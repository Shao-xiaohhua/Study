require('framework7/dist/js/framework7');
var $$ = Dom7;
var myApp;
var framework = {
  init: function(e) {
    if (myApp) {
      return myApp;
    } else {
      return new Framework7(e);
    }
  }
};
var set = {
  init: function() {
    myApp = framework.init({
      pushState: true,
    });
    // Add view
    var mainView = myApp.addView('.view-main', {
      // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    animatePages:true,
    swipeBackPageAnimateOpacity:false
    });
    var e = $$('.toolbar .toolbar-item');
    var iconFull = ['icon-interactive_fill', 'icon-star_fill', 'icon-group_fill', 'icon-people_fill'],
      iconEmpty = [ 'icon-interactive', 'icon-star', 'icon-group', 'icon-people'];
    e.each(function(i) {
      e.eq(i).touchstart(function() {
        var els = e.parent().find('i');
        for (var j = 0; j < els.length; j++) {
          $$(els[j]).removeClass(iconFull[j]).addClass(iconEmpty[j]);
        }
        e.removeClass('active');
        $$(this).addClass('active').find('i').removeClass(iconEmpty[i]).addClass(iconFull[i]);
      })
    });

  myApp.onPageInit('home', function(page) {
    var num = 10;
    var t;
    $$('.theLabel.phone').find('.head').on('click', function () {
        t = setInterval(function () {
        num --;
        $$('.theLabel.phone').find('.head').css({color: '#808080'});
        $$('.theLabel.phone').find('.head').text( num +'s后重新获取');
        if (num <= 0) {
          num = 10;
          clearInterval(t);
          $$('.theLabel.phone').find('.head').text('获取验证码');
          $$('.theLabel.phone').find('.head').css({color: '#00cc99'});
        }
      }, 1000);
    })
    var mySwiperVertical = myApp.swiper('.swiper-vertical', {
      pagination:'.swiper-vertical .swiper-pagination',
      direction: 'vertical',
      autoplayDisableOnInteraction: false,
      autoplay: 2000
    });
  });

  var consultation = '';
  myApp.onPageInit('consultation', function(page) {
    var len = $$('.consultationBox').find('.cardWarp').length;
    $$('.consultationBox').find('.cardWarp').on('click', function () {
      $$('.consultationBox').find('.cardWarp').removeClass('active');
      $$(this).addClass('active');
      consultation = $$(this).text();
    });
    $$('.btnBox.conee a').on('click', function() {
      if(consultation) {
        $$('.theLabel.cont').find('.head').text(consultation)
      }
    })
    });
  myApp.onPageInit('chatRoom', function(page) {
        var fabn = $$('.chatBox')[0].offsetHeight;
        var fhei = $$(window).height();
        var frohei = $$('.respondent')[0].offsetHeight;
        var fteHie = $$('.textAreaWarp')[0].offsetHeight;
        var headHeight = $$('.opBox')[0].offsetHeight;
        var num = fabn-fhei+frohei+150;
        // $$('.page-content').scrollTop(num);
        var getNumber = 1;
        var o;
        var gitStart = 0;
        var interval = null;
        var interNUme = 0;
        var p = 0, t = 0, swite = true;
        var pp
        var tx;
        var bx;
        var kaiguan = true;
        var aaaSwite = false;

        // ==================================
        var obj = {};
        var a = 0;
        var shenme = '刚进来'
        var mashen = ''
        var initValue = $$('.page-content').scrollTop()
        
        Object.defineProperty(obj,"newKey",{
          get:function (){
            //当获取值的时候触发的函数
            return initValue;
          },
          set:function (value){
            //当设置值的时候触发的函数,设置的新值通过参数value拿到
            if (value > initValue && value >= 50) {
              aaaSwite = true
              shenme = 'up'
              initValue = value
              getNumber -= 0.05
              if (getNumber <= 0) {
                getNumber = 0
              }
            } else if (value < initValue && value <= 150) {
              aaaSwite = true
              shenme = 'down'
              initValue = value
              getNumber += 0.05
              if (getNumber >= 1) {
                getNumber = 1
              }
            }
            if (value === initValue) {
              aaaSwite = false
              if (value <= 100) {
                mashen = 'show'
              } else {
                mashen = 'down'
              }
            }
            initValue = value
            $$('.opBox').find('span').css({opacity: getNumber});
          }
        });
        $$('.page-content').on('scroll', function (e) {
            p = $$(this).scrollTop()
            obj.newKey = p
          });
         $$('page-content').on('touchend', function (e) {
          var number = 0
          if (kaiguan) {
            kaiguan = false
            tx = setInterval(function () {
              if (aaaSwite) {
                if (mashen === 'show') {
                  getNumber = 1
                  console.log('caodayeaaaaa')
                  $$(this).scrollTop(0)
                } else if (mashen === 'down') {
                  getNumber = 0
                }
              } else {
                clearInterval(tx)
              }
            }, 0)
            bx = setInterval(function () {
              var b = $$(this).scrollTop();
              if (b === 0) {
                aaaSwite = false
                kaiguan = true
                getNumber = 1
                $$('.opBox').find('span').css({opacity: getNumber});
                clearInterval(tx);
                clearInterval(bx);
              }
            },10)
          };
         });
         $$(window).on('touchmove', function () {
            aaaSwite = false
            kaiguan = true
            clearInterval(tx);
            clearInterval(bx);
         });
    $$('.que_box').on('keyup', function () {
      if (!$$(this).val()) {
        $$(this).css({height: '.66rem'})
      }
    });
    $$('.que_box').on('blur', function () {
      if (!$$(this).val()) {
        $$(this).css({height: '.66rem'});
      } else {
        // var theLi = $$('<li class="goTo move"><div class="head" style="background-image: url(/static/images/timg.jpg);"></div><div class="content">'+$$(this).val()+'</div></li>');
        // theLi.appendTo('.chatBox');
        // $$(this).val('');
        // $$(this).css({height: '.66rem'});
        // var abn = $$('.chatBox')[0].offsetHeight;
        // var hei = $$(window).height();
        // var rohei = $$('.respondent')[0].offsetHeight;
        // var teHie = $$('.textAreaWarp')[0].offsetHeight;
        // var num = abn-hei+rohei+150;
        // $$('.page-content').scrollTop(num);
      }
    });

    $$('.sendOut').on('click', function () {
      if (!$$('.que_box').val()) {
        $$('.que_box').css({height: '.66rem'});
      } else {
        var theLi = $$('<li class="goTo move"><div class="head" style="background-image: url(/static/images/timg.jpg);"></div><div class="content">'+$$('.que_box').val()+'</div></li>');
        theLi.appendTo('.chatBox');
        $$('.que_box').val('');
        $$('.que_box').css({height: '.66rem'});
        var abn = $$('.chatBox')[0].offsetHeight;
        var hei = $$(window).height();
        var rohei = $$('.respondent')[0].offsetHeight;
        var teHie = $$('.textAreaWarp')[0].offsetHeight;
        var num = abn-hei+rohei+150;
        $$('.page-content').scrollTop(num);
      }
    });

    $$('.respondent .footBox').on('click', function () {
      $$('.evaluate').css({display: 'block'});
      $$('.textAreaWarp').css({display: 'none'});
      $$('.haveBusy').css({display: 'none'});
      $$('.textClose').css({display: 'block'});
        var abn = $$('.chatBox')[0].offsetHeight;
        var hei = $$(window).height();
        var heiEv = $$('.evaluate')[0].offsetHeight;
        var rohei = $$('.respondent')[0].offsetHeight;
        var teHie = $$('.textAreaWarp')[0].offsetHeight;
        var num = abn-hei+heiEv+rohei+150;
        $$('.page-content').scrollTop(num);
    });

    $$('.theStar').find('.ballBox').on('touchend', function () {
      var tex = $$(this).find('.cont').text();
      var len = $$('.theStar').find('.ballBox').length;
      var ind = $$(this).index();
      if (ind === 0) {
        $$('.theStar').removeClass('DissFeid').removeClass('Feid').removeClass('VeryFeid');
        $$('.theStar').addClass('DissFeid');
      } else if (ind === 1) {
        $$('.theStar').removeClass('DissFeid');
        $$('.theStar').removeClass('VeryFeid');
        $$('.theStar').addClass('Feid');
      } else if (ind === 2) {
        $$('.theStar').removeClass('DissFeid');
        $$('.theStar').removeClass('Feid');
        $$('.theStar').addClass('VeryFeid');
      }
    });

  });
  }
};

exports.set = set;
exports.framework = framework;
// exports.chart = chart;
(function(window){

  var $window = $(window);

  function init(){

    breakpoint();

    if(window.breakpoint != 'mobile'){
      barbaInit();
    }

    $('.main-nav a.back-home').on('click',function(e){
      $(this).parent().toggleClass('active');
      e.preventDefault();
      e.stopPropagation();
    });
  }

  function barbaInit(){

    var lastElementClicked,
        oldElementClicked;

    Barba.Dispatcher.on('linkClicked', function(el) {
      lastElementClicked = el;
    });

    Barba.Dispatcher.on('transitionCompleted', function(currentStatus,prevStatus) {
      oldElementClicked = lastElementClicked;
    });


    // Used for pages on the same side. Leftcol fade to leftcol or rightcol to rightcol
    var verticalTransition = Barba.BaseTransition.extend({
      start: function() {
        // As soon the loading is finished and the old page is faded out, let's fade the new page
        Promise
          .all([this.newContainerLoading])
          .then(this.moveVertical.bind(this));
      },

      moveVertical: function() {
        var _this = this;
        var $el = $(this.newContainer);
        var isLeft = (Barba.HistoryManager.prevStatus().namespace == 'leftcol' ? true : false);

        $el.css({
          visibility : 'visible',
          opacity : 1,
          top: "100%",
          right: isLeft ? "auto" : 0,
          left: isLeft ? 0 : "auto"
        });

        var moveUpAnim = new TimelineMax({onComplete: function(){
          return _this.done();
        }});

        moveUpAnim
          .to($(this.oldContainer), 1, {top:'-100%',ease: Power4.easeInOut},'open')
          .to($(this.newContainer), 1, {top:'0',ease: Power4.easeInOut},'open');
      },

      valid: function() {
        var prev = Barba.HistoryManager.prevStatus().namespace;
        var isRightSide = $(lastElementClicked).parents('nav').hasClass('right-nav');
        var isHome = $(lastElementClicked).hasClass('back-home');
        var next = (isRightSide ? "rightcol" : "leftcol");
            next = (isHome ? "home" : next);

        if((prev === 'leftcol' && next === 'leftcol') || (prev === 'rightcol' && next === 'rightcol')){
          return true
          // console.log(prev.namespace + ' to ' + next + " fadeIn");
        } else {
          return false
        }
      }
    });

    var columnTransitionLeft = Barba.BaseTransition.extend({
      start: function() {
        var open = (this.oldContainer.dataset.namespace == "home" ? true : false);

        if(open){
          Promise
            .all([this.newContainerLoading])
            .then(this.openBox.bind(this));
        } else {
          Promise
            .all([this.newContainerLoading])
            .then(this.closeBox.bind(this));
        }
      },

      openBox: function() {
        var _this = this;
        var $el = $(this.newContainer);

        $el.css({
          visibility : 'visible',
          opacity : 1,
          left: '0',
          right: 'auto',
          marginLeft: "-100%"
        });

        var leftcolanim = new TimelineMax({onComplete: function(){
          return _this.done();
        }});

        leftcolanim
          .to($('.left-nav'), 1, {left:'400',ease: Power4.easeInOut},'open')
          .to($(this.newContainer), 1, {marginLeft:'0',ease: Power4.easeInOut},'open');
      },

      closeBox: function() {
        var _this = this;
        var leftcolanim = new TimelineMax({onComplete: function(){
          return _this.done();
        }});

        leftcolanim
          .to($('.left-nav'), 1, {left:'0',ease: Power4.easeInOut},'close')
          .to($(this.oldContainer), 1, {marginLeft:'-100%',ease: Power4.easeInOut},'close');
      },

      valid: function() {
        var prev = Barba.HistoryManager.prevStatus();
        var isBackButton = (lastElementClicked == oldElementClicked ? true : false);
        var isRightSide = $(lastElementClicked).parents('nav').hasClass('right-nav');
        var isHome = $(lastElementClicked).hasClass('back-home');
            isHome = (isBackButton ? isBackButton : isHome);
        var next = (isRightSide ? "rightcol" : "leftcol");
            next = (isHome ? "home" : next);

        if((prev.namespace === 'home' && next === 'leftcol') || (prev.namespace === 'leftcol' && next === 'home')){
          // console.log(prev.namespace + ' to ' + next + " move left");
          return true
        } else {
          return false
        }
      }
    });

    var columnTransition = Barba.BaseTransition.extend({
      start: function() {
        var open = (this.oldContainer.dataset.namespace == "home" ? true : false);

        if(open){
          Promise
            .all([this.newContainerLoading])
            .then(this.openBox.bind(this));
        } else {
          Promise
            .all([this.newContainerLoading])
            .then(this.closeBox.bind(this));
        }
      },

      openBox: function() {
        var _this = this;
        var $el = $(this.newContainer);
        var isLeftSide = $(lastElementClicked).parents('nav').hasClass('left-nav');
        console.log(Barba.HistoryManager.prevStatus());
        var $nav = (isLeftSide ? $('.right-nav') : $('.left-nav'));

        $nav.css({
          zIndex : '-110'
        });

        $el.css({
          visibility : 'visible',
          opacity : 1,
          left: (isLeftSide ? '0' : 'auto'),
          right: (isLeftSide ? 'auto' : '0'),
          transform: (isLeftSide ? 'translateX(-100%)' : 'translateX(100%)')
        });

        var openColumnAnimation = new TimelineMax({onComplete: function(){
          return _this.done();
        }});

        openColumnAnimation
          .to('.fullscreen-bg', 1, {opacity:'0.3',ease: Power4.easeInOut},'open')
          .to($(this.newContainer), 1, {x:'0',ease: Power4.easeInOut},'open');

      },

      closeBox: function() {
        var _this = this;
        var isLeftSide = (Barba.HistoryManager.prevStatus().namespace == 'leftcol' ? true : false);
        var $nav = (isLeftSide ? $('.right-nav') : $('.left-nav'));

        $nav.css({
          zIndex : ''
        });

        var closeColumnAnimation = new TimelineMax({onComplete: function(){
          return _this.done();
        }});

        var hideColumnValue = (isLeftSide ? '-100%' : '100%');

        closeColumnAnimation
          .to('.fullscreen-bg', 1, {opacity:'1',ease: Power4.easeInOut},'close')
          .to($(this.oldContainer), 1, {x:hideColumnValue,ease: Power4.easeInOut},'close');

      },

      valid: function() {
        var prev = Barba.HistoryManager.prevStatus();

        if(prev.namespace === 'home' || prev.namespace === 'leftcol' || prev.namespace === 'rightcol'){
          return true
        } else {
          return false
        }
      }
    });

    var columnTransitionSideToSide = Barba.BaseTransition.extend({
      start: function() {
        Promise
          .all([this.newContainerLoading])
          .then(this.openCloseBox.bind(this));
      },

      openCloseBox: function() {
        var _this = this;
        var $elNew = $(this.newContainer);
        var $elOld = $(this.oldContainer);
        var leftToRight = (this.oldContainer.dataset.namespace == "leftcol" ? true : false);

        if(leftToRight){
          $elOld.css({
            visibility : 'visible',
            opacity : 1,
            left: '0',
            right: 'auto',
            marginLeft: "0%"
          });

          $elNew.css({
            visibility : 'visible',
            opacity : 1,
            left: 'auto',
            right: '0',
            marginRight: "-100%"
          });

          var leftToRightanim = new TimelineMax({onComplete: function(){
            return _this.done();
          }});

          leftToRightanim
            .to($(this.oldContainer), 1, {marginLeft:'-100%',ease: Power4.easeInOut},'open')
            .to($('.left-nav'), 1, {left:'0',ease: Power4.easeInOut},'open')
            .to($('.right-nav'), 1, {right:'400px',ease: Power4.easeInOut},'open+=0.1')
            .to($(this.newContainer), 1, {marginRight:'0%',ease: Power4.easeInOut},'open+=0.1');

        } else {
          $elOld.css({
            visibility : 'visible',
            opacity : 1,
            right: '0',
            left: 'auto',
            marginRight: "0%"
          });

          $elNew.css({
            visibility : 'visible',
            opacity : 1,
            left: '0',
            right: 'auto',
            marginLeft: "-100%"
          });

          var rightToLeftanim = new TimelineMax({onComplete: function(){
            return _this.done();
          }});

          rightToLeftanim
            .to($(this.oldContainer), 1, {marginRight:'-100%',ease: Power4.easeInOut},'open')
            .to($('.right-nav'), 1, {right:'0',ease: Power4.easeInOut},'open')
            .to($('.left-nav'), 1, {left:'400px',ease: Power4.easeInOut},'open+=0.1')
            .to($(this.newContainer), 1, {marginLeft:'0%',ease: Power4.easeInOut},'open+=0.1');
        }
      },

      valid: function() {
        var prev = Barba.HistoryManager.prevStatus();
        var isLeftSide = $(lastElementClicked).parents('nav').hasClass('left-nav');
        var isHome = $(lastElementClicked).hasClass('back-home');
        var next = (isLeftSide ? "leftcol" : "rightcol");
            next = (isHome ? "home" : next);

        if((prev.namespace === 'leftcol' && next === 'rightcol') || (prev.namespace === 'rightcol' && next === 'leftcol')){
          // console.log(prev.namespace + ' to ' + next + " move side to side");
          return true
        } else {
          return false
        }
      }
    });


    Barba.Pjax.getTransition = function() {

      if (columnTransition.valid()) {
        return columnTransition;
      }

      console.log("else");
    };

    var Leftcol = Barba.BaseView.extend({
      namespace: 'leftcol',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--leftcol');
        $('.fullscreen-bg').on('click',function(){
          window.history.back();
        });
      }
    });

    var Rightcol = Barba.BaseView.extend({
      namespace: 'rightcol',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--rightcol');
        $('.fullscreen-bg').on('click',function(){
          window.history.back();
        });
      }
    });

    var Home = Barba.BaseView.extend({
      namespace: 'home',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--home');
        $('.fullscreen-bg').unbind( "click" );
      }
    });


    // Don't forget to init the view!
    Leftcol.init();
    Rightcol.init();
    Home.init();
    Barba.Prefetch.init();
    Barba.Pjax.init();
  }

  function breakpoint() {
    var breakpoint;
    var breakpoint_refreshValue;
    breakpoint_refreshValue = function () {
      window.breakpoint = window.getComputedStyle(document.querySelector('html'), ':before').getPropertyValue('content').replace(/\"/g, '');
    };

    $(window).resize(function () {
      breakpoint_refreshValue();
    }).resize();
  }

  window.Application = {
    init: init
  }

}(window))  // Self execute

Application.init();

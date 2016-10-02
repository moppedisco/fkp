(function(window){

  var $window = $(window);

  function init(){

    breakpoint();

    if(window.breakpoint != 'mobile'){
      barbaInit();
    }

    // var menuAnimLeft = new TimelineMax({paused: true, reversed: true});
    // var menuAnimRight = new TimelineMax({paused: true, reversed: true});
    // menuAnimLeft.staggerFrom($('.left-nav li'), 0.5, {y:'-3px', autoAlpha:'0',ease: Power4.easeOut},'0.1');
    // menuAnimRight.staggerFrom($('.right-nav li'), 0.5, {y:'-3px', autoAlpha:'0',ease: Power4.easeOut},'0.1');

    $('.main-nav a.back-home').on('click',function(e){

      // $(this).parents('.main-nav').removeClass('active');
      $(this).parent().toggleClass('active');

      // if($(this).parent().hasClass('left-nav')){
      //   menuAnimLeft.reversed() ? menuAnimLeft.play() : menuAnimLeft.reverse();
      //   menuAnimRight.reversed() ? menuAnimRight.pause(0) : menuAnimRight.reverse();
      // } else {
      //   menuAnimRight.reversed() ? menuAnimRight.play() : menuAnimRight.reverse();
      //   menuAnimLeft.reversed() ? menuAnimLeft.pause(0) : menuAnimLeft.reverse();
      // }

      $(".main-nav li").removeClass('active');

      if(this.href === window.location.href) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Prevent same link == same url reload
    $('.main-nav ul a').on('click',function(e){
      $(".main-nav li").removeClass('active');
      $(this).parent().toggleClass('active');
      if(this.href === window.location.href) {
        e.preventDefault();
        e.stopPropagation();
      }
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
        var isBackButton = (lastElementClicked == oldElementClicked ? true : false);
        console.log(isBackButton);
        var isRightSide = $(lastElementClicked).parents('nav').hasClass('right-nav');
        var isHome = $(lastElementClicked).hasClass('back-home');
            isHome = (isBackButton ? isBackButton : isHome);
            console.log(lastElementClicked);
        var next = (isRightSide ? "rightcol" : "leftcol");
            next = (isHome ? "home" : next);

        console.log(prev);
        console.log(next);

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

    var columnTransitionRight = Barba.BaseTransition.extend({
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
          left: 'auto',
          right: '0',
          marginRight: "-100%"
        });

        var rightcolanim = new TimelineMax({onComplete: function(){
          return _this.done();
        }});

        rightcolanim
          .to($('.right-nav'), 1, {right:'400',ease: Power4.easeInOut},'open')
          .to($(this.newContainer), 1, {marginRight:'0',ease: Power4.easeInOut},'open');

      },

      closeBox: function() {
        var _this = this;
        var rightcolanim = new TimelineMax({onComplete: function(){
          return _this.done();
        }});

        rightcolanim
          .to($('.right-nav'), 1, {right:'0',ease: Power4.easeInOut},'close')
          .to($(this.oldContainer), 1, {marginRight:'-100%',ease: Power4.easeInOut},'close');

      },

      valid: function() {
        var prev = Barba.HistoryManager.prevStatus();
        var isLeftSide = $(lastElementClicked).parents('nav').hasClass('left-nav');
        var isHome = $(lastElementClicked).hasClass('back-home');
        var next = (isLeftSide ? "leftcol" : "rightcol");
            next = (isHome ? "home" : next);

        if((prev.namespace === 'home' && next === 'rightcol') || (prev.namespace === 'rightcol' && next === 'home')){
          // console.log(prev.namespace + ' to ' + next + " move right");
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

      if (verticalTransition.valid()) {
        console.log('vert');
        return verticalTransition;
      }

      if (columnTransitionLeft.valid()) {
        console.log('left');
        return columnTransitionLeft;
      }

      if (columnTransitionRight.valid()) {
        console.log('right');
        return columnTransitionRight;
      }

      if (columnTransitionSideToSide.valid()) {
        console.log('side');
        return columnTransitionSideToSide;
      }
      console.log("else");
    };

    var Leftcol = Barba.BaseView.extend({
      namespace: 'leftcol',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--leftcol');
      }
    });

    var Rightcol = Barba.BaseView.extend({
      namespace: 'rightcol',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--rightcol');
      }
    });

    // Don't forget to init the view!
    Leftcol.init();
    Rightcol.init();
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

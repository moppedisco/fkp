(function(window){

  var $window = $(window);

  function init(){

    breakpoint();

    if(window.breakpoint != 'mobile'){
      barbaInit();
      console.log('everywhere except mobile')
    } else {
      console.log('no barba');
    }

    // Prevent same link == same url reload
    $('.main-nav a').on('click',function(e){
      $(".main-nav li").removeClass('active');
      $(this).parent().addClass('active');
      if(this.href === window.location.href) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  function barbaInit(){

    var lastElementClicked;

    Barba.Dispatcher.on('linkClicked', function(el) {
      lastElementClicked = el;
    });

    // Used for pages on the same side. Leftcol fade to leftcol or rightcol to rightcol
    var FadeTransition = Barba.BaseTransition.extend({
      start: function() {
        // As soon the loading is finished and the old page is faded out, let's fade the new page
        Promise
          .all([this.newContainerLoading])
          .then(this.fadeIn.bind(this));
      },

      fadeOut: function() {
        return $(this.oldContainer).animate({ opacity: 0 }).promise();
      },

      fadeIn: function() {
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
        var prev = Barba.HistoryManager.prevStatus();
        var isRightSide = $(lastElementClicked).parents('nav').hasClass('right-nav');
        var isHome = $(lastElementClicked).parent().index();
        var next = (isRightSide ? "rightcol" : "leftcol");
            next = (isHome == 0 ? "home" : next);

        if((prev.namespace === 'leftcol' && next === 'leftcol') || prev.namespace === 'rightcol' && next === 'rightcol'){
          return true
          console.log(prev.namespace + ' to ' + next + " fadeIn");
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
        var isRightSide = $(lastElementClicked).parents('nav').hasClass('right-nav');
        var isHome = $(lastElementClicked).parent().index();
        var next = (isRightSide ? "rightcol" : "leftcol");
            next = (isHome == 0 ? "home" : next);

        if((prev.namespace === 'home' && next === 'leftcol') || (prev.namespace === 'leftcol' && next === 'home')){
          console.log(prev.namespace + ' to ' + next + " move left");
          return true
        // } else if((prev.namespace === 'home' && next === 'rightcol') || (prev.namespace === 'rightcol' && next === 'home')){
        //   return true
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
        var isHome = $(lastElementClicked).parent().index();
        var next = (isLeftSide ? "leftcol" : "rightcol");
            next = (isHome == 0 ? "home" : next);

        if((prev.namespace === 'home' && next === 'rightcol') || (prev.namespace === 'rightcol' && next === 'home')){
          console.log(prev.namespace + ' to ' + next + " move right");
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
        var isHome = $(lastElementClicked).parent().index();
        var next = (isLeftSide ? "leftcol" : "rightcol");
            next = (isHome == 0 ? "home" : next);

        if((prev.namespace === 'leftcol' && next === 'rightcol') || (prev.namespace === 'rightcol' && next === 'leftcol')){
          console.log(prev.namespace + ' to ' + next + " move side to side");
          return true
        } else {
          return false
        }
      }
    });


    Barba.Pjax.getTransition = function() {

      if (FadeTransition.valid()) {
        return FadeTransition;
      }

      if (columnTransitionLeft.valid()) {
        return columnTransitionLeft;
      }

      if (columnTransitionRight.valid()) {
        return columnTransitionRight;
      }

      if (columnTransitionSideToSide.valid()) {
        return columnTransitionSideToSide;
      }

    };

    var Leftcol = Barba.BaseView.extend({
      namespace: 'leftcol',
      onEnter: function() {
          // The new Container is ready and attached to the DOM.
      },
      onEnterCompleted: function() {
          // The Transition has just finished.
      },
      onLeave: function() {
          // A new Transition toward a new page has just started.
      },
      onLeaveCompleted: function() {
          // The Container has just been removed from the DOM.
      }
    });

    // Don't forget to init the view!
    Leftcol.init();
    Barba.Pjax.init();
    Barba.Prefetch.init();

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

(function(window){

  var $window = $(window);

  function init(){
    barbaInit();

    // Prevent same link == same url reload
    $('.main-nav a').on('click',function(e){
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

    Barba.Dispatcher.on('transitionCompleted', function(currentStatus, prevStatus) {
      console.log(currentStatus);
    });

    // Used for pages on the same side. Leftcol fade to leftcol or rightcol to rightcol
    var FadeTransition = Barba.BaseTransition.extend({
      start: function() {
        // As soon the loading is finished and the old page is faded out, let's fade the new page
        Promise
          .all([this.newContainerLoading, this.fadeOut()])
          .then(this.fadeIn.bind(this));
      },

      fadeOut: function() {
        return $(this.oldContainer).animate({ opacity: 0 }).promise();
      },

      fadeIn: function() {
        var _this = this;
        var $el = $(this.newContainer);

        $(this.oldContainer).hide();
        var isLeft = (Barba.HistoryManager.prevStatus().namespace == 'leftcol' ? true : false);

        $el.css({
          visibility : 'visible',
          opacity : 0,
          right: isLeft ? "auto" : 0,
          left: isLeft ? 0 : "auto"
        });

        $el.animate({ opacity: 1 }, 400, function() {
          _this.done();
        });
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

        $('.left-nav').animate({left: 400},600);

        return $(this.newContainer).animate({ marginLeft: "0%" }, 800, function() {
          _this.done();
        });
      },

      closeBox: function() {
        var _this = this;

        $('.left-nav').animate({left: 0},600);

        return $(this.oldContainer).animate({ marginLeft: "-100%" }, 800, function() {
          _this.done();
        });
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
          console.log('something');
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

        $('.right-nav').animate({right: 400},600);

        $el.css({
          visibility : 'visible',
          opacity : 1,
          left: 'auto',
          right: '0',
          marginRight: "-100%"
        });

        return $(this.newContainer).animate({ marginRight: "0%" }, 800, function() {
          _this.done();
        });
      },

      closeBox: function() {
        var _this = this;

        $('.right-nav').animate({right: 0},600);

        return $(this.oldContainer).animate({ marginRight: "-100%" }, 800, function() {
          _this.done();
        });
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
          console.log('something right');
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

          $(this.oldContainer).animate({ marginLeft: "-100%" }, 800);
          $('.left-nav').animate({left: 0},600);
          $('.right-nav').animate({right: 400},600);

          return $(this.newContainer).animate({ marginRight: "0%" }, 800, function() {
            _this.done();
          });

        } else {
          $elOld.css({
            visibility : 'visible',
            opacity : 1,
            float: 'right',
            marginRight: "0%"
          });

          $elNew.css({
            visibility : 'visible',
            opacity : 1,
            float: 'left',
            marginLeft: "-100%"
          });

          $(this.oldContainer).animate({ marginRight: "-100%" }, 800);
          $('.right-nav').animate({right: 0},600);
          $('.left-nav').animate({left: 400},600);

          return $(this.newContainer).animate({ marginLeft: "0%" }, 800, function() {
            _this.done();
          });

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

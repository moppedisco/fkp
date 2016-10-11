(function(window){

  var $window = $(window);

  function init(){

    breakpoint();

    if(window.breakpoint != 'mobile'){
      barbaInit();

      $('.main-nav a.back-home').on('click',function(e){
        var $siblingMenu = $(this).parent().siblings();
        if($siblingMenu.hasClass('active')) { $siblingMenu.removeClass('active') };
        // ($('.main-nav').hasClass('') ? $('.right-nav') : $('.left-nav'));
        $(this).parent().toggleClass('active');
        e.preventDefault();
        e.stopPropagation();
      });
    } else {
      // Create gallery on project page
      if($('.project-list-images img')){
        var $lg = $(".project-list-images");
        $lg.each(function(index){
          $(this).lightGallery({
            showThumbByDefault: false,
            controls: false,
            download: false,
            mode: 'lg-fade'
          });

          $(this).on('onSlideClick.lg',function(event, index, fromTouch, fromThumb){
            $(this).data('lightGallery').goToNextSlide();
          });
        });
      }      
    }
  }

  function barbaInit(){
    var lastElementClicked;

    Barba.Dispatcher.on('linkClicked', function(el) {
      lastElementClicked = el;
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

    Barba.Pjax.getTransition = function() {

      if (columnTransition.valid()) {
        return columnTransition;
      }

    };

    var Leftcol = Barba.BaseView.extend({
      namespace: 'leftcol',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--leftcol');

        // Close button for column open
        $('.fullscreen-bg,.close-button').on('click',function(){
          window.history.back();
        });

        // Create gallery on project page
        if($('.project-list-images img')){
          var $lg = $(".project-list-images");
          $lg.each(function(index){
            $(this).lightGallery({
              showThumbByDefault: false,
              controls: false,
              download: false,
              mode: 'lg-fade'
            });

            $(this).on('onSlideClick.lg',function(event, index, fromTouch, fromThumb){
              $(this).data('lightGallery').goToNextSlide();
            });
          });
        }
      }
    });

    var Rightcol = Barba.BaseView.extend({
      namespace: 'rightcol',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--rightcol');

        // Close button for column open
        $('.fullscreen-bg,.close-button').on('click',function(){
          window.history.back();
        });
      }
    });

    var Home = Barba.BaseView.extend({
      namespace: 'home',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--home');
        $('.fullscreen-bg,.close-button').unbind( "click" );
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

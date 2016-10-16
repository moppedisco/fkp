(function(window){

  var $window = $(window);

  function reSizeVideoWrapper(){
    if(window.breakpoint != 'mobile'){
      adjustVideoPositioning('.fullscreen-bg','video');
    } else {
      adjustVideoPositioning('.fullscreen-bg','img');
    }
  }

  function init(){

    breakpoint();

    reSizeVideoWrapper();

    $(window).resize(function() {
			reSizeVideoWrapper();
		});

    $('.main-nav a.back-home').on('click',function(e){
      var $siblingMenu = $(this).parent().siblings();
      if($siblingMenu.hasClass('active')) { $siblingMenu.removeClass('active') };
      $(this).parent().toggleClass('active');
      e.preventDefault();
      e.stopPropagation();
    });

    if(window.breakpoint != 'mobile'){
      barbaInit();
    } else {
      // =================
      // Create gallary if project or magazine page
      if($('.gallery-list').length){
        imageGallery();
      }
    }
  }

  function imageGallery(){
    var $lg = $(".gallery-list-images");
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

  function barbaInit(){
    var lastElementClicked;

    Barba.Dispatcher.on('linkClicked', function(el) {
      lastElementClicked = el;
    });

    Barba.Dispatcher.on('transitionCompleted', function(currentStatus, oldStatus, container) {
      // =================
      // Create gallary if project or magazine page
      if($('.gallery-list').length){
        imageGallery();
      }

      // =================
      // Apply pin on magazine pages
      if($('.magazine-list').length){
        var controller = new ScrollMagic.Controller({container: ".barba-container"});

        $('.gallery-list').each(function(){
          var _this = this,
              containerHeight = $(this).innerHeight(),
              // elementHeight = $(this).parents('.project-list__item').innerHeight(),
              pinnedText = $(this).find('.gallery-list-intro')[0];

          var currentScene = new ScrollMagic.Scene({
            triggerElement: pinnedText,
            triggerHook: 0,
            // duration: containerHeight - 85
            duration: 0
          })
            .setPin(pinnedText)
            .setClassToggle(_this, 'pinned')
            .addTo(controller);
        });
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
          .to($(this.newContainer), 1, {x:'0',clearProps:"all",ease: Power4.easeInOut},'open');

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
          .to($(this.oldContainer), 1, {x:hideColumnValue,clearProps:"all",ease: Power4.easeInOut},'close');

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
        $('.fullscreen-bg').on('click',function(){
          var home = $('.back-home').attr('href');
          Barba.Pjax.goTo(home);
        });
      }
    });

    var Rightcol = Barba.BaseView.extend({
      namespace: 'rightcol',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--rightcol');

        // Close button for column open
        $('.fullscreen-bg').on('click',function(){
          var home = $('.back-home').attr('href');
          Barba.Pjax.goTo(home);
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

  function adjustVideoPositioning(element,type) {
		var windowW = $(window).width();
		var windowH = $(window).height();
		var mediaAspect = 16/9;
		var windowAspect = windowW/windowH;
		if (windowAspect < mediaAspect) {
			// taller
			$(element).find(type)
				.width(windowH*mediaAspect)
				.height(windowH);
			$(element)
				.css('top',0)
				.css('left',-(windowH*mediaAspect-windowW)/2)
				.css('height',windowH);
			$(element+'_html5_api').css('width',windowH*mediaAspect);
			$(element+'_flash_api')
				.css('width',windowH*mediaAspect)
				.css('height',windowH);
		} else {
			// wider
			$(element).find(type)
				.width(windowW)
				.height(windowW/mediaAspect);
			$(element)
				.css('top',-(windowW/mediaAspect-windowH)/2)
				.css('left',0)
				.css('height',windowW/mediaAspect);
			$(element+'_html5_api').css('width','100%');
			$(element+'_flash_api')
				.css('width',windowW)
				.css('height',windowW/mediaAspect);
		}
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

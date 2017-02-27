(function(window){

  var $window = $(window);

  function reSizeVideoWrapper(){
    if(window.breakpoint != 'mobile'){
      adjustVideoPositioning('.fullscreen-bg','video');
      adjustVideoPositioning('.fullscreen-bg','img');
    } else {
      adjustVideoPositioning('.fullscreen-bg','img');
    }
  }

  function setFirstVisit(){
    if (typeof localStorage === 'object') {
      try {
        sessionStorage.setItem('firstvisit', true);
      } catch (e) {
        console.log("your browser doesn't support localStorage in privatemode");
      }
    }
  }

  function introLoading(){

    window.onload = function(e) {
      if(window.breakpoint != 'mobile'){
        TweenMax.to('.fullscreen-bg', 1.4, {opacity:'1',scale: 1,ease: Expo.easeOut});
        TweenMax.to('.fullscreen-bg img', 1.4, {opacity:'0',ease: Expo.easeOut});
      } else {
        TweenMax.to('.fullscreen-bg', 1.4, {opacity:'1',scale: 1,ease: Expo.easeOut});
      }
    };

  }

  function init(){

    if($('body').hasClass('template--home')){
      console.log('first visit');
      introLoading();
    } else {
      $('.template--home .fullscreen-bg').css({
        opacity: 1,
        transform: "scale(1)"
      })
      console.log('not first time');
    }

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
    var clicked = false;

    Barba.Dispatcher.on('linkClicked', function(el) {
      lastElementClicked = el;
      clicked = true;
    });

    Barba.Dispatcher.on('initStateChange', function(currentStatus) {
      if(!clicked) {
        console.log('back');
      }
    });

    Barba.Dispatcher.on('transitionCompleted', function(currentStatus, oldStatus, container) {
      clicked = false;
      // =================
      // Create gallary if project or magazine page
      if($('.gallery-list').length){
        imageGallery();
      }

      // currentNamespace = currentStatus.namespace;

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
          console.log("open");
          Promise
            .all([this.newContainerLoading])
            .then(this.openBox.bind(this));
        } else {
          console.log("close");
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

    var projectTransition = Barba.BaseTransition.extend({
      start: function() {
        var open = ($(lastElementClicked).attr('data-barba-link-type') == "projects" ? true : false);
        var current = Barba.HistoryManager.history.length;

        if(open){
          console.log("open");
          if(clicked){
            Promise
              .all([this.newContainerLoading])
              .then(this.openBox.bind(this));
          } else {
            Promise
              .all([this.newContainerLoading])
              .then(this.goBackToProjects.bind(this));
          }
        } else {
          console.log("close");
          console.log("rumpa 0");
          Promise
            .all([this.newContainerLoading])
            .then(this.closeBox.bind(this));
        }
      },
      openBox: function() {
        var _this = this;
        var growColumnAnimation = new TimelineMax({onComplete: function(){
          return _this.done();
        }});

        growColumnAnimation
          .to($(this.oldContainer), 0.8, {width:"80%",ease: Power4.easeOut},'first')
          .to($(this.oldContainer).find('.content'), 0.2, {opacity:0,ease: Power4.easeOut},'first')
          .to($(this.newContainer), 0.2, {x:0,width:"80%",ease: Power4.easeOut});

      },
      closeBox: function() {
        var _this = this;
        var closeColumnAnimation = new TimelineMax({onComplete: function(){
          return _this.done();
        }});

        $('.right-nav').css({
          zIndex : ''
        });

        console.log("rumpa");

        closeColumnAnimation
          .to('.fullscreen-bg', 1, {opacity:'1',ease: Power4.easeInOut},'close')
          .to($(this.oldContainer), 1, {x:"-100%",ease: Power4.easeInOut},'close');

      },
      goBackToProjects: function() {
        var _this = this;
        var closeColumnAnimation = new TimelineMax({onComplete: function(){
          return _this.done();
        }});

        closeColumnAnimation
          .to($(this.oldContainer), 0.8, {width:"500px",ease: Power4.easeOut},'first')
          .to($(this.oldContainer).find('.content'), 0.2, {opacity:0,ease: Power4.easeOut},'first');

      },

      valid: function() {
        var prev = Barba.HistoryManager.prevStatus();

        if(prev.namespace === 'projects' || prev.namespace === 'project'){
          return true
        } else {
          return false
        }
      }
    });

    Barba.Pjax.getTransition = function() {

      if (columnTransition.valid()) {
        return columnTransition;
      } else if(projectTransition.valid()) {
        return projectTransition;
      } else {
        console.log('broken');
      }
    };

    var Leftcol = Barba.BaseView.extend({
      namespace: 'leftcol',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--leftcol');

        // Close button for column open
        $('.fullscreen-bg').on('click',function(){
          var home = $('.back-home').attr('href');
          lastElementClicked = $('.fullscreen-bg');
          Barba.Dispatcher.trigger('linkClicked', $('.fullscreen-bg'));
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
          lastElementClicked = $('.fullscreen-bg');
          Barba.Dispatcher.trigger('linkClicked', $('.fullscreen-bg'));
          Barba.Pjax.goTo(home);
        });
      }
    });

    var Projectscol = Barba.BaseView.extend({
      namespace: 'projects',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--projects');

        // Close button for column open
        $('.fullscreen-bg').unbind('click').on('click',function(){
          var home = $('.back-home').attr('href');
          lastElementClicked = $('.fullscreen-bg');
          Barba.Dispatcher.trigger('linkClicked', $('.fullscreen-bg'));
          Barba.Pjax.goTo(home);
        });
      }
    });

    var Projectcol = Barba.BaseView.extend({
      namespace: 'project',
      onEnterCompleted: function() {
        $("body").attr('class','').addClass('template--project');

        // Close button for column open
        $('.fullscreen-bg').unbind( "click" ).on('click',function(){
          var home = $('.back-home').attr('href');
          lastElementClicked = $('.fullscreen-bg');
          Barba.Dispatcher.trigger('linkClicked', $('.fullscreen-bg'));
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
    Projectscol.init();
    Projectcol.init();
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

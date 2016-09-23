(function(window){

  var $window = $(window);

  var anim_imageLoop = new TimelineMax({paused: true,repeat: 1});
  var anim_intro = new TimelineMax({paused: true,onStart:function(){
    $('.loading').css('opacity',1);
  }});

  var workMenuAnim = new TimelineMax({paused: true});

  // var homeIntro = new TimelineMax({paused: true,onComplete: function(){
  //
  // }});
  //
  // homeIntro.from($('.home-hero__text'), 1.6, { autoAlpha: 0, y: "10px",ease: Power4.easeOut},'second')
  //   .to("body", 0.2, {css:{overflow:"visible"}, ease:Power2.easeOut},'second')
  //   .from($('.main-nav li:nth-of-type(1)'), 0.6, {delay: 0.1,autoAlpha:0,y: "-10px",ease: Power4.easeOut},'second')
  //   .from($('.main-nav li:nth-of-type(2)'), 0.6, {delay: 0.2,autoAlpha:0,y: "-10px",ease: Power4.easeOut},'second')
  //   .from($('.scroll-down'), 0.6, {delay: 0.2,autoAlpha:0,marginBottom: "-10px",ease: Power4.easeOut},'second');

  workMenuAnim.to($('#barba-wrapper'), 1, {y:'180px',ease: Power4.easeInOut},'first')
    .to($('.main-nav'), 1, {y:'180px',ease: Power4.easeInOut},'first')
    .to(".nav-work-list", 0.1, {css:{zIndex:"9"}})
    .to(".main-nav", 0.1, {css:{position:"absolute"}});

  anim_imageLoop.to($('.loading--images figure:nth-of-type(1)'), 0.15, {display:'block',ease: Power4.easeOut})
    .to($('.loading--images figure:nth-of-type(2)'), 0.15, {display:'block',ease: Power4.easeOut})
    .to($('.loading--images figure:nth-of-type(3)'), 0.15, {display:'block',ease: Power4.easeOut})
    .to($('.loading--images figure:nth-of-type(4)'), 0.15, {display:'block',ease: Power4.easeOut})
    .to($('.loading--images figure:nth-of-type(5)'), 0.15, {display:'block',ease: Power4.easeOut})
    .to($('.loading--images figure:nth-of-type(6)'), 0.15, {display:'block',ease: Power4.easeOut});

  anim_intro.to(".loading", 0.1, {css:{zIndex:"9"}})
    .from($('.loading--images'), 0.6, { scale: "0",ease: Power4.easeOut},'first')
    .from($('.loading--text'), 0.6, { autoAlpha: 0, bottom: "-40px",ease: Power4.easeOut},'first')
    .to($('.loading--images'), 0.6, { scale: "0",ease: Power4.easeInOut},'second')
    .to($('.loading--text'), 0.6, { autoAlpha: 0, bottom: "0px",ease: Power4.easeInOut},'second')
    .to(".loading", 0.1, {css:{zIndex:"-1"}});

  function init(){
    breakpoint();
    barbaInit();

    // $('.work-link').on('click',function(){
    //
    //   var scrollDistance = $window.scrollTop();
    //   if(!$(this).hasClass('active')){
    //     if(scrollDistance >= 10){
    //       workMenuAnim.play();
    //       TweenLite.to($window, 0.8, {scrollTo: 0,ease:Power4.easeInOut});
    //     } else {
    //       workMenuAnim.play();
    //     }
    //   } else {
    //     workMenuAnim.reverse();
    //   }
    //   $(this).toggleClass('active');
    // });
  }

  function homeIndexLinks(){
    $('.work-item--index a').on('click',function(){
      var href = $(this).attr('href');
      TweenLite.to($window, 1.3, {scrollTo: {y:href,offsetY:110},ease:Power4.easeInOut});
      return false;
    });

    $('.scroll-down,.home-hero__text').on('click',function(){
      var href = '#latest-work';
      TweenLite.to($window, 1.3, {scrollTo: {y:href,offsetY:110},ease:Power4.easeInOut});
      return false;
    });

  }

  function barbaInit(){

    var timelinePromise = function(timeline) {
       return new Promise(function(resolve) {
          //alternate syntax for adding a callback
          timeline.eventCallback("onComplete", function() {
            //  console.log('on complete resolving')
             resolve(true)
          })
       });
    }

    var FadeTransition = Barba.BaseTransition.extend({
      start: function() {
        anim_imageLoop.restart();



        /**
         * This function is automatically called as soon the Transition starts
         * this.newContainerLoading is a Promise for the loading of the new container
         * (Barba.js also comes with an handy Promise polyfill!)
         */

        // As soon the loading is finished and the old page is faded out, let's fade the new page
        Promise
          .all([this.newContainerLoading,this.fadeOut(),timelinePromise(anim_intro.restart())])
          .then(this.fadeIn.bind(this));
      },

      fadeOut: function() {
        /**
         * this.oldContainer is the HTMLElement of the old Container
         */

        return $(this.oldContainer).animate({ opacity: 0,marginTop: "-10px" },200).promise();
      },

      fadeIn: function() {
        /**
         * this.newContainer is the HTMLElement of the new Container
         * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
         * Please note, newContainer is available just after newContainerLoading is resolved!
         */

        var _this = this;
        var $el = $(this.newContainer);

        $(this.oldContainer).hide();

        $el.css({
          visibility : 'visible',
          opacity : 0,
          marginTop : "5px"
        });

        window.scrollTo(0,10);

        $el.animate({ opacity: 1,marginTop: "0px" }, 250, function() {
          /**
           * Do not forget to call .done() as soon your transition is finished!
           * .done() will automatically remove from the DOM the old Container
           */

          _this.done();
        });
      }
    });

    /**
     * Next step, you have to tell Barba to use the new Transition
     */
    Barba.Pjax.getTransition = function() {
      /**
       * Here you can use your own logic!
       * For example you can use different Transition based on the current page or link...
       */

      return FadeTransition;
    };

    Barba.Dispatcher.on('initStateChange', function() {
      ga('send', 'pageview', location.pathname);
    });

    var AboutView = Barba.BaseView.extend({
      namespace: 'about',
      onEnter: function() {
        // console.log("about");
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

    var HomepageView = Barba.BaseView.extend({
      namespace: 'homepage',
      onEnter: function() {
        // homeIntro.play();
        // console.log("home");
      },
      onEnterCompleted: function() {
          // The Transition has just finished.
          homeIndexLinks();
      },
      onLeave: function() {
          // A new Transition toward a new page has just started.
      },
      onLeaveCompleted: function() {
          // The Container has just been removed from the DOM.
      }
    });

    var ProjectView = Barba.BaseView.extend({
      namespace: 'project',
      onEnter: function() {
        // console.log("project");
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

    HomepageView.init();
    AboutView.init();
    ProjectView.init();
    Barba.Pjax.start();

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

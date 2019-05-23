
/* eslint eqeqeq: 0 */
/* eslint no-unused-vars: 0 */

/* v3.2/w last work version*/


(function($){

    $.fn.vitGallery = function( options) {


        //Default settings
        var settings = $.extend({
            debag: false,
            buttons: true,
            galleryHeight: 'auto',
            imgBlockClass: 'gallery__img-block',
            controls: 'thumbnails', // points thumbnails
            controlsClass: 'gallery__controls',
            thumnailWidth: 90,
            thumnaiHeight: 60,
            thumbnailMargin: 5,
            animateSpeed: 1000,
            description: true,
            imgPadding: 15,
            autoplay: false,
            autoplayDelay: 3000,
            fullscreen: false,
            transition: 'slide' // slide crossfade

        }, options);


        //Default variables
        var $this = $(this) // .gallery
          , $galleryBlock // .gallery__block
          , $imgBlock = $this.find('.'+ settings.imgBlockClass) // .gallery__img-block
          , $controlsBlock = $this.find('.'+ settings.controlsClass) // .gallery__controls
          , $prevButton // .gallery .prev
          , $nextButton // .gallery .next
          , $controlsItem // .gallery__controls__item
          , $galleryInner // .gallery__inner
          , $descriptionBlock // .gallery__description-block
          , galleryInnerPosition // css left of gallery inner
          , $currentBlock // .gallery__img-block.current
          , currentBlockIndex // index of current block
          , $galleryControlsUl
          , $centerThumbnail
          , $currentControlItem
          , $galleryControlsInner
          , controlsInnerPosition
          , $fullscreenWrap
          ;


        //Classess
        var _galleryInnerClass = 'gallery__inner'
          , _galleryDescriptionClass = 'gallery__description-block'
          , _thumbnailImgClass = 'gallery__thumbnail'
          , _controlsClass = 'gallery__controls'
          , _fullscreenWrapClass = 'gallery__fullscreen__wrap'
          , _fullscreenButtonClass = 'gallery__fullscreen__bt'
          , _fullscreenExitClass =  'gallery__fullscreen__exit'
          ;

        //Timer
        var sliderTimer;

        function updatevariables(functionName) {
            //console.log(functionName);
            $controlsBlock = $this.find('.' + settings.controlsClass);
            $galleryBlock = $this.find('.gallery__block');
            $prevButton = $('.prev');
            $nextButton = $('.next');
            $controlsItem = ( $('.gallery__thumbnail').length ) ? $('.gallery__thumbnail') : $('.gallery__controls__item');
            $galleryInner = $('.gallery__inner');
            $currentBlock = $galleryInner.find('.gallery__img-block.current');
            $descriptionBlock = $imgBlock.find('.gallery__description-block__description');
            currentBlockIndex = $currentBlock.index();
        }

        function updateSlideVariables() {
            $currentBlock = $galleryInner.find('.gallery__img-block.current');
            currentBlockIndex = $currentBlock.index();
            $descriptionBlock = $imgBlock.find('.gallery__description-block__description');
            $currentControlItem = $('.' + _controlsClass).find('.current');

            if (settings.controls == 'thumbnails') {
                controlsInnerPosition = parseInt($galleryControlsInner.css('left'));
            }

            //console.log(currentBlockIndex);
            //console.log(galleryInnerPosition)
        }

        function addClasses () {
            $imgBlock.each(function(){
                $(this).find('span').addClass('gallery__description-block__description');
                $(this).find('img').addClass('gallery__img-block__img')
            })
            updatevariables('addClasses');
        }

        function addWrapper() {
            $imgBlock.wrapAll('<div class="gallery__block"><div class="' + _galleryInnerClass + '"></div></div>');
            updatevariables('addWrapper');
        }

        function getFullWidth() {
            var imgBlockWidth = 0;
            if (settings.imgPadding && settings.imgPadding != 0) {
                imgBlockWidth = ($imgBlock.length - 1) * settings.imgPadding;
            }
            $imgBlock.each(function(){
                imgBlockWidth = imgBlockWidth + $(this).outerWidth();
            })

            updatevariables('getFullWidth');
            return imgBlockWidth;
        }

        function setInnerWidth() {
            var inner = $('.' + _galleryInnerClass);
            inner.css('width', getFullWidth());

            updatevariables('setInnerWidth');
        }

        function setImgBlockWidth() {
            $imgBlock.css('width', $this.width());
            updatevariables('setImgBlockWidth');
        }

        function setGalleryHeight() {

            $imgBlock.each(function(){
                var img = $(this).find('.gallery__img-block__img');
                $(this).addClass('load');


                img.bindImageLoad(function () { //Plugin for load image (look at the end of page)

                    var img = $(this);
                    setTimeout(function () {
                        img.parent().removeClass('load');
                        // обнуляем переменную, чтобы GC сделал свою работу
                        img = null;
                    }, 100);

                });
            })

            updatevariables('setGalleryHeight');
        }

        function createControlsButton() {
            var prev = '<span class="prev"></span>'
              , next = '<span class="next"></span>'
              , buttonBlock = '<div class="gallery__controls-buttons"></div>'
              ;

            var newItem = $galleryBlock.append($(buttonBlock));

            newItem.find('.gallery__controls-buttons').append($(prev)).append($(next))
        }

        function createFullscreen() {
            var $body = $('body')
              , fullscreenButton = '<span class="' + _fullscreenButtonClass + '"></span>'
              , fullscreenWrap = '<div class="' + _fullscreenWrapClass + '"></div>'
              , fullscreenClose = '<span class="' + _fullscreenExitClass + '"></span>'
              , fakeBlock = '<div class="gallery__fake"></div>'
              , fullScreenControls = '<div class="gallery__fullscreen__controls"><span class="prev"></span><span class="next"></span></div>'
              ;

            $galleryBlock.append(fullscreenButton);

            $body.append(fullscreenWrap);

            $fullscreenWrap = $body.find('.' + _fullscreenWrapClass).append(fullscreenClose);
            $fullscreenWrap.append(fakeBlock);
            $fullscreenWrap.append(fullScreenControls);

            $controlsBlock.clone().appendTo($fullscreenWrap);

            var fullscreenThumbnailsBlock = $fullscreenWrap.find('.' + settings.controlsClass).addClass('fullscreen');
        }

        function openCurrentImage () {
            var currentImageSrc = $currentBlock.find('img').attr('src');

            $fullscreenWrap.append('<img src="' + currentImageSrc + '" class="gallery__fullscreen__img">');
        }

        function changeFullscreenImg(where, index) {
            var $currentImage = $fullscreenWrap.find('.gallery__fullscreen__img');

            switch (where) {
                case 'next':
                    var nextImgSrc = $currentBlock.next().find('img').attr('src');
                    $currentImage.attr('src', nextImgSrc);
                    break;

                case 'prev':
                    var prevImgSrc = $currentBlock.prev().find('img').attr('src');
                    $currentImage.attr('src', prevImgSrc);
                    break;

                case 'goTo':
                    break;
            }
        }

        function createControls() {
            if (settings.controls) {
                $controlsBlock = $this.find('.' + settings.controlsClass);

                var item = '<li class="gallery__controls__item"></li>';

                for (var i=0; $imgBlock.length > i; i++) {
                    var newItem = $controlsBlock.append(item);

                }

                $('.gallery__controls__item').each(function(index){
                    $(this).addClass('item_' + index)
                })

                $controlsBlock.append(newItem);
                var galleryUl = $(newItem).find('li').wrapAll('<ul class="gallery__controls__ul"></ul>');

            }

            //getCurrentSlide();
            updatevariables('createControls');
        }

        function createThumbnails() {
            var controlInner = '<div class="gallery__controls__inner"></div>'
              , controlsThumbnailul = '<div class="gallery__controls__thumbnails-ul"></div>'
              , newItem
              ;

            if (settings.controls) {
                $controlsBlock = $this.find('.' + settings.controlsClass);

                var $galleryUl = $controlsBlock.append(controlsThumbnailul);
                $galleryUl.find('.gallery__controls__thumbnails-ul').append(controlInner);
                $galleryControlsUl = $galleryUl.find('.gallery__controls__thumbnails-ul');
                $galleryControlsInner = $('.gallery__controls__inner');


                $imgBlock.each(function() {
                    var $thumnailImg = $(this).find('img');
                    var thumnailImgUrl = $thumnailImg.attr('thumb-url');

                    newItem = document.createElement('img');
                    newItem.src = thumnailImgUrl;

                    /*$(newItem).width(settings.thumnailWidth)
                              .height(settings.thumnaiHeight)
                              .addClass(_thumbnailImgClass)
                              .css('margin-right', settings.thumbnailMargin)
                              .attr('data-index', $(this).index());*/
                    $(newItem).css('width', '100%')


                    $galleryControlsInner.append($(newItem));
                })

                $galleryControlsInner.find('img').wrap('<span class="'+_thumbnailImgClass+'"></span>');

                $('.' + _thumbnailImgClass).width(settings.thumnailWidth)
                                           .height(settings.thumnaiHeight)
                                           .css('margin-right', settings.thumbnailMargin)
                                           .attr('data-index', $(this).index());
                $('.' + _thumbnailImgClass).append('<i></i>')

                $galleryControlsInner.css({
                    width: ( $('.' + _thumbnailImgClass).outerWidth() + settings.thumbnailMargin ) * $('.' + _thumbnailImgClass).length,
                    left: 0
                });

                updatevariables('createThumbnails');
                //getCurrentSlide();

            }
        }

        function getCenterThumbnail() {
            var containerWidth = $galleryControlsUl.outerWidth()
              , $thumnail = $('.gallery__thumbnail')
              , thumnailWidth = $thumnail.outerWidth()
              , countThumbInCont = Math.round( containerWidth / thumnailWidth ) / 2
              ;

            countThumbInCont = Math.round(countThumbInCont)
            $centerThumbnail = $thumnail.eq(countThumbInCont - 1);
            $centerThumbnail.addClass('center');
        }

        function createDescription() {
            $galleryBlock.append('<div class="' + _galleryDescriptionClass + '"></div>');

            //console.log(currentBlockIndex);
            $descriptionBlock.each(function() {
                $('.' + _galleryDescriptionClass).append($(this));
            })

            $descriptionBlock.eq(currentBlockIndex).addClass('current');

            updatevariables('createDescription');
        }

        function changeDescription(currentIndex, index) {
            $descriptionBlock = $('.' + _galleryDescriptionClass).find('.gallery__description-block__description');
            $descriptionBlock.eq(currentIndex).removeClass('current');
            $descriptionBlock.eq(index).addClass('current');
        }

        function showImg() {
            $imgBlock.each(function(index){
                if (index != 0) {
                    $(this).css('display', 'inline-block');
                }
            })
            updatevariables('showImg');
        }

        function nextSlide(callback) {
            if (!$currentBlock.is(':last-child')) {

                if (settings.transition == 'slide'){
                    $galleryInner.animate({
                        left: galleryInnerPosition - $imgBlock.width()
                    }, settings.animateSpeed);
                    galleryInnerPosition = galleryInnerPosition - $imgBlock.width();
                } else if (settings.transition == 'crossfade') {
                    $currentBlock.animate({
                        opacity: 0
                    }, 150);

                    $currentBlock.animate({
                        opacity: 1
                    }, 150);
                }

                if (settings.fullscreen) {
                    changeFullscreenImg('next')
                }


                $currentBlock.removeClass('current');
                $currentBlock.next().addClass('current');
                $controlsItem.eq(currentBlockIndex).removeClass('current');



                $controlsItem.eq(currentBlockIndex)
                    .find('i').css({left: 'auto', width: '100%'})
                    .animate({width: 0}, settings.animateSpeed, function() {
                        $(this).css('left', 0);
                    });

                currentBlockIndex++;

                $controlsItem.eq(currentBlockIndex).addClass('current');
                $controlsItem.eq(currentBlockIndex)
                    .find('i').css({right: 'auto', width: '0'})
                    .animate({width: '100%'}, settings.animateSpeed, function() {
                        $(this).css('right', 0);
                    });

                if (settings.autoplay ) {
                    clearInterval(sliderTimer);
                    autoplay();
                }
                changeDescription(currentBlockIndex - 1, currentBlockIndex);
                if (callback) {
                    callback();
                }
                updateSlideVariables();
                getCurrentSlide();

                if (settings.controls == 'thumbnails'){
                    var containerOffsetEnd = $galleryControlsUl.offset().left + $galleryControlsUl.outerWidth();
                    var lastItemOffset = $controlsItem.last().offset().left + $controlsItem.last().outerWidth() + settings.thumbnailMargin;
                }
            }

            return currentBlockIndex;
        }

        function prevSlide(callback) {
            if (!$currentBlock.is(':first-child')) {

                if (settings.transition == 'slide'){
                    $galleryInner.animate({
                        left: galleryInnerPosition + $imgBlock.width()
                    }, settings.animateSpeed);
                    galleryInnerPosition = galleryInnerPosition + $imgBlock.width();
                } else if (settings.transition == 'crossfade') {
                    $currentBlock.animate({
                        opacity: 0
                    }, 150);

                    $currentBlock.animate({
                        opacity: 1
                    }, 150);
                }

                if (settings.fullscreen) {
                    changeFullscreenImg('prev')
                }

                $currentBlock.removeClass('current');
                $currentBlock.prev().addClass('current');

                $controlsItem.eq(currentBlockIndex).removeClass('current');

                $controlsItem.eq(currentBlockIndex)
                    .find('i').css({right: 'auto', width: '100%'})
                    .animate({width: '0'}, settings.animateSpeed, function() {
                        $(this).css('right', 0);
                    });

                currentBlockIndex--;

                $controlsItem.eq(currentBlockIndex).addClass('current');

                $controlsItem.eq(currentBlockIndex)
                    .find('i').css({left: 'auto', width: '0'})
                    .animate({width: '100%'}, settings.animateSpeed, function() {
                        $(this).css('left', 0);
                    });

                if (settings.autoplay ) {
                    clearInterval(sliderTimer);
                    autoplay();
                }

                changeDescription(currentBlockIndex + 1, currentBlockIndex);

                if (callback) {
                    callback();
                }

                updateSlideVariables();
                getCurrentSlide();

                if (settings.controls == 'thumbnails'){
                    var containerOffsetBegin = $galleryControlsUl.offset().left;
                    var firstItemOffset = $controlsItem.first().offset().left;
                }
            }
        }

        function scrollControls(direction) {

            var controlsInnerPosition = parseInt($galleryControlsInner.css('left'));

            if (direction == 'back') {
                $galleryControlsInner.animate({
                    left: controlsInnerPosition - ( $controlsItem.outerWidth() + settings.thumbnailMargin)
                }, settings.animateSpeed)
            } else if (direction == 'forward') {
                $galleryControlsInner.animate({
                    left: controlsInnerPosition + ( $controlsItem.outerWidth() + settings.thumbnailMargin)
                }, settings.animateSpeed)
            }

            updateSlideVariables();
        }

        function goToSlide(thisIndex) {
            if (settings.transition == 'slide'){
                if (currentBlockIndex < thisIndex) {
                    $galleryInner.animate({
                        left: galleryInnerPosition - ( $imgBlock.width() * ( thisIndex -  currentBlockIndex))
                    }, settings.animateSpeed);

                    galleryInnerPosition = galleryInnerPosition - ( $imgBlock.width() * ( thisIndex -  currentBlockIndex))

                } else {
                    $galleryInner.animate({
                        left: - ( $imgBlock.width() * ( thisIndex +  currentBlockIndex) +  galleryInnerPosition)
                    }, settings.animateSpeed);

                    galleryInnerPosition = - ( $imgBlock.width() * ( thisIndex +  currentBlockIndex) +  galleryInnerPosition)
                }
            } else if (settings.transition == 'crossfade') {
                $galleryInner.find('.current').animate({
                    opacity: 0
                }, 150);

                $galleryInner.find('.current').animate({
                    opacity: 1
                }, 150);
            }

            changeDescription($galleryInner.find('.current').index(), thisIndex);

            $galleryInner.find('.current').removeClass('current');
            $imgBlock.eq(thisIndex).addClass('current');

            $controlsBlock.find('.current').removeClass('current');
            $controlsItem.eq(thisIndex).addClass('current');


            getCurrentSlide();
            updateSlideVariables();

            if (settings.autoplay ) {
                clearInterval(sliderTimer);
                autoplay();
            }
        }

        function autoplay() {
            var countSlides = $imgBlock.length;
            //console.log('autoplay');
            sliderTimer = setInterval(function() {

                if ( (currentBlockIndex + 1) / countSlides  == 1  ) {
                    clearInterval(sliderTimer);

                    setTimeout(function() {
                        goToSlide(0)
                    }, settings.autoplayDelay / 2);
                }

                nextSlide();

            }, settings.autoplayDelay);

        }

        function bindEvents() {
            galleryInnerPosition = parseInt($galleryInner.css('left'));
            currentBlockIndex = $currentBlock.index();

            $prevButton.on('click', function(){
                $currentBlock = $galleryInner.find('.gallery__img-block.current');
                prevSlide();
            })

            $nextButton.on('click', function(){
                $currentBlock = $galleryInner.find('.gallery__img-block.current');
                nextSlide();
            })


            $controlsItem.on('click', function() {
                goToSlide($(this).index());

            })

            if (settings.fullscreen) {
                var $fullscreenButton = $('.' + _fullscreenButtonClass)
                  , $fullscreenExitButton = $('.' + _fullscreenExitClass)
                  ;

                $fullscreenButton.on('click', function() {
                    $fullscreenWrap.addClass('open');
                    openCurrentImage();

                })

                $fullscreenExitButton.on('click', function() {
                    $fullscreenWrap.removeClass('open');

                    $fullscreenWrap.find('.gallery__fullscreen__img').remove();
                })
            }

            if (settings.controls == 'thumbnails'){
                $galleryControlsInner.on('mousedown', function( e ) {
                    var clickPosition = e.pageX
                      , startPosition = $galleryControlsInner.css('left')
                      , offsetLeft = $(this).offset().left
                      , offsetRight = $(this).offset().left + $(this).outerWidth()
                      , oldX
                      , newX
                      ;

                    $(window).on('mousemove', function(e) {

                        var delta = clickPosition - e.pageX;
                        var oldX = e.pageX;

                        (function() {
                            setTimeout(function() {
                                newX = e.pageX
                            }, 50)
                        })()

                        if (oldX > newX ) {
                            $galleryControlsInner.css('left', parseInt(startPosition) - delta);
                        }

                        if (oldX < newX){
                            $galleryControlsInner.css('left', parseInt(startPosition) - delta);
                        }

                        e.preventDefault();
                    }).on('mouseup', function(e) {
                        //$(e.target).unbind('mouseup');
                        e.preventDefault();

                        if ($galleryControlsInner.offset().left >= $galleryControlsInner.parent().offset().left) {
                            $galleryControlsInner.addClass('go-back').css('left', 0)
                            setTimeout(function() {
                                $galleryControlsInner.removeClass('go-back')
                            },300)
                        }

                        if ($galleryControlsInner.offset().left + $galleryControlsInner.outerWidth()  <= $galleryControlsInner.parent().offset().left + $galleryControlsInner.parent().outerWidth()) {
                            $galleryControlsInner.addClass('go-back').css('left', $galleryControlsInner.parent().outerWidth() - $galleryControlsInner.outerWidth())
                            setTimeout(function() {
                                $galleryControlsInner.removeClass('go-back')
                            },300)
                        }
                        $(this).unbind('mousemove');
                    })
                    e.preventDefault();
                })
            }

            $(window).on('resize', function() {
                if (settings.autoplay ) {
                    clearInterval(sliderTimer);
                }
                setGalleryHeight();
                setImgBlockWidth();
                setInnerWidth();
                updateSlideVariables();

                $galleryInner.css('left', - (currentBlockIndex * $currentBlock.width()));
                galleryInnerPosition = - (currentBlockIndex * $currentBlock.width())
                if (settings.autoplay ) {
                    autoplay();
                }
            })
        }

        function getCurrentSlide() {
            var index = 0;

            if ($galleryInner.find('.current').length > 0) {
                index = $galleryInner.find('.current').index();

                if (settings.controls == 'thumbnails'){
                    var curentItemOffset = $controlsItem.eq(index).offset().left + (($controlsItem.outerWidth() + settings.thumbnailMargin) / 2)
                      , centerItemOffset = $centerThumbnail.offset().left + (($controlsItem.outerWidth() + settings.thumbnailMargin) / 2)
                      ;

                    if ($controlsItem.eq(index).index() > $centerThumbnail.index() - 1 && $controlsItem.eq(index).index() < $controlsItem.length - $centerThumbnail.index() + 1) {

                        $galleryControlsInner.animate({
                            left: -(curentItemOffset - centerItemOffset)
                        }, 300)

                    }

                    if ($controlsItem.eq(index).index() < $centerThumbnail.index() - 1) {
                        $galleryControlsInner.animate({
                            left: 0
                        }, 300)
                    }

                    if ($controlsItem.eq(index).index() > $controlsItem.length - $centerThumbnail.index() + 1) {
                        $galleryControlsInner.animate({
                            left: $galleryControlsInner.parent().outerWidth() - $galleryControlsInner.outerWidth()
                        }, 300)
                    }
                }

                $controlsItem.eq(index).addClass('current');
                $galleryInner.css('left', - (index * $imgBlock.width()));



            } else {
                $imgBlock.first().addClass('current');
                $controlsItem.first().addClass('current');
            }

            updatevariables('getCurrentSlide');
            updateSlideVariables();

            return index;
        }

        function init() {
            addClasses();
            addWrapper();
            createControlsButton();
            showImg();
            setGalleryHeight();
            setImgBlockWidth();
            setInnerWidth();



            if (settings.controls == 'points'){
                createControls();
            } else if (settings.controls == 'thumbnails') {
                createThumbnails();
                getCenterThumbnail();

            }

            if (settings.fullscreen) {
                createFullscreen();
            }

            getCurrentSlide();

            if (settings.description) {
                createDescription();
            }

            bindEvents();

            if (settings.autoplay ) {
                autoplay();
            }
        }

        init();

    }
})(jQuery)

;(function ($) {
    $.fn.bindImageLoad = function (callback) {
        function isImageLoaded(img) {
            if (!img.complete) {
                return false;
            }
            if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        }

        return this.each(function () {
            var ele = $(this);
            if (ele.is("img") && $.isFunction(callback)) {
                ele.one("load", callback);
                if (isImageLoaded(this)) {
                    ele.trigger("load");
                }
            }
        });
    };
})(jQuery);

/*(function($) {
    $.fn.drags = function(opt) {

        opt = $.extend({
            handle: '',
            cursor: 'default'
        }, opt);

        if (opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if (opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if (opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);*/
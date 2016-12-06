function Tekitizy (selector, options) {
  this.selector = selector
  this.position = 0
  if (options && options.hasOwnProperty('carroussel_id')) {
    this.carroussel_id = options.carroussel_id
  } else {
    this.carroussel_id = 'tekitizy_carroussel'
  }
  if (options && options.hasOwnProperty('speed')) {
    this.speed = options.speed
  } else {
    this.speed = 5000
  }
  // this.selector <- selector (paramètre)
  // this.carrousel_id <- 'tekitizy_carroussel' ou options.carroussel_id
}

// Tekitizy.setup('.post img',{ carrousse_id: 'my-tekitizy' })
// Tekitizy.setup('.post img')
Tekitizy.setup = function (imgSelector, opts) {
  $(document).ready(function () {
    var tekitizy
    tekitizy = new Tekitizy(imgSelector, opts)
    tekitizy.position = 0
    tekitizy.setup()
  })
}

Tekitizy.prototype.setup = function () {
  this.drawCarroussel(this.carroussel_id)
  this.appendZoomBtn(this.selector,this.clickZoomBtn)
  this.listenToButtons()
  // ...
}

Tekitizy.prototype.listenToButtons = function () {
  // this -> instance Tekitizy
  var _this = this
  setTimeout(function() {
  $('.tekitizy-open-btn').on('click',function () {
	_this.position = jQuery(this).attr('data-position')
    _this.actionShow($(this).attr('data-src'))
  })
  jQuery('.tekitizy-close-btn').on('click',function () {
	_this.actionClose()  
  })
  
  jQuery('.tekitizy-play-btn').on('click', function() {
	  _this.actionPlay()
  })
  jQuery('.tekitizy-pause-btn').on('click', function() {
	  _this.actionPause()
  })
  
  jQuery('.tekitizy-next-btn').on('click', function() {
	  _this.actionNext()
  })
  jQuery('.tekitizy-prev-btn').on('click', function() {
	  _this.actionPrev()
  })
  }, 1)
}

Tekitizy.prototype.drawCarroussel = function (id) {
  var carroussel = ''
  carroussel += '<div class="tekitizy-carroussel" id=' + id + '></div>'
  // Ajouter les boutons, la figure ..
  this.carroussel = $(carroussel)
  this.carroussel.appendTo($('body'))
  jQuery(this.carroussel).append('<div class="tekitizy-carroussel-window"><div class="tekitizy-carroussel-window-left"><button class="tekitizy-nav tekitizy-prev-btn"><i class="fa fa-angle-left"></i></button></div><div class="tekitizy-carroussel-window-center"><div class="tekitizy-window-inner"></div></div><div class="tekitizy-carroussel-window-right"><button class="tekitizy-close-btn"><i class="fa fa-close"></i></button><button class="tekitizy-nav tekitizy-next-btn"><i class="fa fa-angle-right"></i></button></div></div>')
  setTimeout(function() {
      jQuery('.tekitizy-window-inner').append('<img class="tekitizy-carroussel-image" src=""/>')
      jQuery('.tekitizy-carroussel-window-center').append('<button class="tekitizy-play-btn"><i class="fa fa-play"></i></button><button class="tekitizy-pause-btn"><i class="fa fa-pause"></i></button>')
  }, 1)
}

Tekitizy.prototype.appendZoomBtn = function (selector) {
	var image_position
	image_position = 0
  $(selector).each(function () {
    // image
    var $el
    var image_src
    $el = $(this)
    image_src = $el.attr('src')
    $el.wrap('<div></div>') // image
      .parent() // container
        .addClass('tekitizy-container') // container
        .append('<i class="tekitizy-open-btn fa fa-search" data-src="' + image_src + '" data-position="' + image_position + '" aria-hidden="true"></i>')
    image_position ++
  })
}

// affiche une image
Tekitizy.prototype.actionShow = function (url) {
  jQuery('.tekitizy-carroussel-image').attr('src',url);
  jQuery('.tekitizy-carroussel-image').attr('data-position', this.position)
  this.carroussel.addClass('tekitizy-carroussel-open')
}

Tekitizy.prototype.actionNext = function () {
	var currentPosition
	currentPosition = jQuery('.tekitizy-carroussel-image').attr('data-position')
	currentPosition = parseInt(currentPosition)+1
	nextElement = jQuery('.tekitizy-container').find('i[data-position=' + currentPosition + ']')
	if(nextElement.length == 0){
		currentPosition = 0
		nextElement = jQuery('.tekitizy-container').find('i[data-position=0]')
	}
	nextElementSrc = nextElement.attr('data-src')
	jQuery('.tekitizy-carroussel-image').fadeOut('slow', function(){
		jQuery('.tekitizy-carroussel-image').attr('src', nextElementSrc)
		jQuery('.tekitizy-carroussel-image').attr('data-position', currentPosition)
	})
	jQuery('.tekitizy-carroussel-image').fadeIn('slow')
}

Tekitizy.prototype.actionPrev = function () {
	var currentPosition
	currentPosition = jQuery('.tekitizy-carroussel-image').attr('data-position')
	currentPosition = parseInt(currentPosition)-1
	nextElement = jQuery('.tekitizy-container').find('i[data-position=' + currentPosition + ']')
	if(nextElement.length <= 0){
		currentPosition = jQuery('.tekitizy-container i').length
		nextElement = jQuery('.tekitizy-container').find('i[data-position=0]')
	}
	nextElementSrc = nextElement.attr('data-src')
	jQuery('.tekitizy-carroussel-image').attr('src', nextElementSrc)
	jQuery('.tekitizy-carroussel-image').attr('data-position', currentPosition)
}

Tekitizy.prototype.actionPlay = function () {
	_this = this
	this.autoshow = setInterval(function(){_this.rotate(_this)}, _this.speed)
}

Tekitizy.prototype.actionPause = function () {
	_this = this
	clearInterval(_this.autoshow);
}

Tekitizy.prototype.actionClose = function () {
  this.carroussel.removeClass('tekitizy-carroussel-open')
  jQuery(this.carroussel).remove('tekitizy-carroussel-window')
  this.actionPause()
}

Tekitizy.prototype.rotate = function (tekitizi){
	jQuery('.tekitizy-next-btn').click()
}

// Tekitizy.setup('.post img',{ 'carroussel_id': 'my-tekitizy-carroussel' })

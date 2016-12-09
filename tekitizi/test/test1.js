function Tekitizy (jquery, selector, options) {
  this.selector = selector
  this.position = 0
  this.$ = jquery
  this.desc = ''
  if (options && options.hasOwnProperty('carroussel_id')) {
    this.carroussel_id = options.carroussel_id
  } else {
    this.carroussel_id = 'tekitizy_carroussel'
  }
  if (options && options.hasOwnProperty('imageDuration')) {
    this.speed = options.imageDuration * 1000
  } else {
    this.speed = 5000
  }
  if (options && options.hasOwnProperty('transition')) {
    this.transition = options.transition
  } else {
    this.transition = 600
  }
  if (options && options.hasOwnProperty('autoPlay')) {
    this.autoplay = options.autoplay
  } else {
    this.autoplay = true
  }
  if (options && options.hasOwnProperty('prevNext')) {
    this.prevNext = options.prevNext
  } else {
    this.prevNext = 'true'
  }
  if (options && options.hasOwnProperty('play')) {
    this.play = options.play
  } else {
    this.play = 'true'
  }
  if (options && options.hasOwnProperty('effect')) {
    this.effect = options.effect
  } else {
    this.effect = 'true'
  }
  // this.selector <- selector (paramètre)
  // this.carrousel_id <- 'tekitizy_carroussel' ou options.carroussel_id
}

// Tekitizy.setup('.post img',{ carrousse_id: 'my-tekitizy' })
// Tekitizy.setup('.post img')
Tekitizy.setup = function (jquery, imgSelector, opts) {
  jquery().ready(function () {
    var tekitizy
    tekitizy = new Tekitizy(jquery, imgSelector, opts)
    tekitizy.position = 0
    tekitizy.setup()
  })
}

Tekitizy.prototype.setup = function () {
  this.drawCarroussel(this.carroussel_id)
  this.appendZoomBtn(this.selector, this.clickZoomBtn)
  this.listenToButtons()
  if (this.autoplay) {
    this.actionPlay()
  }
  // ...
}

Tekitizy.prototype.listenToButtons = function () {
  // this -> instance Tekitizy
  var _this = this
  setTimeout(function () {
    _this.$('.tekitizy-open-btn').on('click', function () {
      _this.position = _this.$(this).attr('data-position')
      _this.desc = _this.$(this).attr('data-desc')
      _this.actionShow(_this.$(this).attr('data-src'))
    })
    _this.$('.tekitizy-close-btn').on('click', function () {
      _this.actionClose()
    })
    _this.$('.tekitizy-play-btn').on('click', function () {
      _this.actionPlay()
    })
    _this.$('.tekitizy-pause-btn').on('click', function () {
      _this.actionPause()
    })
    _this.$('.tekitizy-next-btn').on('click', function () {
      _this.actionNext()
    })
    _this.$('.tekitizy-prev-btn').on('click', function () {
      _this.actionPrev()
    })
  }, 1)
}

Tekitizy.prototype.drawCarroussel = function (id) {
  var _this = this
  var carroussel = ''
  carroussel += '<div class="tekitizy-carroussel" id=' + id + '></div>'
  // Ajouter les boutons, la figure ..
  this.carroussel = _this.$(carroussel)
  this.carroussel.appendTo(_this.$('body'))
  _this.$(this.carroussel).append('<div class="tekitizy-carroussel-window"><div class="tekitizy-carroussel-window-left"></div><div class="tekitizy-carroussel-window-center"><div class="tekitizy-window-inner"></div></div><div class="tekitizy-carroussel-window-right"><button class="tekitizy-close-btn"><i class="fa fa-close"></i></button></div></div>')
  setTimeout(function () {
    _this.$('.tekitizy-window-inner').append('<figure class="image-container"><img class="tekitizy-carroussel-image" src=""/><figcaption class="tekitizy-img-desc"></figcaption></figure>')
    if (_this.prevNext) {
      _this.$('.tekitizy-carroussel-window-left').append('<button class="tekitizy-nav tekitizy-prev-btn"><i class="fa fa-angle-left"></i></button>')
      _this.$('.tekitizy-carroussel-window-right').append('<button class="tekitizy-nav tekitizy-next-btn"><i class="fa fa-angle-right"></i></button>')
    }
    if (_this.play) {
      _this.$('.tekitizy-carroussel-window-center').append('<button class="tekitizy-play-btn"><i class="fa fa-play"></i></button>')
      _this.$('.tekitizy-carroussel-window-center').append('<button class="tekitizy-pause-btn"><i class="fa fa-pause"></i></button>')
    }
  }, 1)
}

Tekitizy.prototype.appendZoomBtn = function (selector) {
  var imagePosition
  imagePosition = 0
  var _this = this
  _this.$(selector).each(function () {
    // image
    var $el
    var imageSrc
    var imageAlt
    $el = _this.$(this)
    imageSrc = $el.attr('src')
    imageAlt = $el.attr('alt')
    $el.wrap('<div></div>') // image
      .parent() // container
        .addClass('tekitizy-container') // container
        .append('<i class="tekitizy-open-btn fa fa-search" data-desc="' + imageAlt + '" data-src="' + imageSrc + '" data-position="' + imagePosition + '" aria-hidden="true"></i>')
    imagePosition++
  })
}

// affiche une image
Tekitizy.prototype.actionShow = function (url) {
  var _this = this
  _this.$('.tekitizy-carroussel-image').attr('src', url)
  _this.$('.tekitizy-carroussel-image').attr('data-position', this.position)
  _this.$('.tekitizy-img-desc').html('<p>' + this.desc + '</p>')
  this.carroussel.addClass('tekitizy-carroussel-open')
}

Tekitizy.prototype.actionNext = function () {
  var _this = this
  var currentPosition
  var nextElement
  var nextElementSrc
  currentPosition = _this.$('.tekitizy-carroussel-image').attr('data-position')
  currentPosition = parseInt(currentPosition) + 1
  nextElement = _this.$('.tekitizy-container').find('i[data-position=' + currentPosition + ']')
  if (nextElement.length === 0) {
    currentPosition = 0
    nextElement = _this.$('.tekitizy-container').find('i[data-position=0]')
  }
  nextElementSrc = nextElement.attr('data-src')
  if (_this.effect) {
    _this.$('.tekitizy-carroussel-image').css('position', 'relative')
    _this.$('.tekitizy-carroussel-image').animate({right: _this.$(window).width() + 'px'}, _this.transition, function () {
      _this.$('.tekitizy-carroussel-image').attr('src', nextElementSrc)
      _this.$('.tekitizy-carroussel-image').attr('data-position', currentPosition)
      _this.$('.tekitizy-carroussel-image').css('left', _this.$(window).width() + 'px')
      _this.$('.tekitizy-carroussel-image').css('right', 'initial')
      _this.$('.tekitizy-carroussel-image').animate({left: '0px'}, _this.transition, function () {
        _this.$('.tekitizy-carroussel-image').css('position', 'initial')
        _this.$('.tekitizy-carroussel-image').css('right', 'initial')
        _this.$('.tekitizy-carroussel-image').css('left', 'initial')
      })
    })
  } else {
    _this.$('.tekitizy-carroussel-image').attr('src', nextElementSrc)
    _this.$('.tekitizy-carroussel-image').attr('data-position', currentPosition)
  }
  _this.$('.tekitizy-img-desc').html('<p>' + _this.$(nextElement).attr('data-desc') + '</p>')
}

Tekitizy.prototype.actionPrev = function () {
  var _this = this
  var currentPosition
  var nextElement
  var nextElementSrc
  currentPosition = _this.$('.tekitizy-carroussel-image').attr('data-position')
  currentPosition = parseInt(currentPosition) - 1
  nextElement = _this.$('.tekitizy-container').find('i[data-position=' + currentPosition + ']')
  if (nextElement.length <= 0) {
    currentPosition = _this.$('.tekitizy-container i').length
    nextElement = _this.$('.tekitizy-container').find('i[data-position=0]')
  }
  nextElementSrc = nextElement.attr('data-src')
  if (_this.effect) {
    _this.$('.tekitizy-carroussel-image').css('position', 'relative')
    _this.$('.tekitizy-carroussel-image').animate({left: _this.$(window).width() + 'px'}, _this.transition, function () {
      _this.$('.tekitizy-carroussel-image').attr('src', nextElementSrc)
      _this.$('.tekitizy-carroussel-image').attr('data-position', currentPosition)
      _this.$('.tekitizy-carroussel-image').css('right', _this.$(window).width() + 'px')
      _this.$('.tekitizy-carroussel-image').css('left', 'initial')
      _this.$('.tekitizy-carroussel-image').animate({right: '0px'}, _this.transition, function () {
        _this.$('.tekitizy-carroussel-image').css('position', 'initial')
        _this.$('.tekitizy-carroussel-image').css('right', 'initial')
        _this.$('.tekitizy-carroussel-image').css('left', 'initial')
      })
    })
  } else {
    _this.$('.tekitizy-carroussel-image').attr('src', nextElementSrc)
    _this.$('.tekitizy-carroussel-image').attr('data-position', currentPosition)
  }
  _this.$('.tekitizy-img-desc').html('<p>' + _this.$(nextElement).attr('data-desc') + '</p>')
}

Tekitizy.prototype.actionPlay = function () {
  var _this = this
  this.autoshow = setInterval(function () { _this.rotate(_this) }, _this.speed)
}

Tekitizy.prototype.actionPause = function () {
  var _this = this
  clearInterval(_this.autoshow)
}

Tekitizy.prototype.actionClose = function () {
  var _this = this
  this.carroussel.removeClass('tekitizy-carroussel-open')
  _this.$(this.carroussel).remove('tekitizy-carroussel-window')
  this.actionPause()
}

Tekitizy.prototype.rotate = function (tekitizi) {
  var _this = this
  _this.$('.tekitizy-next-btn').click()
}

// Tekitizy.setup('.post img',{ 'carroussel_id': 'my-tekitizy-carroussel' })

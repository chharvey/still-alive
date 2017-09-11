(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Color = require('csscolor').Color

function fontdemo(self) {
  return $(self).closest('.o-Grid').find('.c-FontSamp')
}
$('input[name="fs"]').change(function () {
  fontdemo(this).css('font-style', (this.checked) ? $(this).val() : '')
})
$('input[name="fv"]').change(function () {
  fontdemo(this).css('font-variant', (this.checked) ? $(this).val() : '')
})
$('input[name="fw"]').on('input change', function () {
  var val = $(this).val() // a string
  fontdemo(this).css('font-weight', val)
  var norm = (+val == 400) ? ' (normal)' : ''
  var bold = (+val == 700) ? ' (bold)' : ''
  $(this).siblings('input[type="text"]').val(val + norm + bold)
})
$('.c-FontForm input[type="reset"]').click(function () {
  fontdemo(this).css('font-style', '').css('font-variant','').css('font-weight', '')
})
function showMix(hexvalue) {
  return function () {
    var bg_color = hexvalue || $(this).parents('.js-colorbox').find('.js-rowbc-swatch').attr('value') || '#000000'
    var overlap = {
      color : $(this).parents('.js-colorbox').attr('data-overlap-color') || '#000000'
    , alpha : $(this).parents('.js-colorbox').attr('data-overlap-alpha') || 0
    , number: $(this).attr('data-overlap-number')                        || 0
    }
    var mix = Color.fromString(bg_color).mix(Color.fromString(overlap.color), 1 - Math.pow(1-overlap.alpha, overlap.number), false)
    $(this).html(mix.toString('hex'))
  }
}
$('.js-mix').each(showMix())
$('.js-rowbc-swatch').change(function () {
  var value = $(this).val()
  $(this).parents('.js-colorbox').css('background-color', value)
  $(this).parents('.js-colorbox').find('.js-mix').each(showMix(value))
})
$('.js-reset-swatch').click(function () {
  var orig = $(this).parents('form').find('.js-rowbc-swatch').attr('value')
  $(this).parents('.js-colorbox').css('background-color', orig)
  $(this).parents('.js-colorbox').find('.js-mix').each(showMix(orig))
})

},{"csscolor":5}],2:[function(require,module,exports){
var Util = require('./Util.class.js')

/**
 * A 24-bit color ("True Color") that can be displayed in a pixel, given three primary color components.
 * @type {Color}
 */
module.exports = (function () {
  // CONSTRUCTOR
  /**
   * Construct a Color object.
   * Valid parameters:
   * - new Color([60, 120, 240]) // [red, green, blue]
   * - new Color([192])          // [grayscale]
   * - new Color()               // (black, rgb(0,0,0))
   * The RGB array may be an array of length 3 or 1, containing integers 0–255.
   * If array length is 3, the components are red, green, and blue, in that order.
   * If the length is 1, the red, green, and blue components are equal to that number,
   * which will produce a grayscale color.
   * If no argument is given, the color will be black (#000000).
   * @constructor
   * @param {Array<number>=[0]} $rgb an array of 1 or 3 integers in [0,255]
   */
  function Color($rgb) {
    var self = this
    if (arguments.length >= 1 && $rgb.length >= 3) {
      ;
    } else if (arguments.length >= 1) {
      return Color.call(self, [ $rgb[0], $rgb[0], $rgb[0] ])
    } else /* if (arguments.length < 1) */ {
      return Color.call(self, [0])
    }

    /**
     * The red component of this color. An integer in [0,255].
     * @type {number}
     */
    self._RED = $rgb[0]
    /**
     * The green component of this color. An integer in [0,255].
     * @type {number}
     */
    self._GREEN = $rgb[1]
    /**
     * The blue component of this color. An integer in [0,255].
     * @type {number}
     */
    self._BLUE = $rgb[2]

    var _max = Math.max(self._RED, self._GREEN, self._BLUE) / 255
    var _min = Math.min(self._RED, self._GREEN, self._BLUE) / 255
    var _chroma = _max - _min

    /**
     * The HSV-space hue of this color, or what "color" this color is.
     * A number bound by [0, 360).
     * @type {number}
     */
    self._HSV_HUE = (function () {
      if (_chroma === 0) return 0
      var rgb_norm = [
        self._RED   / 255
      , self._GREEN / 255
      , self._BLUE  / 255
      ]
      return [
        function (r, g, b) { return ((g - b) / _chroma + 6) % 6 * 60 }
      , function (r, g, b) { return ((b - r) / _chroma + 2)     * 60 }
      , function (r, g, b) { return ((r - g) / _chroma + 4)     * 60 }
      ][rgb_norm.indexOf(_max)].apply(null, rgb_norm)
      /*
       * Exercise: prove:
       * _HSV_HUE === Math.atan2(Math.sqrt(3) * (g - b), 2*r - g - b)
       */
    })()

    /**
     * The brightness of this color. A lower value means the color is closer to black, a higher
     * value means the color is more true to its hue.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSV_VAL = (function () {
      return _max
    })()

    /**
     * The vividness of this color. A lower saturation means the color is closer to white,
     * a higher saturation means the color is more true to its hue.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSV_SAT = (function () {
      if (_chroma === 0) return 0 // avoid div by 0
      return _chroma / self._HSV_VAL
    })()

    /**
     * The Hue of this color. Identical to `this._HSV_HUE`.
     * A number bound by [0, 360).
     * @type {number}
     */
    self._HSL_HUE = (function () {
      return self._HSV_HUE
    })()

    /**
     * How "white" or "black" the color is. A lower luminosity means the color is closer to black,
     * a higher luminosity means the color is closer to white.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSL_LUM = (function () {
      return 0.5 * (_max + _min)
    })()

    /**
     * The amount of "color" in the color. A lower saturation means the color is more grayer,
     * a higher saturation means the color is more colorful.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSL_SAT = (function () {
      if (_chroma === 0) return 0 // avoid div by 0
      return _chroma / ((self._HSL_LUM <= 0.5)  ?  2*self._HSL_LUM  :  (2 - 2*self._HSL_LUM))
      /*
       * Exercise: prove:
       * _HSL_SAT === _chroma / (1 - Math.abs(2*self._HSL_LUM - 1))
       * Proof:
       * denom == (function (x) {
       *   if (x <= 0.5) return 2x
       *   else          return 2 - 2x
       * })(_HSL_LUM)
       * Part A. Let x <= 0.5. Then 2x - 1 <= 0, and |2x - 1| == -(2x - 1).
       * Then 1 - |2x - 1| == 1 + (2x - 1) = 2x. //
       * Part B. Let 0.5 < x. Then 1 < 2x - 1, and |2x - 1| == 2x - 1.
       * Then 1 - |2x - 1| == 1 - (2x - 1) = 2 - 2x. //
       */
    })()

    /**
     * The Hue of this color. Identical to `this._HSV_HUE`.
     * A number bound by [0, 360).
     * @type {number}
     */
    self._HWB_HUE = (function () {
      return self._HSV_HUE
    })()
    /**
     * The amount of White in this color. A higher white means the color is closer to #fff,
     * a lower white means the color has a true hue (more colorful).
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HWB_WHT = (function () {
      return _min
    })()
    /**
     * The amount of Black in this color. A higher black means the color is closer to #000,
     * a lower black means the color has a true hue (more colorful).
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HWB_BLK = (function () {
      return 1 - _max
    })()
  }


  // ACCESSOR FUNCTIONS
  /**
   * Get the red component of this color.
   * @return {number} the red component of this color
   */
  Color.prototype.red = function red() { return this._RED }
  /**
   * Get the green component of this color.
   * @return {number} the green component of this color
   */
  Color.prototype.green = function green() { return this._GREEN }
  /**
   * Get the blue component of this color.
   * @return {number} the blue component of this color
   */
  Color.prototype.blue = function blue() { return this._BLUE }

  /**
   * Get the hsv-hue of this color.
   * @return {number} the hsv-hue of this color
   */
  Color.prototype.hsvHue = function hsvHue() { return this._HSV_HUE }
  /**
   * Get the hsv-saturation of this color.
   * @return {number} the hsv-saturation of this color
   */
  Color.prototype.hsvSat = function hsvSat() { return this._HSV_SAT }
  /**
   * Get the hsv-value of this color.
   * @return {number} the hsv-value of this color
   */
  Color.prototype.hsvVal = function hsvVal() { return this._HSV_VAL }

  /**
   * Get the hsl-hue of this color.
   * @return {number} the hsl-hue of this color
   */
  Color.prototype.hslHue = function hslHue() { return this._HSL_HUE }
  /**
   * Get the hsl-saturation of this color.
   * @return {number} the hsl-saturation of this color
   */
  Color.prototype.hslSat = function hslSat() { return this._HSL_SAT }
  /**
   * Get the hsl-luminosity of this color.
   * @return {number} the hsl-luminosity of this color
   */
  Color.prototype.hslLum = function hslLum() { return this._HSL_LUM }

  /**
   * Get the hwb-hue of this color.
   * @return {number} the hwb-hue of this color
   */
  Color.prototype.hwbHue = function hwbHue() { return this._HWB_HUE }
  /**
   * Get the hwb-white of this color.
   * @return {number} the hwb-white of this color
   */
  Color.prototype.hwbWht = function hwbWht() { return this._HWB_WHT }
  /**
   * Get the hwb-black of this color.
   * @return {number} the hwb-black of this color
   */
  Color.prototype.hwbBlk = function hwbBlk() { return this._HWB_BLK }

  // Convenience getter functions.
  /**
   * Return an array of RGB components (in that order).
   * @return {Array<number>} an array of RGB components
   */
  Color.prototype.rgb = function rgb() { return [this.red(), this.green(), this.blue()] }
  /**
   * Return an array of HSV components (in that order).
   * @return {Array<number>} an array of HSV components
   */
  Color.prototype.hsv = function hsv() { return [this.hsvHue(), this.hsvSat(), this.hsvVal()] }
  /**
   * Return an array of HSL components (in that order).
   * @return {Array<number>} an array of HSL components
   */
  Color.prototype.hsl = function hsl() { return [this.hslHue(), this.hslSat(), this.hslLum()] }
  /**
   * Return an array of HWB components (in that order).
   * @return {Array<number>} an array of HWB components
   */
  Color.prototype.hwb = function hwb() { return [this.hwbHue(), this.hwbWht(), this.hwbBlk()] }


  // METHODS
  /**
   * Return a new color that is the complement of this color.
   * The complement of a color is the difference between that color and white (#fff).
   * @return {Color} a new Color object that corresponds to this color’s complement
   */
  Color.prototype.complement = function complement() {
    return new Color([
      255 - this.red()
    , 255 - this.green()
    , 255 - this.blue()
    ])
  }

  /**
   * Return a new color that is a hue-rotation of this color.
   * @param  {number} a the number of degrees to rotate
   * @return {Color} a new Color object corresponding to this color rotated by `a` degrees
   */
  Color.prototype.rotate = function rotate(a) {
    var newhue = (this.hsvHue() + a) % 360
    return Color.fromHSV(newhue, this.hsvSat(), this.hsvVal())
  }

  /**
   * Return a new color that is the inverse of this color.
   * The inverse of a color is that color with a hue rotation of 180 degrees.
   * @return {Color} a new Color object that corresponds to this color’s inverse
   */
  Color.prototype.invert = function invert() {
    return this.rotate(180)
  }

  /**
   * Return a new color that is a more saturated (more colorful) version of this color by a percentage.
   * This method calculates saturation in the HSL space.
   * A parameter of 1.0 returns a color with full saturation, and 0.0 returns an identical color.
   * A negative number will {@link Color.desaturate()|desaturate} this color.
   * @param  {number} p must be between -1.0 and 1.0; the value by which to saturate this color
   * @param  {boolean=} relative true if the saturation added is relative
   * @return {Color} a new Color object that corresponds to this color saturated by `p`
   */
  Color.prototype.saturate = function saturate(p, relative) {
    var newsat = this.hslSat() + (relative ? (this.hslSat() * p) : p)
    newsat = Math.min(Math.max(0, newsat), 1)
    return Color.fromHSL(this.hslHue(), newsat, this.hslLum())
  }

  /**
   * Return a new color that is a less saturated version of this color by a percentage.
   * A parameter of 1.0 returns a grayscale color, and 0.0 returns an identical color.
   * @see Color.saturate()
   * @param  {number} p must be between -1.0 and 1.0; the value by which to desaturate this color
   * @param  {boolean=} relative true if the saturation subtracted is relative
   * @return {Color} a new Color object that corresponds to this color desaturated by `p`
   */
  Color.prototype.desaturate = function desaturate(p, relative) {
    return this.saturate(-p, relative)
  }

  /**
   * Return a new color that is a lighter version of this color by a percentage.
   * This method calculates with luminosity in the HSL space.
   * A parameter of 1.0 returns white (#fff), and 0.0 returns an identical color.
   * A negative parameter will {@link Color.darken()|darken} this color.
   *
   * Set `relative = true` to specify the amount as relative to the color’s current luminosity.
   * For example, if `$color` has an HSL-lum of 0.5, then calling `$color.lighten(0.5)` will return
   * a new color with an HSL-lum of 1.0, because the argument 0.5 is simply added to the color’s luminosity.
   * However, calling `$color.lighten(0.5, true)` will return a new color with an HSL-lum of 0.75,
   * because the argument 0.5, relative to the color’s current luminosity of 0.5, results in
   * an added luminosity of 0.25.
   *
   * @param {number} p must be between -1.0 and 1.0; the amount by which to lighten this color
   * @param {boolean=} relative true if the luminosity added is relative
   * @return {Color} a new Color object that corresponds to this color lightened by `p`
   */
  // CHANGED DEPRECATED v2 remove
  Color.prototype.brighten = function brighten(p, relative) {
    return this.lighten(p, relative)
  }
  Color.prototype.lighten = function lighten(p, relative) {
    var newlum = this.hslLum() + (relative ? (this.hslLum() * p) : p)
    newlum = Math.min(Math.max(0, newlum), 1)
    return Color.fromHSL(this.hslHue(), this.hslSat(), newlum)
  }

  /**
   * Return a new color that is a darker version of this color by a percentage.
   * A parameter of 1.0 returns black (#000), and 0.0 returns an identical color.
   * @see Color.lighten()
   * @param {number} p must be between -1.0 and 1.0; the amount by which to darken this color
   * @param {boolean=} relative true if the luminosity subtracted is relative
   * @return {Color} a new Color object that corresponds to this color darkened by `p`
   */
  Color.prototype.darken = function darken(p, relative) {
    return this.lighten(-p, relative)
  }

  /**
   * Mix (average) another color with this color, with a given weight favoring that color.
   * If `w == 0.0`, return exactly this color.
   * `w == 1.0` return exactly the other color.
   * `w == 0.5` (default if omitted) return a perfectly even mix.
   * In other words, `w` is "how much of the other color you want."
   * Note that `color1.mix(color2, w)` returns the same result as `color2.mix(color1, 1-w)`.
   * When param `flag` is provided, this method uses a more mathematically accurate calculation,
   * thus providing a more aesthetically accurate mix.
   * TODO This will be the default behavior starting in v2.
   * @see https://www.youtube.com/watch?v=LKnqECcg6Gw
   * @param {Color} $color the second color
   * @param {number=0.5} w between 0.0 and 1.0; the weight favoring the other color
   * @param {flag=} flag if truthy, will use a more accurate calculation
   * @return {Color} a mix of the two given colors
   */
  Color.prototype.mix = function mix($color, w, flag) {
    if (arguments.length >= 2) {
      ;
    } else return this.mix($color, 0.5)
    // /**
    //  * Helper function. Average two numbers, with a weight favoring the 2nd number.
    //  * The result will always be between the two numbers.
    //  * @param  {number} a 1st number
    //  * @param  {number} b 2nd number
    //  * @param  {number} w number between [0,1]; weight of 2nd number
    //  * @return {number} the weighted average of `a` and `b`
    //  */
    // function average(a, b, w) {
    //   return (a * (1-w)) + (b * w)
    // }
    // return new Color([
    //   average(this.red(),   $color.red(),   w)
    // , average(this.green(), $color.green(), w)
    // , average(this.blue(),  $color.blue(),  w)
    // ].map(Math.round))
    if (flag) {
    return new Color([
      (1-w) * Math.pow(this.red()  , 2)  +  w * Math.pow($color.red()  , 2)
    , (1-w) * Math.pow(this.green(), 2)  +  w * Math.pow($color.green(), 2)
    , (1-w) * Math.pow(this.blue() , 2)  +  w * Math.pow($color.blue() , 2)
    ].map(function (n) { return Math.round(Math.sqrt(n)) }))
    }
    return new Color([
      (1-w) * this.red()    +  w * $color.red()
    , (1-w) * this.green()  +  w * $color.green()
    , (1-w) * this.blue()   +  w * $color.blue()
    ].map(Math.round))
  }

  /**
   * Compare this color with another color.
   * Return `true` if they are the same color.
   * @param  {Color} $color a Color object
   * @return {boolean} true if the argument is the same color as this color
   */
  Color.prototype.equals = function equals($color) {
    return (this.hsvSat()===0 && $color.hsvSat()===0 && (this.hsvVal() === $color.hsvVal())) // NOTE speedy
      || (
         (this.red()   === $color.red())
      && (this.green() === $color.green())
      && (this.blue()  === $color.blue())
      )
  }
  /**
   * Return the *contrast ratio* between two colors.
   * More info can be found at
   * {@link https://www.w3.org/TR/WCAG/#contrast-ratiodef}
   * @param {Color} $color the second color to check
   * @return {number} the contrast ratio of this color with the argument
   */
  Color.prototype.contrastRatio = function contrastRatio($color) {
    /**
     * Return the relative lumance of a color.
     * @param  {Color} c a Color object
     * @return {number} the relative lumance of the color
     */
    function luma(c) {
      /**
       * A helper function.
       * @param  {number} p a decimal representation of an rgb component of a color
       * @return {number} the output of some mathematical function of `p`
       */
      function coef(p) {
        return (p <= 0.03928) ? p/12.92 : Math.pow((p + 0.055)/1.055, 2.4)
      }
      return 0.2126*coef(c.red()  /255)
           + 0.7152*coef(c.green()/255)
           + 0.0722*coef(c.blue() /255)
    }
    var both = [luma(this), luma($color)]
    return (Math.max.apply(null, both) + 0.05) / (Math.min.apply(null, both) + 0.05)
  }

  /**
   * Return a string representation of this color.
   * If `space === 'hex'`, return `#rrggbb`
   * If `space === 'hsv'`, return `hsv(h, s, v)`
   * If `space === 'hsl'`, return `hsl(h, s, l)`
   * If `space === 'hwb'`, return `hwb(h, w, b)`
   * If `space === 'rgb'`, return `rgb(r, g, b)` (default)
   * The format of the numbers returned will be as follows:
   * - all HEX values will be base 16 integers in [00,FF], two digits
   * - HSV/HSL/HWB-hue values will be base 10 decimals in [0,360) rounded to the nearest 0.1
   * - HSV/HSL-sat/val/lum and HWB-wht/blk values will be base 10 decimals in [0,1] rounded to the nearest 0.01
   * - all RGB values will be base 10 integers in [0,255], one to three digits
   * IDEA may change the default to 'hex' instead of 'rgb', once browsers support ColorAlpha hex (#rrggbbaa)
   * https://drafts.csswg.org/css-color/#hex-notation
   * @param {string='rgb'} space represents the space in which this color exists
   * @return {string} a string representing this color.
   */
  Color.prototype.toString = function toString(space) {
    if (space === 'hex') {
      var r = Util.toHex(this.red())
      var g = Util.toHex(this.green())
      var b = Util.toHex(this.blue())
      return '#' + r + g + b
      // return `#${r}${g}${b}` // CHANGED ES6
    }
    if (space === 'hsv') {
      var h = Math.round(this.hsvHue() *  10) /  10
      var s = Math.round(this.hsvSat() * 100) / 100
      var v = Math.round(this.hsvVal() * 100) / 100
      return 'hsv(' + h + ', ' + s + ', ' + v + ')'
      // return `hsv(${h}, ${s}, ${v})` // CHANGED ES6
    }
    if (space === 'hsl') {
      var h = Math.round(this.hslHue() *  10) /  10
      var s = Math.round(this.hslSat() * 100) / 100
      var l = Math.round(this.hslLum() * 100) / 100
      return 'hsl(' + h + ', ' + s + ', ' + l + ')'
      // return `hsl(${h}, ${s}, ${l})` // CHANGED ES6
    }
    if (space === 'hwb') {
      var h = Math.round(this.hwbHue() *  10) /  10
      var w = Math.round(this.hwbWht() * 100) / 100
      var b = Math.round(this.hwbBlk() * 100) / 100
      return 'hwb(' + h + ', ' + w + ', ' + b + ')'
      // return `hwb(${h}, ${w}, ${b})` // CHANGED ES6
    }
    var r = this.red()
    var g = this.green()
    var b = this.blue()
    return 'rgb(' + r + ', ' + g + ', ' + b + ')'
    // return `rgb(${r}, ${g}, ${b})` // CHANGED ES6
  }


  // STATIC MEMBERS
  /**
   * Return a new Color object, given hue, saturation, and value in HSV-space.
   * The HSV-hue must be between 0 and 360.
   * The HSV-saturation must be between 0.0 and 1.0.
   * The HSV-value must be between 0.0 and 1.0.
   * The given argument must be an array of these three values in order.
   * Or, you may pass 3 values as 3 separate arguments.
   * CHANGED DEPRECATED starting in v2, argument must be Array<number>(3)
   * @param {(number|Array<number>)} hue must be between 0 and 360; hue in HSV-space || an Array of HSV components
   * @param {number=} sat must be between 0.0 and 1.0; saturation in HSV-space
   * @param {number=} val must be between 0.0 and 1.0; brightness in HSV-space
   * @return {Color} a new Color object with hsv(hue, sat, val)
   */
  Color.fromHSV = function fromHSV(hue, sat, val) {
    if (Array.isArray(hue)) {
      return Color.fromHSV(hue[0], hue[1], hue[2])
    }
    var c = sat * val
    var x = c * (1 - Math.abs(hue/60 % 2 - 1))
    var m = val - c
    var rgb;
         if (  0 <= hue && hue <  60) { rgb = [c, x, 0] }
    else if ( 60 <= hue && hue < 120) { rgb = [x, c, 0] }
    else if (120 <= hue && hue < 180) { rgb = [0, c, x] }
    else if (180 <= hue && hue < 240) { rgb = [0, x, c] }
    else if (240 <= hue && hue < 300) { rgb = [x, 0, c] }
    else if (300 <= hue && hue < 360) { rgb = [c, 0, x] }
    return new Color(rgb.map(function (el) { return Math.round((el + m) * 255) }))
  }

  /**
   * Return a new Color object, given hue, saturation, and luminosity in HSL-space.
   * The HSL-hue must be between 0 and 360.
   * The HSL-saturation must be between 0.0 and 1.0.
   * The HSL-luminosity must be between 0.0 and 1.0.
   * The given argument must be an array of these three values in order.
   * Or, you may pass 3 values as 3 separate arguments.
   * CHANGED DEPRECATED starting in v2, argument must be Array<number>(3)
   * @param {(number|Array<number>)} hue must be between 0 and 360; hue in HSL-space || an Array of HSL components
   * @param {number=} sat must be between 0.0 and 1.0; saturation in HSL-space
   * @param {number=} lum must be between 0.0 and 1.0; luminosity in HSL-space
   * @return {Color} a new Color object with hsl(hue, sat, lum)
   */
  Color.fromHSL = function fromHSL(hue, sat, lum) {
    if (Array.isArray(hue)) {
      return Color.fromHSL(hue[0], hue[1], hue[2])
    }
    var c = sat * (1 - Math.abs(2*lum - 1))
    var x = c * (1 - Math.abs(hue/60 % 2 - 1))
    var m = lum - c/2
    var rgb;
         if (  0 <= hue && hue <  60) { rgb = [c, x, 0] }
    else if ( 60 <= hue && hue < 120) { rgb = [x, c, 0] }
    else if (120 <= hue && hue < 180) { rgb = [0, c, x] }
    else if (180 <= hue && hue < 240) { rgb = [0, x, c] }
    else if (240 <= hue && hue < 300) { rgb = [x, 0, c] }
    else if (300 <= hue && hue < 360) { rgb = [c, 0, x] }
    return new Color(rgb.map(function (el) { return Math.round((el + m) * 255) }))
  }

  /**
   * Return a new Color object, given hue, white, and black in HWB-space.
   * Credit for formula is due to https://drafts.csswg.org/css-color/#hwb-to-rgb
   * The HWB-hue must be between 0 and 360.
   * The HWB-white must be between 0.0 and 1.0.
   * The HWB-black must be between 0.0 and 1.0.
   * The given argument must be an array of these three values in order.
   * Or, you may pass 3 values as 3 separate arguments.
   * CHANGED DEPRECATED starting in v2, argument must be Array<number>(3)
   * @param {(number|Array<number>)} hue must be between 0 and 360; hue in HWB-space || an Array of HWB components
   * @param {number=} wht must be between 0.0 and 1.0; white in HWB-space
   * @param {number=} blk must be between 0.0 and 1.0; black in HWB-space
   * @return {Color} a new Color object with hwb(hue, wht, blk)
   */
  Color.fromHWB = function fromHWB(hue, wht, blk) {
    if (Array.isArray(hue)) {
      return Color.fromHWB(hue[0], hue[1], hue[2])
    }
    return Color.fromHSV(hue, 1 - wht / (1 - blk), 1 - blk)
    // HWB -> RGB:
    /*
    var rgb = Color.fromHSL(hue, 1, 0.5).rgb().map(function (el) { return el / 255 })
    for (var i = 0; i < 3; i++) {
      rgb[i] *= (1 - white - black);
      rgb[i] += white;
    }
    return new Color(rgb.map(function (el) { return Math.round(el * 255) }))
     */
  }

  /**
   * Return a new Color object, given a string.
   * The string may have either of the following formats:
   * 1. `#rrggbb`, with hexadecimal RGB components (in base 16, out of ff, lowercase). The `#` must be included.
   * 2. `rgb(r,g,b)` or `rgb(r, g, b)`, with integer RGB components (in base 10, out of 255).
   * 3. `hsv(h,s,v)` or `hsv(h, s, v)`, with decimal HSV components (in base 10).
   * 4. `hsl(h,s,l)` or `hsl(h, s, l)`, with decimal HSL components (in base 10).
   * 5. `hwb(h,w,b)` or `hwb(h, w, b)`, with decimal HWB components (in base 10).
   * @param {string} str a string of one of the forms described
   * @return {Color} a new Color object constructed from the given string
   */
  Color.fromString = function fromString(str) {
    if (str.slice(0,1) === '#' && str.length === 7) {
      return new Color([
        str.slice(1,3)
      , str.slice(3,5)
      , str.slice(5,7)
      ].map(Util.toDec))
    }
    if (str.slice(0,4) === 'rgb(') {
      return new Color(Util.components(4, str))
    }
    if (str.slice(0,4) === 'hsv(') {
      return Color.fromHSV.apply(null, Util.components(4, str))
    }
    if (str.slice(0,4) === 'hsl(') {
      return Color.fromHSL.apply(null, Util.components(4, str))
    }
    if (str.slice(0,4) === 'hwb(') {
      return Color.fromHWB.apply(null, Util.components(4, str))
    }
    return null
  }

  /**
   * Mix (average) a set of 2 or more colors. The average will be weighted evenly.
   * If two colors $a and $b are given, calling this static method, `Color.mix([$a, $b])`,
   * is equivalent to calling `$a.mix($b)` without a weight.
   * However, calling `Color.mix([$a, $b, $c])` with 3 or more colors yields an even mix,
   * and will *NOT* yield the same results as calling `$a.mix($b).mix($c)`, which yields an uneven mix.
   * Note that the order of the given colors does not change the result, that is,
   * `Color.mix([$a, $b])` will return the same result as `Color.mix([$b, $a])`.
   * When param `flag` is provided, this method uses a more mathematically accurate calculation,
   * thus providing a more aesthetically accurate mix.
   * TODO This will be the default behavior starting in v2.
   * @param {Array<Color>} $colors an array of Color objects, of length >=2
   * @param {flag=} flag if truthy, will use a more accurate calculation
   * @return {Color} a mix of the given colors
   */
  Color.mix = function mix($colors, flag) {
    return new Color([
      $colors.map(function ($c) { return $c.red()   })
    , $colors.map(function ($c) { return $c.green() })
    , $colors.map(function ($c) { return $c.blue()  })
    ].map(function ($arr) {
      if (flag) return Math.round(Math.sqrt($arr.reduce(function (a, b) { return a*a + b*b }) / $colors.length))
      return Math.round($arr.reduce(function (a, b) { return a + b }) / $colors.length)
    }))
  }

  return Color
})()

},{"./Util.class.js":4}],3:[function(require,module,exports){
var Util = require('./Util.class.js')
var Color = require('./Color.class.js')

/**
 * A 32-bit color that can be displayed in a pixel, given three primary color components
 * and a transparency component.
 * @type {ColorAlpha}
 * @extends Color
 */
module.exports = (function () {
  // CONSTRUCTOR
  /**
   * Construct a ColorAlpha object.
   * Valid parameters:
   * - new ColorAlpha([60, 120, 240], 0.7) // [red, green, blue], alpha (translucent, rgba(r, g, b, alpha))
   * - new ColorAlpha([192], 0.7)          // [grayscale], alpha        (translucent, rgba(r, r, r, alpha))
   * - new ColorAlpha([60, 120, 240])      // [red, green, blue]        (opaque, rgba(r, g, b, 1.0))
   * - new ColorAlpha([192])               // [grayscale]               (opaque, rgba(r, r, r, 1.0))
   * - new ColorAlpha(0.7)                 // alpha                     (rgba(0, 0, 0, alpha), translucent black)
   * - new ColorAlpha()                    //                           (rgba(0, 0, 0, 0.0), transparent)
   * You may pass both an RGB array and an alpha, or either one, or neither.
   * See {@see Color} for specs on the RGB array. The alpha must be a (decimal) number 0–1.
   * If RGB is given, alpha defaults to 1.0 (opaque).
   * If no RGB is given, alpha defaults to 0.0 (transparent).
   * @constructor
   * @param {Array<number>=[0]} $rgb an array of 1 or 3 integers in [0,255]
   * @param {number=(1|0)} alpha a number in [0,1]; the alpha, or opacity, of this color
   */
  function ColorAlpha($rgb, alpha) {
    var self = this
    if (arguments.length >= 2 && $rgb.length >= 3) {
      ;
    } else if (arguments.length >= 2) {
      return ColorAlpha.call(self, [$rgb[0], $rgb[0], $rgb[0]], alpha)
    } else if (arguments.length >= 1 && $rgb instanceof Array) {
      return ColorAlpha.call(self, $rgb, 1)
    } else if (arguments.length >= 1) {
      return ColorAlpha.call(self, [0], $rgb)
    } else /* if (arguments.length < 1) */ {
      return ColorAlpha.call(self, 0)
    }

    // call the super. if alpha===0 then this color’s rgb will be [0,0,0].
    if (alpha !== 0) Color.call(self, $rgb)
    else             Color.call(self)

    /**
     * The alpha component of this color. An number in [0,1].
     * @type {number}
     */
    self._ALPHA = alpha
  }
  ColorAlpha.prototype = Object.create(Color.prototype)
  ColorAlpha.prototype.constructor = ColorAlpha


  // ACCESSOR FUNCTIONS
  /**
   * Get the alpha (opacity) of this color.
   * @return {number} the alpha of this color
   */
  ColorAlpha.prototype.alpha = function alpha() { return this._ALPHA }

  // Convenience getter functions.
  /**
   * Return an array of RGBA components (in that order).
   * @return {Array<number>} an array of RGBA components
   */
  ColorAlpha.prototype.rgba = function rgba() { return this.rgb().concat(this.alpha()) }
  /**
   * Return an array of HSVA components (in that order).
   * @return {Array<number>} an array of HSVA components
   */
  ColorAlpha.prototype.hsva = function hsva() { return this.hsv().concat(this.alpha()) }
  /**
   * Return an array of HSLA components (in that order).
   * @return {Array<number>} an array of HSLA components
   */
  ColorAlpha.prototype.hsla = function hsla() { return this.hsl().concat(this.alpha()) }
  /**
   * Return an array of HWBA components (in that order).
   * @return {Array<number>} an array of HWBA components
   */
  ColorAlpha.prototype.hwba = function hwba() { return this.hwb().concat(this.alpha()) }


  // METHODS

  /**
   * @override
   * @return {ColorAlpha} the complement of this color
   */
  ColorAlpha.prototype.complement = function complement() {
    return new ColorAlpha(Color.prototype.complement.call(this).rgb(), this.alpha())
  }

  /**
   * @override
   * @param  {number} a the number of degrees to rotate
   * @return {ColorAlpha} a new color corresponding to this color rotated by `a` degrees
   */
  ColorAlpha.prototype.rotate = function rotate(a) {
    return new ColorAlpha(Color.prototype.rotate.call(this, a).rgb(), this.alpha())
  }

  /**
   * @override
   * @param  {number} p must be between -1.0 and 1.0; the value by which to saturate this color
   * @param  {boolean=} relative true if the saturation added is relative
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color saturated by `p`
   */
  ColorAlpha.prototype.saturate = function saturate(p, relative) {
    return new ColorAlpha(Color.prototype.saturate.call(this, p, relative).rgb(), this.alpha())
  }

  /**
   * @override
   * @param {number} p must be between -1.0 and 1.0; the amount by which to lighten this color
   * @param {boolean=} relative true if the luminosity added is relative
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color lightened by `p`
   */
  // CHANGED DEPRECATED v2 remove
  ColorAlpha.prototype.brighten = function brighten(p, relative) {
    return this.lighten(p, relative)
  }
  ColorAlpha.prototype.lighten = function lighten(p, relative) {
    return new ColorAlpha(Color.prototype.lighten.call(this, p, relative).rgb(), this.alpha())
  }

  /**
   * Return a new color with the complemented alpha of this color.
   * An alpha of, for example, 0.7, complemented, is 0.3 (the complement with 1.0).
   * @return {ColorAlpha} a new ColorAlpha object with the same color but complemented alpha
   */
  ColorAlpha.prototype.negative = function negative() {
    return new ColorAlpha(this.rgb(), 1 - this.alpha())
  }

  /**
   * @override
   * @param {Color} $color the second color; may also be an instance of ColorAlpha
   * @param {number=0.5} w between 0.0 and 1.0; the weight favoring the other color
   * @param {flag=} flag if truthy, will use a more accurate mixing calculation
   * @return {ColorAlpha} a mix of the two given colors
   */
  ColorAlpha.prototype.mix = function mix($color, w, flag) {
    var newColor = Color.prototype.mix.call(this, $color, w, flag)
    var newAlpha = (function compoundOpacity(a, b) {
      return 1 - ( (1-a) * (1-b) )
    })(this.alpha(), ($color instanceof ColorAlpha) ? $color.alpha() : 1)
    return new ColorAlpha(newColor.rgb(), newAlpha)
  }

  /**
   * @override
   * @param  {ColorAlpha} $colorAlpha a ColorAlpha object
   * @return {boolean} true if the argument is the same color as this color
   */
  ColorAlpha.prototype.equals = function equals($colorAlpha) {
    var sameAlphas = (this.alpha() === $color.alpha()) // NOTE speedy
    return sameAlphas && (this.alpha()===0 || Color.prototype.equals.call(this, $colorAlpha))
  }

  /**
   * Return a string representation of this color.
   * If `space === 'hex'`,  return `#rrggbbaa`
   * If `space === 'hsva'`, return `hsva(h, s, v, a)`
   * If `space === 'hsla'`, return `hsla(h, s, l, a)`
   * If `space === 'hwba'`, return `hwba(h, w, b, a)` // NOTE not supported yet
   * If `space === 'rgba'`, return `rgba(r, g, b, a)` (default)
   * The format of the numbers returned will be as follows:
   * - all HEX values for RGB, and hue/sat/val/lum will be of the same format as described in
   *   {@link Color#toString}
   * - all alpha values will be base 10 decimals in [0,1], rounded to the nearest 0.001
   * IDEA may change the default to 'hex' instead of 'rgba', once browsers support ColorAlpha hex (#rrggbbaa)
   * https://drafts.csswg.org/css-color/#hex-notation
   * @override
   * @param {string='rgba'} space represents the space in which this color exists
   * @return {string} a string representing this color.
   */
  ColorAlpha.prototype.toString = function toString(space) {
    var a = Math.round(this.alpha() * 1000) / 1000
    // CHANGED v2 remove 'hexa'
    if (space === 'hex' || space==='hexa') {
      return Color.prototype.toString.call(this, 'hex') + Util.toHex(Math.round(this.alpha()*255))
    }
    if (space === 'hsva') {
      return 'hsva(' + Color.prototype.toString.call(this, 'hsv').slice(4, -1) + ', ' + a + ')'
      // return `hsva(${Color.prototype.toString.call(this, 'hsv').slice(4, -1)}, ${a})` // CHANGED ES6
    }
    if (space === 'hsla') {
      return 'hsla(' + Color.prototype.toString.call(this, 'hsl').slice(4, -1) + ', ' + a + ')'
      // return `hsla(${Color.prototype.toString.call(this, 'hsl').slice(4, -1)}, ${a})` // CHANGED ES6
    }
    if (space === 'hwba') {
      return 'hwba(' + Color.prototype.toString.call(this, 'hwb').slice(4, -1) + ', ' + a + ')'
      // return `hwba(${Color.prototype.toString.call(this, 'hwb').slice(4, -1)}, ${a})` // CHANGED ES6
    }
    return 'rgba(' + Color.prototype.toString.call(this, 'rgb').slice(4, -1) + ', ' + a + ')'
    // return `rgba(${Color.prototype.toString.call(this, 'rgb').slice(4, -1)}, ${a})` // CHANGED ES6
  }


  // STATIC MEMBERS
  /**
   * Return a new ColorAlpha object, given hue, saturation, and value in HSV-space,
   * and an alpha component.
   * The alpha must be between 0.0 and 1.0.
   * The first argument must be an array of these three values in order.
   * Or, you may pass 3 values as the first 3 arguments.
   * CHANGED DEPRECATED starting in v2, first argument must be Array<number>(3)
   * @see Color.fromHSV
   * @param {(number|Array<number>)} hue must be between 0 and 360; hue in HSV-space || an Array of HSV components
   * @param {number} sat must be between 0.0 and 1.0; saturation in HSV-space || alpha (opacity)
   * @param {number=} val must be between 0.0 and 1.0; brightness in HSV-space
   * @param {number=} alpha must be between 0.0 and 1.0; alpha (opacity)
   * @return {ColorAlpha} a new ColorAlpha object with hsva(hue, sat, val, alpha)
   */
  ColorAlpha.fromHSVA = function fromHSVA(hue, sat, val, alpha) {
    if (Array.isArray(hue)) {
      return Color.fromHSVA(hue[0], hue[1], hue[2], sat)
    }
    return new ColorAlpha(Color.fromHSV([hue, sat, val]).rgb(), alpha)
  }

  /**
   * Return a new ColorAlpha object, given hue, saturation, and luminosity in HSL-space,
   * and an alpha component.
   * The alpha must be between 0.0 and 1.0.
   * The first argument must be an array of these three values in order.
   * Or, you may pass 3 values as the first 3 arguments.
   * CHANGED DEPRECATED starting in v2, first argument must be Array<number>(3)
   * @see Color.fromHSL
   * @param {(number|Array<number>)} hue must be between 0 and 360; hue in HSL-space || an Array of HSL components
   * @param {number} sat must be between 0.0 and 1.0; saturation in HSL-space || alpha (opacity)
   * @param {number=} lum must be between 0.0 and 1.0; luminosity in HSL-space
   * @param {number=} alpha must be between 0.0 and 1.0; alpha (opacity)
   * @return {ColorAlpha} a new ColorAlpha object with hsla(hue, sat, lum, alpha)
   */
  ColorAlpha.fromHSLA = function fromHSLA(hue, sat, lum, alpha) {
    if (Array.isArray(hue)) {
      return Color.fromHSVA(hue[0], hue[1], hue[2], sat)
    }
    return new ColorAlpha(Color.fromHSL([hue, sat, lum]).rgb(), alpha)
  }

  /**
   * Return a new ColorAlpha object, given hue, white, and black in HWB-space,
   * and an alpha component.
   * The alpha must be between 0.0 and 1.0.
   * The first argument must be an array of these three values in order.
   * Or, you may pass 3 values as the first 3 arguments.
   * CHANGED DEPRECATED starting in v2, first argument must be Array<number>(3)
   * @see Color.fromHWB
   * @param {(number|Array<number>)} hue must be between 0 and 360; hue in HWB-space || an Array of HWB components
   * @param {number} wht must be between 0.0 and 1.0; white in HWB-space || alpha (opacity)
   * @param {number=} blk must be between 0.0 and 1.0; black in HWB-space
   * @param {number=} alpha must be between 0.0 and 1.0; alpha (opacity)
   * @return {ColorAlpha} a new ColorAlpha object with hwba(hue, wht, blk, alpha)
   */
  ColorAlpha.fromHWBA = function fromHWBA(hue, wht, blk, alpha) {
    if (Array.isArray(hue)) {
      return Color.fromHSVA(hue[0], hue[1], hue[2], wht)
    }
    return new ColorAlpha(Color.fromHWB([hue, wht, blk]).rgb(), alpha)
  }

  /**
   * Return a new ColorAlpha object, given a string.
   * The string may have any of the formats described in
   * {@link Color.fromString}, or it may have either of the following formats,
   * with the alpha component as a base 10 decimal between 0.0 and 1.0.
   * 1. `#rrggbbaa`, where `aa` is alpha
   * 2. `rgba(r,g,b,a)` or `rgba(r, g, b, a)`, where `a` is alpha
   * 3. `hsva(h,s,v,a)` or `hsva(h, s, v, a)`, where `a` is alpha
   * 4. `hsla(h,s,l,a)` or `hsla(h, s, l, a)`, where `a` is alpha
   * 4. `hwba(h,w,b,a)` or `hwba(h, w, b, a)`, where `a` is alpha
   * @see Color.fromString
   * @param {string} str a string of one of the forms described
   * @return {ColorAlpha} a new ColorAlpha object constructed from the given string
   */
  ColorAlpha.fromString = function fromString(str) {
    var is_opaque = Color.fromString(str)
    if (is_opaque) {
      return new ColorAlpha(is_opaque.rgb())
    }
    if (str.slice(0,1) === '#' && str.length === 9) {
      return new ColorAlpha([
        str.slice(1,3)
      , str.slice(3,5)
      , str.slice(5,7)
      ].map(Util.toDec), Util.toDec(str.slice(7,9))/255)
    }
    if (str.slice(0,5) === 'rgba(') {
      var comps = Util.components(5, str)
      return new ColorAlpha(comps.slice(0,3), comps[3])
    }
    if (str.slice(0,5) === 'hsva(') {
      return ColorAlpha.fromHSVA.apply(null, Util.components(5, str))
    }
    if (str.slice(0,5) === 'hsla(') {
      return ColorAlpha.fromHSLA.apply(null, Util.components(5, str))
    }
    if (str.slice(0,5) === 'hwba(') {
      return ColorAlpha.fromHWBA.apply(null, Util.components(5, str))
    }
    return null
  }

  /**
   * ColorAlpha equivalent of `Color.mix`.
   * @see Color.mix
   * @param {Array<Color>} $colors an array of Color (or ColorAlpha) objects, of length >=2
   * @return {ColorAlpha} a mix of the given colors
   */
  ColorAlpha.mix = function mix($colors) {
    var newColor = Color.mix($colors, true)
    var newAlpha = 1 - $colors.map(function ($c) {
      return ($c instanceof ColorAlpha) ? $c.alpha() : 1
    }).reduce(function (a, b) { return (1-a) * (1-b) })
    return new ColorAlpha(newColor.rgb(), newAlpha)
  }

  return Color
})()

},{"./Color.class.js":2,"./Util.class.js":4}],4:[function(require,module,exports){
/**
 * A utility class for performing calculations. Contains only static members.
 * This class is *not* exported with the package.
 * @type {Util}
 */
module.exports = (function () {
  // CONSTRUCTOR
  function Util() {}


  // ACCESSOR FUNCTIONS

  // METHODS

  // STATIC MEMBERS
  /**
   * Convert a decimal number to a hexadecimal number, as a string.
   * The given number must be an integer within 0–255.
   * The returned string is in lowercase.
   * @param  {number} n an integer in base 10
   * @return {string} an integer in base 16 as a string
   */
  Util.toHex = function toHex(n) {
    return '0123456789abcdef'.charAt((n - n % 16) / 16) + '0123456789abcdef'.charAt(n % 16)
  }

  /**
   * Convert a hexadecimal number (as a string) to a decimal number.
   * The hexadecimal number must be a string of exactly 2 characters,
   * each of which is a digit `0–9` or `a–f`.
   * @param  {string} n a number in base 16 as a string
   * @return {number} a number in base 10
   */
  Util.toDec = function toDec(n) {
    var tens, ones
    for (var i = 0; i < 16; i++) {
      if ('0123456789abcdef'.charAt(i) === n.slice(0,1)) tens = i*16
      if ('0123456789abcdef'.charAt(i) === n.slice(1,2)) ones = i
    }
    return tens + ones
  }

  /**
   * Return an array of comma-separated numbers extracted from a string.
   * The string must be of the form `xxx(a, b, c, ...)` or `xxx(a,b,c,...)`, where
   * `a`, `b`, and `c`, etc. are numbers, and `xxx` is any `n-1` number of characters
   * (if n===4 then `xxx` must be 3 characters).
   * Any number of prefixed characters and comma-separated numbers may be given. Spaces are optional.
   * Examples:
   * ```
   * components(4, 'rgb(20, 32,044)') === [20, 32, 44]
   * components(5, 'hsva(310,0.7, .3, 1/2)') === [310, 0.7, 0.3, 0.5]
   * ```
   * @param  {number} n the starting point of extraction
   * @param  {string} s the string to dissect
   * @return {Array<number>} an array of numbers
   */
  Util.components = function components(n, s) {
    return s.slice(n, -1).split(',').map(function (el) { return +el })
  }

  return Util
})()

},{}],5:[function(require,module,exports){
module.exports = {
  Color: require('./Color.class.js')
, ColorAlpha: require('./ColorAlpha.class.js')
}

},{"./Color.class.js":2,"./ColorAlpha.class.js":3}]},{},[1]);

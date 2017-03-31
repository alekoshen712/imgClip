class imgClip {
  constructor (config) {

    this.cfg = config || {
        container: null,
        file: null,
        width: 500,
        height: 300,
        cWidth: 120,
        cHeight: 120,
        curScale: 1,
        clipShape: 'circle',
        sliderTop: 10,
        sliderBottom: 10,
        maxScale: 2
    }
    this.container = this.cfg.container
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.offScreenCanvas = document.createElement('canvas')
    this.offScreenCtx = this.offScreenCanvas.getContext('2d')
    this.slider = document.createElement('input')

    this.file = this.cfg.file
    this.img = new Image()
    this.clipShape = this.cfg.clipShape
    this.ognImgWidth = 0
    this.ognImgHeith = 0
    this.curImgWidth = 0
    this.curImgHeight = 0
    this.midDisX = (this.canvas.width - this.curImgWidth) / 2
    this.midDisY = (this.canvas.height - this.curImgHeight) / 2
    this.ognImgTranslateX = 0
    this.ognImgTranslateY = 0
    this.curImgTranslateX = 0
    this.curImgTranslateY = 0
    this.mouseDownX = 0
    this.mouseDownY = 0
    this.curScale = this.cfg.curScale
    this.maxScale = this.cfg.maxScale
    this.bgImg = new Image()
    this.init()
  }

  init () {
    this.destroy()
    this.bgImg.src = 'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMxMjg1RUZGN0U1RDExRTFCOEZCREU5NEM0NjZCMUZEIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMxMjg1RUZFN0U1RDExRTFCOEZCREU5NEM0NjZCMUZEIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzEyODVFRkE3RTVEMTFFMUI4RkJERTk0QzQ2NkIxRkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzEyODVFRkI3RTVEMTFFMUI4RkJERTk0QzQ2NkIxRkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAACAgICAgICAgICAwICAgMEAwICAwQFBAQEBAQFBgUFBQUFBQYGBwcIBwcGCQkKCgkJDAwMDAwMDAwMDAwMDAwMAQMDAwUEBQkGBgkNCwkLDQ8ODg4ODw8MDAwMDA8PDAwMDAwMDwwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAFTAcYDAREAAhEBAxEB/8QATgABAQAAAAAAAAAAAAAAAAAACAkBAQAAAAAAAAAAAAAAAAAAAAAQAQEBAQAAAAAAAAAAAAAAAABB8AERAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AL+AGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGXQDQDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzAf/2Q=='
    this.img.onload = () => {
      this.initSlider()
      this.initCanvas()
      this.initOffScreenCanvas()
      this.adjustImgSize()
      this.drawCanvas()
      this.calculateOgnBorder()
      this.bindEvent()
      this.appendToDocument()
    }
    let reader = new FileReader()
    reader.readAsDataURL(this.file)
    reader.onload = () => {
      this.img.src = reader.result
    }
  }

  initSlider () {
    this.slider.setAttribute('type', 'range')
    this.slider.setAttribute('max', this.maxScale)
    this.slider.setAttribute('min', 1)
    this.slider.setAttribute('value', this.curScale)
    this.slider.setAttribute('step', 0.01)
    this.slider.style.display = 'block'
    this.slider.style.width = '50%'
    this.slider.style.margin = `${this.cfg.sliderTop}px auto ${this.cfg.sliderBottom}px`
  }

  initCanvas () {
    this.canvas.style.cursor = 'move'
    this.canvas.width = this.cfg.width
    this.canvas.height = this.cfg.height
  }

  initOffScreenCanvas () {
    this.offScreenCanvas.width = this.cfg.cWidth
    this.offScreenCanvas.height = this.cfg.cHeight
  }

  drawCanvas (scale = this.curScale, moveX = 0, moveY = 0) {
    this.curScale = scale
    this.curImgWidth = this.ognImgWidth * this.curScale
    this.curImgHeight = this.ognImgHeight * this.curScale
    this.midDisX = (this.canvas.width - this.curImgWidth) / 2 + this.curImgTranslateX
    this.midDisY = (this.canvas.height - this.curImgHeight) / 2 + this.curImgTranslateY
    this.resetCanvas(this.canvas)
    this.ctx.drawImage(this.bgImg, 0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.img, this.midDisX, this.midDisY, this.curImgWidth, this.curImgHeight)
    this.ctx.fillStyle = 'rgba(255,255,255,0.6)'
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height)
    if (this.clipShape === 'circle') {
      this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.cfg.cWidth / 2, 0, 2 * Math.PI)
    }
    if (this.clipShape === 'rect') {
      this.ctx.rect((this.canvas.width - this.cfg.cWidth) / 2, (this.canvas.height - this.cfg.cHeight) / 2, this.cfg.cWidth, this.cfg.cHeight)
    }
    this.ctx.clip()
    this.ctx.drawImage( this.img , this.midDisX , this.midDisY , this.curImgWidth , this.curImgHeight )
  }

  resetCanvas (canvas) {
    canvas.width = canvas.width
    canvas.height = canvas.height
  }

  adjustImgSize () {
    let scale = this.img.width / this.img.height
    if (this.img.width < this.img.height) {
      this.curImgWidth = this.ognImgWidth = this.cfg.cWidth
      this.curImgHeight = this.ognImgHeight = this.ognImgWidth / scale
    } else {
      this.curImgHeight = this.ognImgHeight = this.cfg.cHeight
      this.curImgWidth = this.ognImgWidth = this.ognImgHeight * scale
    }
  }

  bindEvent () {
    let that = this
    let moveImg = this.moveImg.bind(this)
    let handleMouseUp =  () => {
      that.ognImgTranslateX = that.curImgTranslateX
      that.ognImgTranslateY = that.curImgTranslateY
      that.calculateOgnBorder()
      document.removeEventListener('mousemove', moveImg)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    this.canvas.addEventListener('mousedown', (e) => {
      that.mouseDownX = e.clientX
      that.mouseDonwY = e.clientY
      document.addEventListener('mousemove', moveImg)
      document.addEventListener('mouseup', handleMouseUp)
    })

    this.slider.onchange = () => {
      this.drawCanvas(this.slider.value)
      this.calculateOgnBorder()
    }

    this.slider.addEventListener('mousedown', () => {
      let A = () => {
        this.drawCanvas(this.slider.value)
        this.calculateOgnBorder()
      }
      this.slider.addEventListener('mousemove', A)
      this.slider.addEventListener('mouseup', () => {
        this.slider.removeEventListener('mousemove', A)
      })
    })
  }

  moveImg (e) {
    let moveX = e.clientX - this.mouseDownX
    let moveY = e.clientY - this.mouseDonwY
    this.setCurImgTranslate(moveX, moveY)
    this.drawCanvas(this.curScale)
  }

  setCurImgTranslate (x, y) {
    if (x < 0) {
      this.curImgTranslateX = this.ognImgTranslateX + (this.canMoveLeft(x) ? x : -this.ognBorder.right)
    }
    if (x > 0) {
      this.curImgTranslateX = this.ognImgTranslateX + (this.canMoveRight(x) ? x : this.ognBorder.left)
    }
    if (y > 0) {
      this.curImgTranslateY = this.ognImgTranslateY + (this.canMoveBottom(y) ? y : this.ognBorder.top)
    }
    if (y < 0) {
      this.curImgTranslateY = this.ognImgTranslateY + (this.canMoveTop(y) ? y : -this.ognBorder.bottom)
    }
  }

  getImgData () {
    this.resetCanvas(this.offScreenCanvas)
    let bl_x = this.img.width / this.curImgWidth
    let bl_y = this.img.height / this.curImgHeight
    this.offScreenCtx.arc(this.offScreenCanvas.width / 2, this.offScreenCanvas.height / 2, this.offScreenCanvas.width / 2, 0, 2 * Math.PI)
    this.offScreenCtx.clip()
    let sx = (this.curImgWidth / 2 - this.offScreenCanvas.width / 2 - this.curImgTranslateX) * bl_x
    let sy = (this.curImgHeight / 2 - this.offScreenCanvas.height / 2 - this.curImgTranslateY) * bl_y
    this.offScreenCtx.drawImage(this.img, sx, sy, this.offScreenCanvas.width * bl_x, this.offScreenCanvas.height * bl_y, 0, 0, this.offScreenCanvas.width, this.offScreenCanvas.height)
    return this.offScreenCanvas.toDataURL()
  }

  calculateOgnBorder () {
    this.ognBorder = {
      left: Math.floor(this.curImgWidth - this.cfg.cWidth) / 2 - this.curImgTranslateX,
      right: Math.floor(this.curImgWidth - this.cfg.cWidth) / 2 + this.curImgTranslateX,
      top: Math.floor(this.curImgHeight - this.cfg.cHeight) / 2 - this.curImgTranslateY,
      bottom: Math.floor(this.curImgHeight - this.cfg.cHeight) / 2 + this.curImgTranslateY
    }
  }

  calculateCurBorder () {
    this.curBorder = {
      left: Math.floor(this.curImgWidth - this.cfg.cWidth) / 2 - this.curImgTranslateX,
      right:Math.floor(this.curImgWidth - this.cfg.cWidth) / 2 + this.curImgTranslateX,
      top: Math.floor(this.curImgHeight - this.cfg.cHeight) / 2 - this.curImgTranslateY,
      bottom: Math.floor(this.curImgHeight - this.cfg.cHeight) / 2 + this.curImgTranslateY
    }
  }

  canMoveLeft (x) {
    return Math.abs(x) < this.ognBorder.right
  }
  canMoveRight (x) {
    return Math.abs(x) < this.ognBorder.left
  }
  canMoveTop (x) {
    return Math.abs(x) < this.ognBorder.bottom
  }
  canMoveBottom (x) {
    return Math.abs(x) < this.ognBorder.top
  }

  appendToDocument () {
    this.container.appendChild(this.canvas)
    this.container.appendChild(this.slider)
  }

  destroy () {
    console.log(1)
    this.container.innerHTML = ''
  }
}


export default imgClip


// var s = null
// s = new imgClip({
//   container: document.querySelector('#t'),
//   width: 250,
//   height: 150,
//   cWidth: 120,
//   cHeight: 120,
//   imgSrc: './i5.jpg',
//   clipShape: 'circle',
//   maxScale: 3,
//   curScale: 1,
//   sliderTop: 10,
//   sliderBottom: 10
// })
//
// var btn = document.querySelector('#btn')
// var img1 = document.querySelector('#img')
// btn.addEventListener('click', () => {
//   img1.src = s.getImgData()
// })

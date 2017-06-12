class imgClip {
  constructor(cfg) {
    this.cfg = cfg
    this.container = this.cfg.container
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.offScreenCanvas = document.createElement('canvas')
    this.offScreenCtx = this.offScreenCanvas.getContext('2d')
    this.slider = document.createElement('input')

    this.file = this.cfg.file

    this.img = new Image
    this.bgImg = new Image

    this.clipShape = this.cfg.clipShape || 'circle'

    this.curScale = this.cfg.curScale
    this.maxScale = this.cfg.maxScale

    this.init()
  }

  init() {
    this.destroy()
    this.initImg().then(() => {
      this.adjustImgSize()
      this.initCanvas()
      this.initOffScreenCanvas()
      this.initSlider()
      this.appendToDocument()
      this.bindEvent()
    })
  }

  initImg() {
    return Promise.all([this.initBgImg(), this.initUploadImg()])
  }

  initUploadImg () {
    return new Promise(resolve => {
      this.img.onload = () => resolve()
      let r = new FileReader
      r.readAsDataURL(this.file)
      r.onload = () => {
        this.img.src = r.result
      }
    })
  }

  initBgImg () {
    return new Promise(resolve => {
      this.bgImg.onload = () => resolve()
      this.bgImg.src = 'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMxMjg1RUZGN0U1RDExRTFCOEZCREU5NEM0NjZCMUZEIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMxMjg1RUZFN0U1RDExRTFCOEZCREU5NEM0NjZCMUZEIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzEyODVFRkE3RTVEMTFFMUI4RkJERTk0QzQ2NkIxRkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzEyODVFRkI3RTVEMTFFMUI4RkJERTk0QzQ2NkIxRkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAACAgICAgICAgICAwICAgMEAwICAwQFBAQEBAQFBgUFBQUFBQYGBwcIBwcGCQkKCgkJDAwMDAwMDAwMDAwMDAwMAQMDAwUEBQkGBgkNCwkLDQ8ODg4ODw8MDAwMDA8PDAwMDAwMDwwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAFTAcYDAREAAhEBAxEB/8QATgABAQAAAAAAAAAAAAAAAAAACAkBAQAAAAAAAAAAAAAAAAAAAAAQAQEBAQAAAAAAAAAAAAAAAABB8AERAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AL+AGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGYAZgZgBmBmAGYGXQDQDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMpzUDNAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADKc1AzQDMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAynNQM0AzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzADMDMAMwMwAzAzAf/2Q=='
    })
  }

  initCanvas() {
    this.canvas.style.cursor = 'move'
    this.canvas.width = this.cfg.width
    this.canvas.height = this.cfg.height
    // 开始的时候图片是居中的
    this.ognDisX = this.curDisX = (this.canvas.width - this.ognImgWidth * this.curScale) / 2
    this.ognDisY = this.curDisY = (this.canvas.height - this.ognImgHeight * this.curScale) / 2
    this.drawCanvas(this.ognDisX, this.ognDisY, this.ognImgWidth * this.curScale, this.ognImgHeight * this.curScale)
  }

  initOffScreenCanvas() {
    this.offScreenCanvas.width = this.cfg.cWidth
    this.offScreenCanvas.height = this.cfg.cHeight
  }

  initSlider() {
    this.slider.setAttribute('type', 'range')
    this.slider.setAttribute('max', this.maxScale)
    this.slider.setAttribute('min', 1)
    this.slider.setAttribute('value', this.curScale)
    this.slider.setAttribute('step', 0.01)
    this.slider.style.display = 'block'
    this.slider.style.width = '70%'
    this.slider.style.margin = `${this.cfg.sliderTop}px auto ${this.cfg.sliderBottom}px`
  }


  // 调整图片大小
  adjustImgSize() {
    let scale = this.img.width / this.img.height
    if (this.img.width < this.img.height) {
      this.curImgWidth = this.ognImgWidth = this.cfg.cWidth
      this.curImgHeight = this.ognImgHeight = this.ognImgWidth / scale
    } else {
      this.curImgHeight = this.ognImgHeight = this.cfg.cHeight
      this.curImgWidth = this.ognImgWidth = this.ognImgHeight * scale
    }
  }


  drawCanvas(dx, dy, dw, dh) {
    this.resetCanvas(this.canvas)
    this.ctx.drawImage(this.bgImg, 0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.img, dx, dy, dw, dh)
    this.ctx.fillStyle = 'rgba(255,255,255,0.6)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    if (this.clipShape === 'circle') {
      this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.cfg.cWidth / 2, 0, 2 * Math.PI)
    }
    if (this.clipShape === 'rect') {
      this.ctx.rect((this.canvas.width - this.cfg.cWidth) / 2, (this.canvas.height - this.cfg.cHeight) / 2, this.cfg.cWidth, this.cfg.cHeight)
    }
    this.ctx.clip()
    this.ctx.drawImage(this.img, dx, dy, dw, dh)
  }

  resetCanvas (canvas) {
    canvas.width = canvas.width
    canvas.height = canvas.height
  }

  appendToDocument () {
    this.container.appendChild(this.canvas)
    this.container.appendChild(this.slider)
  }

  bindEvent () {
    this.bindCanvasEvent()
    this.bindSliderEvent()
  }

  unbindEvent () {
    this.unbindCanvasEvent()
    this.unbindSliderEvent()
  }

  bindCanvasEvent () {
    this._mousedownCanvasImgEventHandle = this._mousedownCanvasImgEventHandle || this.mousedownCanvasImgEventHandle.bind(this)
    this.canvas.addEventListener('mousedown', this._mousedownCanvasImgEventHandle)
  }

  unbindCanvasEvent () {
    this.canvas.removeEventListener('mousedown', this._mousedownCanvasImgEventHandle)
  }

  // canvas鼠标左键按下
  mousedownCanvasImgEventHandle (e) {
    this._mouseupCanvasImgEventHandle = this._mouseupCanvasImgEventHandle || this.mouseupCanvasImgEventHandle.bind(this)
    this._mousemoveCanvasImgEventHandle = this._mousemoveCanvasImgEventHandle || this.mousemoveCanvasImgEventHandle.bind(this)
    this.mouseDownX = e.clientX
    this.mouseDonwY = e.clientY
    document.addEventListener('mousemove', this._mousemoveCanvasImgEventHandle)
    document.addEventListener('mouseup', this._mouseupCanvasImgEventHandle)
  }
  // canvas鼠标左键抬起
  mouseupCanvasImgEventHandle () {
    this.ognDisX = this.curDisX
    this.ognDisY = this.curDisY
    document.removeEventListener('mousemove', this._mousemoveCanvasImgEventHandle)
    document.removeEventListener('mouseup', this._mousedownCanvasImgEventHandle)
  }
  // canvas鼠标移动
  mousemoveCanvasImgEventHandle (e) {
    let moveX = e.clientX - this.mouseDownX
    let moveY = e.clientY - this.mouseDonwY
    this.curDisX = this.ognDisX + moveX
    this.curDisY = this.ognDisY + moveY
    this.fixCurDis()
    this.drawCanvas(this.curDisX, this.curDisY, this.ognImgWidth * this.curScale, this.ognImgHeight * this.curScale)
  }

  bindSliderEvent() {
    let that = this
    this._changeSliderEventHandle = this._changeSliderEventHandle || this.changeSliderEventHandle.bind(this)
    this._mousedownSliderEventHandle = this._mousedownSliderEventHandle || this.mousedownSliderEventHandle.bind(this)
    this.slider.addEventListener('change', this._changeSliderEventHandle)
    this.slider.addEventListener('mousedown', this._mousedownSliderEventHandle)
  }

  unbindSliderEvent () {
    this.slider.removeEventListener('change', this._changeSliderEventHandle)
    this.slider.removeEventListener('mousedown', this._mousedownSliderEventHandle)
  }
  // 滚动条滑动
  changeSliderEventHandle () {
    this.scaleCanvasImg()
  }
  // 滚动条鼠标左键按下
  mousedownSliderEventHandle () {
    this.ognScale = this.curScale
    this._mouseupSliderEventHandle = this._mouseupSliderEventHandle || this.mouseupSliderEventHandle.bind(this)
    this.slider.addEventListener('mousemove', this._changeSliderEventHandle)
    this.slider.addEventListener('mouseup', this._mouseupSliderEventHandle)
  }
  // 滚动条鼠标左键抬起
  mouseupSliderEventHandle () {
    this.slider.removeEventListener('mousemove', this._changeSliderEventHandle)
    this.slider.removeEventListener('mouseup', this._mouseupSliderEventHandle)
  }
  // 缩放图片
  scaleCanvasImg() {
    this.curScale = this.slider.value
    this.fixCurDis()
    this.drawCanvas(this.curDisX, this.curDisY, this.ognImgWidth * this.curScale, this.ognImgHeight * this.curScale)
  }

  // 边界问题
  fixCurDis() {
    if (this.curDisX >= (this.canvas.width - this.cfg.cWidth) / 2) {
      this.curDisX = (this.canvas.width - this.cfg.cWidth) / 2
    }
    if (this.curDisX <= (this.canvas.width + this.cfg.cWidth) / 2 - this.ognImgWidth * this.curScale) {
      this.curDisX = (this.canvas.width + this.cfg.cWidth) / 2 - this.ognImgWidth * this.curScale
    }
    if (this.curDisY >= (this.canvas.height - this.cfg.cHeight) / 2) {
      this.curDisY = (this.canvas.height - this.cfg.cHeight) / 2
    }
    if (this.curDisY <= (this.canvas.height + this.cfg.cHeight) / 2 - this.ognImgHeight * this.curScale) {
      this.curDisY = (this.canvas.height + this.cfg.cHeight) / 2 - this.ognImgHeight * this.curScale
    }
  }

  // 获取离屏Canvas图片
  getImgData() {
    this.resetCanvas(this.offScreenCanvas)
    let bl_x = this.img.width / (this.ognImgWidth * this.curScale)
    let bl_y = this.img.height / (this.ognImgHeight * this.curScale)
    if (this.clipShape === 'circle') {
      this.offScreenCtx.arc(this.offScreenCanvas.width / 2, this.offScreenCanvas.height / 2, this.offScreenCanvas.width / 2, 0, 2 * Math.PI)
      this.offScreenCtx.clip()
    }
    let sx = ((this.canvas.width - this.cfg.cWidth) / 2 - this.curDisX) * bl_x
    let sy = ((this.canvas.height - this.cfg.cHeight) / 2 - this.curDisY) * bl_y
    this.offScreenCtx.drawImage(this.img, sx, sy, this.offScreenCanvas.width * bl_x, this.offScreenCanvas.height * bl_y, 0, 0, this.offScreenCanvas.width, this.offScreenCanvas.height)
    return this.offScreenCanvas.toDataURL()
  }

  destroy() {
    this.unbindEvent()
    this.container.innerHTML = ''
  }
}

export default imgClip

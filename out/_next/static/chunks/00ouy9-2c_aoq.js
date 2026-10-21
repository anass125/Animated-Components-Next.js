(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,16503,e=>{"use strict";let t,r,i,n,o,a,l,s,u,c,d,f,h,p;var m,g=e.i(43476),v=e.i(71645);let x=`#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`,b=8294400;class y{parentElement;canvasElement;gl;program=null;uniformLocations={};fragmentShader;rafId=null;lastRenderTime=0;currentFrame=0;speed=0;currentSpeed=0;providedUniforms;mipmaps=[];hasBeenDisposed=!1;resolutionChanged=!0;textures=new Map;minPixelRatio;maxPixelCount;isSafari=(function(){let e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("android")})();uniformCache={};textureUnitMap=new Map;ownerDocument;constructor(e,t,r,i,n=0,o=0,a=2,l=b,s=[]){if(e?.nodeType===1)this.parentElement=e;else throw Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=e.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){let e=this.ownerDocument.createElement("style");e.innerHTML=_,e.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(e)}let u=this.ownerDocument.createElement("canvas");this.canvasElement=u,this.parentElement.prepend(u),this.fragmentShader=t,this.providedUniforms=r,this.mipmaps=s,this.currentFrame=o,this.minPixelRatio=a,this.maxPixelCount=l;let c=u.getContext("webgl2",{antialias:!1,depth:!1,stencil:!1,...i});if(!c)throw Error("Paper Shaders: WebGL is not supported in this browser");this.gl=c,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(n),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}initProgram=()=>{let e=function(e,t,r){let i=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT),n=i?i.precision:null;n&&n<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),r=r.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let o=w(e,e.VERTEX_SHADER,t),a=w(e,e.FRAGMENT_SHADER,r);if(!o||!a)return null;let l=e.createProgram();return l?(e.attachShader(l,o),e.attachShader(l,a),e.linkProgram(l),e.getProgramParameter(l,e.LINK_STATUS))?(e.detachShader(l,o),e.detachShader(l,a),e.deleteShader(o),e.deleteShader(a),l):(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(l)),e.deleteProgram(l),e.deleteShader(o),e.deleteShader(a),null):null}(this.gl,x,this.fragmentShader);e&&(this.program=e,this.gl.useProgram(e))};setupPositionAttribute=()=>{let e=this.gl.getAttribLocation(this.program,"a_position"),t=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(e),this.gl.vertexAttribPointer(e,2,this.gl.FLOAT,!1,0,0)};setupUniforms=()=>{let e={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([t,r])=>{if(e[t]=this.gl.getUniformLocation(this.program,t),r instanceof HTMLImageElement){let r=`${t}AspectRatio`;e[r]=this.gl.getUniformLocation(this.program,r)}}),this.uniformLocations=e};renderScale=1;parentWidth=0;parentHeight=0;parentDevicePixelWidth=0;parentDevicePixelHeight=0;devicePixelsSupported=!1;intersectionObserver=null;isInViewport=!0;resizeObserver=null;setupResizeObserver=()=>{this.resizeObserver=new ResizeObserver(([e])=>{if(e?.borderBoxSize[0]){let t=e.devicePixelContentBoxSize?.[0];void 0!==t&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=t.inlineSize,this.parentDevicePixelHeight=t.blockSize),this.parentWidth=e.borderBoxSize[0].inlineSize,this.parentHeight=e.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)};setupIntersectionObserver=()=>{let e=this.ownerDocument.defaultView;e?.IntersectionObserver&&(this.intersectionObserver=new e.IntersectionObserver(([e])=>{this.isInViewport=e?.isIntersecting??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))};handleVisualViewportChange=()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()};handleResize=()=>{let e=0,t=0,r=Math.max(1,window.devicePixelRatio),i=visualViewport?.scale??1;if(this.devicePixelsSupported){let n=Math.max(1,this.minPixelRatio/r);e=this.parentDevicePixelWidth*n*i,t=this.parentDevicePixelHeight*n*i}else{var n;let o,a,l=Math.max(r,this.minPixelRatio)*i;this.isSafari&&(l*=Math.max(1,(n=this.ownerDocument,(a=Math.round(100*(o=outerWidth/((visualViewport?.scale??1)*(visualViewport?.width??window.innerWidth)+(window.innerWidth-n.documentElement.clientWidth)))))%5==0?a/100:33===a?1/3:67===a?2/3:133===a?4/3:o))),e=Math.round(this.parentWidth)*l,t=Math.round(this.parentHeight)*l}let o=Math.min(1,Math.sqrt(this.maxPixelCount)/Math.sqrt(e*t)),a=Math.round(e*o),l=Math.round(t*o),s=a/Math.round(this.parentWidth);(this.canvasElement.width!==a||this.canvasElement.height!==l||this.renderScale!==s)&&(this.renderScale=s,this.canvasElement.width=a,this.canvasElement.height=l,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))};render=e=>{if(this.hasBeenDisposed)return;if(null===this.program)return void console.warn("Tried to render before program or gl was initialized");let t=e-this.lastRenderTime;this.lastRenderTime=e,0!==this.currentSpeed&&(this.currentFrame+=t*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.uniform1f(this.uniformLocations.u_time,.001*this.currentFrame),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),0!==this.currentSpeed?this.requestRender():this.rafId=null};requestRender=()=>{null!==this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)};setTextureUniform=(e,t)=>{if(!t.complete||0===t.naturalWidth)throw Error(`Paper Shaders: image for uniform ${e} must be fully loaded`);let r=this.textures.get(e);r&&this.gl.deleteTexture(r),this.textureUnitMap.has(e)||this.textureUnitMap.set(e,this.textureUnitMap.size);let i=this.textureUnitMap.get(e);this.gl.activeTexture(this.gl.TEXTURE0+i);let n=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,n),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,t),this.mipmaps.includes(e)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let o=this.gl.getError();if(o!==this.gl.NO_ERROR||null===n)return void console.error("Paper Shaders: WebGL error when uploading texture:",o);this.textures.set(e,n);let a=this.uniformLocations[e];if(a){this.gl.uniform1i(a,i);let r=`${e}AspectRatio`,n=this.uniformLocations[r];if(n){let e=t.naturalWidth/t.naturalHeight;this.gl.uniform1f(n,e)}}};areUniformValuesEqual=(e,t)=>e===t||!!(Array.isArray(e)&&Array.isArray(t))&&e.length===t.length&&e.every((e,r)=>this.areUniformValuesEqual(e,t[r]));setUniformValues=e=>{Object.entries(e).forEach(([e,t])=>{let r=t;if(t instanceof HTMLImageElement&&(r=`${t.src.slice(0,200)}|${t.naturalWidth}x${t.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[e],r))return;this.uniformCache[e]=r;let i=this.uniformLocations[e];if(!i)return void console.warn(`Uniform location for ${e} not found`);if(t instanceof HTMLImageElement)this.setTextureUniform(e,t);else if(Array.isArray(t)){let r=null,n=null;if(void 0!==t[0]&&Array.isArray(t[0])){let i=t[0].length;if(!t.every(e=>e.length===i))return void console.warn(`All child arrays must be the same length for ${e}`);r=t.flat(),n=i}else n=(r=t).length;switch(n){case 2:this.gl.uniform2fv(i,r);break;case 3:this.gl.uniform3fv(i,r);break;case 4:this.gl.uniform4fv(i,r);break;case 9:this.gl.uniformMatrix3fv(i,!1,r);break;case 16:this.gl.uniformMatrix4fv(i,!1,r);break;default:console.warn(`Unsupported uniform array length: ${n}`)}}else"number"==typeof t?this.gl.uniform1f(i,t):"boolean"==typeof t?this.gl.uniform1i(i,+!!t):console.warn(`Unsupported uniform type for ${e}: ${typeof t}`)})};getCurrentFrame=()=>this.currentFrame;setFrame=e=>{this.currentFrame=e,this.lastRenderTime=performance.now(),this.renderUnlessAnimating()};setSpeed=(e=1)=>{this.speed=e,this.updateCurrentSpeed()};updateCurrentSpeed=()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)};setCurrentSpeed=e=>{this.currentSpeed=e,null===this.rafId&&0!==e&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),null!==this.rafId&&0===e&&(cancelAnimationFrame(this.rafId),this.rafId=null)};setMaxPixelCount=(e=b)=>{this.maxPixelCount=e,this.handleResize()};setMinPixelRatio=(e=2)=>{this.minPixelRatio=e,this.handleResize()};setUniforms=e=>{this.setUniformValues(e),this.providedUniforms={...this.providedUniforms,...e},this.renderUnlessAnimating()};renderUnlessAnimating=()=>{null===this.rafId&&this.render(performance.now())};handleDocumentVisibilityChange=()=>{this.updateCurrentSpeed()};dispose=()=>{this.hasBeenDisposed=!0,null!==this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(e=>{this.gl.deleteTexture(e)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.gl.getExtension("WEBGL_lose_context")?.loseContext(),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount}}function w(e,t,r){let i=e.createShader(t);return i?(e.shaderSource(i,r),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS))?i:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(i)),e.deleteShader(i),null):null}let _=`@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;function A(e){if(e.naturalWidth<1024&&e.naturalHeight<1024){if(e.naturalWidth<1||e.naturalHeight<1)return;let t=e.naturalWidth/e.naturalHeight;e.width=Math.round(t>1?1024*t:1024),e.height=Math.round(t>1?1024:1024/t)}}async function U(e){let t={},r=[];return Object.entries(e).forEach(([e,i])=>{if("string"==typeof i){let n=i||"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";if(!(e=>{try{if(e.startsWith("/"))return!0;return new URL(e),!0}catch{return!1}})(n))return void console.warn(`Uniform "${e}" has invalid URL "${n}". Skipping image loading.`);let o=new Promise((r,i)=>{let o=new Image;(e=>{try{if(e.startsWith("/"))return!1;return new URL(e,window.location.origin).origin!==window.location.origin}catch{return!1}})(n)&&(o.crossOrigin="anonymous"),o.onload=()=>{A(o),t[e]=o,r()},o.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${n}`),i()},o.src=n});r.push(o)}else if(i instanceof HTMLImageElement){let n=i.decode().then(()=>{A(i),t[e]=i});r.push(n)}else t[e]=i}),await Promise.all(r),t}let E=(0,v.forwardRef)(function({fragmentShader:e,uniforms:t,webGlContextAttributes:r,speed:i=0,frame:n=0,width:o,height:a,minPixelRatio:l,maxPixelCount:s,mipmaps:u,style:c,...d},f){var h;let p,m,[x,b]=(0,v.useState)(!1),w=(0,v.useRef)(null),_=(0,v.useRef)(null),A=(0,v.useRef)(r);(0,v.useEffect)(()=>((async()=>{let r=await U(t);w.current&&!_.current&&(_.current=new y(w.current,e,r,A.current,i,n,l,s,u),b(!0))})(),()=>{_.current?.dispose(),_.current=null}),[e]),(0,v.useEffect)(()=>{let e=!1;return(async()=>{let r=await U(t);e||_.current?.setUniforms(r)})(),()=>{e=!0}},[t,x]),(0,v.useEffect)(()=>{_.current?.setSpeed(i)},[i,x]),(0,v.useEffect)(()=>{_.current?.setMaxPixelCount(s)},[s,x]),(0,v.useEffect)(()=>{_.current?.setMinPixelRatio(l)},[l,x]),(0,v.useEffect)(()=>{_.current?.setFrame(n)},[n,x]);let E=(h=[w,f],p=v.useRef(void 0),m=v.useCallback(e=>{let t=h.map(t=>{if(null!=t){if("function"==typeof t){let r=t(e);return"function"==typeof r?r:()=>{t(null)}}return t.current=e,()=>{t.current=null}}});return()=>{t.forEach(e=>e?.())}},h),v.useMemo(()=>h.every(e=>null==e)?null:e=>{p.current&&(p.current(),p.current=void 0),null!=e&&(p.current=m(e))},h));return(0,g.jsx)("div",{ref:E,style:void 0!==o||void 0!==a?{width:"string"==typeof o&&!1===isNaN(+o)?+o:o,height:"string"==typeof a&&!1===isNaN(+a)?+a:a,...c}:c,...d})});E.displayName="ShaderMount";let R=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,B=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`,k=`
  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);
`,S=`
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`,z=`#version 300 es
precision mediump float;

uniform sampler2D u_image;

uniform vec2 u_resolution;
uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorTint;

uniform float u_softness;
uniform float u_repetition;
uniform float u_shiftRed;
uniform float u_shiftBlue;
uniform float u_distortion;
uniform float u_contour;
uniform float u_angle;

uniform float u_shape;
uniform bool u_isImage;

in vec2 v_objectUV;
in vec2 v_responsiveUV;
in vec2 v_responsiveBoxGivenSize;
in vec2 v_imageUV;

out vec4 fragColor;

${R}
${B}
${S}

float getColorChanges(float c1, float c2, float stripe_p, vec3 w, float blur, float bump, float tint) {

  float ch = mix(c2, c1, smoothstep(.0, 2. * blur, stripe_p));

  float border = w[0];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  if (u_isImage == true) {
    bump = smoothstep(.2, .8, bump);
  }
  border = w[0] + .4 * (1. - bump) * w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + .5 * (1. - bump) * w[1];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border, border + .5 * blur, stripe_p));

  // Tint color is applied with color burn blending
  ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, 0.0001)), u_colorTint.a);
  return ch;
}

float getImgFrame(vec2 uv, float th) {
  float frame = 1.;
  frame *= smoothstep(0., th, uv.y);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.y);
  frame *= smoothstep(0., th, uv.x);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.x);
  return frame;
}

float blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = radius * texel;

  float w1 = 1.0, w2 = 2.0, w4 = 4.0;
  float norm = 16.0;
  float sum = w4 * centerSample;

  sum += w2 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).r;

  sum += w1 * textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).r;

  return sum / norm;
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

void main() {

  const float firstFrameOffset = 2.8;
  float t = .3 * (u_time + firstFrameOffset);

  vec2 uv = v_imageUV;
  vec2 dudx = dFdx(v_imageUV);
  vec2 dudy = dFdy(v_imageUV);
  vec4 img = textureGrad(u_image, uv, dudx, dudy);

  if (u_isImage == false) {
    uv = v_objectUV + .5;
    uv.y = 1. - uv.y;
  }

  float cycleWidth = u_repetition;
  float edge = 0.;
  float contOffset = 1.;

  vec2 rotatedUV = uv - vec2(.5);
  float angle = (-u_angle + 70.) * PI / 180.;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rotatedUV = vec2(
  rotatedUV.x * cosA - rotatedUV.y * sinA,
  rotatedUV.x * sinA + rotatedUV.y * cosA
  ) + vec2(.5);

  // u_contour is applied in 2 separate ranges:
  // - 0 to .4 sets the edge hardness, saturated above .4 (both branches below)
  // - .5 to 1 warps the stripes direction along the edges, inactive below .5 (see u_contour range 2)
  if (u_isImage == true) {
    float edgeRaw = img.r;
    edge = blurEdge3x3(u_image, uv, dudx, dudy, 6., edgeRaw);
    edge = pow(edge, 1.6);
    edge *= mix(0.0, 1.0, smoothstep(0.0, 0.4, u_contour));
  } else {
    if (u_shape < 1.) {
      // full-fill on canvas
      vec2 borderUV = v_responsiveUV + .5;
      float ratio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
      vec2 mask = min(borderUV, 1. - borderUV);
      vec2 pixel_thickness = min(250. / v_responsiveBoxGivenSize, vec2(.5));
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);

      uv = v_responsiveUV;
      if (ratio > 1.) {
        uv.y /= ratio;
      } else {
        uv.x *= ratio;
      }
      uv += .5;
      uv.y = 1. - uv.y;

      cycleWidth *= 2.;
      contOffset = 1.5;

    } else if (u_shape < 2.) {
      // circle
      vec2 shapeUV = uv - .5;
      shapeUV *= .67;
      edge = pow(clamp(3. * length(shapeUV), 0., 1.), 18.);
    } else if (u_shape < 3.) {
      // daisy
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.68;

      float r = length(shapeUV) * 2.;
      float a = atan(shapeUV.y, shapeUV.x) + .2;
      r *= (1. + .05 * sin(3. * a + 2. * t));
      float f = abs(cos(a * 3.));
      edge = smoothstep(f, f + .7, r);
      edge *= edge;

      uv *= .8;
      cycleWidth *= 1.6;

    } else if (u_shape < 4.) {
      // diamond
      vec2 shapeUV = uv - .5;
      shapeUV = rotate(shapeUV, .25 * PI);
      shapeUV *= 1.42;
      shapeUV += .5;
      vec2 mask = min(shapeUV, 1. - shapeUV);
      vec2 pixel_thickness = vec2(.15);
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);
    } else if (u_shape < 5.) {
      // metaballs
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.3;
      edge = 0.;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float speed = 1.5 + 2./3. * sin(fi * 12.345);
        float angle = -fi * 1.5;
        vec2 dir1 = vec2(cos(angle), sin(angle));
        vec2 dir2 = vec2(cos(angle + 1.57), sin(angle + 1.));
        vec2 traj = .4 * (dir1 * sin(t * speed + fi * 1.23) + dir2 * cos(t * (speed * 0.7) + fi * 2.17));
        float d = length(shapeUV + traj);
        edge += pow(1.0 - clamp(d, 0.0, 1.0), 4.0);
      }
      edge = 1. - smoothstep(.65, .9, edge);
      edge = pow(edge, 4.);
    }

    edge = mix(smoothstep(.9 - 2. * fwidth(edge), .9, edge), edge, smoothstep(0.0, 0.4, u_contour));

  }

  float opacity = 0.;
  if (u_isImage == true) {
    opacity = img.g;
    float frame = getImgFrame(v_imageUV, 0.);
    opacity *= frame;
  } else {
    opacity = 1. - smoothstep(.9 - 2. * fwidth(edge), .9, edge);
    if (u_shape < 2.) {
      edge = 1.2 * edge;
    } else if (u_shape < 5.) {
      edge = 1.8 * pow(edge, 1.5);
    }
  }

  float diagBLtoTR = rotatedUV.x - rotatedUV.y;
  float diagTLtoBR = rotatedUV.x + rotatedUV.y;

  vec3 color = vec3(0.);
  vec3 color1 = vec3(.98, 0.98, 1.);
  vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, diagTLtoBR));

  vec2 grad_uv = uv - .5;

  float dist = length(grad_uv + vec2(0., .2 * diagBLtoTR));
  grad_uv = rotate(grad_uv, (.25 - .2 * diagBLtoTR) * PI);
  float direction = grad_uv.x;

  float bump = pow(1.8 * dist, 1.2);
  bump = 1. - bump;
  bump *= pow(uv.y, .3);


  float thin_strip_1_ratio = .12 / cycleWidth * (1. - .4 * bump);
  float thin_strip_2_ratio = .07 / cycleWidth * (1. + .4 * bump);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);

  float thin_strip_1_width = cycleWidth * thin_strip_1_ratio;
  float thin_strip_2_width = cycleWidth * thin_strip_2_ratio;

  float noise = snoise(uv - t);

  edge += (1. - edge) * u_distortion * noise;

  direction += diagBLtoTR;
  float contour = 0.;
  direction -= 2. * noise * diagBLtoTR * (smoothstep(0., 1., edge) * (1.0 - smoothstep(0., 1., edge)));
  // u_contour range 2
  direction *= mix(1., 1. - edge, smoothstep(.5, 1., u_contour));
  direction -= 1.7 * edge * smoothstep(.5, 1., u_contour);
  direction += .2 * pow(u_contour, 4.) * (1.0 - smoothstep(0., 1., edge));

  bump *= clamp(pow(uv.y, .1), .3, 1.);
  direction *= (.1 + (1.1 - edge) * bump);

  direction *= (.4 + .6 * (1.0 - smoothstep(.5, 1., edge)));
  direction += .18 * (smoothstep(.1, .2, uv.y) * (1.0 - smoothstep(.2, .4, uv.y)));
  direction += .03 * (smoothstep(.1, .2, 1. - uv.y) * (1.0 - smoothstep(.2, .4, 1. - uv.y)));

  direction *= (.5 + .5 * pow(uv.y, 2.));
  direction *= cycleWidth;
  direction -= t;


  float colorDispersion = (1. - bump);
  colorDispersion = clamp(colorDispersion, 0., 1.);
  float dispersionRed = colorDispersion;
  dispersionRed += .03 * bump * noise;
  dispersionRed += 5. * (smoothstep(-.1, .2, uv.y) * (1.0 - smoothstep(.1, .5, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, 1., bump)));
  dispersionRed -= diagBLtoTR;

  float dispersionBlue = colorDispersion;
  dispersionBlue *= 1.3;
  dispersionBlue += (smoothstep(0., .4, uv.y) * (1.0 - smoothstep(.1, .8, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, .8, bump)));
  dispersionBlue -= .2 * edge;

  dispersionRed *= (u_shiftRed / 20.);
  dispersionBlue *= (u_shiftBlue / 20.);

  float blur = 0.;
  float rExtraBlur = 0.;
  float gExtraBlur = 0.;
  if (u_isImage == true) {
    float softness = 0.05 * u_softness;
    blur = softness + .5 * smoothstep(1., 10., u_repetition) * smoothstep(.0, 1., edge);
    float smallCanvasT = 1.0 - smoothstep(100., 500., min(u_resolution.x, u_resolution.y));
    blur += smallCanvasT * smoothstep(.0, 1., edge);
    rExtraBlur = softness * (0.05 + .1 * (u_shiftRed / 20.) * bump);
    gExtraBlur = softness * 0.05 / max(0.001, abs(1. - diagBLtoTR));
  } else {
    blur = u_softness / 15. + .3 * contour;
  }

  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bump);
  float stripe_r = fract(direction + dispersionRed);
  float r = getColorChanges(color1.r, color2.r, stripe_r, w, blur + fwidth(stripe_r) + rExtraBlur, bump, u_colorTint.r);
  float stripe_g = fract(direction);
  float g = getColorChanges(color1.g, color2.g, stripe_g, w, blur + fwidth(stripe_g) + gExtraBlur, bump, u_colorTint.g);
  float stripe_b = fract(direction - dispersionBlue);
  float b = getColorChanges(color1.b, color2.b, stripe_b, w, blur + fwidth(stripe_b), bump, u_colorTint.b);

  color = vec3(r, g, b);
  color *= opacity;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  ${k}

  fragColor = vec4(color, opacity);
}
`;function C(e){let t=document.createElement("canvas"),r=t.getContext("2d"),i="string"==typeof e&&e.startsWith("blob:");return new Promise((n,o)=>{if(!e||!r)return void o(Error("Invalid file or canvas context"));let a=i&&fetch(e).then(e=>e.headers.get("Content-Type")),l=new Image;l.crossOrigin="anonymous";let s=performance.now();l.onload=async()=>{let i,s=await a;i=s?"image/svg+xml"===s:"string"==typeof e?e.endsWith(".svg")||e.startsWith("data:image/svg+xml"):"image/svg+xml"===e.type;let u=l.width||l.naturalWidth,c=l.height||l.naturalHeight;if(i){let e=u/c;u>c?(u=4096,c=4096/e):(c=4096,u=4096*e),l.width=u,l.height=c}let d=512/Math.min(u,c),f=Math.round(u*d),h=Math.round(c*d);t.width=u,t.height=c;let p=document.createElement("canvas");p.width=f,p.height=h;let m=p.getContext("2d");m.drawImage(l,0,0,f,h);let g=performance.now(),v=m.getImageData(0,0,f,h).data,x=new Uint8Array(f*h),b=new Uint8Array(f*h),y=0;for(let e=0,t=0;e<v.length;e+=4,t++){let r=+(0!==v[e+3]);x[t]=r,y+=r}let w=[],_=[];for(let e=0;e<h;e++)for(let t=0;t<f;t++){let r=e*f+t;if(x[r])0!==t&&t!==f-1&&0!==e&&e!==h-1&&x[r-1]&&x[r+1]&&x[r-f]&&x[r+f]&&x[r-f-1]&&x[r-f+1]&&x[r+f-1]&&x[r+f+1]?_.push(r):(b[r]=1,w.push(r))}let A=function(e,t,r,i,n){let o=t.length,a=new Int32Array(4*o);for(let r=0;r<o;r++){let o=t[r],l=o%i,s=Math.floor(o/i);a[4*r+0]=l<i-1&&e[o+1]?o+1:-1,a[4*r+1]=l>0&&e[o-1]?o-1:-1,a[4*r+2]=s>0&&e[o-i]?o-i:-1,a[4*r+3]=s<n-1&&e[o+i]?o+i:-1}return{interiorPixels:t,boundaryPixels:r,pixelCount:o,neighborIndices:a}}(x,new Uint32Array(_),new Uint32Array(w),f,h),U=performance.now(),E=function(e,t,r){let i=new Float32Array(t*r),{interiorPixels:n,neighborIndices:o,pixelCount:a}=e,l=performance.now(),s=[],u=[];for(let e=0;e<a;e++){let r=n[e];(r%t+Math.floor(r/t))%2==0?s.push(e):u.push(e)}for(let e=0;e<40;e++){for(let e of s){let t=n[e],r=o[4*e+0],a=o[4*e+1],l=o[4*e+2],s=o[4*e+3],u=0;r>=0&&(u+=i[r]),a>=0&&(u+=i[a]),l>=0&&(u+=i[l]),s>=0&&(u+=i[s]);let c=(.01+u)/4;i[t]=1.9*c+(1-1.9)*i[t]}for(let e of u){let t=n[e],r=o[4*e+0],a=o[4*e+1],l=o[4*e+2],s=o[4*e+3],u=0;r>=0&&(u+=i[r]),a>=0&&(u+=i[a]),l>=0&&(u+=i[l]),s>=0&&(u+=i[s]);let c=(.01+u)/4;i[t]=1.9*c+(1-1.9)*i[t]}}0;return i}(A,f,h);let R=0;for(let e=0;e<_.length;e++){let t=_[e];E[t]>R&&(R=E[t])}let B=document.createElement("canvas");B.width=f,B.height=h;let k=B.getContext("2d"),S=k.createImageData(f,h);for(let e=0;e<h;e++)for(let t=0;t<f;t++){let r=e*f+t,i=4*r;if(x[r]){let e=255*(1-E[r]/R);S.data[i]=e,S.data[i+1]=e,S.data[i+2]=e,S.data[i+3]=255}else S.data[i]=255,S.data[i+1]=255,S.data[i+2]=255,S.data[i+3]=0}k.putImageData(S,0,0),r.imageSmoothingEnabled=!0,r.imageSmoothingQuality="high",r.drawImage(B,0,0,f,h,0,0,u,c);let z=r.getImageData(0,0,u,c),C=document.createElement("canvas");C.width=u,C.height=c;let I=C.getContext("2d");I.drawImage(l,0,0,u,c);let V=I.getImageData(0,0,u,c);for(let e=0;e<z.data.length;e+=4){let t=V.data[e+3],r=z.data[e+3];0===t?(z.data[e]=255,z.data[e+1]=0):(z.data[e]=0===r?0:z.data[e],z.data[e+1]=t),z.data[e+2]=255,z.data[e+3]=255}r.putImageData(z,0,0),t.toBlob(e=>{if(!e)return void o(Error("Failed to create PNG blob"));0;n({imageData:z,pngBlob:e})},"image/png")},l.onerror=()=>o(Error("Failed to load image")),l.src="string"==typeof e?e:URL.createObjectURL(e)})}let I={none:0,circle:1,daisy:2,diamond:3,metaballs:4},V={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0},T={none:0,contain:1,cover:2};function D(e){if(Array.isArray(e))return 4===e.length?e:3===e.length?[...e,1]:P;if("string"!=typeof e)return P;let t,r,i,n=1;if(e.startsWith("#")){var o;(3===(o=(o=e).replace(/^#/,"")).length||4===o.length)&&(o=o.split("").map(e=>e+e).join("")),6===o.length&&(o+="ff"),[t,r,i,n]=/^[0-9a-f]{8}$/i.test(o)?[parseInt(o.slice(0,2),16)/255,parseInt(o.slice(2,4),16)/255,parseInt(o.slice(4,6),16)/255,parseInt(o.slice(6,8),16)/255]:(console.warn("Invalid hex color"),P)}else if(e.startsWith("rgb")){let o,a=(o=e.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i))?[parseInt(o[1]??"0")/255,parseInt(o[2]??"0")/255,parseInt(o[3]??"0")/255,void 0===o[4]?1:parseFloat(o[4])]:null;if(null===a)return P;[t,r,i,n]=a}else{let o;if(!e.startsWith("hsl"))return console.error("Unsupported color format",e),P;let a=(o=e.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i))?[parseInt(o[1]??"0"),parseInt(o[2]??"0"),parseInt(o[3]??"0"),void 0===o[4]?1:parseFloat(o[4])]:null;if(null===a)return P;[t,r,i,n]=function(e){let t,r,i,[n,o,a,l]=e,s=n/360,u=o/100,c=a/100;if(0===o)t=r=i=c;else{let e=(e,t,r)=>(r<0&&(r+=1),r>1&&(r-=1),r<1/6)?e+(t-e)*6*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e,n=c<.5?c*(1+u):c+u-c*u,o=2*c-n;t=e(o,n,s+1/3),r=e(o,n,s),i=e(o,n,s-1/3)}return[t,r,i,l]}(a)}return[M(t,0,1),M(r,0,1),M(i,0,1),M(n,0,1)]}let M=(e,t,r)=>Math.min(Math.max(e,t),r),P=[.5,.5,.5,1],j="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",L=[],O={name:"Default",params:{...V,scale:.6,speed:1,frame:0,colorBack:"#AAAAAC",colorTint:"#ffffff",distortion:.07,repetition:2,shiftRed:.3,shiftBlue:.3,contour:.4,softness:.1,angle:70,shape:"diamond"}},N=[O,{name:"Noir",params:{...V,scale:.6,speed:1,frame:0,colorBack:"#000000",colorTint:"#606060",softness:.45,repetition:1.5,shiftRed:0,shiftBlue:0,distortion:0,contour:0,angle:90,shape:"diamond"}},{name:"Backdrop",params:{...V,speed:1,frame:0,scale:1,colorBack:"#AAAAAC",colorTint:"#ffffff",softness:.05,repetition:1.5,shiftRed:.3,shiftBlue:.3,distortion:.1,contour:.4,shape:"none",angle:90,worldWidth:0,worldHeight:0}},{name:"Stripes",params:{...V,speed:1,frame:0,scale:.6,colorBack:"#000000",colorTint:"#2c5d72",softness:.8,repetition:6,shiftRed:1,shiftBlue:-1,distortion:.4,contour:.4,shape:"circle",angle:0}}],H=(0,v.memo)(function({colorBack:e=O.params.colorBack,colorTint:t=O.params.colorTint,speed:r=O.params.speed,frame:i=O.params.frame,image:n="",contour:o=O.params.contour,distortion:a=O.params.distortion,softness:l=O.params.softness,repetition:s=O.params.repetition,shiftRed:u=O.params.shiftRed,shiftBlue:c=O.params.shiftBlue,angle:d=O.params.angle,shape:f=O.params.shape,suspendWhenProcessingImage:h=!1,fit:p=O.params.fit,scale:m=O.params.scale,rotation:x=O.params.rotation,originX:b=O.params.originX,originY:y=O.params.originY,offsetX:w=O.params.offsetX,offsetY:_=O.params.offsetY,worldWidth:A=O.params.worldWidth,worldHeight:U=O.params.worldHeight,...R}){let B,k="string"==typeof n?n:n.src,[S,V]=(0,v.useState)(j);B=h&&"u">typeof window&&k?function(e,t=null){for(let r of(null===t&&(t=[e]),L))if(function(e,t){if(e===t)return!0;if(!e||!t)return!1;let r=e.length;if(t.length!==r)return!1;for(let i=0;i<r;i++)if(e[i]!==t[i])return!1;return!0}(t,r.keys)){if(Object.prototype.hasOwnProperty.call(r,"error"))throw r.error;if(Object.prototype.hasOwnProperty.call(r,"response"))return r.response;throw r.promise}let r={keys:t,promise:("object"==typeof e&&"function"==typeof e.then?e:e(...t)).then(e=>{r.response=e}).catch(e=>r.error=e)};throw L.push(r),r.promise}(()=>C(k).then(e=>URL.createObjectURL(e.pngBlob)),[k,"liquid-metal"]):S,(0,v.useLayoutEffect)(()=>{if(h)return;if(!k)return void V(j);let e=!0;return C(k).then(t=>{e&&V(URL.createObjectURL(t.pngBlob))}),()=>{e=!1}},[k,h]);let M={u_colorBack:D(e),u_colorTint:D(t),u_image:B,u_contour:o,u_distortion:a,u_softness:l,u_repetition:s,u_shiftRed:u,u_shiftBlue:c,u_angle:d,u_isImage:!!n,u_shape:I[f],u_fit:T[p],u_scale:m,u_rotation:x,u_offsetX:w,u_offsetY:_,u_originX:b,u_originY:y,u_worldWidth:A,u_worldHeight:U};return(0,g.jsx)(E,{...R,speed:r,frame:i,fragmentShader:z,mipmaps:["u_image"],uniforms:M})});function F(e){var t;return(null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function W(e){return"u">typeof window&&(e instanceof HTMLElement||e instanceof F(e).HTMLElement)}let G={...v},X={};function $(e,t){let r=v.useRef(X);return r.current===X&&(r.current=e(t)),r}let Y=G.useInsertionEffect,K=Y&&Y!==G.useLayoutEffect?Y:e=>e();function q(){let e={next:void 0,callback:Q,trampoline:(...t)=>e.callback?.(...t),effect:()=>{e.callback=e.next}};return e}function Q(){}let J="u">typeof document?v.useLayoutEffect:()=>{};function Z(e,t){return e&&!t?e:!e&&t?t:e||t?{...e,...t}:void 0}let ee={};function et(e,t,r,i,n){if(!r&&!i&&!n&&!e)return er(t);let o=er(e);return t&&(o=ei(o,t)),r&&(o=ei(o,r)),i&&(o=ei(o,i)),n&&(o=ei(o,n)),o}function er(e){return eo(e)?{...e(ee)}:function(e){let t={...e};for(let e in t){let r=t[e];en(e,r)&&(t[e]=ea(r))}return t}(e)}function ei(e,t){return eo(t)?t(e):function(e,t){if(!t)return e;for(let r in t){let i=t[r];switch(r){case"style":e[r]=Z(e.style,i);break;case"className":e[r]=es(e.className,i);break;default:en(r,i)?e[r]=function(e,t){return t?e?(...r)=>{let i=r[0];if(eu(i)){el(i);let n=t(...r);return i.baseUIHandlerPrevented||e?.(...r),n}let n=t(...r);return e?.(...r),n}:ea(t):e}(e[r],i):e[r]=i}}return e}(e,t)}function en(e,t){let r=e.charCodeAt(0),i=e.charCodeAt(1),n=e.charCodeAt(2);return 111===r&&110===i&&n>=65&&n<=90&&("function"==typeof t||void 0===t)}function eo(e){return"function"==typeof e}function ea(e){return e?(...t)=>{let r=t[0];return eu(r)&&el(r),e(...t)}:e}function el(e){return e.preventBaseUIHandler=()=>{e.baseUIHandlerPrevented=!0},e}function es(e,t){return t?e?t+" "+e:t:e}function eu(e){return null!=e&&"object"==typeof e&&"nativeEvent"in e}let ec=function(e,...t){let r=new URL("https://base-ui.com/production-error");return r.searchParams.set("code",e.toString()),t.forEach(e=>r.searchParams.append("args[]",e)),`Base UI error #${e}; visit ${r} for the full message.`},ed=v.createContext(void 0);function ef(e,t,{detail:r=0,pointerType:i=""}={}){e.dispatchEvent(new(F(e)).PointerEvent("click",{bubbles:!0,cancelable:!0,composed:!0,detail:r,pointerType:i,shiftKey:t.shiftKey,ctrlKey:t.ctrlKey,altKey:t.altKey,metaKey:t.metaKey}))}function eh(e){return W(e)&&"BUTTON"===e.tagName}function ep(e,t,r,i){var n,o,a,l,s;let u=$(em).current;return n=u,o=e,a=t,l=r,s=i,(n.refs[0]!==o||n.refs[1]!==a||n.refs[2]!==l||n.refs[3]!==s)&&eg(u,[e,t,r,i]),u.callback}function em(){return{callback:null,cleanup:null,refs:[]}}function eg(e,t){if(e.refs=t,t.every(e=>null==e)){e.callback=null;return}e.callback=r=>{if(e.cleanup&&(e.cleanup(),e.cleanup=null),null!=r){let i=Array(t.length).fill(null);for(let e=0;e<t.length;e+=1){let n=t[e];if(null!=n)switch(typeof n){case"function":{let t=n(r);"function"==typeof t&&(i[e]=t);break}case"object":n.current=r}}e.cleanup=()=>{for(let e=0;e<t.length;e+=1){let r=t[e];if(null!=r)switch(typeof r){case"function":{let t=i[e];"function"==typeof t?t():r(null);break}case"object":r.current=null}}}}}}let ev=parseInt(v.version,10);function ex(e){if(!v.isValidElement(e))return null;let t=e.props;return(ev>=19?t?.ref:e.ref)??null}Object.freeze([]);let eb=Object.freeze({});function ey(e,t,r={}){let i=t.render;!1!==r.enabled&&(i=function(e){if(e?.$$typeof!==ew)return e;let t=v.Children.toArray(e)[0];return v.isValidElement(t)?t:e}(i));let n=function(e,t,r){var i,n,o;let{className:a,style:l}=e,{state:s=eb,ref:u,props:c,stateAttributesMapping:d,enabled:f=!0}=t,h=f?"function"==typeof a?a(s):a:void 0,p=f?"function"==typeof l?l(s):l:void 0,m=f?function(e,t){let r={};for(let i in e){let n=e[i];if(t?.hasOwnProperty(i)){let e=t[i](n);null!=e&&Object.assign(r,e);continue}!0===n?r[`data-${i.toLowerCase()}`]="":n&&(r[`data-${i.toLowerCase()}`]=n.toString())}return r}(s,d):eb,g=f&&c?function(e){if(Array.isArray(e)){if(0===e.length)return ee;if(1===e.length)return er(e[0]);let t=er(e[0]);for(let r=1;r<e.length;r+=1)t=ei(t,e[r]);return t}return et(void 0,e)}(c):void 0,v=f?Z(m,g)??{}:eb;if("u">typeof document)if(f)if(Array.isArray(u)){let e;i=[v.ref,ex(r),...u],n=e=$(em).current,o=i,(n.refs.length!==o.length||n.refs.some((e,t)=>e!==o[t]))&&eg(e,i),v.ref=e.callback}else v.ref=ep(v.ref,ex(r),u);else ep(null,null);return f?(void 0!==h&&(v.className=es(v.className,h)),void 0!==p&&(v.style=Z(v.style,p)),v):eb}(t,r,i);return!1===r.enabled?null:function(e,t,r,i){var n,o;if(t){if("function"==typeof t)return t(r,i);let e=et(r,t.props);return e.ref=r.ref,v.cloneElement(t,e)}return n=e,o=r,"button"===n?(0,v.createElement)("button",{type:"button",...o,key:o.key}):"img"===n?(0,v.createElement)("img",{alt:"",...o,key:o.key}):v.createElement(n,o)}(e,i,n,r.state??eb)}let ew=Symbol.for("react.lazy"),e_=v.forwardRef(function(e,t){let{render:r,className:i,disabled:n=!1,focusableWhenDisabled:o=!1,nativeButton:a=!0,style:l,...s}=e,{getButtonProps:u,buttonRef:c}=function(e={}){var t;let r,{disabled:i=!1,focusableWhenDisabled:n,tabIndex:o=0,native:a=!0,composite:l}=e,s=v.useRef(null),u=function(e=!1){let t=v.useContext(ed);if(void 0===t&&!e)throw Error(ec(16));return t}(!0),c=l??void 0!==u,{props:d}=function(e){let{focusableWhenDisabled:t,disabled:r,composite:i=!1,tabIndex:n=0,isNativeButton:o}=e,a=i&&!1!==t,l=i&&!1===t;return{props:v.useMemo(()=>{let e={onKeyDown(e){r&&t&&"Tab"!==e.key&&e.preventDefault()}};return i||(e.tabIndex=n,!o&&r&&(e.tabIndex=t?n:-1)),(o&&(t||a)||!o&&r)&&(e["aria-disabled"]=r),o&&(!t||l)&&(e.disabled=r),e},[i,r,t,a,l,o,n])}}({focusableWhenDisabled:n,disabled:i,composite:c,tabIndex:o,isNativeButton:a}),f=v.useCallback(()=>{let e=s.current;eh(e)&&c&&i&&void 0===d.disabled&&e.disabled&&(e.disabled=!1)},[i,d.disabled,c]);return J(f,[f]),{getButtonProps:v.useCallback((e={})=>{let{onClick:t,onMouseDown:r,onKeyUp:n,onKeyDown:o,onPointerDown:l,...s}=e;return et({onClick(e){i?e.preventDefault():t?.(e)},onMouseDown(e){i||r?.(e)},onKeyDown(e){var t;if(i||(el(e),o?.(e),e.baseUIHandlerPrevented))return;let r=e.target===e.currentTarget,n=e.currentTarget,l=eh(n),s=!a&&W(t=n)&&"A"===t.tagName&&!!t.href,u=r&&(a?l:!s),d="Enter"===e.key,f=" "===e.key,h=n.getAttribute("role"),p=h?.startsWith("menuitem")||"option"===h||"gridcell"===h;if(r&&c&&f){if(e.defaultPrevented&&p)return;e.preventDefault(),(!a||l)&&(e.preventBaseUIHandler(),ef(n,e));return}if(!u||a||!f&&!d){r&&s&&f&&e.preventDefault();return}!e.defaultPrevented&&(e.preventDefault(),d&&(e.preventBaseUIHandler(),ef(n,e)))},onKeyUp(e){i||((el(e),n?.(e),e.target===e.currentTarget&&a&&c&&eh(e.currentTarget)&&" "===e.key)?e.preventDefault():!e.baseUIHandlerPrevented&&(e.target!==e.currentTarget||a||c||e.defaultPrevented||" "!==e.key||(e.preventBaseUIHandler(),ef(e.currentTarget,e))))},onPointerDown(e){i?e.preventDefault():l?.(e)}},a?{type:"button"}:{role:"button"},d,s)},[i,d,c,a]),buttonRef:(t=e=>{s.current=e,f()},(r=$(q).current).next=t,K(r.effect),r.trampoline)}}({disabled:n,focusableWhenDisabled:o,native:a});return ey("button",e,{state:{disabled:n},ref:[t,c],props:[s,u]})});var eA=e.i(7670);let eU=e=>"boolean"==typeof e?`${e}`:0===e?"0":e,eE=eA.f,eR=(e,t)=>r=>{var i;if((null==t?void 0:t.variants)==null)return eE(e,null==r?void 0:r.class,null==r?void 0:r.className);let{variants:n,defaultVariants:o}=t,a=Object.keys(n).map(e=>{let t=null==r?void 0:r[e],i=null==o?void 0:o[e];if(null===t)return null;let a=eU(t)||eU(i);return n[e][a]}),l=r&&Object.entries(r).reduce((e,t)=>{let[r,i]=t;return void 0===i||(e[r]=i),e},{});return eE(e,a,null==t||null==(i=t.compoundVariants)?void 0:i.reduce((e,t)=>{let{class:r,className:i,...n}=t;return Object.entries(n).every(e=>{let[t,r]=e;return Array.isArray(r)?r.includes({...o,...l}[t]):({...o,...l})[t]===r})?[...e,r,i]:e},[]),null==r?void 0:r.class,null==r?void 0:r.className)};var eB=e.i(57851);let ek=eR("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/80",outline:"border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",ghost:"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",destructive:"bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",xs:"h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",sm:"h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",lg:"h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",icon:"size-8","icon-xs":"size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3","icon-sm":"size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg","icon-lg":"size-9"}},defaultVariants:{variant:"default",size:"default"}});function eS({className:e,variant:t="default",size:r="default",...i}){return(0,g.jsx)(e_,{"data-slot":"button",className:(0,eB.f)(ek({variant:t,size:r,className:e})),...i})}let ez=eR("group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",{variants:{variant:{default:"bg-primary text-primary-foreground [a]:hover:bg-primary/80",secondary:"bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",destructive:"bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",outline:"border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",ghost:"hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",link:"text-primary underline-offset-4 hover:underline"}},defaultVariants:{variant:"default"}});function eC({className:e,variant:t="default",render:r,...i}){var n;return ey((n={defaultTagName:"span",props:et({className:(0,eB.f)(ez({variant:t}),e)},i),render:r,state:{slot:"badge",variant:t}}).defaultTagName??"div",n,n)}let eI=(e,t=0)=>{let r=new Int32Array(e.length);for(let i=0;i<e.length;i++)r[i]=e.charCodeAt(i)-48-t;return r},eV=e=>{let t=new Int32Array(e.length+1);for(let r=0;r<e.length;r++)t[r+1]=t[r]+e[r];return t},eT=e=>{let t=new Int32Array(e.length),r=0;for(let i=0;i<e.length;i++){let n=e.charCodeAt(i)-48;r+=n>>>1^-(1&n),t[i]=r}return t},eD=eV(eI("E0500002005282000000002000150000020021820000011200000003022202000300004200120000200420001200021200301200010400162000010000220021010:2192001200220012000220012000200200200400010200040000000000400200108200110100000022010313000162002000020020012020080213000228200000000082000000000120002000120020020040101020300130001001010")),eM=eV(eI(":11111111211111119311546544411119731869:671397415686432441111111111161114151214313433415:78311132233313187211117221449443411141111151152226611131111112212518142224214215421421542142424242516171151615616347111111111197911327451111111111111111111113134714133513411111311111111111111111111112444411111342312715245411117:3")),eP=(()=>{let e=eD.length-1,t=new Int32Array(e);for(let r=e-1;r>=0;r--){let e=1,i=r+1;for(let n=eD[r];n<eD[r+1];n++)e+=t[i],i+=t[i];t[r]=e}let r=new Int32Array(eD[e]),i=0;for(let n=0;n<e;n++){let e=n+1;for(let o=eD[n];o<eD[n+1];o++)r[i++]=e,e+=t[e]}return r})(),ej=eI("02000000000000900<=0?000B000F00F00ŏI0J0LNPRTVX0000]_a00000000000000000000000rst0000000zŏ00000000000ŏ0000000ŏ00000000000000000000000000000000000000000000000000000000000000Ë000000000000000000000Þ000000000000000000ð0000000ø0ùúûüýþÿĀāĂăĄąĆ000000000000000000000000000000000000000000ħ0ĨĪ00000000000000000000ļĽ00000Ŭ000000",1),eL=eV(eI("123333359346463635126536711576")),eO=eI("93203242332583253248325D>E?F@03263243255B:032523853:0325B:8GA032542H<C=12727B:0328432553;D>E?3257D>032585:0325B:;0328B:032"),eN=eI("012113445661666666789111:5;;;;;;;;444;;;:62999<1161=62>>?61:21@ABCD4446996:64E:::;:?::64:F114GHHIHHHHIHH1HH1HH1HHHHHH::EEJ4444::EE4444441691;644444114244444:;K6666555555555555555999666664444444444444444444444226?6:66644L9M?D:111::::6DE199"),eH=eT("020200202020020020020020020020200200200200200200200002020202001003040106000200200200200200200200200200200200200200200200200200200200200200200200200200200200020020020020020020002020200202002002002002002002002002002020002002020020200220200200200200200200200200200200020020020000200020002000200200200020020020002000200200200020020202002020202000200200020022000200200020020002002000200220002002000200W0Z00020020002002020002002000200g0j0002002000200200020020002002000200200020020002000200002000002002002002002000200020000200002002002002002002002020020020200200200200200200200200202020020020020020020020020002002002020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020002002002002002002000200200200200200200200200200020202020002000200020002002002002000020200200"),eF=(()=>{let e=(new Int32Array(319)).fill(-1),t=eT("02422242:222222242224222242442222222422222244442242226224222426222422442462222422622222222626222462242622422622422424242422222222422222222242422222222222222222622442224222222222222224424442262222222222222222222226224222424242422224422422422222"),r=eT("02222222222222222222202222222222222222222222221422222222222222222222222222222222222Y\\222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222221422222222222222222222222222222222222222Ŀł222222222222222222");for(let i=0;i<t.length;i++)e[t[i]]=r[i];return e})(),eW="container |break-after- all auto avoid avoid-page column left page right|break-before- all auto avoid avoid-page column left page right|break-inside-a uto void void-column void-page|box-decoration- clone slice|box- border content| contents flow-root hidden table table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group| not-sr-only sr-only|float- end left none right start|clear- both end left none right start|isolat e ion-auto|overflow- auto clip hidden scroll visible|overflow-x- auto clip hidden scroll visible|overflow-y- auto clip hidden scroll visible|overscroll- auto contain none|overscroll-x- auto contain none|overscroll-y- auto contain none| absolute fixed relative static sticky| collapse invisible visible|justify- around baseline between center center-safe end end-safe evenly normal start stretch|justify-items- center center-safe end end-safe normal start stretch|justify-self- auto center center-safe end end-safe start stretch|items- baseline baseline-last center center-safe end end-safe start stretch|self- auto baseline baseline-last center center-safe end end-safe start stretch|place-content- around baseline between center center-safe end end-safe evenly start stretch|place-items- baseline center center-safe end end-safe start stretch|place-self- auto center center-safe end end-safe start stretch| antialiased subpixel-antialiased| italic not-italic|normal-nums |ordinal |slashed-zero | lining-nums oldstyle-nums| proportional-nums tabular-nums| diagonal-fractions stacked-fractions| no-underline overline| capitalize lowercase normal-case uppercase|truncate |whitespace- break-spaces normal nowrap pre pre-line pre-wrap|break- all keep normal words|wrap- anywhere break-word normal|hyphens- auto manual none|mix-blend- color color-burn color-dodge darken difference exclusion hard-light hue lighten luminosity multiply normal overlay plus-darker plus-lighter saturation screen soft-light|table- auto fixed|caption- bottom top|backface- hidden visible|appearance- auto none|scheme- dark light light-dark normal only-dark only-light|field-sizing- content fixed|pointer-events- auto none|resize  -none -x -y|snap- align-none center end start|snap- always normal|snap- both none x y|snap- mandatory proximity|touch- auto manipulation none|touch-pan- left right x|touch-pan- down up y|touch-pinch-zoom |select- all auto none text|forced-color-adjust- auto none| normal size| baseline bottom middle sub super text-bottom text-top top| bounce none ping pulse spin| auto square video| auto fr max min px|none | auto full px| fixed local scroll|clip- border content padding text|origin- border content padding| bottom bottom-left bottom-right center left left-bottom left-top right right-bottom right-top top top-left top-right| no-repeat repeat repeat-round repeat-space repeat-x repeat-y| auto contain cover| gradient-to-b gradient-to-bl gradient-to-br gradient-to-l gradient-to-r gradient-to-t gradient-to-tl gradient-to-tr none|blend- color color-burn color-dodge darken difference exclusion hard-light hue lighten luminosity multiply normal overlay saturation screen soft-light|to- b bl br l r t tl tr| auto dvh fit full lh lvh max min px screen svh| dashed dotted double hidden none solid| collapse separate|px |auto |full | content none strict| inline-size size|layout |paint |style | around baseline between center center-safe end end-safe evenly normal start stretch| alias all-scroll auto cell col-resize context-menu copy crosshair default e-resize ew-resize grab grabbing help move n-resize ne-resize nesw-resize no-drop none not-allowed ns-resize nw-resize nwse-resize pointer progress row-resize s-resize se-resize sw-resize text vertical-text w-resize wait zoom-in zoom-out| dashed dotted double solid wavy| auto from-font|reverse |initial | in in-out initial linear out| col col-reverse row row-reverse| nowrap wrap wrap-reverse| auto initial none| black bold extrabold extralight light medium normal semibold thin| condensed expanded extra-condensed extra-expanded normal semi-condensed semi-expanded ultra-condensed ultra-expanded|flow- col col-dense dense row row-dense| none subgrid| auto dvh dvw fit full lh lvh lvw max min px screen svh svw| block flex grid table| auto dvw fit full lvw max min px screen svw| loose none normal px relaxed snug tight|through |item | inside outside| decimal disc none| auto px| clip-border clip-content clip-fill clip-padding clip-stroke clip-view no-clip| add exclude intersect subtract| alpha luminance match|origin- border content fill padding stroke view|type- alpha luminance| circle ellipse| closest-corner closest-side farthest-corner farthest-side|at- bottom bottom-left bottom-right center left left-bottom left-top right right-bottom right-top top top-left top-right| dvh fit full lh lvh max min none px screen svh| auto dvh dvw fit full lh lvh lvw max min none px screen svh svw| dvw fit full lvw max min none px screen svw| auto dvh dvw fit full lvh lvw max min none prose px svh svw| auto dvh dvw fit full lvh lvw max min none px screen svh svw| contain cover fill none scale-down| first last none| distant dramatic midrange near none normal|inset | full none|3d | auto smooth|gutter- auto both stable| auto none thin| inner none| auto dvh dvw fit full lvh lvw max min px svh svw|base | center end justify left right start| clip ellipsis| balance nowrap pretty wrap| normal tight tighter wide wider widest| cpu gpu none| 3d flat| all colors none opacity shadow transform| discrete normal| full px| auto dvh dvw fit full lvh lvw max min px screen svh svw| auto contents scroll transform".split("|").map(e=>{let t=e.split(" "),r=t.shift();for(let e=0;e<t.length;e++)t[e]=r+t[e];return t}),eG=eT("0000000000000000000000000000000000000000000000000000000000000262242:6@200000006:240B428:4422400002046044222426220026642642462026224222824220022400000000\\00N222422242222222224062242222222422226264222422222222222222442804222422222222222222222222220<4<0204260002444020204224422"),eX=eT("ɠ222222222222222222222222222222222222222222222222222222222222˕4222226>ʶ22ʷʺʷ2ʸʷ42ʴ2ʓ22>621422ɶ222ɹɼɷɺɷɺ22ɱ42222ɨ2ɧ26622ɘɓ244ƸƵ222]d24242ǖǓƚÄȫ2263ȨȥȨ2222222ǣ222222222222222222ǂƽ2ƾƵ2222222422222ƜƑ22222222222222222222144Ŧţ22Ţş222222222222222222222ĸ2ı68ĦģĦɡŰ4Ġ«®ĝ822ĔđĔ2ē2222622"),e$=eT("02222222222222222222222222222222222222222222222222222222222222222202022222222222EH2200IL021042222Y\\222IL0cf2e10j2222U00X202[^2y0000120|{~22:22|22222222222G000qOVI00000}2>40000B00000I¨©000¬00000000000000021M®­00°000000000000000000000222HGHa1º222¿2À2222ÉÌ000­°2±"),eY=new Int32Array(995),eK=new Int32Array(995),eq=new Int32Array(995),eQ="",eJ=new Int32Array(1038);{let e=new Map,t=0,r=0;for(let i=0;i<eG.length;i++)for(let n of eW[e$[i]]){let o=e.get(n);void 0===o&&(o=t++,e.set(n,o),eJ[2*o]=eQ.length,eJ[2*o+1]=n.length,eQ+=n),eY[r]=eG[i],eK[r]=eX[i],eq[r]=o,r++}}let eZ=eT("0b2N:222@R>F@286¦2@H2D266226FB22B2>BD\\6N22222Z222D222p"),e0=eV(eI("1::24444432:442:44:44>222222:44:4421322511111311111114")),e2=eT("24A;33N=C@H4A;33N=C@<27;83:;8393NQ:3NQʰ222ˉºŴŽ2R2=18cƴÅŇ=cĞÛC1ƈǝȈ:ħ25=11D3A@4=<1;1DEr25;11B3?<6;:371BCn9@7=<8192>2E121@9@EHE@9>2T25511<398454131<=V25511<398454131<=ƧNž2Đå242L222290000f22500ɛ000ǘ222"),e1=eI("ĳ"),e4=eI("");var e3={GROUP_COUNT:384,customValidatorNames:[],edgeStart:eD,labelStart:eM,labelText:"@containerabcdefghinlmoprstunderlineviawzccentlignnimatespectuto-colsrowsaglorightnessckdrop-sisbcontrastfiltergrayscalehue-rotateinvertopacityslurrightnessaturateepia-coniclinearpositionradialsizeockurrderttom-belrstxyespacing-xyaretoursorlnt-umnsendspantartainentrasteividerop-shadowurationcorationlay-xyasendillexontromlter-featuresstretchapr-xyayscaleidow-colsrowsue-rotatedentlinesetvert-beringsxyeshadoweiadingftnest-clamp-imageabein-lrstxyskx--b-coniclpositionrsizet-x-y-fromto-fromto-inearfromto-fromto-adialfromto-fromtofromtofromtofromtoblockhinlinew-screenesblockhinlinewbjectpacityrutlinederigin-offsetbelrstxyesrspective-originaceholderioghtng-offsettateundedw-xyz-belrstlreseslr-endspantartaturatecepiahizekewpace-taleroll-xyz-barmpbelrstxyesbelrstxyes-thumbrackadowrink-xyxyartrokeabextora-shadowpckingnsformitionlate-xyz-offsetill-changeoom",edgeTarget:eP,nodeGroup:ej,nodeVlist:eF,vlistPat:eL,vlistOps:eO,vlistRef:eN,vlistGroup:eH,litAnchor:eY,litGroup:eK,litPool:eq,poolOffsets:eJ,poolText:eQ,adjGid:eZ,adjStart:e0,adjTgt:e2,patGid:e1,patTgt:e4,postfixLookupGroups:eI("1"),orderSensitiveModifiers:"* ** after backdrop before details-content file first-letter first-line marker placeholder selection"};let e5="line"in Error(),e6=(e,t,r)=>{let i=0x811c9dc5;for(let n=t;n<r;n++)i=Math.imul(i^e.charCodeAt(n),0x1000193);return i},e9=(e,t,r)=>{let i=r-t,n=Math.imul(i,0x9e3779b1)^e.charCodeAt(t);if(i>3){let o=i>>2,a=i>>1;n=Math.imul((n=Math.imul(n^e.charCodeAt(t+1)<<8^e.charCodeAt(t+2)<<16^e.charCodeAt(t+o),0x85ebca6b))^e.charCodeAt(t+a)<<8^e.charCodeAt(t+a+o)<<16^e.charCodeAt(r-3),0xc2b2ae35)^(e.charCodeAt(r-2)<<8^e.charCodeAt(r-1)<<16);for(let i=t+3,o=r-4;i<t+8&&i<o;i++,o--)n=Math.imul(n^e.charCodeAt(i)^e.charCodeAt(o)<<8,0x1000193)}return n^n>>>15},e8=(e,t)=>{if(!e)return"";if("string"==typeof e)return e;let r="";if("number"==typeof e.length&&(!t||Array.isArray(e))){for(let i=0;i<e.length;i++){let n=e[i];if(!n)continue;let o="string"==typeof n?n:e8(n,t);o&&(r&&(r+=" "),r+=o)}return r}if(t){if("number"==typeof e)return""+e;if("object"==typeof e)for(let t in e)e[t]&&(r&&(r+=" "),r+=t)}return r},e7=function(){return((e,t)=>{let r="";for(let i=0;i<e.length;i++){let n=e[i];if(!n)continue;let o="string"==typeof n?n:e8(n,t);o&&(r&&(r+=" "),r+=o)}return r})(arguments,!1)},te=((e,t={})=>{let{GROUP_COUNT:r,edgeStart:i,labelStart:n,labelText:o,edgeTarget:a,nodeGroup:l,nodeVlist:s,vlistPat:u,vlistOps:c,vlistRef:d,vlistGroup:f,litAnchor:h,litGroup:p,litPool:m,poolOffsets:g,poolText:v,adjGid:x,adjStart:b,adjTgt:y,patGid:w,patTgt:_,postfixLookupGroups:A,customValidatorNames:U,orderSensitiveModifiers:E}=e,R=new Int32Array(r).fill(-1);for(let e=0;e<x.length;e++)R[x[e]]=e;let B=0;for(let e=0;e+1<b.length;e++){let t=b[e+1]-b[e];t>B&&(B=t)}let k=32;for(;k<2*(1+B+w.length);)k<<=1;let S=new Int32Array(d.length+1);for(let e=0;e<d.length;e++)S[e+1]=S[e]+u[d[e]+1]-u[d[e]];let z=new Uint8Array(r);for(let e=0;e<A.length;e++)z[A[e]]=1;let C=new Uint8Array(i.length-1),I=0,V=!0;for(let e=0;e<h.length;e++){C[h[e]]=1;let t=g[2*m[e]+1];t>I&&(I=t);let r=v.charCodeAt(g[2*m[e]]);(91===r||40===r)&&(V=!1)}let T=1;for(;T<2*h.length;)T<<=1;let D=new Int32Array(T).fill(-1);for(let e=0;e<h.length;e++){let t=g[2*m[e]],r=(e6(v,t,t+g[2*m[e]+1])^Math.imul(h[e],0x9e3779b1))&T-1;for(;-1!==D[r];)r=r+1&T-1;D[r]=e}let M=(e,t,r,i)=>{let n=(e6(t,r,i)^Math.imul(e,0x9e3779b1))&T-1,o=i-r;for(;;){let i=D[n];if(-1===i)return -1;if(h[i]===e&&g[2*m[i]+1]===o){let e=g[2*m[i]],n=!0;for(let i=0;i<o;i++)if(v.charCodeAt(e+i)!==t.charCodeAt(r+i)){n=!1;break}if(n)return p[i]}n=n+1&T-1}},P=t.cacheSize??8192,j=t.prefix??e.prefix??"",L=""===j?"":j+":",O=L.length,N=(U??[]).map(e=>{let t;if(!t)throw Error("cn: missing validator "+e);return t}),H=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,F=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,W=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,G=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,X=0,$=-1,Y=-1,K=-1,q=-1,Q=e=>e>=97&&e<=122||e>=65&&e<=90||e>=48&&e<=57||95===e,J=e=>/\s/.test(String.fromCharCode(e)),Z=(e,t,r)=>{if(X=0,$=-1,r-t<3)return;let i=e.charCodeAt(t),n=e.charCodeAt(r-1);if(91===i&&93===n)X=1;else{if(40!==i||41!==n)return;X=2}K=t+1,q=r-1;let o=t+1;if(Q(e.charCodeAt(o))){for(o++;o<r-1;){let t=e.charCodeAt(o);if(!Q(t)&&45!==t)break;o++}o<r-2&&58===e.charCodeAt(o)&&($=t+1,Y=o,K=o+1)}},ee=(e,t,r,i)=>{if(r-t!==i.length)return!1;for(let r=0;r<i.length;r++)if(e.charCodeAt(t+r)!==i.charCodeAt(r))return!1;return!0},et=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,er=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,ei=e=>!!e&&!Number.isNaN(Number(e)),en=[1,1,1,1,1,1,1,1,2,2,2,2,2,2,2],eo="length|number|number weight|family-name|position percentage|length size bg-size|image url|shadow|length|family-name|position percentage|length size bg-size|image url|shadow|number weight".split("|").map(e=>e.split(" ")),ea=[2,3,1,0,0,0,4,5,0,0,0,0,0,1,1],el=(e,t,r,i)=>{if(e>=10){if(e>=25)return N[e-25](t.slice(r,i));let n=e-10;if(X!==en[n])return!1;if($>=0){for(let e of eo[n])if(ee(t,$,Y,e))return!0;return!1}switch(ea[n]){case 0:return!1;case 1:return!0;case 2:{let e=t.slice(K,q);return H.test(e)&&!F.test(e)}case 3:return ei(t.slice(K,q));case 4:return G.test(t.slice(K,q));default:return W.test(t.slice(K,q))}}switch(e){case 0:return!0;case 1:return 0===X;case 2:return 1===X;case 3:return 2===X;case 4:return et.test(t.slice(r,i));case 5:return ei(t.slice(r,i));case 6:{let e=t.slice(r,i);return!!e&&Number.isInteger(Number(e))}case 7:return i>r&&37===t.charCodeAt(i-1)&&ei(t.slice(r,i-1));case 8:return er.test(t.slice(r,i));default:if(i-r<11||!ee(t,r,r+10,"@container"))return!1;if(47===t.charCodeAt(r+10))return i-r>=12;let n=t.charCodeAt(r+11);return 115===n&&i-r>=17&&ee(t,r+10,r+16,"-size/")||110===n&&i-r>=19&&ee(t,r+10,r+18,"-normal/")}},es=new Set("string"==typeof E?E.split(" "):E),eu=(e,t,r,i,n,o)=>{let a=e6(t,r,i)^0x9e3779b9*!!n,l=e.get(a);if(void 0!==l)e:for(let e=0;e<l.length;e++){let o=l[e];if(o.imp===n&&o.k.length===i-r){for(let e=0;e<o.k.length;e++)if(o.k.charCodeAt(e)!==t.charCodeAt(r+e))continue e;return o.id}}else e.set(a,l=[]);let s=t.slice(r,i),u=o(s);return l.push({k:s,imp:n,id:u}),u},ec=new Map,ed=new Map,ef=2,eh=(e,t)=>{let r=[],i=0,n=0,o=0;for(let t=0;t<e.length;t++){let a=e.charCodeAt(t);0===i&&0===n&&58===a?(r.push(e.slice(o,t)),o=t+1):91===a?i++:93===a?i--:40===a?n++:41===a&&n--}r.push(e.slice(o));let a=r[0];if(r.length>1){let e=[],t=[];for(let i of r)91===i.charCodeAt(0)||es.has(i)?(t.length&&(e.push(...t.sort()),t=[]),e.push(i)):t.push(i);t.length&&e.push(...t.sort()),a=e.join(":")}let l=t?a+" !":a,s=ed.get(l);return void 0===s&&ed.set(l,s=ef++),s},ep=new Map,em=r,eg=r+4096,ev=()=>em++,ex=new Int32Array(8192),eb=Array(8192).fill(null),ey=new Int32Array(8192),ew=new Int32Array(8192),e_=new Uint8Array(8192),eA=0,eU=(e,t,r,i,n,o,a,l)=>{let s=e;if(null!==eb[e])if(null===eb[1|e])s=1|e;else{if((3&eA++)!=0)return;s=e|eA>>2&1}eb[s]=t.slice(r,i),ex[s]=n,ey[s]=o,ew[s]=a,e_[s]=l},eE=256,eR=[new Int32Array(256),new Int32Array(eE),new Int32Array(eE),new Int32Array(eE)],[eB,ek,eS,ez]=eR,eC=new Uint8Array(eE),eI=new Uint8Array(eE),eV=()=>{eE*=2,eR=eR.map(e=>{let t=new Int32Array(eE);return t.set(e),t}),[eB,ek,eS,ez]=eR;let e=new Uint8Array(eE);e.set(eC),eC=e,eI=new Uint8Array(eE)},eT=64,eD=new Int32Array(64),eM=new Int32Array(eT),eP=new Int32Array(r),ej=2048,eL=21,eO=new Float64Array(2048),eN=new Int32Array(ej),eH=0,eF=(e,t)=>{if(0===e&&t<r)return eP[t]===eH?1:(eP[t]=eH,0);let i=2097152*e+t+1,n=Math.imul(i,0x9e3779b1)>>>eL;for(;eN[n]===eH;){if(eO[n]===i)return 1;n=n+1&ej-1}return eO[n]=i,eN[n]=eH,0},eW=(e,t,r,i,n)=>{if(r-t>=2&&91===e.charCodeAt(t)&&93===e.charCodeAt(r-1)){let i=-1;for(let n=t+1;n<r-1;n++)if(58===e.charCodeAt(n)){i=n;break}return -1===i||i===t+1?-1:eu(ep,e,t+1,i,0,ev)}if(i>=0&&l[i]>=0)return l[i];for(let t=n-1;t>=0;t--){let i=eM[t];if(i>r)continue;let n=eD[t],o=r-i;if(1===C[n]&&o>0&&o<=I){let t=e.charCodeAt(i);if(!1===V||91!==t&&40!==t){let t=M(n,e,i,r);if(t>=0)return t}}let a=s[n];if(a<0)continue;let l=d[a],h=u[l],p=u[l+1];if(h===p)continue;Z(e,i,r);let m=S[a]-h;for(let t=h;t<p;t++)if(el(c[t],e,i,r))return f[m+t]}return -1},eG=e=>{let t=e.length,l=0,u=0,c=!1;(ef>4096||ec.size>4096)&&(ec=new Map,ed=new Map,ef=2,eb.fill(null)),em>eg&&(ep=new Map,em=r,eb.fill(null));let d=0;for(;d<t;){let f,h=e.charCodeAt(d);if(32===h||h>=9&&h<=13||h>=160&&J(h)){32!==h&&(c=!0),d++;continue}let p=d,m=0;for(;d<t;){if((h=e.charCodeAt(d))<=32){if(32===h)break;if(h>=9&&h<=13){c=!0;break}}else if(h>=160&&J(h)){c=!0;break}m=Math.imul(m^h,0x1000193),d++}let g=d,v=g-p;l===eE&&eV();let x=l++;eB[x]=p,ek[x]=g,u+=v;let b=(m^=Math.imul(v,0x9e3779b1))^m>>>15,y=8190&b;{let t=-1;if(ex[y]===b&&null!==eb[y]&&eb[y].length===v?t=y:ex[1|y]===b&&null!==eb[1|y]&&eb[1|y].length===v&&(t=1|y),t>=0){let r=eb[t],i=!0;for(let t=0;t<v;t++)if(r.charCodeAt(t)!==e.charCodeAt(p+t)){i=!1;break}if(i){eS[x]=ey[t],ez[x]=ew[t],eC[x]=e_[t];continue}}}let w=p;if(0!==O){if(g-p<=O||!e.startsWith(L,p)){eS[x]=-1,eU(y,e,p,g,b,-1,0,0);continue}w=p+O}let _=0,A=0,U=-1,E=-1;for(let t=w;t<g;t++){let r=e.charCodeAt(t);if(0===_&&0===A){if(58===r){U=t;continue}if(47===r){E=t;continue}}91===r?_++:93===r?_--:40===r?A++:41===r&&A--}let R=U>=w?U+1:w,B=R,k=g,S=!1,I=0;k>B&&33===e.charCodeAt(k-1)?(S=!0,k--):k>B&&33===e.charCodeAt(B)&&(S=!0,B++,I=1);let V=-1;E>R&&(V=E+I)>=k&&(V=-1);let T=B;k-B>1&&45===e.charCodeAt(B)&&(T=B+1);let D=0,M=0,P=0,j=-1,N=0;(s[0]>=0||1===C[0])&&(eD[0]=0,eM[0]=T,N=1);let H=-1,F=0;for(let t=T;t<k;t++)if(t===V&&(H=M<P?-1:D,F=N),-1!==D){let r=e.charCodeAt(t),l=-1;if(M<P)o.charCodeAt(M)===r?++M===P&&(l=D=j):D=-1;else{let e=i[D],t=i[D+1],s=-1;for(let i=e;i<t;i++){let e=n[i];if(o.charCodeAt(e)===r){n[i+1]-e==1?l=s=a[i]:(M=e+1,P=n[i+1],j=a[i],s=D);break}}D=s}if(l>=0&&(s[l]>=0||1===C[l])&&t+1<k&&45===e.charCodeAt(t+1)){if(N===eT){let e=new Int32Array(eT*=2);e.set(eD),eD=e;let t=new Int32Array(eT);t.set(eM),eM=t}eD[N]=l,eM[N]=t+2,N++}}V===k&&(H=M<P?-1:D,F=N);let W=M<P?-1:D,G=!1;if(V>=0)if(G=!0,-1!==(f=eW(e,B,V,H,F))&&f<r&&z[f]){let t=eW(e,B,k,W,N);-1!==t&&t!==f&&(f=t,G=!1)}else -1===f&&(f=eW(e,B,k,W,N),G=!1);else f=eW(e,B,k,W,N);let X=0,$=0;-1===f?eS[x]=-1:($=+!!G,X=w>=U?+!!S:eu(ec,e,w,U,+!!S,e=>eh(e,S)),eS[x]=f,eC[x]=$,ez[x]=X),eU(y,e,p,g,b,f,X,$)}if(0===l)return"";if(1===l)return 0===eB[0]&&ek[0]===t?e:e.slice(eB[0],ek[0]);if(l*k>ej){for(;l*k>ej;)ej<<=1,eL--;eO=new Float64Array(ej),eN=new Int32Array(ej)}if(ef>=2097152||em>=2097152)throw Error("cn: too many distinct classes in one merge");0==(eH=eH+1|0)&&(eP.fill(0),eN.fill(0),eH=1);let f=!1;for(let e=l-1;e>=0;e--){let t=eS[e];if(-1===t){eI[e]=1;continue}let i=ez[e];if(1===eF(i,t)){eI[e]=0,f=!0;continue}if(eI[e]=1,t<r){let r=R[t];if(r>=0)for(let e=b[r];e<b[r+1];e++)eF(i,y[e]);if(1&eC[e])for(let e=0;e<w.length;e++)w[e]===t&&eF(i,_[e])}}if(!f&&!c&&t===u+l-1)return e;let h="",p=0;for(;p<l;){if(!eI[p]){p++;continue}let t=eB[p],r=ek[p],i=p+1;for(;i<l&&eI[i]&&eB[i]===r+1&&32===e.charCodeAt(r);)r=ek[i],i++;h.length>0&&(h+=" "),h+=e.slice(t,r),p=i}return h},eX=new Int32Array(32768),e$=0,eY=1,eK=Object.create(null),eq=Object.create(null),eQ=new Map,eJ=new Map,eZ=0,e0=0,e2=()=>{e$^=16384,eY=eY+1|0,e0=0},e1=0===P?eG:e5?e=>{let t=eQ.get(e);return void 0!==t?t:(e=>{let t=eQ.get(e);if(void 0!==t)return t;let r=e9(e,0,e.length),i=(16383&r)+e$,n=eX[i]===(r^eY)||eX[16384^i]===(r^eY-1);return n&&void 0!==(t=eJ.get(e))?(eQ.set(e,t),t):(t=eG(e),n?(eQ.set(e,t),++eZ>P&&(eZ=0,eJ=eQ,eQ=new Map,e2())):(eX[i]=r^eY,++e0>16384&&e2()),t)})(e)}:e=>{let t=eK[e];if(void 0!==t)return t;let r=e9(e,0,e.length),i=(16383&r)+e$,n=eX[i]===(r^eY)||eX[16384^i]===(r^eY-1);return n&&void 0!==(t=eq[e])?(eK[e]=t,t):(t=eG(e),n?(eK[e]=t,++eZ>P&&(eZ=0,eq=eK,eK=Object.create(null),e2())):(eX[i]=r^eY,++e0>16384&&e2()),t)};return{merge:function(){return 1==arguments.length&&"string"==typeof arguments[0]?e1(arguments[0]):e1(e7.apply(null,arguments))},mergeString:e1,seenBefore:0===P?()=>!1:e=>{let t=e9(e,0,e.length),r=(16383&t)+e$;return eX[r]===(t^eY)||eX[16384^r]===(t^eY-1)||(eX[r]=t^eY,++e0>16384&&e2(),!1)},mergeUncached:eG}})(e3),tt=(m=te.mergeString,t=void 0===te?()=>!0:te.seenBefore,r=void 0===te?m:te.mergeUncached,i=new Map,n=new Map,o=0,a=null,l=null,s=[],u=[],c=0,d=(e,t,r)=>{null===l&&(l=Array(4096).fill(""),s=Array(4096).fill(""),u=Array(4096).fill(""));let i=4094&e9(e,0,e.length);if(l[i]===e&&s[i]===t)return u[i];if(l[1|i]===e&&s[1|i]===t)return u[1|i];let n=m(r?t+" "+e:e),o=""===l[i]?i:i|(""===l[1|i]?1:1&c++);return l[o]=e,s[o]=t,u[o]=n,n},f=(e,t,r,i)=>{let n=0;if(t){if(t!==e.a0)return!1;n=1}if(r){if(r!==(0===n?e.a0:e.a1))return!1;n++}if(i){if(i!==(0===n?e.a0:1===n?e.a1:e.a2))return!1;n++}return n===e.t},h=(e,t)=>{let r=e.a,i=0;for(let e=0;e<t.length;e++){let n=t[e];if(n){if(n!==r[i])return!1;i++}}return i===e.t},p=(e,l)=>{let s=e.length,u=null===a?null:a.n;if(!l){if(null!==u&&h(u,e))return a=u,u.r;if(null!==a&&a!==u&&h(a,e))return a.r}let c="",f=-1,p=0,g=!1;for(let t=0;t<s;t++){let r=e[t];if(r){if("string"!=typeof r){if(!(r=e[t]=e8(r,!0)))continue;g=!0}f<0&&(c=r,f=t),p++}}if(0===p)return"";if(1===p)return m(c);if(g){if(null!==u&&h(u,e))return a=u,u.r;if(null!==a&&a!==u&&h(a,e))return a.r}let v=i.get(c);void 0===v&&void 0!==(v=n.get(c))&&i.set(c,v);let x=null;if(void 0!==v){if(v.skip>0){v.skip--,a=null;let t=c;for(let r=f+1;r<s;r++){let i=e[r];i&&(t+=" "+i)}return d(t,"",!1)}let t=v.e;e:for(let r=0;r<t.length;r++){let i=t[r];if(i.t!==p)continue;let n=i.a,o=1;for(let t=f+1;t<s;t++){let r=e[t];if(r&&r!==n[o++])continue e}x=i;break}null!==x&&(v.miss=0)}if(null===x){let a=c,l=[c];for(let t=f+1;t<s;t++){let r=e[t];r&&(a+=" "+r,l.push(r))}if(!t(a))return r(a);x={r:m(a),t:l.length,a0:l[0],a1:l[1],a2:l[2]??"",a:l,n:null},void 0===v?i.set(c,v={e:[],miss:0,skip:0,at:0}):++v.miss>16&&(v.miss=16,v.skip=1024,v.e.length=0,v.at=0);let u=v.e;u.length<256?u.push(x):(u[v.at]=x,v.at=v.at+1&255),++o>1e3&&(o=0,n=i,i=new Map)}return null!==a&&a!==x&&(a.n=x),a=x,x.r},function(e,t,r){let n=arguments.length;if((1|n)==3){let o=a;if(null!==o){let i=o.n;if(null!==i&&f(i,e,t,r))return a=i,i.r;if(o!==i&&f(o,e,t,r))return o.r}if(2===n&&"string"==typeof t&&""!==t){let r=i.get(e);if(void 0!==r&&r.skip>0)return r.skip--,a=null,d(t,e,!0)}return p([e,t,r],!0)}if(1===n)return"string"==typeof e?m(e):Array.isArray(e)?p(e.slice(),!1):m(e8(e,!0));let o=a;if(null!==o){let e=o.n;if(null!==e){let t=e.a,r=0,i=!0;for(let e=0;e<n;e++){let n=arguments[e];if(n){if(n!==t[r]){i=!1;break}r++}}if(i&&r===e.t)return a=e,e.r}if(o!==e){let e=o.a,t=0,r=!0;for(let i=0;i<n;i++){let n=arguments[i];if(n){if(n!==e[t]){r=!1;break}t++}}if(r&&t===o.t)return o.r}}let l=[];for(let e=0;e<n;e++)l.push(arguments[e]);return p(l,!0)});function tr({className:e,size:t="default",...r}){return(0,g.jsx)("div",{"data-slot":"card","data-size":t,className:tt("group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",e),...r})}te.merge;var ti=e.i(46932);function tn({badge:e,title:t,subtitle:r,primaryCtaLabel:i,secondaryCtaLabel:n,onPrimaryCtaClick:o,onSecondaryCtaClick:a,features:l=[]}){let s={hidden:{opacity:0,y:30},visible:{opacity:1,y:0}},u=N?.[2]||N?.[0],{worldWidth:c,worldHeight:d,...f}=u?.params||{};return(0,g.jsxs)("section",{className:"\r\n\n        relative\r\n\n        isolate\r\n\n        flex\r\n\n        min-h-screen\r\n\n        items-center\r\n\n        justify-center\r\n\n        overflow-hidden\r\n\n      ",children:[(0,g.jsx)(H,{...f,style:{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0}}),(0,g.jsx)("div",{className:"\r\n\n          absolute\r\n\n          inset-0\r\n\n          z-[1]\r\n\n          bg-black/20\r\n\n          pointer-events-none\r\n\n        "}),(0,g.jsx)("div",{className:"\r\n\n          relative\r\n\n          z-10\r\n\n          container\r\n\n          mx-auto\r\n\n          max-w-7xl\r\n\n          px-6\r\n\n          lg:px-8\r\n\n        ",children:(0,g.jsxs)(ti.f.div,{className:"space-y-8 text-center",variants:{hidden:{opacity:0},visible:{opacity:1,transition:{delayChildren:.2,staggerChildren:.15}}},initial:"hidden",animate:"visible",children:[e&&(0,g.jsx)(ti.f.div,{className:"flex justify-center",variants:s,children:(0,g.jsx)(eC,{variant:"secondary",className:"\r\n\n                  border-white/20\r\n\n                  bg-white/10\r\n\n                  text-white\r\n\n                  backdrop-blur-md\r\n\n                  hover:bg-white/20\r\n\n                ",children:e})}),(0,g.jsxs)(ti.f.div,{className:"space-y-6",variants:s,children:[(0,g.jsx)(ti.f.h1,{className:"\r\n\n                text-5xl\r\n\n                font-bold\r\n\n                leading-tight\r\n\n                tracking-tight\r\n\n                text-white\r\n\n                sm:text-6xl\r\n\n                lg:text-7xl\r\n\n                xl:text-8xl\r\n\n              ",variants:s,children:t}),(0,g.jsx)(ti.f.p,{className:"\r\n\n                mx-auto\r\n\n                max-w-3xl\r\n\n                text-xl\r\n\n                leading-relaxed\r\n\n                text-white/90\r\n\n                sm:text-2xl\r\n\n              ",variants:s,children:r})]}),(0,g.jsxs)(ti.f.div,{className:"\r\n\n              flex\r\n\n              flex-col\r\n\n              items-center\r\n\n              justify-center\r\n\n              gap-4\r\n\n              sm:flex-row\r\n\n            ",variants:{hidden:{opacity:0,scale:.9},visible:{opacity:1,scale:1}},children:[(0,g.jsx)(ti.f.div,{whileHover:{scale:1.05},whileTap:{scale:.95},children:(0,g.jsx)(eS,{onClick:o,size:"lg",className:"\r\n\n                  bg-white\r\n\n                  px-8\r\n\n                  py-6\r\n\n                  text-lg\r\n\n                  font-semibold\r\n\n                  text-black\r\n\n                  shadow-2xl\r\n\n                  hover:bg-white/90\r\n\n                ",children:i})}),n&&a&&(0,g.jsx)(ti.f.div,{whileHover:{scale:1.05},whileTap:{scale:.95},children:(0,g.jsx)(eS,{onClick:a,variant:"outline",size:"lg",className:"\r\n\n                      border-white/40\r\n\n                      bg-white/10\r\n\n                      px-8\r\n\n                      py-6\r\n\n                      text-lg\r\n\n                      font-semibold\r\n\n                      text-white\r\n\n                      backdrop-blur-md\r\n\n                      hover:bg-white/20\r\n\n                      hover:text-white\r\n\n                    ",children:n})})]}),l.length>0&&(0,g.jsx)(ti.f.div,{className:"pt-12",variants:s,children:(0,g.jsx)(ti.f.div,{whileHover:{y:-4},transition:{duration:.3},children:(0,g.jsx)(tr,{className:"\r\n\n                    border-white/20\r\n\n                    bg-white/10\r\n\n                    shadow-2xl\r\n\n                    backdrop-blur-md\r\n\n                  ",children:(0,g.jsx)("div",{className:"p-8",children:(0,g.jsx)("div",{className:"\r\n\n                        grid\r\n\n                        grid-cols-1\r\n\n                        gap-6\r\n\n                        md:grid-cols-3\r\n\n                      ",children:l.map((e,t)=>(0,g.jsx)(ti.f.div,{className:"\r\n\n                              flex\r\n\n                              items-center\r\n\n                              justify-center\r\n\n                              text-center\r\n\n                            ",initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{duration:.6,delay:.8+.1*t},children:(0,g.jsx)("p",{className:"\r\n\n                                text-lg\r\n\n                                font-medium\r\n\n                                text-white/90\r\n\n                              ",children:e})},t))})})})})})]})})]})}e.s(["default",0,function(){return(0,g.jsx)(tn,{badge:"✨ Next Generation UI",title:"Fluid Design Excellence",subtitle:"Experience the future of web interfaces with liquid metal aesthetics that adapt, flow, and captivate. Built for modern applications that demand both beauty and performance.",primaryCtaLabel:"Start Building",secondaryCtaLabel:"View Examples",onPrimaryCtaClick:()=>{alert("Primary CTA clicked!")},onSecondaryCtaClick:()=>{alert("Secondary CTA clicked!")},features:["Seamless Animations","Responsive Excellence","Modern Architecture"]})}],16503)}]);
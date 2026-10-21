(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,57293,e=>{"use strict";var i=e.i(43476),t=e.i(71645),n=e.i(90072),o=e.i(8560);e.s(["ShaderAnimation",0,function(){let e=(0,t.useRef)(null),r=(0,t.useRef)(null);return(0,t.useEffect)(()=>{if(!e.current)return;let i=e.current,t=`
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,l=`
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;

      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy)
                  / min(resolution.x, resolution.y);

        float t = time * 0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);

        for (int j = 0; j < 3; j++) {
          for (int i = 0; i < 5; i++) {
            color[j] +=
              lineWidth * float(i * i) /
              abs(
                fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
                - length(uv)
                + mod(uv.x + uv.y, 0.2)
              );
          }
        }

        gl_FragColor = vec4(
          color[0],
          color[1],
          color[2],
          1.0
        );
      }
    `,a=new n.VT;a.position.z=1;let u=new n.P6,d=new n.CQ(2,2),s={time:{value:1},resolution:{value:new n.wq}},c=new n.Zg({uniforms:s,vertexShader:t,fragmentShader:l}),m=new n.kE(d,c);u.add(m);let v=new o.f({antialias:!0});v.setPixelRatio(Math.min(window.devicePixelRatio,2)),i.appendChild(v.domElement);let f=()=>{let e=i.clientWidth,t=i.clientHeight;v.setSize(e,t),s.resolution.value.x=v.domElement.width,s.resolution.value.y=v.domElement.height};f(),window.addEventListener("resize",f);let h=()=>{let e=requestAnimationFrame(h);s.time.value+=.05,v.render(u,a),r.current&&(r.current.animationId=e)};return r.current={camera:a,scene:u,renderer:v,uniforms:s,animationId:0},h(),()=>{window.removeEventListener("resize",f),r.current&&(cancelAnimationFrame(r.current.animationId),i.contains(r.current.renderer.domElement)&&i.removeChild(r.current.renderer.domElement),r.current.renderer.dispose(),d.dispose(),c.dispose())}},[]),(0,i.jsx)("div",{ref:e,className:"h-full w-full",style:{background:"#000",overflow:"hidden"}})}])}]);
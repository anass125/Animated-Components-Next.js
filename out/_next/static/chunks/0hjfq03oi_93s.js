(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,47638,e=>{"use strict";var i=e.i(43476),n=e.i(71645),o=e.i(8560),t=e.i(90072);e.s(["default",0,function({hasActiveReminders:e=!1,hasUpcomingReminders:s=!1,disableCenterDimming:a=!1,className:l=""}){let r=(0,n.useRef)(null),m=(0,n.useRef)(null);return(0,n.useEffect)(()=>{let i=m.current;i&&(i.uniforms.hasActiveReminders.value=e,i.uniforms.hasUpcomingReminders.value=s,i.uniforms.disableCenterDimming.value=a)},[e,s,a]),(0,n.useEffect)(()=>{let i=r.current;if(!i)return;let n=new o.f({antialias:!0,alpha:!1});n.setPixelRatio(Math.min(window.devicePixelRatio,2)),n.setClearColor(0,1),i.appendChild(n.domElement);let l=new t.P6,v=new t.Sc(-1,1,1,-1,0,1),u=new t.mR,d=`
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,c=`
      precision mediump float;

      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;

      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;

      varying vec2 vUv;

      #define t iTime

      mat2 m(float a) {
        float c = cos(a);
        float s = sin(a);

        return mat2(
          c,
          -s,
          s,
          c
        );
      }

      float map(vec3 p) {

        p.xz *= m(t * 0.4);
        p.xy *= m(t * 0.3);

        vec3 q = p * 2.0 + t;

        return
          length(
            p + vec3(sin(t * 0.7))
          )
          * log(length(p) + 1.0)

          + sin(
              q.x
              + sin(
                  q.z
                  + sin(q.y)
                )
            )
          * 0.5

          - 1.0;
      }

      void mainImage(
        out vec4 O,
        in vec2 fragCoord
      ) {

        vec2 uv =
          fragCoord
          / min(
              iResolution.x,
              iResolution.y
            )
          - vec2(0.9, 0.5);

        uv.x += 0.4;

        vec3 col = vec3(0.0);

        float d = 2.5;

        // --------------------------------------------
        // Ray Marching
        // --------------------------------------------

        for (int i = 0; i <= 5; i++) {

          vec3 p =
            vec3(
              0.0,
              0.0,
              5.0
            )
            +
            normalize(
              vec3(
                uv,
                -1.0
              )
            )
            * d;

          float rz = map(p);

          float f =
            clamp(
              (
                rz
                - map(p + 0.1)
              )
              * 0.5,
              -0.1,
              1.0
            );

          // ------------------------------------------
          // Color palettes
          // ------------------------------------------

          vec3 base =
            hasActiveReminders

              ? vec3(
                  0.05,
                  0.2,
                  0.5
                )
                +
                vec3(
                  4.0,
                  2.0,
                  5.0
                )
                * f

              : hasUpcomingReminders

              ? vec3(
                  0.05,
                  0.3,
                  0.1
                )
                +
                vec3(
                  2.0,
                  5.0,
                  1.0
                )
                * f

              : vec3(
                  0.1,
                  0.3,
                  0.4
                )
                +
                vec3(
                  5.0,
                  2.5,
                  3.0
                )
                * f;

          col =
            col * base
            +
            smoothstep(
              2.5,
              0.0,
              rz
            )
            * 0.7
            * base;

          d += min(
            rz,
            1.0
          );
        }

        // --------------------------------------------
        // Center dimming
        // --------------------------------------------

        float dist =
          distance(
            fragCoord,
            iResolution * 0.5
          );

        float radius =
          min(
            iResolution.x,
            iResolution.y
          )
          * 0.5;

        float dim =
          disableCenterDimming

            ? 1.0

            : smoothstep(
                radius * 0.3,
                radius * 0.5,
                dist
              );

        O = vec4(
          col,
          1.0
        );

        if (!disableCenterDimming) {

          O.rgb =
            mix(
              O.rgb * 0.3,
              O.rgb,
              dim
            );
        }
      }

      void main() {

        mainImage(
          gl_FragColor,
          vUv * iResolution
        );
      }
    `,f={iTime:{value:0},iResolution:{value:new t.wq},iMouse:{value:new t.wq},hasActiveReminders:{value:e},hasUpcomingReminders:{value:s},disableCenterDimming:{value:a}},p=new t.Zg({vertexShader:d,fragmentShader:c,uniforms:f});m.current=p;let g=new t.CQ(2,2),h=new t.kE(g,p);l.add(h);let R=()=>{let e=i.clientWidth,o=i.clientHeight;0!==e&&0!==o&&(n.setSize(e,o,!1),f.iResolution.value.set(e,o))},w=e=>{f.iMouse.value.set(e.clientX,window.innerHeight-e.clientY)};return window.addEventListener("resize",R),window.addEventListener("mousemove",w),R(),n.setAnimationLoop(()=>{f.iTime.value=u.getElapsedTime(),n.render(l,v)}),()=>{window.removeEventListener("resize",R),window.removeEventListener("mousemove",w),n.setAnimationLoop(null),m.current=null,l.remove(h),g.dispose(),p.dispose(),i.contains(n.domElement)&&i.removeChild(n.domElement),n.dispose()}},[]),(0,i.jsx)("div",{ref:r,className:`
        fixed
        inset-0
        z-0
        pointer-events-none
        overflow-hidden
        bg-black
        ${l}
      `,"aria-hidden":"true"})}])}]);
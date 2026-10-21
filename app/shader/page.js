// After you copy components/ui/shader-animation.jsx from your original project,
// replace this placeholder with:
// import Component from "@/components/ui/shader-animation";
// export default function Page() { return <Component />; };

import { ShaderAnimation } from "@/components/ui/shader-animation"

export default function Page() { return (
    <main className="min-h-screen bg-black p-10">
    <div className="relative flex h-[650px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border bg-blue-700">

      <ShaderAnimation />

      <span className="pointer-events-none absolute z-10 whitespace-pre-wrap text-center text-7xl font-semibold leading-none tracking-tighter text-white">
        Shader Animation
      </span>

    </div>
    </main>
  )  }
    
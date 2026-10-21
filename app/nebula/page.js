// After you copy components/ui/liquid-shader.jsx from your original project,
// replace this placeholder with:
// import Component from "@/components/ui/liquid-shader";
// export default function Page() { return <Component />; };

import InteractiveNebulaShader from "@/components/ui/liquid-shader";

export default function Page() { return(<main className="relative min-h-screen">


      <div className="relative z-10">
      <InteractiveNebulaShader />
      </div>

    </main>)  }

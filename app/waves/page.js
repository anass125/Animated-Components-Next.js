// After you copy components/ui/wave-background.jsx from your original project,
// replace this placeholder with:
// import Component from "@/components/ui/wave-background";
// export default function Page() { return <Component />; };

import { Waves } from "@/components/ui/wave-background"


export default function Page() { return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      <Waves className="h-full w-full" />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <h1 className="text-6xl font-bold text-white">
          Waves Background
        </h1>
      </div>
    </main>
  ) }

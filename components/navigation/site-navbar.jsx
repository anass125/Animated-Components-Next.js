"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { name: "Home", href: "/" },
  { name: "Nebula", href: "/nebula" },
  { name: "Shader", href: "/shader" },
  { name: "Waves", href: "/waves" },
  { name: "Kinetic", href: "/kinetic" },
  { name: "Vapour", href: "/vapour" },
  { name: "Liquid Metal", href: "/liquid-metal" },
  { name: "Anime Navbar", href: "/anime-navbar" }
];
export default function SiteNavbar() {
  const pathname = usePathname();
  return <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 pointer-events-none">
    <nav aria-label="Main navigation" className="pointer-events-auto flex max-w-full flex-wrap justify-center gap-1 rounded-2xl border border-white/15 bg-black/70 p-2 shadow-2xl backdrop-blur-xl">
      {links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}
        className={`rounded-xl px-3 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 ${pathname === link.href ? "bg-orange-500 text-black" : "text-white/90"}`}>
        {link.name}</Link>)}
    </nav>
  </header>;
}


// ///Using anime navigation from 21st dev components

// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { AnimatePresence, motion } from "motion/react"

// const links = [
//   { name: "Home", href: "/" },
//   { name: "Nebula", href: "/nebula" },
//   { name: "Shader", href: "/shader" },
//   { name: "Waves", href: "/waves" },
//   { name: "Kinetic", href: "/kinetic" },
//   { name: "Vapour", href: "/vapour" },
//   { name: "Liquid Metal", href: "/liquid-metal" },
//   {name: "Anime Navbar", href: "/anime-navbar"}
// ]

// export default function SiteNavbar() {
//   const pathname = usePathname()

//   return (
//     <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-8">
//       <motion.nav
//         aria-label="Main navigation"
//         className="
//           pointer-events-auto
//           relative
//           flex
//           max-w-full
//           flex-wrap
//           items-center
//           justify-center
//           gap-1
//           rounded-full
//           border
//           border-white/10
//           bg-black/60
//           p-2
//           shadow-2xl
//           backdrop-blur-xl
//         "
//         initial={{
//           y: -30,
//           opacity: 0,
//         }}
//         animate={{
//           y: 0,
//           opacity: 1,
//         }}
//         transition={{
//           type: "spring",
//           stiffness: 260,
//           damping: 20,
//         }}
//       >
//         {links.map((link) => {
//           const isActive = pathname === link.href

//           return (
//             <Link
//               key={link.href}
//               href={link.href}
//               aria-current={isActive ? "page" : undefined}
//               className="
//                 group
//                 relative
//                 rounded-full
//                 px-4
//                 py-2.5
//                 text-sm
//                 font-semibold
//                 text-white/70
//                 transition-colors
//                 duration-300
//                 hover:text-white
//               "
//             >
//               {/* Active glow */}
//               {isActive && (
//                 <motion.div
//                   layoutId="active-navbar-tab"
//                   className="
//                     absolute
//                     inset-0
//                     -z-10
//                     overflow-hidden
//                     rounded-full
//                   "
//                   transition={{
//                     type: "spring",
//                     stiffness: 300,
//                     damping: 30,
//                   }}
//                 >
//                   <motion.div
//                     className="absolute inset-0 rounded-full bg-violet-500/30"
//                     animate={{
//                       opacity: [0.4, 0.7, 0.4],
//                       scale: [1, 1.04, 1],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       ease: "easeInOut",
//                     }}
//                   />

//                   <div className="absolute inset-[-5px] rounded-full bg-violet-500/20 blur-xl" />

//                   <div className="absolute inset-[-10px] rounded-full bg-purple-500/10 blur-2xl" />
//                 </motion.div>
//               )}

//               {/* Hover background */}
//               {!isActive && (
//                 <motion.div
//                   className="
//                     absolute
//                     inset-0
//                     -z-10
//                     rounded-full
//                     bg-white/0
//                     transition-colors
//                     duration-300
//                     group-hover:bg-white/10
//                   "
//                 />
//               )}

//               {/* Navbar text */}
//               <span className="relative z-10">
//                 {link.name}
//               </span>

//               {/* Anime mascot */}
//               {isActive && (
//                 <motion.div
//                   layoutId="anime-navbar-mascot"
//                   className="
//                     pointer-events-none
//                     absolute
//                     -top-12
//                     left-1/2
//                     -translate-x-1/2
//                   "
//                   transition={{
//                     type: "spring",
//                     stiffness: 300,
//                     damping: 25,
//                   }}
//                 >
//                   <div className="relative h-12 w-12">

//                     {/* Head */}
//                     <motion.div
//                       className="
//                         absolute
//                         left-1/2
//                         h-10
//                         w-10
//                         -translate-x-1/2
//                         rounded-full
//                         bg-white
//                         shadow-lg
//                         shadow-violet-500/30
//                       "
//                       animate={{
//                         y: [0, -3, 0],
//                       }}
//                       transition={{
//                         duration: 2,
//                         repeat: Infinity,
//                         ease: "easeInOut",
//                       }}
//                     >
//                       {/* Left eye */}
//                       <motion.div
//                         className="
//                           absolute
//                           h-2
//                           w-2
//                           rounded-full
//                           bg-black
//                         "
//                         style={{
//                           left: "25%",
//                           top: "40%",
//                         }}
//                         animate={{
//                           scaleY: [1, 1, 0.15, 1, 1],
//                         }}
//                         transition={{
//                           duration: 3,
//                           repeat: Infinity,
//                           times: [0, 0.4, 0.45, 0.5, 1],
//                         }}
//                       />

//                       {/* Right eye */}
//                       <motion.div
//                         className="
//                           absolute
//                           h-2
//                           w-2
//                           rounded-full
//                           bg-black
//                         "
//                         style={{
//                           right: "25%",
//                           top: "40%",
//                         }}
//                         animate={{
//                           scaleY: [1, 1, 0.15, 1, 1],
//                         }}
//                         transition={{
//                           duration: 3,
//                           repeat: Infinity,
//                           times: [0, 0.4, 0.45, 0.5, 1],
//                         }}
//                       />

//                       {/* Left cheek */}
//                       <div
//                         className="
//                           absolute
//                           h-1.5
//                           w-2
//                           rounded-full
//                           bg-pink-300
//                         "
//                         style={{
//                           left: "12%",
//                           top: "58%",
//                         }}
//                       />

//                       {/* Right cheek */}
//                       <div
//                         className="
//                           absolute
//                           h-1.5
//                           w-2
//                           rounded-full
//                           bg-pink-300
//                         "
//                         style={{
//                           right: "12%",
//                           top: "58%",
//                         }}
//                       />

//                       {/* Mouth */}
//                       <div
//                         className="
//                           absolute
//                           h-2
//                           w-4
//                           rounded-full
//                           border-b-2
//                           border-black
//                         "
//                         style={{
//                           left: "30%",
//                           top: "60%",
//                         }}
//                       />

//                       {/* Sparkles */}
//                       <AnimatePresence>
//                         <motion.span
//                           className="
//                             absolute
//                             -right-2
//                             -top-2
//                             text-xs
//                           "
//                           animate={{
//                             opacity: [0, 1, 0],
//                             scale: [0.5, 1.2, 0.5],
//                             rotate: [0, 20, 0],
//                           }}
//                           transition={{
//                             duration: 1.5,
//                             repeat: Infinity,
//                           }}
//                         >
//                           ✨
//                         </motion.span>
//                       </AnimatePresence>
//                     </motion.div>

//                     {/* Anime tail/body */}
//                     <motion.div
//                       className="
//                         absolute
//                         -bottom-1
//                         left-1/2
//                         h-4
//                         w-4
//                         -translate-x-1/2
//                       "
//                       animate={{
//                         y: [0, 2, 0],
//                       }}
//                       transition={{
//                         duration: 1,
//                         repeat: Infinity,
//                         ease: "easeInOut",
//                       }}
//                     >
//                       <div
//                         className="
//                           h-full
//                           w-full
//                           rotate-45
//                           bg-white
//                         "
//                       />
//                     </motion.div>

//                   </div>
//                 </motion.div>
//               )}
//             </Link>
//           )
//         })}
//       </motion.nav>
//     </header>
//   )
// }
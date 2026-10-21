"use client"

import {
  LiquidMetal,
  liquidMetalPresets,
} from "@paper-design/shaders-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

import { motion } from "framer-motion"

export default function LiquidMetalHero({
  badge,
  title,
  subtitle,
  primaryCtaLabel,
  secondaryCtaLabel,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  features = [],
}) {
  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,

      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },

    visible: {
      opacity: 1,
      y: 0,
    },
  }

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },

    visible: {
      opacity: 1,
      scale: 1,
    },
  }

  /*
   * Paper's presets store the actual shader values
   * inside the "params" property.
   *
   * We try preset 2 first because that was used
   * in your original component.
   */
  const selectedPreset =
    liquidMetalPresets?.[2] ||
    liquidMetalPresets?.[0]

  const {
    worldWidth,
    worldHeight,
    ...liquidMetalPreset
  } = selectedPreset?.params || {}

  return (
    <section
      className="
        relative
        isolate
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
      "
    >
      {/* Liquid Metal Background */}

      <LiquidMetal
        {...liquidMetalPreset}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Dark overlay for text readability */}

      <div
        className="
          absolute
          inset-0
          z-[1]
          bg-black/20
          pointer-events-none
        "
      />

      {/* Hero Content */}

      <div
        className="
          relative
          z-10
          container
          mx-auto
          max-w-7xl
          px-6
          lg:px-8
        "
      >
        <motion.div
          className="space-y-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}

          {badge && (
            <motion.div
              className="flex justify-center"
              variants={itemVariants}
            >
              <Badge
                variant="secondary"
                className="
                  border-white/20
                  bg-white/10
                  text-white
                  backdrop-blur-md
                  hover:bg-white/20
                "
              >
                {badge}
              </Badge>
            </motion.div>
          )}

          {/* Heading */}

          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <motion.h1
              className="
                text-5xl
                font-bold
                leading-tight
                tracking-tight
                text-white
                sm:text-6xl
                lg:text-7xl
                xl:text-8xl
              "
              variants={itemVariants}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}

            <motion.p
              className="
                mx-auto
                max-w-3xl
                text-xl
                leading-relaxed
                text-white/90
                sm:text-2xl
              "
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>
          </motion.div>

          {/* Buttons */}

          <motion.div
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-4
              sm:flex-row
            "
            variants={buttonVariants}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              <Button
                onClick={onPrimaryCtaClick}
                size="lg"
                className="
                  bg-white
                  px-8
                  py-6
                  text-lg
                  font-semibold
                  text-black
                  shadow-2xl
                  hover:bg-white/90
                "
              >
                {primaryCtaLabel}
              </Button>
            </motion.div>

            {secondaryCtaLabel &&
              onSecondaryCtaClick && (
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  <Button
                    onClick={onSecondaryCtaClick}
                    variant="outline"
                    size="lg"
                    className="
                      border-white/40
                      bg-white/10
                      px-8
                      py-6
                      text-lg
                      font-semibold
                      text-white
                      backdrop-blur-md
                      hover:bg-white/20
                      hover:text-white
                    "
                  >
                    {secondaryCtaLabel}
                  </Button>
                </motion.div>
              )}
          </motion.div>

          {/* Feature Card */}

          {features.length > 0 && (
            <motion.div
              className="pt-12"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{
                  y: -4,
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                <Card
                  className="
                    border-white/20
                    bg-white/10
                    shadow-2xl
                    backdrop-blur-md
                  "
                >
                  <div className="p-8">
                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-6
                        md:grid-cols-3
                      "
                    >
                      {features.map(
                        (feature, index) => (
                          <motion.div
                            key={index}
                            className="
                              flex
                              items-center
                              justify-center
                              text-center
                            "
                            initial={{
                              opacity: 0,
                              x: -20,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            transition={{
                              duration: 0.6,
                              delay:
                                0.8 +
                                index * 0.1,
                            }}
                          >
                            <p
                              className="
                                text-lg
                                font-medium
                                text-white/90
                              "
                            >
                              {feature}
                            </p>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}



















// "use client";

// import {
//   LiquidMetal,
//   liquidMetalPresets,
// } from "@paper-design/shaders-react";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { motion } from "framer-motion";

// export default function LiquidMetalHero({
//   badge,
//   title,
//   subtitle,
//   primaryCtaLabel,
//   secondaryCtaLabel,
//   onPrimaryCtaClick,
//   onSecondaryCtaClick,
//   features = [],
// }) {
//   const containerVariants = {
//     hidden: { opacity: 0 },

//     visible: {
//       opacity: 1,

//       transition: {
//         delayChildren: 0.2,
//         staggerChildren: 0.15,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: {
//       opacity: 0,
//       y: 30,
//     },

//     visible: {
//       opacity: 1,
//       y: 0,
//     },
//   };

//   const buttonVariants = {
//     hidden: {
//       opacity: 0,
//       scale: 0.9,
//     },

//     visible: {
//       opacity: 1,
//       scale: 1,
//     },
//   };

//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       <LiquidMetal
//         {...liquidMetalPresets[2]}
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: -10,
//         }}
//       />

//       <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
//         <motion.div
//           className="text-center space-y-8"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           transition={{
//             duration: 0.8,
//             ease: [0.25, 0.1, 0.25, 1],
//           }}
//         >
//           {badge && (
//             <motion.div
//               className="flex justify-center"
//               variants={itemVariants}
//             >
//               <Badge
//                 variant="secondary"
//                 className="bg-foreground/10 text-foreground border-foreground/20 hover:bg-foreground/20 transition-colors duration-300 backdrop-blur-sm"
//               >
//                 {badge}
//               </Badge>
//             </motion.div>
//           )}

//           <motion.div
//             className="space-y-6"
//             variants={itemVariants}
//           >
//             <motion.h1
//               role="heading"
//               aria-level={1}
//               className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-tight tracking-tight"
//               variants={itemVariants}
//             >
//               {title}
//             </motion.h1>

//             <motion.p
//               className="max-w-3xl mx-auto text-xl sm:text-2xl text-foreground/90 leading-relaxed"
//               variants={itemVariants}
//             >
//               {subtitle}
//             </motion.p>
//           </motion.div>

//           <motion.div
//             className="flex flex-col sm:flex-row gap-4 justify-center items-center"
//             variants={buttonVariants}
//           >
//             <motion.div
//               whileHover={{
//                 scale: 1.05,
//               }}
//               whileTap={{
//                 scale: 0.95,
//               }}
//             >
//               <Button
//                 onClick={onPrimaryCtaClick}
//                 size="lg"
//                 className="bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 shadow-2xl text-lg px-8 py-6 font-semibold"
//               >
//                 {primaryCtaLabel}
//               </Button>
//             </motion.div>

//             {secondaryCtaLabel &&
//               onSecondaryCtaClick && (
//                 <motion.div
//                   whileHover={{
//                     scale: 1.05,
//                   }}
//                   whileTap={{
//                     scale: 0.95,
//                   }}
//                 >
//                   <Button
//                     onClick={
//                       onSecondaryCtaClick
//                     }
//                     variant="outline"
//                     size="lg"
//                     className="border-foreground/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50 transition-all duration-300 backdrop-blur-sm text-lg px-8 py-6 font-semibold"
//                   >
//                     {secondaryCtaLabel}
//                   </Button>
//                 </motion.div>
//               )}
//           </motion.div>

//           {features.length > 0 && (
//             <motion.div
//               className="pt-12"
//               variants={itemVariants}
//             >
//               <motion.div
//                 whileHover={{
//                   y: -4,
//                 }}
//                 transition={{
//                   duration: 0.3,
//                 }}
//               >
//                 <Card className="bg-foreground/10 border-foreground/20 backdrop-blur-md shadow-2xl">
//                   <div className="p-8">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       {features.map(
//                         (feature, index) => (
//                           <motion.div
//                             key={index}
//                             className="flex items-center justify-center text-center"
//                             initial={{
//                               opacity: 0,
//                               x: -20,
//                             }}
//                             animate={{
//                               opacity: 1,
//                               x: 0,
//                             }}
//                             transition={{
//                               duration: 0.6,
//                               delay:
//                                 0.8 +
//                                 index * 0.1,
//                             }}
//                           >
//                             <p className="text-foreground/90 font-medium text-lg">
//                               {feature}
//                             </p>
//                           </motion.div>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 </Card>
//               </motion.div>
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     </section>
//   );
// }
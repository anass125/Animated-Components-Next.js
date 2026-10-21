"use client"

import LiquidMetalHero from "@/components/ui/liquid-metal-hero"

export default function LiquidMetalDemo() {
    const handlePrimaryClick = () => {
        alert("Primary CTA clicked!")
    }

    const handleSecondaryClick = () => {
        alert("Secondary CTA clicked!")
    }

    return (
        <LiquidMetalHero
            badge="✨ Next Generation UI"
            title="Fluid Design Excellence"
            subtitle="Experience the future of web interfaces with liquid metal aesthetics that adapt, flow, and captivate. Built for modern applications that demand both beauty and performance."
            primaryCtaLabel="Start Building"
            secondaryCtaLabel="View Examples"
            onPrimaryCtaClick={handlePrimaryClick}
            onSecondaryCtaClick={
                handleSecondaryClick
            }
            features={[
                "Seamless Animations",
                "Responsive Excellence",
                "Modern Architecture",
            ]}
        />
    )
}
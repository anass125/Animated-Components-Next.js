"use client"

import { CreditCard, FileText, Home, Info } from "lucide-react"
import { AnimeNavBar } from "@/components/ui/anime-navbar"

const items = [
    {
        name: "Home",
        url: "#home",
        icon: Home,
    },
    {
        name: "Convert",
        url: "#convert",
        icon: FileText,
    },
    {
        name: "Pricing",
        url: "#pricing",
        icon: CreditCard,
    },
    {
        name: "About",
        url: "#about",
        icon: Info,
    },
]

export function AnimeNavBarDemo() {
    return <AnimeNavBar items={items} defaultActive="Home" />
}
'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Logo from "@/public/icons/icon.png"
import { APP_NAME } from '@/lib/constants'
import { WeatherWidget } from "./WeatherWidget"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={`
                sticky top-0 z-50 
                transition-all duration-300 
                ${isScrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80'
                    : 'bg-white dark:bg-gray-900'
                }
            `}
        >
            <div className="flex justify-between items-center h-16 px-4">
                <Link
                    href='/'
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                    <Image
                        src={Logo}
                        alt={APP_NAME}
                        className="size-8 rounded-lg"
                        priority
                    />
                    <span className="font-semibold text-xl tracking-tight">
                        {APP_NAME}
                    </span>
                </Link>

                <WeatherWidget />
            </div>
        </nav>
    )
}
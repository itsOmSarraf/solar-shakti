'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { APP_NAME } from '@/lib/constants'
import { WeatherWidget } from "./WeatherWidget"
import { AiOutlineRobot } from 'react-icons/ai'

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
                sticky top-0
                transition-all duration-300 
                bg-white dark:bg-gray-950
                border-b border-gray-200 dark:border-gray-800
                z-50
                ${isScrolled
                    ? 'shadow-sm'
                    : ''
                }
            `}
        >
            <div className="flex justify-between items-center h-16 px-4">
                <Link
                    href='/'
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                    <span className="font-semibold text-xl tracking-tight text-gray-900 dark:text-gray-100">
                        {APP_NAME}
                    </span>
                </Link>

                <div className="flex items-center space-x-4">
                    <WeatherWidget />
                    <Link
                        href='/chatbot'
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                        <AiOutlineRobot size={24} className="text-gray-900 dark:text-gray-100" />
                        <span className="font-semibold text-lg tracking-tight text-gray-900 dark:text-gray-100">
                            ShaktiBot
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
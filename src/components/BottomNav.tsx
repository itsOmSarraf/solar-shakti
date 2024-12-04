"use client";

import { Home, BarChart2, Bell, Settings, Power } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from "@/components/ui/badge";

const navItems = [
    {
        icon: Home,
        label: "Home",
        href: "/",
    },
    {
        icon: BarChart2,
        label: "Stats",
        href: "/statistics",
    },
    {
        icon: Power,
        label: "Devices",
        href: "/appliances",
    },
    {
        icon: Bell,
        label: "Alerts",
        href: "/notifications",
        badge: 3  // Example notification count
    },
    {
        icon: Settings,
        label: "More",
        href: "/settings",
    },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
            <div className="max-w-md mx-auto flex justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex flex-col items-center py-2 px-3"
                        >
                            <div className="relative">
                                <Icon
                                    className={`w-6 h-6 ${isActive
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                        }`}
                                />
                                {item.badge && (
                                    <Badge
                                        className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center bg-red-500"
                                    >
                                        <span className="text-[10px]">
                                            {item.badge}
                                        </span>
                                    </Badge>
                                )}
                            </div>
                            <span
                                className={`mt-1 text-xs ${isActive
                                    ? 'text-green-600 font-medium'
                                    : 'text-gray-500'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
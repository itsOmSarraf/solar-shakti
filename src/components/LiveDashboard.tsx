'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Home, Sun, Zap } from "lucide-react";

interface MetricBoxProps {
    icon: React.ComponentType<any>;
    label: string;
    value?: string;
    subValue?: string;
    isHighlighted?: boolean;
    iconColor?: string;
    hoverIconColor?: string;
    additionalClass?: string;
}

const MetricBox: React.FC<MetricBoxProps> = ({
    icon: Icon,
    label,
    value,
    subValue,
    isHighlighted = false,
    iconColor = "text-gray-600 dark:text-gray-400",
    hoverIconColor = "text-green-500",
    additionalClass = "",
}) => {
    return (
        <div className={`w-full ${additionalClass}`}>
            <Card className={`group h-full ${isHighlighted ? 'border-2 border-green-500 dark:border-green-600 relative' : ''}`}>
                {isHighlighted && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                )}
                <CardContent className="p-2 sm:p-3 h-full w-full flex flex-col items-center justify-center relative space-y-1">
                    <Icon
                        className={`w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 ${iconColor} group-hover:${hoverIconColor} transition-colors ${isHighlighted ? 'animate-spin-slow' : ''}`}
                    />
                    <p className="font-semibold text-xs sm:text-sm text-center line-clamp-1 text-gray-900 dark:text-gray-100">{label}</p>
                    {value && (
                        <p className={`text-sm sm:text-base md:text-lg font-bold text-center line-clamp-1 ${isHighlighted ? 'text-green-600 dark:text-green-500' : 'text-gray-900 dark:text-gray-100'}`}>
                            {value}
                        </p>
                    )}
                    {subValue && (
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center line-clamp-2">
                            {subValue}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

interface ConnectionLineProps {
    from: { x: string; y: string };
    to: { x: string; y: string };
    animated?: boolean;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ from, to, animated = false }) => {
    return (
        <line
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className={animated ? "stroke-green-500 dark:stroke-green-600 stroke-1" : "stroke-gray-300 dark:stroke-gray-700 stroke-1"}
            strokeDasharray="4"
            strokeDashoffset={animated ? "8" : "0"}
        >
            {animated && (
                <animate
                    attributeName="stroke-dashoffset"
                    from="8"
                    to="0"
                    dur="1s"
                    repeatCount="indefinite"
                />
            )}
        </line>
    );
};

export function SolarDashboard() {
    const metrics = [
        {
            position: "top",
            icon: Sun,
            label: "Solar Power",
            value: "1.073 kW",
            isHighlighted: true,
            iconColor: "text-yellow-500 dark:text-yellow-400",
            additionalClass: "solar-power-metric",
        },
        {
            position: "left",
            icon: Zap,
            label: "Grid",
            value: "233.3 V",
            isHighlighted: false,
            hoverIconColor: "text-yellow-500 dark:text-yellow-400",
            additionalClass: "grid-metric mt-5",
        },
        {
            position: "right",
            icon: Home,
            label: "Home",
            value: "0.55 kW",
            isHighlighted: false,
            hoverIconColor: "text-blue-500 dark:text-blue-400",
            additionalClass: "home-metric mt-5",
        },
        {
            position: "bottom",
            icon: Battery,
            label: "Charged",
            isHighlighted: false,
            subValue: "charged",
            additionalClass: "charged-metric mt-5",
        }
    ];

    return (
        <div className="p-2 md:p-6 w-full max-w-2xl mx-auto">
            <Card className="bg-white dark:bg-gray-950">
                <CardHeader className="p-3 md:p-6">
                    <CardTitle className="text-lg md:text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
                        Solar Power Monitor
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-2 md:p-4">
                    <div className="relative p-2 sm:p-4 md:p-8">
                        {/* Center Circle with Pulse Effect */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-green-500 dark:bg-green-600 rounded-full animate-pulse opacity-75"></div>
                                <div className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center relative z-10">
                                    <Zap className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-white animate-bounce" />
                                </div>
                            </div>
                        </div>

                        {/* Four Cards in Cross Layout */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                            {metrics.map((metric, index) => (
                                <div
                                    key={index}
                                    className={`${metric.position === "top" ? "col-start-2" :
                                        metric.position === "left" ? "col-start-1 row-start-2" :
                                            metric.position === "right" ? "col-start-3 row-start-2" :
                                                "col-start-2 row-start-3"
                                        } flex justify-center`}
                                >
                                    <div className="w-24 sm:w-28 md:w-36">
                                        <MetricBox {...metric} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Connection Lines with Animation */}
                        <div className="absolute inset-0 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <ConnectionLine
                                    from={{ x: "50%", y: "25%" }}
                                    to={{ x: "50%", y: "42%" }}
                                    animated={true}
                                />
                                <ConnectionLine
                                    from={{ x: "50%", y: "58%" }}
                                    to={{ x: "50%", y: "75%" }}
                                    animated={true}
                                />
                                <ConnectionLine
                                    from={{ x: "25%", y: "50%" }}
                                    to={{ x: "42%", y: "50%" }}
                                    animated={false}
                                />
                                <ConnectionLine
                                    from={{ x: "58%", y: "50%" }}
                                    to={{ x: "75%", y: "50%" }}
                                    animated={true}
                                />
                            </svg>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default SolarDashboard;
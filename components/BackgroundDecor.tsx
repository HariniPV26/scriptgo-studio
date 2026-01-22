'use client'

import { useEffect, useState } from 'react'

export function BackgroundDecor() {
    const [elements, setElements] = useState<{ id: number; top: string; left: string; size: string; delay: string; duration: string }[]>([])

    useEffect(() => {
        const newElements = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 4 + 2}px`,
            delay: `${Math.random() * 5}s`,
            duration: `${Math.random() * 10 + 10}s`,
        }))
        setElements(newElements)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-5]">
            {elements.map((el) => (
                <div
                    key={el.id}
                    className="absolute bg-emerald-500/20 rounded-full blur-[1px]"
                    style={{
                        top: el.top,
                        left: el.left,
                        width: el.size,
                        height: el.size,
                        animation: `float-particle ${el.duration} linear infinite`,
                        animationDelay: el.delay,
                    }}
                />
            ))}
        </div>
    )
}

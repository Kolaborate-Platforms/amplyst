'use client'

import { BellDotIcon, User2Icon } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header() {
    const currentPath = usePathname()?.split('/')
    const path = currentPath[currentPath.length -1]
    return (
        <>
            <div className='flex flex-row items-center h-full justify-between'>
                <span className='capitalize text-primary font-semibold text-xl tracking-wider'>{path}</span>
                <div className="flex flex-row items-center gap-6">
                    <button className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                        <BellDotIcon className="h-6 w-6 text-gray-600" />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer flex items-center justify-center text-gray-700 font-bold">
                        <User2Icon className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </>
    )
}
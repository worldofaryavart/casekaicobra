"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getAuthStatus } from "./actions"
import { createClient } from "@/utils/supabase/client"

const Page = () => {
    const [configId, setConfigId] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const configurationId = localStorage.getItem('configurationId')
        if (configurationId) setConfigId(configurationId)
        
        // Check if the user was redirected from OAuth
        const checkAuthStatus = async () => {
            const supabase = createClient()
            const { error } = await supabase.auth.getSession()
            
            if (error) {
                console.error("Auth error:", error)
                router.push('/login')
                return
            }
        }
        
        checkAuthStatus()
    }, [router])

    const { data, isError } = useQuery({
        queryKey: ['auth-callback'],
        queryFn: async () => await getAuthStatus(),
        retry: 3,
        retryDelay: 500,
    })

    useEffect(() => {
        if (data?.success) {
            if (configId) {
                localStorage.removeItem('configurationId')
                router.push(`/checkout/${configId}`)
            } else {
                router.push('/')
            }
        } else if (isError) {
            router.push('/login')
        }
    }, [data, isError, configId, router])

    return (
        <div className="w-full mt-24 flex justify-center">
            <div className='flex flex-col items-center gap-2'>
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500"/>
                <h3 className="font-semibold text-xl">Logging you in...</h3>
                <p>You will be redirected automatically.</p>
            </div>
        </div>
    )
}

export default Page
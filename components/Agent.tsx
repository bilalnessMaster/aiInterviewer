import { cn } from '@/app/utils/utils'
import React from 'react'

const Agent = ({volume  , isSpeaking , icon} : {icon: React.ReactNode  ,volume : number , isSpeaking: boolean}) => {
  return (
    <span className={cn('inline-flex bg-white transition-all duration-150  items-center justify-center size-16 rounded-full border border-neutral-100',{'border-green-400':isSpeaking &&  volume})}>
        {icon}
    </span>
  )
}

export default Agent
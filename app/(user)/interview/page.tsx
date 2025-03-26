import React from 'react'
import InterviewRoom from './interview-room'

import { redirect } from 'next/navigation'
import { getInterviewById } from '@/app/utils/queries'

const page = async (props: {searchParams: Promise<{id?:string}>}) => {
    const searchParams = await props.searchParams
    const id = searchParams.id 
    const interview = await getInterviewById(id)
    if(!interview?.length){
      return redirect('/dashboard')
    }
    
  return (
    <>
    <InterviewRoom interview={interview[0]} />
    </>
  )
}

export default page;
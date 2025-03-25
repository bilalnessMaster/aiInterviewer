import React from 'react'
import InterviewRoom from './interview-room'
import { getInterview } from '@/app/utils/actions'
import { redirect } from 'next/navigation'

const page = async (props: {searchParams: Promise<{id?:string}>}) => {
    const searchParams = await props.searchParams
    const id = searchParams.id 
    const interview = await getInterview(id)
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
import React from 'react'
import InterviewRoom from './interview-room'
import { getInterview } from '@/app/utils/actions'

const page = async (props: {params: Promise<{id?:string}>}) => {
    const params = await props.params
    const id = params.id
    const interview = await getInterview(id)
    console.log(interview);
    
  return (
    <>
    <InterviewRoom interview={interview[0]} />
    </>
  )
}

export default page
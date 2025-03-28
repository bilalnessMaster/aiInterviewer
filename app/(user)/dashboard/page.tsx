import Image from "next/image"
import Link from "next/link"
import panel from '@/public/panel.svg'
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/app/utils/utils";
import { getInterviews } from "@/app/utils/queries";
const page = async () => {
  const interviews= await getInterviews()
  return (
    <section className="h-full flex flex-col  gap-16 items-start justify-start py-3 px-3">
      <div className=" max-w-5xl  w-full mx-auto ">
          <div className="w-full h-72 grid md:grid-cols-2 bg-neutral-50 rounded-md border border-neutral-200/55">
              <div className="flex flex-col p-4  justify-between h-full">
                  <div>
                  <h2 className="font-inter text-xl">
                  Start Your AI-Powered Interview
                  </h2>
                  <p className="text-neutral-400 text-sm max-w-xs font-mono">
                  Create meaningful conversations with your family using AI-driven interviews.
                  </p>
                  </div>
                  <Link href='create-interview' className="bg-gradient-to-br w-fit px-3 py-2 rounded-lg bg-amber-200   text-amber-800 border relative border-amber-400 capitalize after:w-8 after:rotate-20 after:h-20 after:-top-4 after:transition-transform after:duration-500 after:absolute after:bg-white/55 after:-right-10 overflow-hidden after:-translate-x-50 after:opacity-0 hover:after:opacity-100 after:inset-y-0 hover:after:translate-x-0" >Set up interview</Link>
              </div>
              <div className="overflow-hidden relative hidden md:block">
                <Image src={panel} width={400} height={400} alt="interview image" className="absolute -right-12 top-14 rounded-md border "/>
              </div>
          </div>
          <div className="mt-4 space-y-4">
            <h1 className="capitalize w-fit text-lg  text-neutral-500 font-inter relative">
              Interviews
              <div className="absolute bg-neutral-500 inset-x-0 h-[2px] rounded-full" />
            </h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {
                  interviews?.map((interview)=>(
                    <Link key={interview.id} href={`/interview?id=${interview.id}`} className="group/card flex flex-col font-mono border rounded-md border-neutral-200/55 bg-neutral-50 h-50 overflow-hidden">
                  <div className="flex justify-between items-center py-2 px-2 border-b border-b-neutral-200">
                    <h2 className="w-32 truncate ...">
                      {interview.field}
                    </h2>
                    <span className="flex gap-1 items-center">
                      <span className={cn("text-emerald-400 transition-all duration-200 opacity-0 -translate-x-12 group-hover/card:translate-x-0 group-hover/card:opacity-100" , {'text-red-400':70<100})}>Note</span>
                      <span>{interview.note}</span>
                      <span>/</span>
                      <span>100</span>
                    </span>
                  </div>
                  <div className="p-2 justify-between flex flex-col flex-grow">
                    <p  className="text-sm text-neutral-500 max-w-65">
                    Web development exec Laravel, React, Next.js, and TypeScript JavaScript
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs  text-neutral-800">
                      {formatDistanceToNow(interview.created_at)}
                      </span>
                      <button className="text-amber-600 cursor-pointer transition-all duration-200  translate-y-12 group-hover/card:translate-y-0 ">
                        Let&apos;s Go
                      </button>
                    </div>
                  </div>
                </Link>
                  ))
                }
            </div>
          </div>
      </div>
    </section>
  )
}

export default page
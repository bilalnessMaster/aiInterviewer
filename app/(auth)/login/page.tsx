import { signInWithGoogle } from "@/app/utils/actions"


const page = () => {
  return (
    <section className="min-h-screen flex justify-center items-center ">
        <form action={signInWithGoogle}>
            <button type="submit" className="flex gap-2 items-center justify-center font-medium bg-neutral-50 border border-neutral-100 w-56  rounded cursor-pointer ">
            <i className="hgi hgi-stroke hgi-google text-2xl"></i>
            <span className="text-lg">
                Google
            </span>
            </button>
            <p className="text-xs mt-2 text-center ">
                Sign in or sign up with google 
            </p>
        </form>
    </section>
  )
}

export default page
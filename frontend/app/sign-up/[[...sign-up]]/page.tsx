import { SignUp } from "@clerk/nextjs"
import dashboardimage from "/assets/dashboardimage.png"
import logo from '/assets/businesslogo.png';
import Image from "next/image"
import { Sigmar } from 'next/font/google'

const sigmar = Sigmar({
  weight: '400',
  subsets: ['latin'],
})

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-300 via-sky-50 to-sky-100">
      <div className="flex w-full flex-col justify-center items-center p-12 lg:w-1/2 order-last lg:order-first">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src={logo} alt="logo" width={60} height={60} />
              <span className={`${sigmar.className} text-4xl`}>Stockiqs</span> 
            </div>
            <div className="space-y-2">
              <h1 className="text-lg font-semibold text-zinc-600">Sign up to maximize profits and minimize hassle</h1>
            </div>
            <SignUp />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden w-1/2 overflow-hidden lg:flex items-center justify-end pr-0 relative">
        {/* Pattern container - Fixed positioning */}
        <div className="absolute inset-0 right-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_50%,#ffffff,transparent)]" />
          <div className="h-full w-full bg-[url('https://as1.ftcdn.net/v2/jpg/01/40/46/16/1000_F_140461652_ypUuOFXiSeS2BaEtAL6oX4nOJ4qNMszB.jpg')] opacity-5" />
        </div>

        <div className="relative h-[80%] w-[85%] mr-0 rounded-l-3xl overflow-hidden border-t-8 border-l-8 border-b-8 border-sky-100">
          <Image
            src={dashboardimage || "/placeholder.svg"}
            alt="Dashboard Preview"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "left",
            }}
            priority
            quality={100}
          />
        </div>
      </div>
    </div>
  )
}

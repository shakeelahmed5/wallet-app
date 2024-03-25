import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-bg grid place-content-center h-screen place-items-center">
     <h1 className='text-7xl font-bold text-center my-2'>
      Wallet Base
     </h1>
     <h3 className='text-3xl text-center my-2'>
       Personal Expense Tracker
     </h3>
     <Link href={'/sign-in'} className='text-xl text-center transition-all bg-red-500 py-2 font-bold rounded-lg w-2/5 my-4 hover:rotate-1 hover:scale-105'>
       Explore Now
    </Link>
    </main>
  )
}

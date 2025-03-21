import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <main class="h-[80vh] w-full flex flex-col justify-center items-center bg-gradient-to-r from-[#007669] via-[#00726f] to-[#006b7c]">
	<h1 class="text-9xl font-extrabold text-white tracking-widest">404</h1>
	<div class="bg-main px-2 text-sm rounded rotate-12 absolute">
		Page Not Found
	</div>
	<button class="mt-5">
      <a
        class="relative inline-block text-sm font-medium text-main group active:text-main focus:outline-none focus:ring"
      >
        <span
          class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-main group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

        <span class="relative block px-8 py-3 bg-[#1A2238] border border-current">
          <Link to="/">Go Home</Link>
        </span>
      </a>
    </button>
</main>
  )
}

export default PageNotFound
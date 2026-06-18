import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100 font-sans flex flex-col">

      {/* NAV */}
      <nav className="flex items-center justify-between px-12 py-5 border-b border-[#1f2d45] sticky top-0 bg-[#0b0f1a]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
          AuthKit
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-5 py-2 rounded-lg transition-all hover:-translate-y-0.5"
        >
          Sign in
        </button>
      </nav>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
          Production-ready authentication
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight leading-tight max-w-2xl mb-5">
          Secure auth,{" "}
          <span className="text-indigo-400">without the headache</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-10">
          Register, verify your email, and sign in with two-factor
          authentication. Your account is protected end to end.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.45)]"
          >
            Create account
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-transparent border border-[#1f2d45] hover:border-indigo-500 text-slate-100 hover:text-indigo-300 font-medium px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5"
          >
            Sign in
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-[#1f2d45] divide-y md:divide-y-0 md:divide-x divide-[#1f2d45]">
        {[
          {
            icon: "🔐",
            title: "Two-factor authentication",
            desc: "OTP sent to your email on every login. No authenticator app needed.",
          },
          {
            icon: "🛡️",
            title: "CSRF protection",
            desc: "Every state-changing request is validated with a signed CSRF token.",
          },
          {
            icon: "🍪",
            title: "HttpOnly cookies",
            desc: "Tokens never touch localStorage. Inaccessible to JavaScript entirely.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-[#0b0f1a] hover:bg-[#111827] p-8 flex flex-col gap-2 transition-colors"
          >
            <span className="text-2xl mb-1">{f.icon}</span>
            <p className="font-bold text-sm text-slate-100">{f.title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="text-center py-5 text-xs text-slate-500 border-t border-[#1f2d45]">
        Built with Express · MongoDB · Redis · React
      </footer>
    </div>
  )
}

export default Home
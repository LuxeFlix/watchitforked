'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-6 selection:bg-primary/20">
      <div className="w-full max-w-md animate-slide-up">
        <div className="admin-panel p-8 sm:p-12 space-y-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(229,9,20,0.3)] group transition-transform hover:scale-105 duration-500">
               <span className="text-3xl font-black text-black select-none tracking-tighter">W</span>
               <div className="absolute -inset-1 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">
                Control <span className="text-primary not-italic">Center</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary/60">
                Secure Administrator Authentication
              </p>
            </div>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="admin-field-label ml-1">
                  Username
                </label>
                <div className="relative group">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="admin-input pl-4 focus:ring-1 focus:ring-primary/20"
                    placeholder="Enter administrator ID"
                  />
                </div>
              </div>
    
              <div className="space-y-2">
                <label htmlFor="password" title="Enter Password" className="admin-field-label ml-1">
                  Security Key
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="admin-input pl-4 focus:ring-1 focus:ring-primary/20"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
  
            {error && (
              <div className="animate-fade-in flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-bold text-red-400">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}
  
            <button
              type="submit"
              disabled={loading}
              className="admin-btn-primary w-full group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'Authenticating...' : 'Access Terminal'}
              </span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-text-secondary/30 uppercase tracking-[0.4em]">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  )
}

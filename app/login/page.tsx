import { login, signup } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string, error: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">Precision Performance</h1>
        <p className="text-xs text-slate-500 mt-3 font-semibold tracking-widest uppercase">
          Go by the Numbers, No Guessing
        </p>
      </div>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-slate-800">
        <label className="text-sm font-medium" htmlFor="email">
          Email Address
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
          name="email"
          placeholder="you@example.com"
          required
        />
        
        <label className="text-sm font-medium mt-2" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />

        <label className="text-sm font-medium mt-2" htmlFor="role">
          Account Role (For Registration)
        </label>
        <select 
          name="role" 
          className="rounded-md px-4 py-2 bg-inherit border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
        >
          <option value="trainer">Trainer</option>
          <option value="client">Client</option>
        </select>

        <button
          formAction={login}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-md px-4 py-3 mt-4 text-sm font-semibold transition-colors"
        >
          Log-in
        </button>
        <button
          formAction={signup}
          className="bg-white border hover:bg-slate-50 border-slate-300 text-slate-900 rounded-md px-4 py-3 text-sm font-semibold transition-colors"
        >
          Register New Account
        </button>

        {searchParams?.error && (
          <p className="mt-4 p-4 bg-red-50 text-red-700 text-center text-sm rounded-md font-medium border border-red-100">
            {searchParams.error}
          </p>
        )}
        
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-slate-50 text-slate-700 text-center text-sm rounded-md font-medium border border-slate-200">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}

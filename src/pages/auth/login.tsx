import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { login, setSession } from '../../services/api'
import heroImg from '../../assets/hero.png'
import iconImg from '../../assets/icon.svg'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi')
      return
    }

    setIsLoading(true)
    try {
      const result = await login(email, password)
      setSession(result.access_token, result.user, rememberMe)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* Sisi Kiri: Hero & Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-base-200 border-r border-base-300 p-12">
        <div className="flex items-center gap-3">
          <img src={iconImg} alt="Sentinel" className="w-10 h-10 rounded-xl" />
          <span className="text-2xl font-bold tracking-tight">Sentinel.</span>
        </div>

        <div className="max-w-md mx-auto text-center space-y-6">
          <img
            src={heroImg}
            alt="Ilustrasi Sentinel"
            className="w-72 mx-auto drop-shadow-md object-contain"
          />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Presensi & Manajemen Terpadu</h2>
            <p className="text-sm text-base-content/70">
              Sistem presensi RFID dan pemantauan absensi siswa secara real-time dan akurat.
            </p>
          </div>
        </div>

        <p className="text-xs text-base-content/50">
          © {new Date().getFullYear()} Sentinel. Hak cipta dilindungi.
        </p>
      </div>

      {/* Sisi Kanan: Form Login */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo untuk tampilan mobile */}
          <div className="lg:hidden flex items-center justify-center gap-2">
            <img src={iconImg} alt="Sentinel" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold tracking-tight">Sentinel.</span>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold">Masuk ke Akun</h1>
            <p className="text-sm text-base-content/70 mt-1">
              Masukkan kredensial untuk mengakses sistem
            </p>
          </div>

          {error && (
            <div role="alert" className="alert alert-error text-sm py-2">
              <AlertCircle className="h-5 w-5 shrink-0 stroke-current" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="nama@contoh.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label justify-between">
                <span className="label-text font-medium">Kata Sandi</span>
                <a href="#forgot" className="link link-hover text-xs text-primary">
                  Lupa kata sandi?
                </a>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input input-bordered w-full pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-xs btn-circle absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="label-text text-sm">Ingat saya</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="divider text-xs text-base-content/50">ATAU</div>

          <p className="text-center text-xs text-base-content/70">
            Belum punya akun?{' '}
            <a href="#register" className="link link-primary font-medium">
              Daftar sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

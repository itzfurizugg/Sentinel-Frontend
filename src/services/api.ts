const envUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/').toString()
export const API_BASE_URL = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl

export interface Student {
  nis: string
  nama_lengkap: string
  kelas: string
  created_at: string
  updated_at: string
}

export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  email: string
  role: UserRole
  nis?: string | null
  student?: Student | null
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  nis: string
  tanggal: string
  jam_masuk: string | null
  jam_pulang: string | null
  student?: Student
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

const TOKEN_KEY = 'sentinel_token'
const USER_KEY = 'sentinel_user'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function setSession(token: string, user: User, rememberMe: boolean) {
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
  storage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface LoginResult {
  access_token: string
  user: User
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    const message = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message
    throw new Error(message || 'Login gagal')
  }
  const json: ApiResponse<LoginResult> = await res.json()
  return json.data
}

export async function fetchStudents(page = 1, limit = 20, kelas?: string): Promise<PaginatedResponse<Student>> {
  const url = new URL(`${API_BASE_URL}/students`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))
  if (kelas) url.searchParams.set('kelas', kelas)

  const res = await fetch(url.toString(), { headers: authHeaders() })
  if (!res.ok) throw new Error(`Gagal memuat siswa: ${res.statusText}`)
  const json: ApiResponse<PaginatedResponse<Student>> = await res.json()
  return json.data
}

export async function fetchAttendances(page = 1, limit = 20, kelas?: string, from?: string, to?: string): Promise<PaginatedResponse<Attendance>> {
  const url = new URL(`${API_BASE_URL}/attendance`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))
  if (kelas) url.searchParams.set('kelas', kelas)
  if (from) url.searchParams.set('from', from)
  if (to) url.searchParams.set('to', to)

  const res = await fetch(url.toString(), { headers: authHeaders() })
  if (!res.ok) throw new Error(`Gagal memuat absensi: ${res.statusText}`)
  const json: ApiResponse<PaginatedResponse<Attendance>> = await res.json()
  return json.data
}

export async function scanAttendance(nis: string) {
  const res = await fetch(`${API_BASE_URL}/attendance/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ nis }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Gagal scan kartu')
  }
  return res.json()
}

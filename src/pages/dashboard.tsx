import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchStudents,
  fetchAttendances,
  scanAttendance,
  clearSession,
  type Student,
  type Attendance,
  API_BASE_URL,
} from '../services/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<Student[]>([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [totalAttendances, setTotalAttendances] = useState(0)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  const [scanNis, setScanNis] = useState('')
  const [scanMessage, setScanMessage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  const refreshData = async () => {
    setLoading(true)
    setApiError(null)
    try {
      const today = new Date().toISOString().split('T')[0]
      const [studentsRes, attendancesRes] = await Promise.all([
        fetchStudents(1, 10),
        fetchAttendances(1, 10, undefined, today, today),
      ])
      setStudents(studentsRes.data)
      setTotalStudents(studentsRes.total)
      setAttendances(attendancesRes.data)
      setTotalAttendances(attendancesRes.total)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Gagal menghubungi server database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function init() {
      try {
        const today = new Date().toISOString().split('T')[0]
        const [studentsRes, attendancesRes] = await Promise.all([
          fetchStudents(1, 10),
          fetchAttendances(1, 10, undefined, today, today),
        ])
        if (!ignore) {
          setStudents(studentsRes.data)
          setTotalStudents(studentsRes.total)
          setAttendances(attendancesRes.data)
          setTotalAttendances(attendancesRes.total)
          setLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setApiError(err instanceof Error ? err.message : 'Gagal menghubungi server database')
          setLoading(false)
        }
      }
    }

    init()
    return () => {
      ignore = true
    }
  }, [])

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scanNis.trim()) return
    setScanning(true)
    setScanMessage(null)
    try {
      const res = await scanAttendance(scanNis.trim())
      setScanMessage(`Scan berhasil: ${res.data?.nama || scanNis} (${res.data?.status || 'sukses'})`)
      setScanNis('')
      await refreshData()
    } catch (err) {
      setScanMessage(err instanceof Error ? err.message : 'Scan gagal')
    } finally {
      setScanning(false)
    }
  }

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <div className="flex-1 bg-base-200">
      <div className="navbar bg-base-100 shadow-sm border-b border-base-300 px-4 md:px-8">
        <div className="flex-1">
          <span className="font-bold text-xl tracking-tight text-primary">SENTINEL</span>
          <span className="text-xs uppercase ml-2 px-2 py-0.5 rounded bg-base-200 text-base-content/70">
            Database: {API_BASE_URL}
          </span>
        </div>
        <div className="flex-none gap-3">
          <button type="button" onClick={refreshData} className="btn btn-ghost btn-sm">
            Refresh
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                AD
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
              <li className="menu-title px-4 py-2 font-semibold text-base-content">Admin Sentinel</li>
              <li><button type="button" onClick={handleLogout} className="text-error">Keluar</button></li>
            </ul>
          </div>
        </div>
      </div>

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        {apiError && (
          <div role="alert" className="alert alert-warning text-sm">
            <span>Koneksi DB Error: {apiError}. Pastikan server di {API_BASE_URL} aktif.</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Dashboard Presensi</h1>
            <p className="text-sm text-base-content/70">Terhubung langsung ke database Sentinel API</p>
          </div>
          <form onSubmit={handleScan} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Simulasi scan NIS..."
              className="input input-sm input-bordered w-full md:w-48"
              value={scanNis}
              onChange={(e) => setScanNis(e.target.value)}
            />
            <button type="submit" className="btn btn-sm btn-primary" disabled={scanning}>
              {scanning ? 'Scanning...' : 'Scan'}
            </button>
          </form>
        </div>

        {scanMessage && (
          <div role="alert" className="alert alert-info text-xs py-2">
            <span>{scanMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <span className="text-xs font-semibold uppercase text-base-content/60">Total Mahasiswa Terdaftar</span>
              <div className="text-3xl font-extrabold text-base-content mt-1">
                {loading ? '...' : totalStudents}
              </div>
              <div className="text-xs text-base-content/70 mt-1">Data master siswa TypeORM</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <span className="text-xs font-semibold uppercase text-base-content/60">Presensi Hari Ini</span>
              <div className="text-3xl font-extrabold text-base-content mt-1">
                {loading ? '...' : totalAttendances}
              </div>
              <div className="text-xs text-base-content/70 mt-1">Log tercatat hari ini</div>
            </div>
          </div>

          {/* <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <span className="text-xs font-semibold uppercase text-base-content/60">Status API Backend</span>
              <div className="text-lg font-bold text-success mt-2 flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-success" />
                Terhubung
              </div>
              <div className="text-xs text-base-content/70 mt-1">{API_BASE_URL}</div>
            </div>
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <h2 className="card-title text-base mb-3">Daftar Mahasiswa (DB)</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra table-sm">
                  <thead>
                    <tr>
                      <th>NIS</th>
                      <th>Nama Lengkap</th>
                      <th>Kelas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-xs py-4 text-base-content/60">
                          {loading ? 'Memuat data...' : 'Tidak ada data mahasiswa'}
                        </td>
                      </tr>
                    ) : (
                      students.map((s) => (
                        <tr key={s.nis}>
                          <td className="font-mono text-xs">{s.nis}</td>
                          <td className="font-medium">{s.nama_lengkap}</td>
                          <td>
                            <span className="badge badge-sm badge-ghost">{s.kelas}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <h2 className="card-title text-base mb-3">Rekap Absensi Terakhir</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra table-sm">
                  <thead>
                    <tr>
                      <th>NIS</th>
                      <th>Tanggal</th>
                      <th>Masuk</th>
                      <th>Pulang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-xs py-4 text-base-content/60">
                          {loading ? 'Memuat data...' : 'Belum ada data scan absensi'}
                        </td>
                      </tr>
                    ) : (
                      attendances.map((a) => (
                        <tr key={a.id}>
                          <td className="font-mono text-xs">{a.nis}</td>
                          <td className="text-xs">{a.tanggal}</td>
                          <td className="text-xs">
                            {a.jam_masuk ? new Date(a.jam_masuk).toLocaleTimeString('id-ID') : '-'}
                          </td>
                          <td className="text-xs">
                            {a.jam_pulang ? new Date(a.jam_pulang).toLocaleTimeString('id-ID') : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

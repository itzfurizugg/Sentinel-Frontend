import { useState, useEffect } from 'react'
import { fetchStudents, authHeaders, API_BASE_URL, type Student } from '../services/api'

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState('')

  const [nis, setNis] = useState('')
  const [namaLengkap, setNamaLengkap] = useState('')
  const [kelas, setKelas] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const loadStudents = async (kls?: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchStudents(1, 50, kls || undefined)
      setStudents(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat siswa')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function init() {
      try {
        const res = await fetchStudents(1, 50)
        if (!ignore) {
          setStudents(res.data)
          setLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Gagal memuat siswa')
          setLoading(false)
        }
      }
    }

    init()
    return () => {
      ignore = true
    }
  }, [])

  const handleFilter = (kls: string) => {
    setSelectedClass(kls)
    loadStudents(kls)
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ nis, nama_lengkap: namaLengkap, kelas }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Gagal menambahkan siswa')
      }

      setNis('')
      setNamaLengkap('')
      setKelas('')
      const modal = document.getElementById('add_student_modal') as HTMLDialogElement | null
      modal?.close()
      loadStudents(selectedClass)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Gagal menambahkan siswa')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Data Siswa</h1>
          <p className="text-sm text-base-content/70">Kelola master data siswa dan kelas</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              const modal = document.getElementById('add_student_modal') as HTMLDialogElement | null
              modal?.showModal()
            }}
          >
            + Tambah Siswa
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="alert alert-warning text-sm">
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="card-title text-base">Daftar Siswa ({students.length})</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                className="select select-bordered select-sm w-full sm:w-44"
                value={selectedClass}
                onChange={(e) => handleFilter(e.target.value)}
              >
                <option value="">Semua Kelas</option>
                <option value="XII IPA 1">XII IPA 1</option>
                <option value="XII IPA 2">XII IPA 2</option>
                <option value="XII IPS 1">XII IPS 1</option>
                <option value="XII IPS 2">XII IPS 2</option>
                <option value="XI IPA 1">XI IPA 1</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>NIS</th>
                  <th>Nama Lengkap</th>
                  <th>Kelas</th>
                  <th>Terdaftar</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-xs py-6 text-base-content/60">
                      {loading ? 'Memuat data...' : 'Tidak ada data siswa ditemukan'}
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.nis}>
                      <td className="font-mono text-xs font-semibold">{s.nis}</td>
                      <td className="font-medium">{s.nama_lengkap}</td>
                      <td>
                        <span className="badge badge-sm badge-ghost">{s.kelas}</span>
                      </td>
                      <td className="text-xs text-base-content/60">
                        {new Date(s.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <dialog id="add_student_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Tambah Siswa Baru</h3>
          {submitError && (
            <div role="alert" className="alert alert-error text-xs mb-4">
              <span>{submitError}</span>
            </div>
          )}
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium">Nomor Induk Siswa (NIS)</span>
              </label>
              <input
                type="text"
                placeholder="misal: 2324011"
                className="input input-bordered input-sm"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium">Nama Lengkap</span>
              </label>
              <input
                type="text"
                placeholder="misal: Siti Nurhaliza"
                className="input input-bordered input-sm"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium">Kelas</span>
              </label>
              <input
                type="text"
                placeholder="misal: XII IPA 1"
                className="input input-bordered input-sm"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                required
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  const modal = document.getElementById('add_student_modal') as HTMLDialogElement | null
                  modal?.close()
                }}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-sm btn-primary" disabled={submitting}>
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}

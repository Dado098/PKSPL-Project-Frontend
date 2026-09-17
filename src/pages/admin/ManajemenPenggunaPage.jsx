import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { createUser, deleteUser, getRoles, getUsers, updateUser } from '../../services/userService'
import UserProfileDetailModal from '../../components/UserProfileDetailModal'

const roleColors = {
  Admin: 'bg-blue-100 text-blue-700',
  Analyst: 'bg-orange-100 text-orange-700',
  Peneliti: 'bg-green-100 text-green-700',
  Guest: 'bg-gray-100 text-gray-700',
}

export const PRESENCE_THRESHOLD_MINUTES = 2

export const isUserOnline = (userOrDate, currentTime = Date.now()) => {
  if (!userOrDate) return false
  const dateValue = typeof userOrDate === 'object' ? userOrDate.last_seen_at : userOrDate
  if (!dateValue) return false
  const time = new Date(dateValue).getTime()
  if (isNaN(time)) return false
  const diffMinutes = (currentTime - time) / (1000 * 60)
  // Allow -1 minute for minor client-server clock skew
  return diffMinutes >= -1 && diffMinutes <= PRESENCE_THRESHOLD_MINUTES
}

function UserAvatar({ user, isOnline }) {
  const [imgError, setImgError] = useState(false)
  const fotoUrl = user?.foto

  useEffect(() => {
    setImgError(false)
  }, [fotoUrl])

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="relative inline-block flex-shrink-0">
      {fotoUrl && !imgError ? (
        <img
          src={fotoUrl}
          alt={user?.nama || 'Avatar'}
          referrerPolicy="no-referrer"
          className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm ring-1 ring-blue-100">
          {getInitials(user?.nama)}
        </div>
      )}

      {/* Status Presence Dot on Avatar corner */}
      <span
        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
          isOnline ? 'bg-emerald-500' : 'bg-gray-300'
        }`}
        title={isOnline ? 'Online' : 'Offline'}
      />
    </div>
  )
}

const formatLastOnline = (dateString) => {
  if (!dateString) {
    return <span className="text-gray-400 italic text-xs">Belum pernah online</span>
  }
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return <span className="text-gray-400 italic text-xs">Belum pernah online</span>
    }
    return (
      <span className="text-gray-700 text-xs sm:text-sm">
        {date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    )
  } catch {
    return <span className="text-gray-400 italic text-xs">Belum pernah online</span>
  }
}

function UserModal({ isOpen, onClose, title, confirmText, initialData, roles, onSubmit, isSubmitting }) {
  const [nama, setNama] = useState(initialData?.nama || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState(initialData?.id_role || '')
  const [status, setStatus] = useState(initialData?.status || 'Aktif')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setNama(initialData?.nama || '')
      setEmail(initialData?.email || '')
      setPassword('')
      setRoleId(initialData?.id_role || '')
      setStatus(initialData?.status || 'Aktif')
      setDropdownOpen(false)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleSubmit = () => {
    const payload = {
      nama,
      email,
      status,
      id_role: Number(roleId),
    }

    if (!initialData) {
      payload.password = password
    }

    onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-5 sm:p-8 animate-in">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="modal-nama" className="block text-sm font-semibold text-gray-900 mb-1.5">Nama</label>
            <input
              id="modal-nama"
              type="text"
              placeholder="Masukan Nama Pengguna"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
            />
          </div>

          <div>
            <label htmlFor="modal-email" className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
            <input
              id="modal-email"
              type="email"
              placeholder="Masukan Email Pengguna"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
            />
          </div>

          {!initialData && (
            <div>
              <label htmlFor="modal-password" className="block text-sm font-semibold text-gray-900 mb-1.5">Password</label>
              <input
                id="modal-password"
                type="password"
                placeholder="Masukan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Role</label>
            <div className="relative">
              <button
                type="button"
                id="modal-role-dropdown"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 cursor-pointer bg-white"
              >
                <span className={roleId ? 'text-gray-900' : 'text-gray-400'}>
                  {roles.find((role) => role.id_role === Number(roleId))?.nama_role || 'Pilih role'}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  {roles.map((role) => (
                    <button
                      key={role.id_role}
                      type="button"
                      onClick={() => {
                        setRoleId(role.id_role)
                        setDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer ${
                        Number(roleId) === role.id_role ? 'bg-blue-50 text-[#1a56db] font-medium' : 'text-gray-700'
                      }`}
                    >
                      {role.nama_role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          id="modal-confirm-button"
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full mt-8 py-3 bg-[#1a56db] text-white text-sm font-semibold rounded-lg hover:bg-[#1545b8] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Menyimpan...' : confirmText}
        </button>
      </div>
    </div>
  )
}

function ManajemenPenggunaPage() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [viewingUser, setViewingUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())

  const loadUserData = async () => {
    try {
      const [userResult, roleResult] = await Promise.all([getUsers(), getRoles()])
      setUsers(userResult)
      setRoles(roleResult)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal memuat data pengguna.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  // Local timer ticks every 30s to dynamically update online/offline presence without refreshing
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  // Light polling every 60s when page is active (does NOT modify last_online_at)
  useEffect(() => {
    const pollTimer = setInterval(() => {
      if (!document.hidden) {
        loadUserData()
      }
    }, 60000)
    return () => clearInterval(pollTimer)
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = (user.nama || '').toLowerCase()
      const email = (user.email || '').toLowerCase()
      const query = searchQuery.toLowerCase()
      return name.includes(query) || email.includes(query)
    })
  }, [users, searchQuery])

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id_user))
    }
  }

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleCreateUser = async (payload) => {
    try {
      setIsSubmitting(true)
      await createUser(payload)
      toast.success('Pengguna berhasil ditambahkan.')
      setShowAddModal(false)
      await loadUserData()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menambah pengguna.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewProfile = (user) => {
    setViewingUser(user)
    setShowProfileModal(true)
  }

  const handleCloseProfileModal = () => {
    setShowProfileModal(false)
    setViewingUser(null)
  }

  const handleEditRole = (user) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleUpdateUser = async (payload) => {
    try {
      setIsSubmitting(true)
      await updateUser(editingUser.id_user, payload)
      toast.success('Perubahan role berhasil disimpan.')
      setShowEditModal(false)
      setEditingUser(null)
      await loadUserData()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal mengubah role pengguna.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return
    }

    try {
      await deleteUser(userId)
      toast.success('Pengguna berhasil dihapus.')
      setSelectedUsers((prev) => prev.filter((id) => id !== userId))
      await loadUserData()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menghapus pengguna.')
    }
  }

  return (
    <div id="manajemen-pengguna-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <input
              id="search-pengguna"
              type="text"
              placeholder="Cari Pengguna"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 bg-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>

          <button
            id="tambah-pengguna-button"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2 bg-[#1a56db] text-white text-sm font-semibold rounded-lg hover:bg-[#1545b8] shadow-lg shadow-blue-500/25 transition-all"
          >
            Tambah Pengguna
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-[#1a56db] text-white">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded accent-white cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Nama Pengguna</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Terakhir Online</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center text-sm text-gray-500">Memuat data pengguna...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center text-sm text-gray-500">Tidak ada data pengguna.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const roleName = user.role?.nama_role || 'Guest'
                const online = isUserOnline(user, currentTime)
                return (
                  <tr key={user.id_user} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id_user)}
                        onChange={() => toggleSelectUser(user.id_user)}
                        className="w-4 h-4 rounded accent-[#1a56db] cursor-pointer"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} isOnline={online} />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-medium text-gray-900">{user.nama}</p>
                            {user.google_id_exists && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-medium border border-red-100" title="Akun login Google">
                                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9z" />
                                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                                </svg>
                                Google
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {online ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                Offline
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleColors[roleName] || 'bg-gray-100 text-gray-700'}`}>
                        {roleName}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {formatLastOnline(user.last_online_at)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                        >
                          Lihat Profil
                        </button>
                        <button
                          onClick={() => handleEditRole(user)}
                          className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200 transition-colors cursor-pointer"
                        >
                          Edit Role
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id_user)}
                          className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Pengguna"
        confirmText="Tambah"
        initialData={null}
        roles={roles}
        onSubmit={handleCreateUser}
        isSubmitting={isSubmitting}
      />

      <UserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingUser(null)
        }}
        title="Edit Role"
        confirmText="Simpan Perubahan"
        initialData={editingUser}
        roles={roles}
        onSubmit={handleUpdateUser}
        isSubmitting={isSubmitting}
      />

      <UserProfileDetailModal
        isOpen={showProfileModal}
        userId={viewingUser?.id_user}
        initialData={viewingUser}
        onClose={handleCloseProfileModal}
      />
    </div>
  )
}

export default ManajemenPenggunaPage

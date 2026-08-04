import { useState } from 'react'

// Static user data
const initialUsers = [
  {
    id: 1,
    name: 'Putri Cantika',
    email: 'putricantika@gmail.com',
    role: 'Admin',
    avatar: null,
  },
  {
    id: 2,
    name: 'Fauzan Hasan Susyanto',
    email: 'fauzanhasan@gmail.com',
    role: 'Peneliti',
    avatar: null,
  },
  {
    id: 3,
    name: 'Muh. Ahmad Saputra',
    email: 'muhahmad@gmail.com',
    role: 'Analis',
    avatar: null,
  },
  {
    id: 4,
    name: 'Muhammad Dhafa Rahmadi',
    email: 'mrahmadi@gmail.com',
    role: 'Peneliti',
    avatar: null,
  },
  {
    id: 5,
    name: 'Siti Nurhaliza',
    email: 'sitinur@gmail.com',
    role: 'Peneliti',
    avatar: null,
  },
  {
    id: 6,
    name: 'Rizky Pratama',
    email: 'rizkypratama@gmail.com',
    role: 'Analis',
    avatar: null,
  },
]

const roleColors = {
  Admin: 'bg-blue-100 text-blue-700',
  Peneliti: 'bg-green-100 text-green-700',
  Analis: 'bg-orange-100 text-orange-700',
}

// Reusable User Modal Component
function UserModal({ isOpen, onClose, title, confirmText, initialData }) {
  const [nama, setNama] = useState(initialData?.name || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [role, setRole] = useState(initialData?.role || '')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  if (!isOpen) return null

  const roles = ['Admin', 'Peneliti', 'Analis']

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-5 sm:p-8 animate-in">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>

        <div className="space-y-5">
          {/* Nama */}
          <div>
            <label htmlFor="modal-nama" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Nama
            </label>
            <input
              id="modal-nama"
              type="text"
              placeholder="Masukan Nama Pengguna"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="modal-email" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Email
            </label>
            <input
              id="modal-email"
              type="email"
              placeholder="Masukan Email Pengguna"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
            />
          </div>

          {/* Foto Profil */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Foto Profil
            </label>
            <div className="flex items-center gap-3">
              <input
                id="modal-foto"
                type="text"
                placeholder="Upload Gambar"
                readOnly
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-400 bg-white outline-none"
              />
              <button
                type="button"
                className="px-6 py-2.5 bg-[#1a56db] text-white text-sm font-semibold rounded-lg hover:bg-[#1545b8] transition-colors cursor-pointer whitespace-nowrap"
              >
                Unggah
              </button>
            </div>
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Role
            </label>
            <div className="relative">
              <button
                type="button"
                id="modal-role-dropdown"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 cursor-pointer bg-white"
              >
                <span className={role ? 'text-gray-900' : 'text-gray-400'}>
                  {role || 'Selected Option'}
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
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r)
                        setDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer ${
                        role === r ? 'bg-blue-50 text-[#1a56db] font-medium' : 'text-gray-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          id="modal-confirm-button"
          type="button"
          onClick={onClose}
          className="w-full mt-8 py-3 bg-[#1a56db] text-white text-sm font-semibold rounded-lg hover:bg-[#1545b8] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          {confirmText}
        </button>
      </div>
    </div>
  )
}

function ManajemenPenggunaPage() {
  const [users] = useState(initialUsers)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id))
    }
  }

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleEditRole = (user) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  return (
    <div id="manajemen-pengguna-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <input
              id="search-pengguna"
              type="text"
              placeholder="Cari Pengguna"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 bg-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>

          {/* Tambah Pengguna Button */}
          <button
            id="tambah-pengguna-button"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2 bg-[#1a56db] text-white text-sm font-semibold rounded-lg hover:bg-[#1545b8] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            Tambah Pengguna
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[600px]">
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
              <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Checkbox */}
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelectUser(user.id)}
                    className="w-4 h-4 rounded accent-[#1a56db] cursor-pointer"
                  />
                </td>

                {/* User Info */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditRole(user)}
                      className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200 transition-colors cursor-pointer"
                    >
                      Edit Role
                    </button>
                    <button
                      className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <UserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Pengguna"
        confirmText="Tambah"
        initialData={null}
      />

      {/* Edit Role Modal */}
      <UserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingUser(null)
        }}
        title="Edit Role"
        confirmText="Simpan Perubahan"
        initialData={editingUser}
      />
    </div>
  )
}

export default ManajemenPenggunaPage

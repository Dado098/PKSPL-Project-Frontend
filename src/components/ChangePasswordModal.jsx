import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { updatePassword } from '../services/profileService';

const ChangePasswordModal = ({ onClose }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isGoogleUser = user?.google_id_exists === true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const clientErrors = {};
    if (!currentPassword) clientErrors.current_password = 'Password saat ini wajib diisi.';
    if (!newPassword) clientErrors.password = 'Password baru wajib diisi.';
    else if (newPassword.length < 8) clientErrors.password = 'Password baru minimal 8 karakter.';
    if (newPassword !== confirmPassword) clientErrors.password_confirmation = 'Konfirmasi password tidak cocok.';

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      toast.success('Password berhasil diubah.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error) {
      const responseErrors = error.response?.data?.errors;
      if (responseErrors) {
        const mapped = {};
        Object.entries(responseErrors).forEach(([key, msgs]) => {
          mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(mapped);
      } else {
        const message = error.response?.data?.message || 'Gagal mengubah password.';
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordField = ({ label, value, onChange, show, onToggle, error, errorKey, placeholder }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm transition-colors ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500'
          } focus:outline-none focus:ring-2`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Ganti Password</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          {/* Google User Info */}
          {isGoogleUser && (
            <div className="flex items-start gap-3 mb-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Akun Anda terhubung dengan Google. Masukkan password saat ini untuk mengubahnya, atau atur password baru jika belum pernah mengatur password lokal.
              </p>
            </div>
          )}

          <PasswordField
            label="Password Saat Ini"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrentPassword}
            onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
            error={errors.current_password}
            placeholder="Masukkan password saat ini"
          />

          <PasswordField
            label="Password Baru"
            value={newPassword}
            onChange={setNewPassword}
            show={showNewPassword}
            onToggle={() => setShowNewPassword(!showNewPassword)}
            error={errors.password}
            placeholder="Minimal 8 karakter"
          />

          <PasswordField
            label="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            error={errors.password_confirmation}
            placeholder="Ulangi password baru"
          />

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? 'Menyimpan...' : 'Ubah Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

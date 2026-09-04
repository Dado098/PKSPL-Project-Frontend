import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const accountCreated = searchParams.get('account_created') === '1';

    if (!token) {
      navigate('/login', { state: { error: 'Authentication failed. No token received.' } });
      return;
    }

    const authenticate = async () => {
      try {
        const user = await handleAuthCallback(token);
        const role = user?.role?.nama_role;

        if (accountCreated) {
          toast.success('Akun berhasil dibuat. Selamat datang!');
        } else {
          toast.success('Anda berhasil login.');
        }

        let redirectPath = sessionStorage.getItem('auth_redirect') || '/';
        sessionStorage.removeItem('auth_redirect');

        if (redirectPath === '/') {
          if (role === 'Admin' || role === 'Administrator') {
            redirectPath = '/admin';
          } else if (role === 'Peneliti') {
            redirectPath = '/valuasi/projects';
          } else if (role === 'Analyst') {
            redirectPath = '/analyst';
          }
        }

        if (role === 'Peneliti' && redirectPath === '/') {
          redirectPath = '/valuasi/projects';
        }

        if (role === 'Admin' || role === 'Administrator') {
          redirectPath = '/admin';
        }

        if (role === 'Analyst' && redirectPath === '/') {
          redirectPath = '/analyst';
        }

        console.debug('Google login redirect decision', { role, redirectPath, user, accountCreated });

        navigate(redirectPath, { replace: true });
      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('Gagal melakukan autentikasi dengan Google.');
        navigate('/login', { state: { error: 'Failed to authenticate with Google.' } });
      }
    };

    authenticate();
  }, [searchParams, navigate, handleAuthCallback]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 font-medium">Memproses login...</p>
    </div>
  );
};

export default GoogleCallbackPage;

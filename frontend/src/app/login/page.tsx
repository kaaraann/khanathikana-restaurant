'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<'username' | 'passcode' | 'card'>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [cardId, setCardId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUsernameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({
        username,
        password,
        loginType: 'username',
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      router.push('/tables');
    } catch (err: any) {
      setError(err.response?.data || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasscodeLogin = async () => {
    if (passcode.length !== 4) return;

    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({
        passcode,
        loginType: 'passcode',
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      router.push('/tables');
    } catch (err: any) {
      setError(err.response?.data || 'Login failed');
      setPasscode('');
    } finally {
      setLoading(false);
    }
  };

  const handleCardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({
        cardId,
        loginType: 'card',
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      router.push('/tables');
    } catch (err: any) {
      setError(err.response?.data || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const addPasscodeDigit = (digit: string) => {
    if (passcode.length < 4) {
      const newPasscode = passcode + digit;
      setPasscode(newPasscode);
      if (newPasscode.length === 4) {
        setTimeout(() => handlePasscodeLogin(), 100);
      }
    }
  };

  const removePasscodeDigit = () => {
    setPasscode(passcode.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1EB] via-[#E8DFD1] to-[#D4A574]/20 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D4A574]/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#D4A574]/6 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#D4A574]/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4A574] to-[#C49A6C] rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl">🍽️</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-800 mb-2">Khanathikana</h1>
            <p className="text-stone-500">Restaurant Management System</p>
          </div>

          <div className="flex gap-2 mb-6 bg-stone-100 p-1.5 rounded-xl">
            <button
              onClick={() => setLoginType('username')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                loginType === 'username'
                  ? 'bg-gradient-to-r from-[#D4A574] to-[#C49A6C] text-white shadow-lg'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-white/50'
              }`}
            >
              Username
            </button>
            <button
              onClick={() => setLoginType('passcode')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                loginType === 'passcode'
                  ? 'bg-gradient-to-r from-[#D4A574] to-[#C49A6C] text-white shadow-lg'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-white/50'
              }`}
            >
              Passcode
            </button>
            <button
              onClick={() => setLoginType('card')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                loginType === 'card'
                  ? 'bg-gradient-to-r from-[#D4A574] to-[#C49A6C] text-white shadow-lg'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-white/50'
              }`}
            >
              Card
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-600 rounded-xl">
              {error}
            </div>
          )}

          {loginType === 'username' && (
            <form onSubmit={handleUsernameLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#D4A574]/30 focus:border-[#D4A574] transition-all outline-none placeholder-stone-400"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#D4A574]/30 focus:border-[#D4A574] transition-all outline-none placeholder-stone-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#D4A574] to-[#C49A6C] text-white py-3.5 rounded-xl font-semibold hover:from-[#C49A6C] hover:to-[#D4A574] transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>
          )}

          {loginType === 'passcode' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-3 mb-8">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      i < passcode.length
                        ? 'bg-gradient-to-r from-[#D4A574] to-[#C49A6C] border-[#D4A574] shadow-lg'
                        : 'border-stone-300 bg-stone-50'
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => addPasscodeDigit(num.toString())}
                    className="bg-white hover:bg-stone-50 text-stone-800 text-2xl font-semibold py-4 rounded-xl transition-all duration-200 border border-stone-200 hover:border-[#D4A574]/50 hover:shadow-md"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={removePasscodeDigit}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-4 rounded-xl transition-all duration-200 border border-stone-200 hover:border-stone-300"
                >
                  ←
                </button>
                <button
                  onClick={() => addPasscodeDigit('0')}
                  className="bg-white hover:bg-stone-50 text-stone-800 text-2xl font-semibold py-4 rounded-xl transition-all duration-200 border border-stone-200 hover:border-[#D4A574]/50 hover:shadow-md"
                >
                  0
                </button>
                <button
                  onClick={() => setPasscode('')}
                  className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-4 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                >
                  Clear
                </button>
              </div>

              <button
                onClick={handlePasscodeLogin}
                disabled={loading || passcode.length !== 4}
                className="w-full bg-gradient-to-r from-[#D4A574] to-[#C49A6C] text-white py-3.5 rounded-xl font-semibold hover:from-[#C49A6C] hover:to-[#D4A574] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'Verifying...' : 'Verify Passcode'}
              </button>
            </div>
          )}

          {loginType === 'card' && (
            <form onSubmit={handleCardLogin} className="space-y-6">
              <div className="text-center py-8">
                <div className="inline-block p-8 bg-gradient-to-br from-[#D4A574]/10 to-[#C49A6C]/10 rounded-2xl mb-4 border border-[#D4A574]/20">
                  <svg
                    className="w-24 h-24 text-[#D4A574]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <p className="text-stone-600 mb-4 text-sm">Swipe your card or enter card ID</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Card ID
                </label>
                <input
                  type="text"
                  value={cardId}
                  onChange={(e) => setCardId(e.target.value)}
                  className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-[#D4A574]/30 focus:border-[#D4A574] transition-all outline-none placeholder-stone-400"
                  placeholder="Enter card ID"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#D4A574] to-[#C49A6C] text-white py-3.5 rounded-xl font-semibold hover:from-[#C49A6C] hover:to-[#D4A574] transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Verifying...' : 'Verify Card'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-stone-500">
            <p>Support: 07969 223344</p>
            <p>support@khanathikana.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

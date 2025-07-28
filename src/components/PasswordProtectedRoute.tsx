import React, { useState, useEffect } from 'react';

const PasswordProtectedRoute = ({ children, password }: { children: React.ReactNode; password?: string }) => {
  // Production ortamı değilse veya şifre belirtilmemişse, korumayı direkt geç
  if (import.meta.env.MODE !== 'production' || !password) {
    return <>{children}</>;
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Sayfa yenilendiğinde sessionStorage'ı kontrol et
    if (sessionStorage.getItem('dashboard_access_granted') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const enteredPassword = (event.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    if (enteredPassword === password) {
      sessionStorage.setItem('dashboard_access_granted', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Hatalı şifre!');
    }
  };

  // Eğer yetkilendirilmişse, içeriği göster
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Yetkilendirilmemişse, şifre formunu göster
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Bu Alan Korumalıdır</h2>
        <p className="text-gray-600 mb-6">Lütfen devam etmek için şifreyi girin.</p>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
            placeholder="Şifre"
          />
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtectedRoute; 
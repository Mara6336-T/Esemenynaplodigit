import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, User } from "lucide-react";
import { USERS } from "../data/Users";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    const user = USERS.find(
      (item) =>
        item.username === username &&
        item.password === password
    );

    if (!user) {
      setError("Helytelen felhasználónév vagy jelszó.");
      return;
    }

    // A jelszót nem adjuk tovább az alkalmazás többi részének
    const loggedInUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      username: user.username,
    };

    onLogin(loggedInUser);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

          {/* Fejléc */}
          <div className="bg-[#2E7D32] px-8 py-8 text-center">
            <img
              src="/logo.png"
              alt="Rába ETO"
              className="h-20 mx-auto mb-5 object-contain"
            />

            <h1 className="text-2xl font-bold text-white">
              Digitális eseménynapló kezelés
            </h1>

            <p className="text-white/90 mt-2">
              Rába ETO
            </p>
          </div>

          {/* Bejelentkezés */}
          <form onSubmit={handleLogin} className="p-8">

            {/* Felhasználónév */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Felhasználónév
              </label>

              <div className="relative">
                <User
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Felhasználónév"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-[#2E7D32]
                             focus:border-[#2E7D32]"
                  required
                />
              </div>
            </div>

            {/* Jelszó */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jelszó
              </label>

              <div className="relative">
                <LockKeyhole
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Jelszó"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-[#2E7D32]
                             focus:border-[#2E7D32]"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Hiba */}
            {error && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200
                              px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Belépés */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#2E7D32] text-white
                         font-semibold hover:bg-[#256628] transition"
            >
              Belépés
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

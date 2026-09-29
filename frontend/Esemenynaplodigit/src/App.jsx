//import { useEffect, useState, useRef } from "react";
import { useEffect, useState } from "react";
import { User, Menu } from "lucide-react";

import LoginPage from "./components/LoginPage";
//import EventLogDocument from "./components/EventLogDocument";
//import { eventMeta, eventRows } from "./data/EventLogData";
import EventLogEditor from "./components/EventLogEditor";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("home");
  const [matches, setMatches] = useState([]);
  const [archived, setArchived] = useState([]);
  const [closed, setClosed] = useState([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  /*
   * Az éppen megnyitott eseménynapló aktuális státusza.
   *
   * in_progress -> Megnyitott
   * finalized   -> Lezárt
   * archived    -> Archivált
   */
  const [editorStatus, setEditorStatus] = useState(null);

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  //const contentRef = useRef();

  useEffect(() => {
    setMatches([
      {
        id: 1,
        title: "CSAPAT 2 vs ETO",
        date: "2026. 04. 09.",
        time: "14:50",
        status: "in_progress",
      },
      {
        id: 6,
        title: "CSAPAT 2 vs ETO",
        date: "2026. 04. 23.",
        time: "14:50",
        status: "in_progress",
      },
      {
        id: 7,
        title: "CSAPAT 2 vs ETO",
        date: "2026. 06. 09.",
        time: "14:50",
        status: "in_progress",
      },
    ]);

    setClosed([
      {
        id: 3,
        title: "CSAPAT 1 vs ETO",
        date: "2026. 03. 09.",
        time: "14:50",
        status: "finalized",
      },
    ]);

    setArchived([
      {
        id: 4,
        title: "CSAPAT 5 vs ETO",
        date: "2026. 02. 09.",
        time: "14:50",
        status: "archived",
      },
    ]);
  }, []);

  /*
   * Aktuális menüpont / eseménynapló státusz megnevezése.
   *
   * Ha nincs megnyitva eseménynapló:
   *   az aktuális menüpont neve jelenik meg.
   *
   * Ha meg van nyitva eseménynapló:
   *   in_progress -> Megnyitott
   *   finalized   -> Lezárt
   *   archived    -> Archivált
   */
  const getViewTitle = () => {
    if (selectedLog) {
      switch (editorStatus) {
        case "in_progress":
          return "Megnyitott";

        case "finalized":
          return "Lezárt";

        case "archived":
          return "Archivált";

        default:
          return "Eseménynapló";
      }
    }

    switch (view) {
      case "home":
        return "Főnézet";

      case "upcoming":
        return "Következő";

      case "closed":
        return "Lezárt";

      case "archived":
        return "Archivált";

      case "profile":
        return "Profil";

      case "admin":
        return "Admin felület";

      default:
        return "Főnézet";
    }
  };

  /*
   * Navigáció főmenüpontok között.
   */
  const navigateTo = (newView) => {
    setSelectedLog(null);
    setEditorStatus(null);
    setView(newView);

    // Mobilon a menü automatikusan bezáródik.
    setMenuOpen(false);

    // Profilmenü bezárása.
    setProfileMenuOpen(false);
  };

  /*
   * PDF export
   *
   * async function downloadPDF() {
   *   if (!contentRef.current) {
   *     console.error("PDF content not ready");
   *     return;
   *   }
   *
   *   const html = contentRef.current.innerHTML;
   *
   *   try {
   *     const res = await fetch(
   *       "http://localhost:3000/generate-pdf",
   *       {
   *         method: "POST",
   *         headers: {
   *           "Content-Type": "application/json",
   *         },
   *         body: JSON.stringify({ html }),
   *       }
   *     );
   *
   *     if (!res.ok) {
   *       throw new Error("PDF generation failed");
   *     }
   *
   *     const blob = await res.blob();
   *     const url = window.URL.createObjectURL(blob);
   *
   *     const a = document.createElement("a");
   *     a.href = url;
   *     a.download = "event-log.pdf";
   *     a.click();
   *
   *     window.URL.revokeObjectURL(url);
   *   } catch (err) {
   *     console.error(err);
   *   }
   * }
   */

  /*
   * Mérkőzés kiválasztása.
   */
  const handleClick = (match) => {
    setSelectedLog(match);

    /*
     * Az eseménynapló kezdeti státuszát
     * az adott mérkőzés státuszából vesszük.
     */
    setEditorStatus(match.status);

    // Mobilon a menü legyen bezárva,
    // amikor megnyitjuk az eseménynaplót.
    setMenuOpen(false);
  };

  /*
   * Eseménynapló bezárása.
   */
  const handleBackFromEditor = () => {
    setSelectedLog(null);
    setEditorStatus(null);
  };

  /*
   * Bejelentkezés előtt a LoginPage jelenik meg.
   */
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={(user) => {
          setCurrentUser(user);
          setView("home");
          setSelectedLog(null);
          setEditorStatus(null);
        }}
      />
    );
  }

  /*
   * Mérkőzéstábla.
   *
   * Mobilon a táblázat vízszintesen görgethető,
   * így nem törik össze a layout kis képernyőn.
   */
  const renderTable = (data) => (
    <div className="w-full overflow-x-auto rounded-2xl shadow">
      <table className="w-full min-w-[600px] text-sm bg-white">
        <thead className="bg-[#2E7D32] text-white text-left">
          <tr>
            <th className="p-3">Csapatok</th>
            <th className="p-3">Időpont</th>
            <th className="p-3">Helyszín</th>
          </tr>
        </thead>

        <tbody>
          {data.map((m) => (
            <tr
              key={m.id}
              onClick={() => handleClick(m)}
              className="border-t cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="p-3 font-medium">
                {m.title}
              </td>

              <td className="p-3 whitespace-nowrap">
                {m.date} {m.time}
              </td>

              <td className="p-3 whitespace-nowrap">
                ETO Stadion Győr
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /*
   * Oldal.
   */
  return (
    <div className="min-h-screen flex bg-gray-100 relative">

      {/* =====================================================
          SIDEMENU
          ===================================================== */}

      <div
        className={`
          bg-[#C19A5B]
          text-black
          p-4
          transition-all
          duration-300
          z-50

          fixed
          inset-y-0
          left-0

          w-64

          ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:relative
          md:translate-x-0

          ${
            menuOpen
              ? "md:w-64"
              : "md:w-16"
          }
        `}
      >

        {/* Menü nyitása / bezárása */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            mb-6
            p-1
            rounded
            hover:bg-[#b08b50]
            transition-colors
          "
          aria-label="Menü megnyitása"
        >
          <Menu />
        </button>

        {menuOpen && (
          <div className="space-y-2">

            {/* FŐNÉZET */}
            <div
              onClick={() => navigateTo("home")}
              className={`
                cursor-pointer
                p-2
                rounded
                transition-colors
                ${
                  view === "home"
                    ? "bg-[#b08b50] font-semibold"
                    : "hover:bg-[#b08b50]"
                }
              `}
            >
              Főnézet
            </div>

            {/* KÖVETKEZŐ */}
            <div
              onClick={() => navigateTo("upcoming")}
              className={`
                cursor-pointer
                p-2
                rounded
                transition-colors
                ${
                  view === "upcoming"
                    ? "bg-[#b08b50] font-semibold"
                    : "hover:bg-[#b08b50]"
                }
              `}
            >
              Következő
            </div>

            {/* LEZÁRT */}
            <div
              onClick={() => navigateTo("closed")}
              className={`
                cursor-pointer
                p-2
                rounded
                transition-colors
                ${
                  view === "closed"
                    ? "bg-[#b08b50] font-semibold"
                    : "hover:bg-[#b08b50]"
                }
              `}
            >
              Lezárt
            </div>

            {/* ARCHIVÁLT */}
            <div
              onClick={() => navigateTo("archived")}
              className={`
                cursor-pointer
                p-2
                rounded
                transition-colors
                ${
                  view === "archived"
                    ? "bg-[#b08b50] font-semibold"
                    : "hover:bg-[#b08b50]"
                }
              `}
            >
              Archivált
            </div>

          </div>
        )}
      </div>

      {/* =====================================================
          MOBILE BACKDROP
          ===================================================== */}

      {menuOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            z-40
            md:hidden
          "
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* =====================================================
          FŐ TARTALOM
          ===================================================== */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* ===================================================
            FEJLÉC
            =================================================== */}

        <div className="bg-[#2E7D32] text-white">

          {/* Felső fejléc */}
          <div className="px-3 sm:px-4 py-2 flex justify-between items-center">

            {/* LOGO + NÉV */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="
                  md:hidden
                  p-2
                  rounded
                  hover:bg-[#256628]
                  transition-colors
                  flex-shrink-0
                "
                aria-label="Menü"
              >
                <Menu size={28} />
              </button>

              <img
                src="/src/assets/logo.png"
                className="h-9 sm:h-12 w-auto flex-shrink-0"
                alt="Rába ETO"
              />

              <span
                className="
                  font-semibold
                  text-2xl
                  sm:text-[42px]
                  truncate
                "
              >
                Rába ETO
              </span>

            </div>

        {/* PROFIL IKON + FELHASZNÁLÓNÉV */}
        <div className="relative flex-shrink-0 flex items-center gap-2">

          <span className="text-sm sm:text-base font-medium text-white">
            {currentUser?.username || "Username"}
          </span>

          <button 
            onClick={() => { 
              setProfileMenuOpen(
                !profileMenuOpen
              ); 
            }}
                className="
                  bg-[#C19A5B]
                  p-2
                  sm:p-3
                  rounded-full
                  hover:bg-[#b08b50]
                  transition-colors
                "
                title="Profil menü"
              >
                <User
                  className="text-black"
                  size={32}
                />
              </button>

              {/* PROFIL MENÜ */}
              {profileMenuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    mt-2
                    w-64
                    max-w-[calc(100vw-1.5rem)]
                    bg-white
                    text-black
                    rounded-xl
                    shadow-lg
                    overflow-hidden
                    z-50
                  "
                >

                  {/* PROFIL MEGTEKINTÉSE */}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigateTo("profile");
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-3
                      hover:bg-gray-100
                      transition-colors
                    "
                  >
                    <div className="font-semibold">
                      Profil megtekintése
                    </div>

                    <div className="text-sm text-gray-500">
                      Felhasználói és szervezeti adatok
                    </div>
                  </button>

                  {/* KIJELENTKEZÉS */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser(null);
                      setView("home");
                      setSelectedLog(null);
                      setEditorStatus(null);
                      setProfileMenuOpen(false);
                      setMenuOpen(false);
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      text-sm
                      text-gray-700
                      hover:bg-gray-50
                    "
                  >
                    Kijelentkezés
                  </button>

                  {/* ADMIN FELÜLET */}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);

                      // Tesztelési célú admin felület
                      navigateTo("admin");
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-3
                      hover:bg-gray-100
                      transition-colors
                      border-t
                    "
                  >
                    <div className="font-semibold">
                      Admin felület
                    </div>

                    <div className="text-sm text-gray-500">
                      Tesztelési célú adminisztráció
                    </div>
                  </button>

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              ALSÓ FEJLÉC SÁV
              ================================================= */}

          <div
            className="
              bg-[#256628]
              px-4
              sm:px-6
              py-2
              text-white
              text-base
              sm:text-lg
              font-semibold
            "
          >
            {getViewTitle()}
          </div>

        </div>

        {/* =====================================================
            OLDAL TARTALMA
            ===================================================== */}

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 min-w-0">

          {/* =================================================
              ESEMÉNYNAPLÓ
              ================================================= */}

          {selectedLog && (
            <EventLogEditor
              match={selectedLog}
              onBack={handleBackFromEditor}
              onStatusChange={setEditorStatus}
            />
          )}

          {/* =================================================
              PROFIL
              ================================================= */}

          {!selectedLog &&
            view === "profile" && (
              <ProfilePage />
            )}

          {/* =================================================
              ADMIN FELÜLET
              ================================================= */}

          {!selectedLog &&
            view === "admin" && (
              <div className="bg-white rounded-2xl shadow p-4 sm:p-6">

                <h2
                  className="
                    text-xl
                    sm:text-2xl
                    font-semibold
                    mb-4
                  "
                >
                  Admin felület
                </h2>

                <AdminPage />

              </div>
            )}

          {/* =================================================
              FŐNÉZET
              ================================================= */}

          {!selectedLog &&
            view === "home" && (
              <>

                {/* MEGNYITOTT NAPLÓK */}
                <div>
                  <h2
                    className="
                      font-semibold
                      mb-2
                      bg-[#C19A5B]
                      text-black
                      px-3
                      py-2
                      rounded
                    "
                  >
                    Megnyitott naplók
                  </h2>

                  {renderTable(matches)}
                </div>

                {/* LEZÁRT NAPLÓK */}
                <div>
                  <h2
                    className="
                      font-semibold
                      mb-2
                      bg-[#C19A5B]
                      text-black
                      px-3
                      py-2
                      rounded
                    "
                  >
                    Lezárt de nem archivált
                  </h2>

                  {renderTable(closed)}
                </div>

                {/* KÖVETKEZŐ MÉRKŐZÉSEK */}
                <div>
                  <h2
                    className="
                      font-semibold
                      mb-2
                      bg-[#C19A5B]
                      text-black
                      px-3
                      py-2
                      rounded
                    "
                  >
                    Következő mérkőzések
                  </h2>

                  {renderTable(matches)}
                </div>

              </>
            )}

          {/* =================================================
              KÖVETKEZŐ
              ================================================= */}

          {!selectedLog &&
            view === "upcoming" &&
            renderTable(matches)}

          {/* =================================================
              LEZÁRT
              ================================================= */}

          {!selectedLog &&
            view === "closed" &&
            renderTable(closed)}

          {/* =================================================
              ARCHIVÁLT
              ================================================= */}

          {!selectedLog &&
            view === "archived" &&
            renderTable(archived)}

        </div>
      </div>
    </div>
  );
}

export default App;

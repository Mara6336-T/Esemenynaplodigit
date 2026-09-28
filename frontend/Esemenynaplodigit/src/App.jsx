import { useEffect, useState, useRef } from "react";
import { User, Menu } from "lucide-react";

import EventLogDocument from "./components/EventLogDocument";
import { eventMeta, eventRows } from "./data/EventLogData";
import EventLogEditor from "./components/EventLogEditor";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";


function App() {
  const [matches, setMatches] = useState([]);
  const [archived, setArchived] = useState([]);
  const [closed, setClosed] = useState([]);

  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [view, setView] = useState("home");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const contentRef = useRef();

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
   * Aktuális menüpont megnevezése.
   * Az eseménynapló szerkesztő megnyitásakor is
   * az eredeti menüpont neve marad látható.
   */
  const getViewTitle = () => {
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
   * Nézetváltás kezelése.
   * Minden menüpont megnyitásakor bezárjuk az esetlegesen
   * megnyitott eseménynaplót.
   */
  const navigateTo = (newView) => {
    setSelectedLog(null);
    setView(newView);
  };

  /*
   * PDF export
   */
  async function downloadPDF() {
    if (!contentRef.current) {
      console.error("PDF content not ready");
      return;
    }

    const html = contentRef.current.innerHTML;

    try {
      const res = await fetch(
        "http://localhost:3000/generate-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ html }),
        }
      );

      if (!res.ok) {
        throw new Error("PDF generation failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "event-log.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  }

  /*
   * Mérkőzés kiválasztása
   */
  const handleClick = (match) => {
    setSelectedLog(match);
  };

  /*
   * Mérkőzéstábla
   */
  const renderTable = (data) => (
    <table className="w-full text-sm bg-white rounded-2xl overflow-hidden shadow">
      <thead className="bg-[#2E7D32] text-white text-left">
        <tr>
          <th className="p-3">Csapatok</th>
          <th>Időpont</th>
          <th>Helyszín</th>
        </tr>
      </thead>

      <tbody>
        {data.map((m) => (
          <tr
            key={m.id}
            onClick={() => handleClick(m)}
            className="border-t cursor-pointer hover:bg-gray-50"
          >
            <td className="p-3 font-medium">
              {m.title}
            </td>

            <td>
              {m.date} {m.time}
            </td>

            <td>
              ETO Stadion Győr
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  /*
   * Oldal
   */
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* =====================================================
          SIDEMENU
          ===================================================== */}

      <div
        className={`bg-[#C19A5B] text-black p-4 transition-all ${
          menuOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Menü nyitása / bezárása */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mb-6"
        >
          <Menu />
        </button>

        {menuOpen && (
          <div className="space-y-2">

            {/* FŐNÉZET */}
            <div
              onClick={() => navigateTo("home")}
              className={`cursor-pointer p-2 rounded transition-colors ${
                view === "home"
                  ? "bg-[#b08b50] font-semibold"
                  : "hover:bg-[#b08b50]"
              }`}
            >
              Főnézet
            </div>

            {/* KÖVETKEZŐ */}
            <div
              onClick={() => navigateTo("upcoming")}
              className={`cursor-pointer p-2 rounded transition-colors ${
                view === "upcoming"
                  ? "bg-[#b08b50] font-semibold"
                  : "hover:bg-[#b08b50]"
              }`}
            >
              Következő
            </div>

            {/* LEZÁRT */}
            <div
              onClick={() => navigateTo("closed")}
              className={`cursor-pointer p-2 rounded transition-colors ${
                view === "closed"
                  ? "bg-[#b08b50] font-semibold"
                  : "hover:bg-[#b08b50]"
              }`}
            >
              Lezárt
            </div>

            {/* ARCHIVÁLT */}
            <div
              onClick={() => navigateTo("archived")}
              className={`cursor-pointer p-2 rounded transition-colors ${
                view === "archived"
                  ? "bg-[#b08b50] font-semibold"
                  : "hover:bg-[#b08b50]"
              }`}
            >
              Archivált
            </div>

            {/* PDF EXPORT */}
            <button
              onClick={downloadPDF}
              className="mt-4 w-full bg-[#2E7D32] text-white p-2 rounded hover:bg-[#256628] transition-colors"
            >
              PDF export
            </button>

          </div>
        )}
      </div>


      {/* =====================================================
          FŐ TARTALOM
          ===================================================== */}

      <div className="flex-1 flex flex-col">

        {/* ===================================================
            FEJLÉC
            =================================================== */}

        <div className="bg-[#2E7D32] text-white">

          {/* Felső fejléc */}
          <div className="px-4 py-2 flex justify-between items-center">

            {/* LOGO + NÉV */}
            <div className="flex items-center gap-4">
              <img
                src="/src/assets/logo.png"
                className="h-12"
                alt="Rába ETO"
              />

              <span className="font-semibold text-[42px]">
                Rába ETO
              </span>
            </div>


            {/* PROFIL IKON */}
            <div className="relative">

  {/* PROFIL IKON */}
  <button
    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
    className="bg-[#C19A5B] p-3 rounded-full hover:bg-[#b08b50] transition-colors"
    title="Profil menü"
  >
    <User
      className="text-black"
      size={48}
    />
  </button>


  {/* PROFIL MENÜ */}
  {profileMenuOpen && (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white text-black rounded-xl shadow-lg overflow-hidden z-50">

      {/* 1. PROFIL MEGTEKINTÉSE */}
      <button
        onClick={() => {
          setProfileMenuOpen(false);
          navigateTo("profile");
        }}
        className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
      >
        <div className="font-semibold">
          Profil megtekintése
        </div>

        <div className="text-sm text-gray-500">
          Felhasználói és szervezeti adatok
        </div>
      </button>


      {/* 2. KIJELENTKEZÉS */}
      <button
        onClick={() => {
          setProfileMenuOpen(false);

          // Később itt kerülhet meghívásra
          // a tényleges backend kijelentkezés.
          console.log("Kijelentkezés");
        }}
        className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-t"
      >
        <div className="font-semibold">
          Kijelentkezés
        </div>

        <div className="text-sm text-gray-500">
          Kilépés a felhasználói fiókból
        </div>
      </button>


      {/* 3. ADMIN FELÜLET */}
      <button
        onClick={() => {
          setProfileMenuOpen(false);

          // Tesztelési célú admin felület
          navigateTo("admin");
        }}
        className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-t"
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

          <div className="bg-[#256628] px-6 py-2 text-white text-lg font-semibold">
            {getViewTitle()}
          </div>

        </div>


        {/* =====================================================
            OLDAL TARTALMA
            ===================================================== */}

        <div className="p-6 space-y-6">

          {/* =================================================
              ESEMÉNYNAPLÓ
              ================================================= */}

          {selectedLog && (
            <EventLogEditor
              match={selectedLog}
              onBack={() => setSelectedLog(null)}
            />
          )}


          {/* =================================================
              PROFIL
              ================================================= */}

          {!selectedLog && view === "profile" && (
            <ProfilePage />
          )}
          {/* =================================================
              ADMIN FELÜLET - TESZTELÉSI CÉLRA
              ================================================= */}

          {!selectedLog && view === "admin" && (
            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-2xl font-semibold mb-4">
                Admin felület
              </h2>

              {view === "admin" && (
  <AdminPage />
)}

            </div>
          )}

          {/* =================================================
              FŐNÉZET
              ================================================= */}

          {!selectedLog && view === "home" && (
            <>

              {/* MEGNYITOTT NAPLÓK */}
              <div>
                <h2 className="font-semibold mb-2 bg-[#C19A5B] text-black px-3 py-2 rounded">
                  Megnyitott naplók
                </h2>

                {renderTable(matches)}
              </div>


              {/* LEZÁRT NAPLÓK */}
              <div>
                <h2 className="font-semibold mb-2 bg-[#C19A5B] text-black px-3 py-2 rounded">
                  Lezárt de nem archivált
                </h2>

                {renderTable(closed)}
              </div>


              {/* KÖVETKEZŐ MÉRKŐZÉSEK */}
              <div>
                <h2 className="font-semibold mb-2 bg-[#C19A5B] text-black px-3 py-2 rounded">
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


          {/* =================================================
              PDF TARTALOM
              ================================================= */}

          <div
            style={{ display: "none" }}
            ref={contentRef}
          >
            <EventLogDocument
              meta={eventMeta}
              rows={eventRows}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
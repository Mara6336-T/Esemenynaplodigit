import {
  useEffect,
  useRef,
  useState,
} from "react";

import EventLogDocument from "./EventLogDocument";
import logo from "../assets/logo.png";
import {
  eventMeta,
  eventRows,
} from "../data/EventLogData";

const CURRENT_USER = "Felhasználó";

const EVENT_OPTIONS = [
  "Meccs kezdete",
  "Félidő",
  "Meccs vége",
  "Mentők megérkezése",
  "Tűzeset",
  "Lesérülés",
];

const ACTION_OPTIONS = [
  "Nincs intézkedés",
  "Orvosi ellátás",
  "Mentő hívása",
  "Játék megszakítása",
  "Játék folytatása",
  "Rendőrség értesítése",
  "Tűzoltóság értesítése",
];

const createEmptyEvent = (events) => {
  const maxSequenceNumber = events.reduce(
    (max, event) =>
      Math.max(
        max,
        Number(event.sequenceNumber) || 0
      ),
    0
  );

  return {
    id:
      typeof crypto !== "undefined" &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now(),

    sequenceNumber:
      maxSequenceNumber + 1,

    eventType: "",
    time: "",
    reporterName: "",
    reporterMode: "",
    eventDescription: "",
    decisionMaker: CURRENT_USER,
    decisionMakerMode: "current_user",
    actionResult: "",
    createdAt: "",
    lastModifiedAt: "",
    createdBy: "",
  };
};


/*
 * ============================================================
 * AUTOMATIKUSAN NÖVEKVŐ TEXTAREA
 * ============================================================
 */

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  rows = 1,
  className = "",
}) {
  const textareaRef = useRef(null);

  const resize = () => {
    const element = textareaRef.current;

    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(event) => {
        onChange(event);
        requestAnimationFrame(resize);
      }}
      placeholder={placeholder}
      rows={rows}
      className={`
        block
        w-full
        min-h-[30px]
        resize-none
        overflow-hidden
        rounded-[5px]
        border
        border-transparent
        bg-transparent
        px-[7px]
        py-[6px]
        text-[13px]
        leading-[1.4]
        text-gray-800
        outline-none
        transition
        duration-150
        placeholder:text-gray-400
        hover:bg-[#f7f9fb]
        focus:border-[#b8c3d4]
        focus:bg-white
        ${className}
      `}
    />
  );
}


/*
 * ============================================================
 * FŐ KOMPONENS
 * ============================================================
 */

function EventLogEditor({
  match,
  onBack,
}) {
  const [status, setStatus] = useState(
    match.status
  );

  /*
   * ----------------------------------------------------------
   * DOKUMENTUM FEJLÉC
   * ----------------------------------------------------------
   */

  const [meta, setMeta] = useState(() => ({
    ...eventMeta,

    securityOfficer: {
      ...(eventMeta.securityOfficer || {}),
    },

    headOrganizer: {
      ...(eventMeta.headOrganizer || {}),
    },

    medicalService: {
      ...(eventMeta.medicalService || {}),
    },

    disasterProtection: {
      ...(eventMeta.disasterProtection || {}),
    },
  }));


  /*
   * ----------------------------------------------------------
   * ESEMÉNYEK
   * ----------------------------------------------------------
   */

  const [events, setEvents] = useState(() =>
    (eventRows || []).map((event) => ({
      ...event,
    }))
  );


  /*
   * ----------------------------------------------------------
   * MEGJEGYZÉSEK
   * ----------------------------------------------------------
   */

  const [notes, setNotes] = useState([
    {
      id: 1,
      text: "Teszt megjegyzés.",
      createdAt: "2026-03-10 09:15",
      createdBy: "Teszt Elek",
    },
  ]);

  const [newNote, setNewNote] = useState("");


  /*
   * ----------------------------------------------------------
   * STÁTUSZOK
   * ----------------------------------------------------------
   */

  const isEditable =
    status === "in_progress";

  const isFinalized =
    status === "finalized";

  const isArchived =
    status === "archived";


  /*
   * ==========================================================
   * META MÓDOSÍTÁS
   * ==========================================================
   */

  const updateMeta = (
    field,
    value
  ) => {
    if (!isEditable) return;

    setMeta((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  const updateNestedMeta = (
    parent,
    field,
    value
  ) => {
    if (!isEditable) return;

    setMeta((previous) => ({
      ...previous,

      [parent]: {
        ...(previous[parent] || {}),
        [field]: value,
      },
    }));
  };


  /*
   * ==========================================================
   * ESEMÉNY HOZZÁADÁSA
   * ==========================================================
   */

  const addEvent = () => {
    if (!isEditable) return;

    setEvents((previous) => [
      ...previous,
      createEmptyEvent(previous),
    ]);
  };


  /*
   * ==========================================================
   * ESEMÉNY MÓDOSÍTÁSA
   * ==========================================================
   */

  const updateEvent = (
    index,
    field,
    value
  ) => {
    if (!isEditable) return;

    setEvents((previous) =>
      previous.map((event, currentIndex) => {
        if (currentIndex !== index) {
          return event;
        }

        const updatedEvent = {
          ...event,
          [field]: value,
        };

        /*
         * Az esemény akkor válik ténylegesen
         * aktívvá, amikor valamelyik érdemi mezőbe
         * adat kerül.
         */
        const hasEventData =
          Boolean(
            updatedEvent.eventType?.trim()
          ) ||
          Boolean(
            updatedEvent.eventDescription?.trim()
          ) ||
          Boolean(
            updatedEvent.decisionMaker?.trim()
          ) ||
          Boolean(
            updatedEvent.actionResult?.trim()
          );

        /*
         * Első tényleges adatbevitel.
         */
        if (
          !event.time &&
          hasEventData
        ) {
          const now = new Date();
          const isoNow =
            now.toISOString();

          updatedEvent.time =
            now.toLocaleTimeString(
              "hu-HU",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            );

          // A kitöltő alapértelmezésben a jelenlegi felhasználó.
          // Manuális módban a korábban megadott személy marad.
          if (updatedEvent.reporterMode !== "custom") {
            updatedEvent.reporterName =
              CURRENT_USER;
            updatedEvent.reporterMode =
              "current_user";
          }

          // Alapértelmezésben az intézkedést a bejelentkezett
          // felhasználó határozza meg. A manuális mód ettől eltérhet.
          if (updatedEvent.decisionMakerMode !== "custom") {
            updatedEvent.decisionMaker = CURRENT_USER;
            updatedEvent.decisionMakerMode = "current_user";
          }

          updatedEvent.createdBy =
            CURRENT_USER;

          updatedEvent.createdAt =
            isoNow;

          updatedEvent.lastModifiedAt =
            isoNow;
        }

        /*
         * Már létező esemény módosítása.
         */
        else if (event.time) {
          updatedEvent.lastModifiedAt =
            new Date().toISOString();
        }

        return updatedEvent;
      })
    );
  };


  /*
   * ==========================================================
   * ESEMÉNY TÖRLÉSE
   * ==========================================================
   */

  const deleteEvent = (index) => {
    if (!isEditable) return;

    setEvents((previous) =>
      previous.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  };


  /*
   * ==========================================================
   * MEGJEGYZÉS
   * ==========================================================
   */

  const addNote = () => {
    if (isArchived) return;

    const text = newNote.trim();

    if (!text) return;

    setNotes((previous) => [
      ...previous,

      {
        id: Date.now(),
        text,
        createdAt:
          new Date().toLocaleString(
            "hu-HU"
          ),
        createdBy: CURRENT_USER,
      },
    ]);

    setNewNote("");
  };


  /*
   * ==========================================================
   * MENTÉS
   * ==========================================================
   */

  const handleSave = () => {
    if (!isEditable) return;

    const data = {
      meta,
      events,
      status,
    };

    console.log(
      "Eseménynapló mentve:",
      data
    );

    /*
     * API később:
     *
     * await updateEventLog(match.id, data);
     */
  };


  /*
   * ==========================================================
   * FINALIZÁLÁS
   * ==========================================================
   */

  const handleFinalize = () => {
    if (!isEditable) return;

    const data = {
      meta,
      events,
      status: "finalized",
    };

    console.log(
      "Eseménynapló finalizálva:",
      data
    );

    /*
     * API később:
     *
     * await finalizeEventLog(match.id, data);
     */

    setStatus("finalized");
  };


  /*
   * ==========================================================
   * FEJLÉC MEZŐ
   * ==========================================================
   */

  const HeaderField = ({
    label,
    children,
    first = false,
  }) => (
    <div
      className={`
        flex
        min-h-[38px]
        items-center
        border-b
        border-[#edf0f4]
        py-[6px]
        last:border-b-0
      `}
    >
      <span
        className={`
          mr-2
          shrink-0
          whitespace-nowrap
          font-semibold
          text-[#2E7D32]
          ${first
            ? "text-[14px]"
            : "text-[13px]"
          }
        `}
      >
        {label}
      </span>

      {children}
    </div>
  );


  /*
   * ==========================================================
   * FEJLÉC INPUT
   * ==========================================================
   */

  const headerInputClass = `
    min-w-0
    w-full
    rounded-[5px]
    border-0
    bg-transparent
    px-[6px]
    py-1
    text-[14px]
    leading-[1.4]
    text-gray-900
    outline-none
    transition
    duration-150
    hover:bg-[#f6f8fb]
    focus:bg-[#f6f8fb]
    focus:shadow-[inset_0_0_0_1px_#b9c4d5]
  `;


  /*
   * ==========================================================
   * FINALIZED / ARCHIVED
   * ==========================================================
   */

  if (
    isFinalized ||
    isArchived
  ) {
    return (
      <div
        className="
          mx-auto
          w-full
          max-w-[1600px]
          p-6
          text-gray-800
          max-[800px]:p-3
        "
      >

        {/* ---------------------------------------------------
            STÁTUSZ / FEJLÉC
        --------------------------------------------------- */}

        <div
          className="
            relative
            mb-6
            rounded-xl
            border
            border-[#d9dee7]
            bg-white
            px-6
            py-[22px]
            shadow-[0_2px_6px_rgba(0,0,0,0.04)]
            max-[800px]:p-4
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div className="min-w-0">

              <h2
                className="
                  text-2xl
                  font-bold
                  text-gray-900
                "
              >
                {match.title}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                {match.date} {match.time}
              </p>

            </div>

            <span
              className={`
                shrink-0
                rounded-full
                px-3
                py-1.5
                text-xs
                font-bold
                ${
                  isFinalized
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-600"
                }
              `}
            >
              {isFinalized
                ? "Lezárt"
                : "Archivált"}
            </span>

          </div>

        </div>


        {/* ---------------------------------------------------
            DOKUMENTUM
        --------------------------------------------------- */}

        <div
          className="
            rounded-[10px]
            border
            border-[#d9dee7]
            bg-white
            p-5
            shadow-[0_2px_5px_rgba(0,0,0,0.03)]
          "
        >

          <EventLogDocument
            meta={meta}
            rows={events}
          />

        </div>


        {/* ---------------------------------------------------
            MEGJEGYZÉSEK
        --------------------------------------------------- */}

        <div
          className="
            mt-6
            rounded-[10px]
            border
            border-[#d9dee7]
            bg-white
            p-5
          "
        >

          <h3
            className="
              mb-[14px]
              text-base
              font-bold
              text-gray-800
            "
          >
            Megjegyzések
          </h3>


          {notes.length === 0 ? (
            <p
              className="
                text-[13px]
                text-[#8a94a3]
              "
            >
              Nincs megjegyzés.
            </p>
          ) : (
            <div
              className="
                flex
                flex-col
                gap-2
              "
            >

              {notes.map((note) => (
                <div
                  key={note.id}
                  className="
                    rounded-[7px]
                    border
                    border-[#e1e5eb]
                    bg-[#fafbfc]
                    px-3
                    py-[10px]
                  "
                >

                  <p
                    className="
                      whitespace-pre-wrap
                      text-[13px]
                      leading-[1.5]
                      text-gray-800
                    "
                  >
                    {note.text}
                  </p>

                  <div
                    className="
                      mt-1.5
                      text-[11px]
                      text-[#8a94a3]
                    "
                  >
                    {note.createdBy}
                    {" – "}
                    {note.createdAt}
                  </div>

                </div>
              ))}

            </div>
          )}


          {/* Finalized állapotban még írható megjegyzés */}
          {isFinalized && (
            <div
              className="
                mt-[14px]
                flex
                flex-col
                gap-2
              "
            >

              <textarea
                value={newNote}
                onChange={(event) =>
                  setNewNote(
                    event.target.value
                  )
                }
                placeholder="Új megjegyzés..."
                rows={3}
                className="
                  min-h-[70px]
                  w-full
                  resize-y
                  rounded-[7px]
                  border
                  border-[#cfd6e0]
                  px-[10px]
                  py-[9px]
                  text-[13px]
                  outline-none
                  transition
                  focus:border-[#9eabbc]
                "
              />

              <button
                type="button"
                onClick={addNote}
                disabled={!newNote.trim()}
                className="
                  self-end
                  min-h-9
                  rounded-[7px]
                  border
                  border-[#2E7D32]
                  bg-[#2E7D32]
                  px-4
                  py-2
                  text-[13px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#256628]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Megjegyzés hozzáadása
              </button>

            </div>
          )}

        </div>


        {/* ---------------------------------------------------
            VISSZA
        --------------------------------------------------- */}

        <button
          type="button"
          onClick={onBack}
          className="
            mt-6
            rounded-[7px]
            border
            border-gray-300
            bg-white
            px-4
            py-2
            text-[13px]
            font-semibold
            text-gray-700
            transition
            hover:bg-gray-50
          "
        >
          Vissza
        </button>

      </div>
    );
  }


  /*
   * ==========================================================
   * IN PROGRESS
   * ==========================================================
   */

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[1600px]
        p-6
        font-sans
        text-gray-800
        max-[800px]:p-3
      "
    >

      {/* ======================================================
          STÁTUSZ
      ====================================================== */}

      <div
        className="
          mb-4
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-[#C19A5B]
          bg-[#f8fafc]
          px-[14px]
          py-[10px]
          text-[13px]
        "
      >

        <strong className="font-bold">
          Állapot:
        </strong>

        <span className="text-[#596579]">
          Megnyitott
        </span>

      </div>


      {/* ======================================================
          DOKUMENTUM FEJLÉC
      ====================================================== */}

      <section
        className="
          relative
          mb-6
          rounded-xl
          border
          border-[#C19A5B]
          bg-white
          px-6
          py-[22px]
          shadow-[0_2px_6px_rgba(0,0,0,0.04)]
          max-[800px]:p-4
        "
      >

        <div
          className="
            grid
            grid-cols-2
            gap-x-[42px]
            gap-y-1
            pr-[170px]
            max-[1100px]:gap-x-6
            max-[1100px]:pr-[140px]
            max-[800px]:grid-cols-2
            max-[800px]:gap-x-4
            max-[800px]:px-0
            max-[800px]:pt-[72px]
          "
        >

          {/* BAL OSZLOP */}
          <div className="flex min-w-0 flex-col">

            <HeaderField
              label="Meccs megnevezése"
              first
            >
              <input
                type="text"
                value={
                  meta.competitionName || ""
                }
                onChange={(event) =>
                  updateMeta(
                    "competitionName",
                    event.target.value
                  )
                }
                className={`
                  ${headerInputClass}
                  text-[18px]
                  font-bold
                `}
              />
            </HeaderField>


            <HeaderField label="Hazai csapat">
              <input
                type="text"
                value={
                  meta.homeTeam || ""
                }
                onChange={(event) =>
                  updateMeta(
                    "homeTeam",
                    event.target.value
                  )
                }
                className={headerInputClass}
              />
            </HeaderField>


            <HeaderField label="Vendég csapat">
              <input
                type="text"
                value={
                  meta.awayTeam || ""
                }
                onChange={(event) =>
                  updateMeta(
                    "awayTeam",
                    event.target.value
                  )
                }
                className={headerInputClass}
              />
            </HeaderField>


            <HeaderField label="Mérkőzés dátuma">
              <input
                type="text"
                value={
                  meta.matchDate || ""
                }
                onChange={(event) =>
                  updateMeta(
                    "matchDate",
                    event.target.value
                  )
                }
                className={headerInputClass}
              />
            </HeaderField>


            <HeaderField label="Mérkőzés időpontja">
              <input
                type="text"
                value={
                  meta.matchTime || ""
                }
                onChange={(event) =>
                  updateMeta(
                    "matchTime",
                    event.target.value
                  )
                }
                className={headerInputClass}
              />
            </HeaderField>


            <HeaderField label="Szervező">
              <input
                type="text"
                value={
                  meta.organizer || ""
                }
                onChange={(event) =>
                  updateMeta(
                    "organizer",
                    event.target.value
                  )
                }
                className={headerInputClass}
              />
            </HeaderField>

          </div>


          {/* JOBB OSZLOP */}
          <div className="flex min-w-0 flex-col">

            <HeaderField label="Biztonsági vezető">
              <input
                type="text"
                value={
                  meta.securityOfficer?.name ||
                  ""
                }
                onChange={(event) =>
                  updateNestedMeta(
                    "securityOfficer",
                    "name",
                    event.target.value
                  )
                }
                className={headerInputClass}
              />
            </HeaderField>


            <HeaderField label="Biztonsági vezető telefonszáma">
              <input
                type="text"
                value={
                  meta.securityOfficer?.phone ||
                  ""
                }
                onChange={(event) =>
                  updateNestedMeta(
                    "securityOfficer",
                    "phone",
                    event.target.value
                  )
                }
                className={headerInputClass}
              />
            </HeaderField>


            <HeaderField label="Főszervező">
              <input
                type="text"
                value={
                  meta.headOrganizer?.name ||
                  ""
                }
                onChange={(event) =>
                  updateNestedMeta(
                    "headOrganizer",
                    "name",
                    event.target.value
                  )
                }
                className={headerInputClass}
              />
            </HeaderField>


            <HeaderField label="Főszervező telefonszáma">
              <input
                type="text"
                value={
                  meta.headOrganizer?.phone ||
                  ""
                }
                onChange={(event) =>
                  updateNestedMeta(
                    "headOrganizer",
                    "phone",
                    event.target.value
                  )
                }
                className={headerInputClass}
              />
            </HeaderField>


            <HeaderField label="Eseménynapló vezető">
              <input
                type="text"
                value={
                  meta.eventLogLeader || ""
                }
                onChange={(event) =>
                  updateMeta(
                    "eventLogLeader",
                    event.target.value
                  )
                }
                className={headerInputClass}
              />
            </HeaderField>


            <HeaderField label="Egészségügyi szolgálat">
              <div className="flex w-full flex-col">
                <input
                  type="text"
                  value={
                    meta.medicalService
                      ?.organization || ""
                  }
                  onChange={(event) =>
                    updateNestedMeta(
                      "medicalService",
                      "organization",
                      event.target.value
                    )
                  }
                  placeholder="Szervezet"
                  className={headerInputClass}
                />

                <input
                  type="text"
                  value={
                    meta.medicalService
                      ?.person || ""
                  }
                  onChange={(event) =>
                    updateNestedMeta(
                      "medicalService",
                      "person",
                      event.target.value
                    )
                  }
                  placeholder="Személy"
                  className={`
                    ${headerInputClass}
                    text-[13px]
                  `}
                />
              </div>
            </HeaderField>


            <HeaderField label="Katasztrófavédelem">
              <div className="flex w-full flex-col">
                <input
                  type="text"
                  value={
                    meta.disasterProtection
                      ?.organization || ""
                  }
                  onChange={(event) =>
                    updateNestedMeta(
                      "disasterProtection",
                      "organization",
                      event.target.value
                    )
                  }
                  placeholder="Szervezet"
                  className={headerInputClass}
                />

                <input
                  type="text"
                  value={
                    meta.disasterProtection
                      ?.person || ""
                  }
                  onChange={(event) =>
                    updateNestedMeta(
                      "disasterProtection",
                      "person",
                      event.target.value
                    )
                  }
                  placeholder="Személy"
                  className={`
                    ${headerInputClass}
                    text-[13px]
                  `}
                />
              </div>
            </HeaderField>

          </div>

        </div>


        {/* ----------------------------------------------------
            LOGÓ
        ---------------------------------------------------- */}

        <div
          className="
            absolute
            right-6
            top-5
            flex
            h-[72px]
            w-[120px]
            items-center
            justify-center
            max-[1100px]:right-[18px]
            max-[1100px]:w-[100px]
            max-[800px]:right-[14px]
            max-[800px]:top-[14px]
            max-[800px]:h-[55px]
            max-[800px]:w-[90px]
          "
        >

          <img
            src={logo}
            alt="Rába ETO logo"
            className="
              h-[150px]
              w-auto
              max-w-[150px]
              object-contain
            "
          />

        </div>

      </section>


      {/* ======================================================
          ESEMÉNYNAPLÓ
      ====================================================== */}

      <section className="w-full">

        <div
          className="
            mb-[10px]
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <div>
            <h2
              className="
                m-0
                text-[18px]
                font-bold
                text-gray-800
              "
            >
              Eseménynapló
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >
              Az időpont és a kitöltő automatikusan
              kerül rögzítésre az esemény első
              adatbevitelekor. Az intézkedést meghatározó
              személy alapértelmezetten a bejelentkezett
              felhasználó, de szükség esetén kézzel megadható.
            </p>
          </div>

          <span
            className="
              shrink-0
              text-[13px]
              text-gray-500
            "
          >
            {events.length} esemény
          </span>

        </div>


        {/* ----------------------------------------------------
            TÁBLÁZAT
        ---------------------------------------------------- */}

        <div
          className="
            w-full
            rounded-[10px]
            border
            border-[#C19A5B]
            bg-white
            shadow-[0_2px_5px_rgba(0,0,0,0.03)]
          "
        >

          <table
            className="
              w-full
              table-fixed
              border-separate
              border-spacing-0
              text-[13px]
            "
          >

            <colgroup>
              <col className="w-[4%]" />
              <col className="w-[8%]" />
              <col className="w-[11%]" />
              <col className="w-[20%]" />
              <col className="w-[16%]" />
              <col className="w-[35%]" />
              <col className="w-[6%]" />
            </colgroup>


            <thead>

              <tr>

                <th
                  className="
                    h-[42px]
                    border-b
                    border-r
                    border-[#e1e5eb]
                    bg-[#2E7D32]
                    px-[10px]
                    py-2
                    text-center
                    align-middle
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  #
                </th>

                <th
                  className="
                    h-[42px]
                    border-b
                    border-r
                    border-[#e1e5eb]
                    bg-[#2E7D32]
                    px-[10px]
                    py-2
                    text-left
                    align-middle
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  Időpont
                </th>

                <th
                  className="
                    h-[42px]
                    border-b
                    border-r
                    border-[#e1e5eb]
                    bg-[#2E7D32]
                    px-[10px]
                    py-2
                    text-left
                    align-middle
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  Kitöltő
                </th>

                <th
                  className="
                    h-[42px]
                    border-b
                    border-r
                    border-[#e1e5eb]
                    bg-[#2E7D32]
                    px-[10px]
                    py-2
                    text-left
                    align-middle
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  Esemény
                </th>

                <th
                  className="
                    h-[42px]
                    border-b
                    border-r
                    border-[#e1e5eb]
                    bg-[#2E7D32]
                    px-[10px]
                    py-2
                    text-left
                    align-middle
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  Intézkedést meghatározó személy
                </th>

                <th
                  className="
                    h-[42px]
                    border-b
                    border-r
                    border-[#e1e5eb]
                    bg-[#2E7D32]
                    px-[10px]
                    py-2
                    text-left
                    align-middle
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  Intézkedés / eredmény
                </th>

                <th
                  className="
                    h-[42px]
                    border-b
                    border-[#e1e5eb]
                    bg-[#2E7D32]
                    px-[10px]
                    py-2
                    text-center
                    align-middle
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  Törlés
                </th>

              </tr>

            </thead>


            <tbody>

              {events.length === 0 ? (
                <tr>

                  <td
                    colSpan={7}
                    className="
                      p-7
                      text-center
                      text-[13px]
                      text-[#8a94a3]
                    "
                  >
                    Nincs még rögzített esemény.
                  </td>

                </tr>
              ) : (
                events.map(
                  (event, index) => (
                    <EventRow
                      key={event.id}
                      event={event}
                      index={index}
                      updateEvent={
                        updateEvent
                      }
                      deleteEvent={
                        deleteEvent
                      }
                    />
                  )
                )
              )}

            </tbody>

          </table>

        </div>


        {/* ----------------------------------------------------
            ESEMÉNY HOZZÁADÁSA
        ---------------------------------------------------- */}

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <span
            className="
              text-xs
              leading-[1.4]
              text-[#7b8492]
            "
          >
            Új esemény hozzáadásakor az időpont automatikusan rögzítésre kerül.
          </span>

          <button
            type="button"
            onClick={addEvent}
            className="
              min-h-[38px]
              shrink-0
              rounded-[7px]
              border
              border-[#c8d0dc]
              bg-white
              px-4
              py-2
              text-[13px]
              font-semibold
              text-[#344054]
              transition
              hover:border-[#aeb8c7]
              hover:bg-[#f5f7fa]
              hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]
            "
          >
            + Esemény hozzáadása
          </button>

        </div>

      </section>


      {/* ======================================================
          ALSÓ GOMBOK
      ====================================================== */}

      <div
        className="
          mt-6
          flex
          items-center
          justify-end
          gap-[10px]
          border-t
          border-[#e1e5eb]
          pt-[18px]
        "
      >

        <button
          type="button"
          onClick={handleSave}
          className="
            min-h-10
            rounded-[7px]
            border
            border-[#aeb8c7]
            bg-white
            px-5
            py-[9px]
            text-[13px]
            font-semibold
            text-[#344054]
            transition
            active:translate-y-px
            hover:border-[#98a5b7]
            hover:bg-[#f5f7fa]
            hover:shadow-[0_2px_5px_rgba(0,0,0,0.06)]
          "
        >
          Mentés
        </button>


        <button
          type="button"
          onClick={handleFinalize}
          className="
            min-h-10
            rounded-[7px]
            border
            border-[#2E7D32]
            bg-[#2E7D32]
            px-5
            py-[9px]
            text-[13px]
            font-semibold
            text-white
            transition
            active:translate-y-px
            hover:border-[#256628]
            hover:bg-[#256628]
            hover:shadow-[0_2px_5px_rgba(0,0,0,0.1)]
          "
        >
          Finalizálás
        </button>

      </div>


      {/* ======================================================
          VISSZA
      ====================================================== */}

      <button
        type="button"
        onClick={onBack}
        className="
          mt-6
          rounded-[7px]
          border
          border-gray-300
          bg-white
          px-4
          py-2
          text-[13px]
          font-semibold
          text-gray-700
          transition
          hover:bg-gray-50
        "
      >
        Vissza
      </button>

    </div>
  );
}


/*
 * ============================================================
 * EVENT ROW
 * ============================================================
 */

function EventRow({
  event,
  index,
  updateEvent,
  deleteEvent,
}) {
  /*
   * Saját esemény / saját intézkedés mód.
   *
   * Ezt lokális UI state-ben tartjuk, így az üres
   * custom input is megmarad "saját" módban.
   */

  const [customEventMode, setCustomEventMode] =
    useState(
      Boolean(
        event.eventType &&
          !EVENT_OPTIONS.includes(
            event.eventType
          )
      )
    );

  const [customActionMode, setCustomActionMode] =
    useState(
      Boolean(
        event.actionResult &&
          !ACTION_OPTIONS.includes(
            event.actionResult
          )
      )
    );

  const [customReporterMode, setCustomReporterMode] =
    useState(
      event.reporterMode === "custom" ||
        Boolean(
          event.reporterName &&
            event.reporterName !== CURRENT_USER
        )
    );

  const [customDecisionMakerMode, setCustomDecisionMakerMode] =
    useState(
      event.decisionMakerMode === "custom" ||
        Boolean(
          event.decisionMaker &&
            event.decisionMaker !== CURRENT_USER
        )
    );


  /*
   * ----------------------------------------------------------
   * ESEMÉNY TÍPUSA
   * ----------------------------------------------------------
   */

  const handleEventTypeChange = (
    value
  ) => {
    if (value === "__custom__") {
      setCustomEventMode(true);

      updateEvent(
        index,
        "eventType",
        ""
      );

      return;
    }

    setCustomEventMode(false);

    updateEvent(
      index,
      "eventType",
      value
    );
  };


  /*
   * ----------------------------------------------------------
   * INTÉZKEDÉS
   * ----------------------------------------------------------
   */

  const handleActionChange = (
    value
  ) => {
    if (value === "__custom__") {
      setCustomActionMode(true);

      updateEvent(
        index,
        "actionResult",
        ""
      );

      return;
    }

    setCustomActionMode(false);

    updateEvent(
      index,
      "actionResult",
      value
    );
  };


  /*
   * ----------------------------------------------------------
   * VISSZA STANDARD LISTÁHOZ
   * ----------------------------------------------------------
   */

  const resetEventType = () => {
    setCustomEventMode(false);

    updateEvent(
      index,
      "eventType",
      ""
    );
  };


  const resetActionType = () => {
    setCustomActionMode(false);

    updateEvent(
      index,
      "actionResult",
      ""
    );
  };
function PersonSelector({
  event,
  index,
  updateEvent,
  nameField,
  modeField,
  placeholder,
}) {
  const isCustom =
    event[modeField] === "custom" ||
    Boolean(
      event[nameField] &&
        event[nameField] !== CURRENT_USER
    );

  const hasEvent = Boolean(event.eventType);

  const setCurrentUser = () => {
    updateEvent(
      index,
      nameField,
      hasEvent ? CURRENT_USER : ""
    );

    updateEvent(
      index,
      modeField,
      hasEvent ? "current_user" : ""
    );
  };

  const setCustom = () => {
    updateEvent(index, nameField, "");
    updateEvent(index, modeField, "custom");
  };

  if (isCustom) {
    return (
      <div className="flex w-full flex-col gap-1">
        <input
          type="text"
          autoFocus
          value={event[nameField] || ""}
          onChange={(e) =>
            updateEvent(
              index,
              nameField,
              e.target.value
            )
          }
          placeholder={placeholder}
          className="
            min-h-[30px]
            w-full
            rounded-[5px]
            border
            border-transparent
            bg-transparent
            px-[7px]
            py-[5px]
            text-[13px]
            text-gray-800
            outline-none
            transition
            hover:bg-[#f7f9fb]
            focus:border-[#b8c3d4]
            focus:bg-white
          "
        />

        <button
          type="button"
          onClick={setCurrentUser}
          className="
            self-start
            text-[11px]
            text-gray-400
            underline
            hover:text-gray-600
          "
        >
          Vissza a saját felhasználóhoz
        </button>
      </div>
    );
  }

  return (
    <select
      value={hasEvent ? CURRENT_USER : ""}
      onChange={(e) => {
        if (e.target.value === "__custom__") {
          setCustom();
          return;
        }

        setCurrentUser();
      }}
      className="
        min-h-[30px]
        w-full
        cursor-pointer
        rounded-[5px]
        border
        border-transparent
        bg-white
        px-[7px]
        py-[5px]
        pr-[26px]
        text-[13px]
        text-gray-800
        outline-none
        transition
        hover:bg-[#f7f9fb]
        focus:border-[#b8c3d4]
      "
    >
      <option value="">
        —
      </option>

      {hasEvent && (
        <option value={CURRENT_USER}>
          {CURRENT_USER}
        </option>
      )}

      <option value="__custom__">
        Saját megadás...
      </option>
    </select>
  );
}
return (
  <tr className="align-top">

    {/* ====================================================
        SORSZÁM
    ==================================================== */}

    <td
      className="
        border-b
        border-r
        border-[#e4e7ec]
        bg-white
        p-2
        text-center
        align-middle
        font-semibold
        text-[#6b7280]
      "
    >
      {event.sequenceNumber}
    </td>


    {/* ====================================================
        IDŐPONT
    ==================================================== */}

    <td
      className="
        border-b
        border-r
        border-[#e4e7ec]
        bg-white
        p-2
        align-top
      "
    >
      <span
        className="
          block
          px-[7px]
          py-[5px]
          text-center
          text-[13px]
          tabular-nums
          text-gray-700
        "
      >
        {event.time || "—"}
      </span>
    </td>


    {/* ====================================================
        KITÖLTŐ
    ==================================================== */}

    <td
      className="
        border-b
        border-r
        border-[#e4e7ec]
        bg-white
        p-2
        align-top
      "
    >
      <PersonSelector
        event={event}
        index={index}
        updateEvent={updateEvent}
        nameField="reporterName"
        modeField="reporterMode"
        placeholder="Kitöltő neve..."
      />
    </td>


    {/* ====================================================
        ESEMÉNY
    ==================================================== */}

    <td
      className="
        border-b
        border-r
        border-[#e4e7ec]
        bg-white
        p-2
        align-top
      "
    >
      <div
        className="
          flex
          w-full
          flex-col
          gap-[5px]
        "
      >
        {!customEventMode ? (
          <select
            value={
              EVENT_OPTIONS.includes(event.eventType)
                ? event.eventType
                : ""
            }
            onChange={(e) =>
              handleEventTypeChange(e.target.value)
            }
            className="
              min-h-[30px]
              w-full
              cursor-pointer
              rounded-[5px]
              border
              border-transparent
              bg-white
              px-[7px]
              py-[5px]
              pr-[26px]
              text-[13px]
              text-gray-800
              outline-none
              transition
              hover:bg-[#f7f9fb]
              focus:border-[#b8c3d4]
            "
          >
            <option value="">
              Válasszon eseményt...
            </option>

            {EVENT_OPTIONS.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}

            <option value="__custom__">
              Egyéb / saját esemény...
            </option>
          </select>
        ) : (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              autoFocus
              value={event.eventType || ""}
              onChange={(e) =>
                updateEvent(
                  index,
                  "eventType",
                  e.target.value
                )
              }
              placeholder="Saját esemény..."
              className="
                min-h-[30px]
                w-full
                rounded-[5px]
                border
                border-transparent
                bg-transparent
                px-[7px]
                py-[5px]
                text-[13px]
                text-gray-800
                outline-none
                transition
                hover:bg-[#f7f9fb]
                focus:border-[#b8c3d4]
                focus:bg-white
              "
            />

            <button
              type="button"
              onClick={resetEventType}
              className="
                self-start
                text-[11px]
                text-gray-400
                underline
                hover:text-gray-600
              "
            >
              Vissza az eseménylistához
            </button>
          </div>
        )}

        <AutoResizeTextarea
          value={event.eventDescription || ""}
          onChange={(e) =>
            updateEvent(
              index,
              "eventDescription",
              e.target.value
            )
          }
          placeholder="Esemény leírása..."
        />
      </div>
    </td>


    {/* ====================================================
        INTÉZKEDÉST MEGHATÁROZÓ SZEMÉLY
    ==================================================== */}

    <td
      className="
        border-b
        border-r
        border-[#e4e7ec]
        bg-white
        p-2
        align-top
      "
    >
      <PersonSelector
        event={event}
        index={index}
        updateEvent={updateEvent}
        nameField="decisionMaker"
        modeField="decisionMakerMode"
        placeholder="Intézkedést meghatározó személy neve..."
      />
    </td>


    {/* ====================================================
        INTÉZKEDÉS / EREDMÉNY
    ==================================================== */}

    <td
      className="
        border-b
        border-r
        border-[#e4e7ec]
        bg-white
        p-2
        align-top
      "
    >
      <div
        className="
          flex
          w-full
          flex-col
          gap-[5px]
        "
      >
        {!customActionMode ? (
          <select
            value={
              ACTION_OPTIONS.includes(event.actionResult)
                ? event.actionResult
                : ""
            }
            onChange={(e) =>
              handleActionChange(e.target.value)
            }
            className="
              min-h-[30px]
              w-full
              cursor-pointer
              rounded-[5px]
              border
              border-transparent
              bg-white
              px-[7px]
              py-[5px]
              pr-[26px]
              text-[13px]
              text-gray-800
              outline-none
              transition
              hover:bg-[#f7f9fb]
              focus:border-[#b8c3d4]
            "
          >
            <option value="">
              Válasszon intézkedést...
            </option>

            {ACTION_OPTIONS.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}

            <option value="__custom__">
              Egyéb / saját intézkedés...
            </option>
          </select>
        ) : (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              autoFocus
              value={event.actionResult || ""}
              onChange={(e) =>
                updateEvent(
                  index,
                  "actionResult",
                  e.target.value
                )
              }
              placeholder="Saját intézkedés..."
              className="
                min-h-[30px]
                w-full
                rounded-[5px]
                border
                border-transparent
                bg-transparent
                px-[7px]
                py-[5px]
                text-[13px]
                text-gray-800
                outline-none
                transition
                hover:bg-[#f7f9fb]
                focus:border-[#b8c3d4]
                focus:bg-white
              "
            />

            <button
              type="button"
              onClick={resetActionType}
              className="
                self-start
                text-[11px]
                text-gray-400
                underline
                hover:text-gray-600
              "
            >
              Vissza az intézkedéslistához
            </button>
          </div>
        )}
      </div>
    </td>


    {/* ====================================================
        TÖRLÉS
    ==================================================== */}

    <td
      className="
        border-b
        border-[#e4e7ec]
        bg-white
        p-[5px]
        text-center
        align-middle
      "
    >
      <button
        type="button"
        onClick={() => deleteEvent(index)}
        title="Esemény törlése"
        aria-label="Esemény törlése"
        className="
          inline-flex
          h-7
          w-7
          items-center
          justify-center
          rounded-[6px]
          border
          border-[#e0e4ea]
          bg-white
          text-[18px]
          leading-none
          text-[#8b95a5]
          transition
          hover:border-[#e3bcbc]
          hover:bg-[#fff5f5]
          hover:text-[#b42318]
        "
      >
        ×
      </button>
    </td>

  </tr>
);

}


export default EventLogEditor;
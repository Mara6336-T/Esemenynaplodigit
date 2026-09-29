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

/* ============================================================
   SEGÉDFÜGGVÉNYEK
   ============================================================ */

const getNow = () => {
  const now = new Date();

  return {
    iso: now.toISOString(),
    time: now.toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

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

    sequenceNumber: maxSequenceNumber + 1,

    eventType: "",
    time: "",

    reporterName: "",
    reporterMode: "",

    eventDescription: "",

    decisionMaker: "",
    decisionMakerMode: "",

    actionResult: "",

    createdAt: "",
    lastModifiedAt: "",
    createdBy: "",
  };
};

/* ============================================================
   AUTOMATIKUSAN NÖVEKVŐ TEXTAREA
   ============================================================ */

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

/* ============================================================
   PERSON SELECTOR
   ============================================================ */

function PersonSelector({
  event,
  index,
  updateEvent,
  nameField,
  modeField,
  placeholder,
}) {
  const hasEvent = Boolean(event.eventType);

  const isCustom =
    event[modeField] === "custom";

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
          onChange={(eventObject) =>
            updateEvent(
              index,
              nameField,
              eventObject.target.value
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
      value={
        hasEvent && event[nameField] === CURRENT_USER
          ? CURRENT_USER
          : ""
      }
      onChange={(eventObject) => {
        if (
          eventObject.target.value ===
          "__custom__"
        ) {
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

/* ============================================================
   SELECTOR SEGÉD
   ============================================================ */

function OptionSelector({
  value,
  options,
  placeholder,
  customLabel,
  onChange,
}) {
  const isCustom =
    value &&
    !options.includes(value);

  if (isCustom) {
    return (
      <div className="flex flex-col gap-1">
        <input
          type="text"
          autoFocus
          value={value || ""}
          onChange={(event) =>
            onChange(
              event.target.value,
              true
            )
          }
          placeholder={customLabel}
          className="
            min-h-[32px]
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
          onClick={() => onChange("", false)}
          className="
            self-start
            text-[11px]
            text-gray-400
            underline
            hover:text-gray-600
          "
        >
          Vissza a listához
        </button>
      </div>
    );
  }

  return (
    <select
      value={options.includes(value) ? value : ""}
      onChange={(event) => {
        const selected =
          event.target.value;

        if (selected === "__custom__") {
          onChange("", true);
        } else {
          onChange(selected, false);
        }
      }}
      className="
        min-h-[32px]
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
        focus:bg-white
      "
    >
      <option value="">
        {placeholder}
      </option>

      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}

      <option value="__custom__">
        {customLabel}
      </option>
    </select>
  );
}

/* ============================================================
   FEJLÉC MEZŐ
   ============================================================ */

function HeaderField({
  label,
  children,
  first = false,
}) {
  return (
    <div
      className="
        grid
        min-h-[38px]
        grid-cols-[minmax(135px,175px)_minmax(0,1fr)]
        items-center
        gap-x-3
        border-b
        border-[#edf0f4]
        py-[6px]
      "
    >
      <span
        className={`
          min-w-0
          leading-[1.2]
          font-semibold
          text-[#2E7D32]
          ${
            first
              ? "text-[14px]"
              : "text-[13px]"
          }
        `}
      >
        {label}
      </span>

      <div className="min-w-0 w-full">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   ESEMÉNY MEZŐ SEGÉDFÜGGVÉNYEK
   ============================================================ */

const getEventType = (event) =>
  event.eventType || "";

const getAction = (event) =>
  event.actionResult || "";

/* ============================================================
   EVENT ROW - DESKTOP
   ============================================================ */

function EventRow({
  event,
  index,
  updateEvent,
  deleteEvent,
}) {
  return (
    <tr className="align-top">

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
        <div className="flex w-full flex-col gap-[5px]">
          <OptionSelector
            value={getEventType(event)}
            options={EVENT_OPTIONS}
            placeholder="Válasszon eseményt..."
            customLabel="Egyéb / saját esemény..."
            onChange={(value) =>
              updateEvent(
                index,
                "eventType",
                value
              )
            }
          />

          <AutoResizeTextarea
            value={
              event.eventDescription || ""
            }
            onChange={(eventObject) =>
              updateEvent(
                index,
                "eventDescription",
                eventObject.target.value
              )
            }
            placeholder="Esemény leírása..."
          />
        </div>
      </td>

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
        <OptionSelector
          value={getAction(event)}
          options={ACTION_OPTIONS}
          placeholder="Válasszon intézkedést..."
          customLabel="Egyéb / saját intézkedés..."
          onChange={(value) =>
            updateEvent(
              index,
              "actionResult",
              value
            )
          }
        />
      </td>

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
          onClick={() =>
            deleteEvent(index)
          }
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

/* ============================================================
   EVENT CARD - MOBILE
   ============================================================ */

function EventCard({
  event,
  index,
  updateEvent,
  deleteEvent,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-[#C19A5B]
        bg-white
        p-3
        shadow-[0_1px_3px_rgba(0,0,0,0.05)]
      "
    >
      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          gap-3
          border-b
          border-[#edf0f4]
          pb-2
        "
      >
        <div className="flex items-center gap-2">
          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-[#C19A5B]
              text-xs
              font-bold
              text-black
            "
          >
            {event.sequenceNumber}
          </span>

          <span
            className="
              text-xs
              font-semibold
              text-gray-500
            "
          >
            Esemény
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="
              text-xs
              font-semibold
              tabular-nums
              text-[#2E7D32]
            "
          >
            {event.time || "Időpont: —"}
          </span>

          <button
            type="button"
            onClick={() =>
              deleteEvent(index)
            }
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              border
              border-[#e0e4ea]
              bg-white
              text-lg
              text-[#8b95a5]
              hover:border-[#e3bcbc]
              hover:bg-[#fff5f5]
              hover:text-[#b42318]
            "
            aria-label="Esemény törlése"
          >
            ×
          </button>
        </div>
      </div>

      <MobileField label="Kitöltő">
        <PersonSelector
          event={event}
          index={index}
          updateEvent={updateEvent}
          nameField="reporterName"
          modeField="reporterMode"
          placeholder="Kitöltő neve..."
        />
      </MobileField>

      <MobileField label="Esemény">
        <OptionSelector
          value={getEventType(event)}
          options={EVENT_OPTIONS}
          placeholder="Válasszon eseményt..."
          customLabel="Egyéb / saját esemény..."
          onChange={(value) =>
            updateEvent(
              index,
              "eventType",
              value
            )
          }
        />
      </MobileField>

      <MobileField label="Esemény leírása">
        <AutoResizeTextarea
          value={
            event.eventDescription || ""
          }
          onChange={(eventObject) =>
            updateEvent(
              index,
              "eventDescription",
              eventObject.target.value
            )
          }
          placeholder="Esemény leírása..."
          className="
            border
            border-[#e1e5eb]
            bg-[#fafbfc]
          "
        />
      </MobileField>

      <MobileField label="Intézkedést meghatározó személy">
        <PersonSelector
          event={event}
          index={index}
          updateEvent={updateEvent}
          nameField="decisionMaker"
          modeField="decisionMakerMode"
          placeholder="Személy neve..."
        />
      </MobileField>

      <MobileField
        label="Intézkedés / eredmény"
        last
      >
        <OptionSelector
          value={getAction(event)}
          options={ACTION_OPTIONS}
          placeholder="Válasszon intézkedést..."
          customLabel="Egyéb / saját intézkedés..."
          onChange={(value) =>
            updateEvent(
              index,
              "actionResult",
              value
            )
          }
        />
      </MobileField>
    </div>
  );
}

/* ============================================================
   MOBILE FIELD
   ============================================================ */

function MobileField({
  label,
  children,
  last = false,
}) {
  return (
    <div
      className={`
        ${!last ? "mb-3" : ""}
      `}
    >
      <label
        className="
          mb-1
          block
          text-[11px]
          font-bold
          uppercase
          tracking-wide
          text-[#2E7D32]
        "
      >
        {label}
      </label>

      {children}
    </div>
  );
}

/* ============================================================
   FŐ KOMPONENS
   ============================================================ */

function EventLogEditor({
  match,
  onBack,
}) {
  const [status, setStatus] = useState(
    match.status
  );

  /* ==========================================================
     META
     ========================================================== */

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

  /* ==========================================================
     ESEMÉNYEK
     ========================================================== */

  const [events, setEvents] = useState(() =>
    (eventRows || []).map((event) => ({
      ...event,
    }))
  );

  /* ==========================================================
     MEGJEGYZÉSEK
     ========================================================== */

  const [notes, setNotes] = useState([
    {
      id: 1,
      text: "Teszt megjegyzés.",
      createdAt: "2026-03-10 09:15",
      createdBy: "Teszt Elek",
    },
  ]);

  const [newNote, setNewNote] = useState("");
  const [generatedPdfUrl, setGeneratedPdfUrl] =
    useState(null);

  const pdfContentRef = useRef(null);

  const [isGeneratingPdf, setIsGeneratingPdf] =
    useState(false);

  /* ==========================================================
     PDF OBJECT URL TAKARÍTÁSA
     ========================================================== */

  useEffect(() => {
    return () => {
      if (generatedPdfUrl) {
        window.URL.revokeObjectURL(
          generatedPdfUrl
        );
      }
    };
  }, [generatedPdfUrl]);

  /* ==========================================================
     STÁTUSZ
     ========================================================== */

  const isEditable =
    status === "in_progress";

  const isFinalized =
    status === "finalized";

  const isArchived =
    status === "archived";

  /* ==========================================================
     META MÓDOSÍTÁS
     ========================================================== */

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

  /* ==========================================================
     ESEMÉNY HOZZÁADÁSA
     ========================================================== */

  const addEvent = () => {
    if (!isEditable) return;

    setEvents((previous) => [
      ...previous,
      createEmptyEvent(previous),
    ]);
  };

  /* ==========================================================
     ESEMÉNY MÓDOSÍTÁSA
     ========================================================== */

  const updateEvent = (
    index,
    field,
    value
  ) => {
    if (!isEditable) return;

    setEvents((previous) =>
      previous.map(
        (event, currentIndex) => {
          if (
            currentIndex !== index
          ) {
            return event;
          }

          const updatedEvent = {
            ...event,
            [field]: value,
          };

          const hasEventData =
            Boolean(
              updatedEvent.eventType?.trim()
            ) ||
            Boolean(
              updatedEvent.eventDescription?.trim()
            ) ||
            Boolean(
              updatedEvent.actionResult?.trim()
            );

          if (
            !event.time &&
            hasEventData
          ) {
            const now = getNow();

            updatedEvent.time =
              now.time;

            if (
              updatedEvent.reporterMode !==
              "custom"
            ) {
              updatedEvent.reporterName =
                CURRENT_USER;

              updatedEvent.reporterMode =
                "current_user";
            }

            if (
              updatedEvent.decisionMakerMode !==
              "custom"
            ) {
              updatedEvent.decisionMaker =
                CURRENT_USER;

              updatedEvent.decisionMakerMode =
                "current_user";
            }

            updatedEvent.createdBy =
              CURRENT_USER;

            updatedEvent.createdAt =
              now.iso;

            updatedEvent.lastModifiedAt =
              now.iso;
          } else if (event.time) {
            updatedEvent.lastModifiedAt =
              new Date().toISOString();
          }

          return updatedEvent;
        }
      )
    );
  };

  /* ==========================================================
     ESEMÉNY TÖRLÉSE
     ========================================================== */

  const deleteEvent = (index) => {
    if (!isEditable) return;

    setEvents((previous) =>
      previous.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  };

  /* ==========================================================
     MEGJEGYZÉS HOZZÁADÁSA
     ========================================================== */

  const addNote = () => {
    if (!isFinalized) return;

    const text =
      newNote.trim();

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
        createdBy:
          CURRENT_USER,
      },
    ]);

    setNewNote("");
  };

  /* ==========================================================
     ESEMÉNYNAPLÓ MENTÉSE
     ========================================================== */

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
  };

  /* ==========================================================
     FINALIZÁLÁS
     ========================================================== */

  const handleFinalize = async () => {
    if (
      !isEditable ||
      isGeneratingPdf
    ) {
      return;
    }

    if (!pdfContentRef.current) {
      console.error(
        "PDF tartalom nem található."
      );
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const html =
        pdfContentRef.current.innerHTML;

      const res = await fetch(
        "http://localhost:3000/generate-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            html,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "PDF generálás sikertelen."
        );
      }

      const blob =
        await res.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      if (generatedPdfUrl) {
        window.URL.revokeObjectURL(
          generatedPdfUrl
        );
      }

      setGeneratedPdfUrl(url);

      setStatus("finalized");

      console.log(
        "Eseménynapló sikeresen véglegesítve."
      );
    } catch (error) {
      console.error(
        "PDF generálási hiba:",
        error
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  /* ==========================================================
     FEJLÉC INPUT CLASS
     ========================================================== */

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

  /* ==========================================================
     FINALIZED / ARCHIVED
     ========================================================== */

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
          px-6
          py-6
          text-gray-800
          max-[800px]:px-3
          max-[800px]:py-3
        "
      >

        {/* ====================================================
            PDF DOKUMENTUM
            ==================================================== */}

        <div
          className="
            w-full
            overflow-hidden
            rounded-[8px]
            border
            border-[#d9dee7]
            bg-[#525659]
          "
        >
          {generatedPdfUrl ? (
            <iframe
              src={generatedPdfUrl}
              title="Eseménynapló PDF"
              className="
                block
                h-[85vh]
                w-full
                border-0
              "
            />
          ) : (
            <div
              className="
                flex
                min-h-[400px]
                items-center
                justify-center
                p-6
                text-sm
                text-white
              "
            >
              A PDF dokumentum nem érhető el.
            </div>
          )}
        </div>

        {/* ====================================================
            FINALIZED - MEGJEGYZÉSEK
            ==================================================== */}

        {isFinalized && (
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
                mb-4
                text-base
                font-bold
                text-gray-800
              "
            >
              Megjegyzések
            </h3>

            {notes.length > 0 && (
              <div
                className="
                  mb-4
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
                min-h-[80px]
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

            <div
              className="
                mt-3
                flex
                justify-end
                gap-2
                max-[600px]:flex-col
              "
            >
              <button
                type="button"
                onClick={onBack}
                className="
                  min-h-10
                  rounded-[7px]
                  border
                  border-gray-300
                  bg-white
                  px-5
                  py-2
                  text-[13px]
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  max-[600px]:w-full
                "
              >
                Vissza
              </button>

              <button
                type="button"
                onClick={addNote}
                disabled={!newNote.trim()}
                className="
                  min-h-10
                  rounded-[7px]
                  border
                  border-[#2E7D32]
                  bg-[#2E7D32]
                  px-5
                  py-2
                  text-[13px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#256628]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  max-[600px]:w-full
                "
              >
                Megjegyzés mentése
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            ARCHIVED - CSAK MEGLÉVŐ MEGJEGYZÉSEK
            ==================================================== */}

        {isArchived &&
          notes.length > 0 && (
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
                  mb-4
                  text-base
                  font-bold
                  text-gray-800
                "
              >
                Megjegyzések
              </h3>

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
            </div>
          )}

        {/* ====================================================
            VISSZA
            ==================================================== */}

        <button
          type="button"
          onClick={onBack}
          className="
            mt-6
            rounded-[7px]
            border
            border-gray-300
            bg-white
            px-5
            py-2
            text-[13px]
            font-semibold
            text-gray-700
            transition
            hover:bg-gray-50
            max-[600px]:w-full
          "
        >
          Vissza
        </button>

      </div>
    );
  }

  /* ==========================================================
     EDITABLE / IN PROGRESS
     ========================================================== */

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
          REJTETT PDF FORRÁS
          ====================================================== */}

      <div
        ref={pdfContentRef}
        style={{
          position: "absolute",
          left: "-100000px",
          top: 0,
          width: "1120px",
          background: "white",
        }}
      >
        <EventLogDocument
          meta={meta}
          rows={events}
        />
      </div>

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
            grid-cols-1
            gap-x-[42px]
            gap-y-1
            pt-[72px]
            lg:grid-cols-2
            lg:pt-0
            lg:pr-[170px]
            max-[1100px]:lg:gap-x-6
          "
        >

          {/* BAL / ELSŐ OSZLOP */}

          <div
            className="
              flex
              min-w-0
              flex-col
            "
          >
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

          {/* JOBB / MÁSODIK OSZLOP */}

          <div
            className="
              flex
              min-w-0
              flex-col
            "
          >
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
              <div
                className="
                  flex
                  w-full
                  flex-col
                "
              >
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
              <div
                className="
                  flex
                  w-full
                  flex-col
                "
              >
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

        {/* LOGÓ */}

        <div
          className="
            absolute
            right-6
            top-1
            z-10
            flex
            h-[90px]
            w-[120px]
            items-start
            justify-center
            max-[800px]:right-[14px]
            max-[800px]:top-[4px]
            max-[800px]:h-[65px]
            max-[800px]:w-[90px]
          "
        >
          <img
            src={logo}
            alt="Rába ETO logo"
            className="
              block
              h-[105px]
              w-[105px]
              object-contain
              max-[800px]:h-[70px]
              max-[800px]:w-[70px]
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
            items-end
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
                max-w-[900px]
                text-xs
                leading-[1.5]
                text-gray-500
              "
            >
              Az időpont és a kitöltő automatikusan
              kerül rögzítésre az esemény első
              adatbevitelekor. Az intézkedést
              meghatározó személy alapértelmezetten
              a bejelentkezett felhasználó.
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

        {/* ====================================================
            DESKTOP TÁBLÁZAT
            ==================================================== */}

        <div
          className="
            hidden
            w-full
            overflow-x-auto
            rounded-[10px]
            border
            border-[#C19A5B]
            bg-white
            shadow-[0_2px_5px_rgba(0,0,0,0.03)]
            lg:block
          "
        >
          <table
            className="
              w-full
              min-w-[1000px]
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
                {[
                  "#",
                  "Időpont",
                  "Kitöltő",
                  "Esemény",
                  "Intézkedést meghatározó személy",
                  "Intézkedés / eredmény",
                  "Törlés",
                ].map((title, index) => (
                  <th
                    key={title}
                    className={`
                      h-[42px]
                      border-b
                      border-r
                      border-[#e1e5eb]
                      bg-[#2E7D32]
                      px-[10px]
                      py-2
                      align-middle
                      text-xs
                      font-bold
                      text-white
                      ${
                        index === 0 ||
                        index === 6
                          ? "text-center"
                          : "text-left"
                      }
                    `}
                  >
                    {title}
                  </th>
                ))}
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

        {/* ====================================================
            MOBILE / TABLET KÁRTYÁK
            ==================================================== */}

        <div
          className="
            flex
            flex-col
            gap-3
            lg:hidden
          "
        >
          {events.length === 0 ? (
            <div
              className="
                rounded-xl
                border
                border-[#C19A5B]
                bg-white
                p-6
                text-center
                text-[13px]
                text-[#8a94a3]
              "
            >
              Nincs még rögzített esemény.
            </div>
          ) : (
            events.map(
              (event, index) => (
                <EventCard
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
        </div>

        {/* ====================================================
            ESEMÉNY HOZZÁADÁSA
            ==================================================== */}

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            gap-4
            max-[600px]:flex-col
            max-[600px]:items-stretch
          "
        >
          <span
            className="
              text-xs
              leading-[1.4]
              text-[#7b8492]
            "
          >
            Új esemény hozzáadásakor az időpont
            automatikusan rögzítésre kerül.
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
              max-[600px]:w-full
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
          max-[600px]:flex-col-reverse
          max-[600px]:items-stretch
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
            max-[600px]:w-full
          "
        >
          Mentés
        </button>

        <button
          type="button"
          onClick={handleFinalize}
          disabled={isGeneratingPdf}
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
            disabled:cursor-not-allowed
            disabled:opacity-60
            max-[600px]:w-full
          "
        >
          {isGeneratingPdf
            ? "PDF generálása..."
            : "Véglegesítés"}
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
          max-[600px]:w-full
        "
      >
        Vissza
      </button>

    </div>
  );
}

export default EventLogEditor;

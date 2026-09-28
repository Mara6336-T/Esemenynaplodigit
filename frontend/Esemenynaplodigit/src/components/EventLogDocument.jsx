// EventLogDocument.jsx

export default function EventLogDocument({ meta, rows }) {
  return (
    <div className="p-10 text-sm font-sans text-black">

        {/* Header Container */}
        <div style={{ position: 'relative', marginBottom: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90px' }}>

        {/* 1. Header Title (Pushed down further) */}
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0', marginTop: '50px', textAlign: 'center' }}>
            Eseménynapló
        </h1>

        {/* 2. Logo */}
        <img
            src={window.location.origin + "/logo.png"}
            alt="logo"
            style={{ position: 'absolute', right: '28px', top: '10px', height: '150px', width: 'auto', objectFit: 'contain' }}/>
        </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6">
        <Field label="Versenyrendszer megnevezése" value={meta.competitionName} />
        <Field
          label="Mérkőző csapatok megnevezése (hazai / vendég)"
          value={`${meta.homeTeam} – ${meta.awayTeam}`}
        />
        <Field
          label="Mérkőzés ideje"
          value={`${meta.matchDate} ${meta.matchTime}`}
        />
        <Field
          label="Biztonsági felelős megnevezése és elérhetősége"
          value={`${meta.securityOfficer.name} ${meta.securityOfficer.phone}`}
        />
        <Field label="Rendező vagy rendező szerv megnevezése" value={meta.organizer} />
        <Field
          label="Főrendező megnevezése"
          value={`${meta.headOrganizer.name} ${meta.headOrganizer.phone}`}
        />
        <Field label="Eseménynaplót vezető megnevezése és elérhetősége" value={meta.eventLogLeader} />
        <Field
          label="Egészségügyi biztosításért felelős szervezet és személy"
          value={`${meta.medicalService.organization} – ${meta.medicalService.person}`}
        />
        <Field
          label="Katasztrófavédelmi biztosításért felelős szervezet és személy"
          value={`${meta.disasterProtection.organization} – ${meta.disasterProtection.person}`}
        />
      </div>

            {/* Táblázat egységes, vékony fekete elválasztó vonalakkal */}
            <table style={{ 
            marginLeft: '26px',
            width: '90%', 
            borderCollapse: 'collapse', // Elnyeli a cellák közötti réseket (megszünteti a blokkosodást)
            borderSpacing: '0',         // Teljesen nullázza a távolságokat
            marginTop: '32px',
            tableLayout: 'fixed'
            }}>
            <thead>
                <tr>
                <Th style={{ width: '40px', textAlign: 'center' }}>SSZ</Th>
                <Th>Időpont</Th>
                <Th style={{ width: '110px' }}>Eseményt jelentő</Th>
                <Th style={{ width: '150px', textAlign: 'center' }}>Esemény leírása</Th>
                <Th style={{ width: '110px' }}>Intézkedést meghatározó</Th>
                <Th style={{ width: '150px', textAlign: 'center' }}>Intézkedés / eredmény</Th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                <tr key={index}>
                    <Td style={{ textAlign: 'center' }}>{index + 1}</Td>
                    <Td>{row.time}</Td>
                    <Td>{row.reporterName}</Td>
                    <Td>{row.eventDescription}</Td>
                    <Td>{row.decisionMaker}</Td>
                    <Td>{row.actionResult}</Td>
                </tr>
                ))}
            </tbody>
            </table>

    </div>
  );
}

/* ---------- helpers ---------- */

function Field({ label, value }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'baseline', 
      gap: '16px', 
      paddingTop: '4px', 
      paddingBottom: '4px',
      marginLeft: '36px' 
    }}>
         {/* A felirat (label) stílusa: félkövér */}
      <span style={{ 
        fontWeight: 'bold', 
        fontSize: '16px', 
        width: '374px', // Ez felel meg a w-72-nek
        flexShrink: 0,
        color: '#000000'
      }}>
        {label}:
      </span>
      <span className="border-b border-black flex-1 text-sm font-medium">
        {value}
      </span>
    </div>
  );
}
function Th({ children, style = {} }) {
  return (
    <th style={{
      border: '1px solid #000000', // Vékony, tiszta fekete elválasztó vonal
      padding: '8px',
      fontWeight: 'bold',
      fontSize: '12px',
      backgroundColor: '#d1d5db',  // Sötétebb szürke címsor háttér
      color: '#000000',
      textAlign: 'left',
      ...style
    }}>
      {children}
    </th>
  );
}

function Td({ children, style = {} }) {
  return (
    <td style={{
      border: '1px solid #000000', // Vékony, tiszta fekete elválasztó vonal
      padding: '8px',
      verticalAlign: 'top',
      fontSize: '12px',
      color: '#000000',
      wordBreak: 'break-word',     // Hosszú szövegek esetén sem tolódik szét a táblázat
      ...style
    }}>
      {children}
    </td>
  );
}
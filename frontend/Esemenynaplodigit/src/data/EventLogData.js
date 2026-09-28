// eventLogData.js (or fetched from API)

export const eventMeta = {
  competitionName: "Mérkőzéselnevezés",
  homeTeam: "RabaETO",
  awayTeam: "Nem RábaETO",
  matchDate: "2026.04.12.",
  matchTime: "14.52",
  securityOfficer: {
    name: "Valaki",
    phone: "03635379"
  },
  organizer: "Szervező",
  headOrganizer: {
    name: "Valaki2",
    phone: "03654892"
  },
  eventLogLeader: "Valaki3",
  medicalService: {
    organization: "Szervezet",
    person: "Személy"
  },
  disasterProtection: {
    organization: "Katasztrofavédelmisek",
    person: "Valaki4"
  }
};
export const eventRows = [
  {
    id: 1,
    sequenceNumber: 1,
    eventType: "Kapunyitás",
    time: "14:55",
    reporterName: "Valaki5",
    eventDescription: "Esemény leírása, hosszasan elemezve",
    decisionMaker: "Valaki5",
    actionResult: "Intézkedés eredménye",
    createdAt: "2026-04-12T14:55:00",
    lastModifiedAt: "2026-04-12T14:55:00",
    createdBy: "Valaki5",
  },

  {
    id: 2,
    sequenceNumber: 2,
    eventType: "Biztonsági esemény",
    time: "15:10",
    reporterName: "Valaki6",
    eventDescription: "Esemény leírása",
    decisionMaker: "Valaki6",
    actionResult: "Intézkedés eredménye",
    createdAt: "2026-04-12T15:10:00",
    lastModifiedAt: "2026-04-12T15:10:00",
    createdBy: "Valaki6",
  },

  {
    id: 3,
    sequenceNumber: 3,
    eventType: "Egyéb",
    time: "15:42",
    reporterName: "Valaki7",
    eventDescription: "Esemény leírása",
    decisionMaker: "Valaki7",
    actionResult: "Intézkedés eredménye",
    createdAt: "2026-04-12T15:42:00",
    lastModifiedAt: "2026-04-12T15:42:00",
    createdBy: "Valaki7",
  },

  {
    id: 4,
    sequenceNumber: 4,
    eventType: "Technikai esemény",
    time: "16:20",
    reporterName: "Valaki8",
    eventDescription: "Esemény leírása",
    decisionMaker: "Valaki8",
    actionResult: "Intézkedés eredménye",
    createdAt: "2026-04-12T16:20:00",
    lastModifiedAt: "2026-04-12T16:20:00",
    createdBy: "Valaki8",
  },
];
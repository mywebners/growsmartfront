/**
 * Official / admissions portal URLs for common Pakistan universities.
 * Used to attach clickable links when AI returns university names.
 */
export const PAKISTAN_UNI_PORTALS = [
  { match: ["nust", "national university of sciences"], url: "https://nust.edu.pk/", label: "NUST" },
  { match: ["lums", "lahore university of management"], url: "https://lums.edu.pk/", label: "LUMS" },
  { match: ["fast", "nuces", "national university of computer"], url: "https://nu.edu.pk/", label: "FAST-NUCES" },
  { match: ["iba karachi", "institute of business administration"], url: "https://www.iba.edu.pk/", label: "IBA Karachi" },
  { match: ["comsats", "cui "], url: "https://www.comsats.edu.pk/", label: "COMSATS" },
  { match: ["giki", "ghulam ishaq"], url: "https://giki.edu.pk/", label: "GIKI" },
  { match: ["uet lahore", "university of engineering and technology, lahore"], url: "https://www.uet.edu.pk/", label: "UET Lahore" },
  { match: ["ned", "neduet"], url: "https://www.neduet.edu.pk/", label: "NED University" },
  { match: ["pieas"], url: "https://www.pieas.edu.pk/", label: "PIEAS" },
  { match: ["aga khan", "aku"], url: "https://www.aku.edu/", label: "Aga Khan University" },
  { match: ["punjab university", "university of the punjab", "pu lahore"], url: "https://pu.edu.pk/", label: "University of the Punjab" },
  { match: ["karachi university", "university of karachi", "uok"], url: "https://uok.edu.pk/", label: "University of Karachi" },
  { match: ["quaid", "qau"], url: "https://www.qau.edu.pk/", label: "Quaid-i-Azam University" },
  { match: ["air university"], url: "https://www.au.edu.pk/", label: "Air University" },
  { match: ["bahria"], url: "https://www.bahria.edu.pk/", label: "Bahria University" },
  { match: ["iqra"], url: "https://iqra.edu.pk/", label: "Iqra University" },
  { match: ["szabist"], url: "https://www.szabist.edu.pk/", label: "SZABIST" },
  { match: ["itu", "information technology university"], url: "https://itu.edu.pk/", label: "ITU Lahore" },
  { match: ["habib university"], url: "https://habib.edu.pk/", label: "Habib University" },
  { match: ["ustb", "university of science and technology bannu"], url: "https://www.ustb.edu.pk/", label: "UST Bannu" },
  { match: ["nca", "national college of arts"], url: "https://www.nca.edu.pk/", label: "NCA" },
  { match: ["fccu", "forman christian"], url: "https://www.fccollege.edu.pk/", label: "FCCU" },
  { match: ["gc university", "gcu lahore"], url: "https://www.gcu.edu.pk/", label: "GCU Lahore" },
  { match: ["numl"], url: "https://www.numl.edu.pk/", label: "NUML" },
  { match: ["riphah"], url: "https://www.riphah.edu.pk/", label: "Riphah International" },
  { match: ["uol", "university of lahore"], url: "https://www.uol.edu.pk/", label: "University of Lahore" },
  { match: ["superior"], url: "https://www.superior.edu.pk/", label: "Superior University" },
  { match: ["umt", "university of management and technology"], url: "https://www.umt.edu.pk/", label: "UMT" },
  { match: ["dau", "dow university"], url: "https://www.duhs.edu.pk/", label: "Dow University" },
  { match: ["kmu", "khyber medical"], url: "https://kmu.edu.pk/", label: "KMU" },
  { match: ["must", "mirpur university"], url: "https://www.must.edu.pk/", label: "MUST" },
  { match: ["uet taxila"], url: "https://www.uettaxila.edu.pk/", label: "UET Taxila" },
  { match: ["uet peshawar"], url: "https://www.uetpeshawar.edu.pk/", label: "UET Peshawar" },
];

export function resolveUniversityPortal(name, aiUrl) {
  const rawUrl = String(aiUrl || "").trim();
  if (/^https?:\/\//i.test(rawUrl)) {
    return rawUrl;
  }
  const n = String(name || "").toLowerCase();
  for (const row of PAKISTAN_UNI_PORTALS) {
    if (row.match.some((m) => n.includes(m))) {
      return row.url;
    }
  }
  // Google search fallback so user still gets a direct jump
  return `https://www.google.com/search?q=${encodeURIComponent(`${name} official website Pakistan university`)}`;
}

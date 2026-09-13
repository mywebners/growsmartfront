/**
 * Rule-based Study / Educational Guidance.
 * Ranks ALL realistic options with human-friendly reasons (not a single pick).
 */

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function avg(marks, keys) {
  const vals = keys.map((k) => num(marks?.[k])).filter((n) => n > 0);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function overallAvg(marks) {
  const vals = Object.values(marks || {})
    .map((v) => num(v))
    .filter((n) => n > 0);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function strengthLabel(score) {
  if (score >= 80) return "Strong fit";
  if (score >= 65) return "Good fit";
  if (score >= 50) return "Possible with effort";
  return "Tough path right now";
}

function toneByScore(score) {
  if (score >= 80) return "You already show solid strength here — this path looks natural for you.";
  if (score >= 65) return "You have a real chance here if you stay consistent and build a bit more.";
  if (score >= 50) return "This is possible, but you would need focused improvement and extra practice.";
  return "This path may feel heavy with your current marks — consider stronger-fit options first.";
}

const INTER_META = {
  "pre-med": {
    title: "FSc Pre-Medical",
    icon: "🩺",
    tagline: "Biology-focused path toward medicine and life sciences",
  },
  "pre-eng": {
    title: "FSc Pre-Engineering",
    icon: "⚙️",
    tagline: "Math + Physics / Chemistry path toward engineering",
  },
  ics: {
    title: "ICS (Computer Science)",
    icon: "💻",
    tagline: "Computing path toward IT, software, and tech degrees",
  },
  arts: {
    title: "FA / Arts & Humanities",
    icon: "🎭",
    tagline: "Languages, social sciences, design, and civic studies",
  },
  icom: {
    title: "I.Com / Commerce",
    icon: "📊",
    tagline: "Business, accounting, and commerce foundation",
  },
};

/** Build ranked rows from ordered ids — order is final (not re-sorted later). */
function rowsFromOrder(order, scoreById, reasonById) {
  return order.map((id, index) => {
    const meta = INTER_META[id];
    const raw = clampScore(scoreById[id] ?? 50);
    // Lock display rank: #1 highest band, then step down; raw marks only tint the band
    const score = clampScore(94 - index * 11 + (raw / 100) * 6);
    return {
      id,
      title: meta.title,
      icon: meta.icon,
      tagline: meta.tagline,
      score,
      reason: reasonById[id] || meta.tagline,
    };
  });
}

function enrichKeepOrder(rows) {
  return rows.map((r, i) => {
    const score = clampScore(r.score);
    return {
      ...r,
      score,
      fit: strengthLabel(score),
      humanNote: toneByScore(score),
      rank: i + 1,
    };
  });
}


/**
 * Matric Biology:
 * Show only Pre-Medical, Pre-Engineering, ICS, I.Com.
 * Chem high + Bio low  → Pre-Eng, Pre-Med, ICS, I.Com
 * Bio >= Chem          → Pre-Med, Pre-Eng, ICS, I.Com
 */
function rankInterForBio(marks) {
  const bio = num(marks.Biology);
  const chem = num(marks.Chemistry);
  const phy = num(marks.Physics);
  const eng = num(marks.English);

  const preMedScore = bio * 0.5 + chem * 0.3 + phy * 0.1 + eng * 0.1;
  const preEngScore = chem * 0.4 + phy * 0.4 + eng * 0.1 + bio * 0.1;
  const icsScore = phy * 0.35 + eng * 0.3 + chem * 0.2 + bio * 0.15;
  const icomScore = eng * 0.55 + overallAvg(marks) * 0.45;

  // Explicit human rule from product owner
  const order =
    chem > bio
      ? ["pre-eng", "pre-med", "ics", "icom"]
      : ["pre-med", "pre-eng", "ics", "icom"];

  return rowsFromOrder(
    order,
    {
      "pre-med": preMedScore,
      "pre-eng": preEngScore,
      ics: icsScore,
      icom: Math.min(icomScore, 70),
    },
    {
      "pre-med":
        chem > bio
          ? `Biology (${bio}%) is behind Chemistry (${chem}%), so Pre-Medical stays possible but not #1 right now.`
          : `Biology (${bio}%) leads Chemistry (${chem}%) — Pre-Medical is your strongest related path.`,
      "pre-eng":
        chem > bio
          ? `Chemistry (${chem}%) is stronger than Biology (${bio}%), with Physics (${phy}%) — Pre-Engineering fits better first.`
          : `Physics (${phy}%) and Chemistry (${chem}%) still support Pre-Engineering as a solid #2 option.`,
      ics: `ICS is a flexible third path using Physics (${phy}%) and English (${eng}%).`,
      icom: `I.Com is a practical backup if you prefer business over pure science (English ${eng}%).`,
    }
  );
}

/**
 * Matric Computer:
 * NEVER show Pre-Medical.
 * Computer strongest (and ahead of Physics/Math) → ICS, Pre-Eng, I.Com
 * Computer weaker but Physics + Math strong     → Pre-Eng, ICS, I.Com
 * (Math stands in for Chemistry-style science strength in Matric CS subjects.)
 */
function rankInterForCs(marks) {
  const computer = num(marks.Computer);
  const math = num(marks.Math);
  const phy = num(marks.Physics);
  const eng = num(marks.English);
  const sciencePair = avg(marks, ["Physics", "Math"]);

  const computerIsBest =
    computer >= phy && computer >= math && computer >= eng;
  const computerStrong = computerIsBest || (computer >= phy && computer > math);
  // User rule: Computer low + Physics good + Chemistry(Math) good → Pre-Eng first
  const preferPreEng =
    !computerStrong && phy >= 60 && math >= 60 && sciencePair >= computer;

  const order = preferPreEng
    ? ["pre-eng", "ics", "icom"]
    : ["ics", "pre-eng", "icom"];

  const icsScore = computer * 0.45 + math * 0.3 + phy * 0.15 + eng * 0.1;
  const preEngScore = phy * 0.4 + math * 0.4 + eng * 0.1 + computer * 0.1;
  const icomScore = eng * 0.5 + overallAvg(marks) * 0.5;

  return rowsFromOrder(
    order,
    {
      ics: icsScore,
      "pre-eng": preEngScore,
      icom: Math.min(icomScore, 68),
    },
    {
      ics: computerStrong
        ? `Computer (${computer}%) is your strongest subject versus Math (${math}%) / Physics (${phy}%) — ICS should lead.`
        : `ICS stays strong with Computer (${computer}%) and Math (${math}%), even if Pre-Engineering edges ahead.`,
      "pre-eng": preferPreEng
        ? `Computer (${computer}%) is softer, while Physics (${phy}%) and Math (${math}%) are solid — Pre-Engineering first.`
        : `Pre-Engineering remains open via Physics (${phy}%) and Math (${math}%).`,
      icom: `I.Com is a safer commerce-style option if tech/engineering feels too heavy (English ${eng}%).`,
    }
  );
}

/**
 * Matric Arts:
 * NEVER Pre-Medical, NEVER Pre-Engineering.
 * Default: I.Com #1, ICS #2 (if workable), FA Arts #3.
 */
function rankInterForArts(marks) {
  const eng = num(marks.English);
  const social = avg(marks, ["Civics", "History", "Geography"]);
  const oa = overallAvg(marks);

  // Arts students can try ICS mainly via English + overall consistency
  const canDoIcsWell = eng >= 65 || (eng >= 55 && oa >= 60);

  const order = canDoIcsWell
    ? ["icom", "ics", "arts"]
    : ["icom", "arts", "ics"];

  const icomScore = eng * 0.45 + social * 0.35 + oa * 0.2;
  const icsScore = eng * 0.55 + oa * 0.45;
  const artsScore = social * 0.7 + eng * 0.3;

  return rowsFromOrder(
    order,
    {
      icom: icomScore + 4,
      ics: Math.min(icsScore, canDoIcsWell ? icsScore : 62),
      arts: artsScore,
    },
    {
      icom: `From an Arts Matric background, I.Com is usually the most natural #1 (English ${eng}%).`,
      ics: canDoIcsWell
        ? `Your English (${eng}%) is strong enough that ICS can sit at #2 — doable with extra Math effort.`
        : `ICS is possible later, but English (${eng}%) / overall marks suggest keeping it lower for now.`,
      arts: `FA / Arts keeps your Civics–History–Geography strengths (${Math.round(social)}% avg) in play.`,
    }
  );
}

const BACHELOR_BY_INTER = {
  "pre-med": [
    {
      id: "mbbs",
      title: "MBBS / Medical pathway",
      icon: "🏥",
      focus: ["Biology", "Chemistry"],
      weight: { Biology: 0.4, Chemistry: 0.35, Physics: 0.15, English: 0.1 },
      note: "Highly competitive — strong Pre-Medical marks matter a lot.",
    },
    {
      id: "pharm",
      title: "Pharm-D / Pharmacy",
      icon: "💊",
      focus: ["Chemistry", "Biology"],
      weight: { Chemistry: 0.4, Biology: 0.3, Physics: 0.15, English: 0.15 },
      note: "Great if Chemistry is one of your stronger subjects.",
    },
    {
      id: "dpt",
      title: "DPT / Physiotherapy",
      icon: "🦴",
      focus: ["Biology", "Physics"],
      weight: { Biology: 0.4, Physics: 0.3, Chemistry: 0.15, English: 0.15 },
      note: "Fits students who like Biology with solid Physics.",
    },
    {
      id: "bs-bio",
      title: "BS Biology / Biotechnology",
      icon: "🧬",
      focus: ["Biology", "Chemistry"],
      weight: { Biology: 0.45, Chemistry: 0.3, English: 0.15, Physics: 0.1 },
      note: "Strong academic path in life sciences without MBBS pressure.",
    },
    {
      id: "nursing",
      title: "BS Nursing / Allied Health",
      icon: "💙",
      focus: ["Biology", "English"],
      weight: { Biology: 0.4, English: 0.25, Chemistry: 0.2, Physics: 0.15 },
      note: "Practical healthcare careers with growing demand.",
    },
  ],
  "pre-eng": [
    {
      id: "be-eng",
      title: "BE / BS Engineering",
      icon: "🏗️",
      focus: ["Math", "Physics"],
      weight: { Math: 0.4, Physics: 0.35, Chemistry: 0.15, English: 0.1 },
      note: "Civil, Mechanical, Electrical and related engineering fields.",
    },
    {
      id: "bs-cs-from-eng",
      title: "BS Computer Science / Software",
      icon: "🖥️",
      focus: ["Math", "Physics"],
      weight: { Math: 0.45, Physics: 0.25, English: 0.2, Chemistry: 0.1 },
      note: "Many Pre-Eng students move successfully into computing.",
    },
    {
      id: "architecture",
      title: "Architecture / Design Engineering",
      icon: "🏛️",
      focus: ["Math", "Physics", "English"],
      weight: { Math: 0.3, Physics: 0.3, English: 0.25, Chemistry: 0.15 },
      note: "Needs spatial thinking plus decent Math and English.",
    },
    {
      id: "bs-physics",
      title: "BS Physics / Applied Sciences",
      icon: "🔭",
      focus: ["Physics", "Math"],
      weight: { Physics: 0.45, Math: 0.35, Chemistry: 0.1, English: 0.1 },
      note: "Good if Physics is clearly your strongest subject.",
    },
  ],
  ics: [
    {
      id: "bs-cs",
      title: "BS Computer Science",
      icon: "💻",
      focus: ["Computer", "Math"],
      weight: { Computer: 0.4, Math: 0.35, Physics: 0.15, English: 0.1 },
      note: "Classic degree path after ICS.",
    },
    {
      id: "bs-se",
      title: "BS Software Engineering",
      icon: "🧩",
      focus: ["Computer", "Math"],
      weight: { Computer: 0.4, Math: 0.3, English: 0.2, Physics: 0.1 },
      note: "More product/build focused; English also helps.",
    },
    {
      id: "bs-it",
      title: "BS Information Technology",
      icon: "🌐",
      focus: ["Computer", "English"],
      weight: { Computer: 0.4, English: 0.25, Math: 0.2, Physics: 0.15 },
      note: "Broader IT roles — networks, systems, support, and apps.",
    },
    {
      id: "bs-ds",
      title: "BS Data Science / AI pathway",
      icon: "📈",
      focus: ["Math", "Computer"],
      weight: { Math: 0.45, Computer: 0.3, Physics: 0.15, English: 0.1 },
      note: "Best when Math is strong and you enjoy problem-solving.",
    },
  ],
  arts: [
    {
      id: "ba-psy",
      title: "BS / BA Psychology",
      icon: "🧠",
      focus: ["Psychology", "English"],
      weight: { Psychology: 0.4, English: 0.3, Sociology: 0.2, Civics: 0.1 },
      note: "Fits students who enjoy people, behavior, and writing.",
    },
    {
      id: "bba",
      title: "BBA / Business Studies",
      icon: "💼",
      focus: ["English", "Civics"],
      weight: { English: 0.35, Civics: 0.25, Sociology: 0.2, Psychology: 0.2 },
      note: "Open business path with communication strength.",
    },
    {
      id: "law",
      title: "LLB / Law pathway",
      icon: "⚖️",
      focus: ["English", "Civics"],
      weight: { English: 0.4, Civics: 0.35, Sociology: 0.15, Psychology: 0.1 },
      note: "Needs strong English and civic understanding.",
    },
    {
      id: "masscom",
      title: "Mass Communication / Media",
      icon: "📺",
      focus: ["English", "Sociology"],
      weight: { English: 0.45, Sociology: 0.25, Psychology: 0.2, Civics: 0.1 },
      note: "Creative and communication-heavy careers.",
    },
  ],
  icom: [
    {
      id: "bcom",
      title: "B.Com / BS Accounting",
      icon: "📒",
      focus: ["English"],
      weight: { English: 0.5 },
      note: "Natural next step after Commerce / I.Com.",
      useOverall: true,
    },
    {
      id: "bba-com",
      title: "BBA",
      icon: "💼",
      focus: ["English"],
      weight: { English: 0.45 },
      note: "Business administration with commerce foundation.",
      useOverall: true,
    },
    {
      id: "ca-acc",
      title: "CA / ACCA pathway",
      icon: "🧮",
      focus: ["English"],
      weight: { English: 0.35 },
      note: "Demanding professional path — consistency matters more than one subject.",
      useOverall: true,
      overallBoost: true,
    },
  ],
};

function scoreBachelorOption(option, marks) {
  const entries = Object.entries(option.weight || {});
  let score = 0;
  let used = 0;
  entries.forEach(([sub, w]) => {
    if (marks?.[sub] != null && marks[sub] !== "") {
      score += num(marks[sub]) * w;
      used += w;
    }
  });
  if (option.useOverall) {
    const oa = overallAvg(marks);
    score = used > 0 ? score + oa * (1 - used) : oa;
  } else if (used > 0 && used < 0.99) {
    score = score / used;
  } else if (used === 0) {
    score = overallAvg(marks);
  }
  if (option.overallBoost) {
    score = score * 0.55 + overallAvg(marks) * 0.45;
  }
  return score;
}

function sortAndEnrich(rows) {
  return rows
    .map((r) => ({
      ...r,
      score: clampScore(r.score),
      fit: strengthLabel(clampScore(r.score)),
      humanNote: toneByScore(clampScore(r.score)),
    }))
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

/**
 * Recommend Intermediate courses from Matric stream + marks.
 * Stream gates:
 * - Bio  → Pre-Med / Pre-Eng / ICS / I.Com (marks decide order)
 * - CS   → NEVER Pre-Med → ICS / Pre-Eng / I.Com
 * - Arts → NEVER Pre-Med / Pre-Eng → I.Com / ICS / FA Arts
 */
export function recommendIntermediate({ matricStream, matricMarks }) {
  const stream = matricStream;
  const marks = matricMarks || {};

  let rows = [];
  if (stream === "bio") rows = rankInterForBio(marks);
  else if (stream === "cs") rows = rankInterForCs(marks);
  else if (stream === "arts") rows = rankInterForArts(marks);

  const ranked = enrichKeepOrder(rows);
  const top = ranked[0];

  return {
    goal: "inter",
    headline: top
      ? `Based on your Matric ${labelStream(stream)} marks, here is where you stand`
      : "We need your Matric details to guide you",
    summary: top
      ? `Your strongest match right now is ${top.title}. Below you can see every allowed option for your Matric stream — ranked from your marks.`
      : "Please complete Matric subjects first.",
    recommendations: ranked,
    tips: buildInterTips(stream, marks, ranked),
  };
}

/**
 * Recommend Bachelor paths from Matric + Intermediate.
 */
export function recommendBachelor({
  matricStream,
  matricMarks,
  intermediateStream,
  intermediateMarks,
}) {
  const interId = intermediateStream;
  const marks = intermediateMarks || {};
  const options = BACHELOR_BY_INTER[interId] || BACHELOR_BY_INTER.arts;

  const rows = options.map((opt) => ({
    id: opt.id,
    title: opt.title,
    icon: opt.icon,
    tagline: opt.note,
    score: scoreBachelorOption(opt, marks),
    reason: buildBachelorReason(opt, marks),
  }));

  const ranked = sortAndEnrich(rows);
  const top = ranked[0];
  const matricAvg = overallAvg(matricMarks);
  const interAvg = overallAvg(marks);

  return {
    goal: "bachelor",
    headline: top
      ? `Looking at your ${labelInter(interId)} marks, here are honest Bachelor directions`
      : "We need Intermediate details to guide Bachelor choices",
    summary: top
      ? `Your best current fit is ${top.title}. We ranked every relevant Bachelor path from your marks — not just the “dream” option — so you can plan realistically.`
      : "Please complete Intermediate subjects first.",
    recommendations: ranked,
    context: {
      matricStream,
      matricAvg: clampScore(matricAvg),
      intermediateStream: interId,
      intermediateAvg: clampScore(interAvg),
    },
    tips: buildBachelorTips(interId, marks, ranked, matricAvg),
  };
}

function labelStream(stream) {
  const map = {
    bio: "Science (Biology)",
    cs: "Science (Computer)",
    arts: "Arts & Commerce",
  };
  return map[stream] || stream || "Matric";
}

function labelInter(id) {
  const map = {
    "pre-med": "FSc Pre-Medical",
    "pre-eng": "FSc Pre-Engineering",
    ics: "ICS",
    arts: "FA / Arts",
    icom: "I.Com",
  };
  return map[id] || id || "Intermediate";
}

function buildBachelorReason(opt, marks) {
  const focus = (opt.focus || [])
    .filter((s) => marks?.[s] != null && marks[s] !== "")
    .map((s) => `${s} (${num(marks[s])}%)`);
  if (focus.length) {
    return `We weighed ${focus.join(", ")} most for this path. ${opt.note}`;
  }
  return opt.note;
}

function buildInterTips(stream, marks, ranked) {
  const tips = [];
  const oa = overallAvg(marks);

  if (stream === "bio") {
    const bio = num(marks.Biology);
    const chem = num(marks.Chemistry);
    if (chem > bio) {
      tips.push(
        `Chemistry (${chem}%) is ahead of Biology (${bio}%), so Pre-Engineering is ranked above Pre-Medical — that matches your current strengths.`
      );
    } else {
      tips.push(
        `Biology (${bio}%) is at least as strong as Chemistry (${chem}%), so Pre-Medical leads for you.`
      );
    }
    tips.push("From Matric Biology we only suggest Pre-Medical, Pre-Engineering, ICS, and I.Com.");
  }

  if (stream === "cs") {
    tips.push(
      "From Matric Computer, Pre-Medical is never shown — that path needs a Biology background."
    );
    const computer = num(marks.Computer);
    const phy = num(marks.Physics);
    const math = num(marks.Math);
    if (computer >= phy && computer >= math) {
      tips.push(
        `Computer (${computer}%) is your top science signal, so ICS is favored over Pre-Engineering.`
      );
    } else if (phy >= 60 && math >= 60) {
      tips.push(
        `Physics (${phy}%) and Math (${math}%) are healthier than Computer (${computer}%), so Pre-Engineering can lead.`
      );
    }
  }

  if (stream === "arts") {
    tips.push(
      "From Matric Arts, Pre-Medical and Pre-Engineering are never shown."
    );
    tips.push(
      "I.Com usually stays on top; ICS can rise to #2 when English/overall marks support it."
    );
  }

  if (oa < 50) {
    tips.push(
      "Your overall Matric average is on the lower side — pick a stream you can manage, and plan tuition or self-study early."
    );
  } else if (oa >= 75) {
    tips.push(
      "Your overall Matric average is strong. Still choose a stream you will enjoy for two years."
    );
  }

  if (ranked[1] && ranked[0] && ranked[0].score - ranked[1].score < 8) {
    tips.push(
      `${ranked[0].title} and ${ranked[1].title} are close. Talk to teachers/parents, then pick the one you can stay motivated in.`
    );
  }

  tips.push(
    "Marks guide the fit — interest and consistency finish the journey."
  );
  return tips;
}

function buildBachelorTips(interId, marks, ranked, matricAvg) {
  const tips = [];
  const oa = overallAvg(marks);
  if (oa >= 80) {
    tips.push(
      "Your Intermediate marks are competitive. Still apply to a mix of stretch and safe programs."
    );
  } else if (oa < 55) {
    tips.push(
      "With the current Intermediate average, prioritize programs where admission and coursework feel realistic, then grow from there."
    );
  }
  if (interId === "pre-med" && num(marks.Biology) < 65) {
    tips.push(
      "For MBBS-level pathways, Biology should ideally be stronger. Allied health and BS life-science options can be wiser bridges."
    );
  }
  if (interId === "ics" && num(marks.Math) < 60) {
    tips.push(
      "CS/SE/Data paths lean on Math. If Math is weak, IT or more applied computing programs may feel kinder at first."
    );
  }
  if (matricAvg && Math.abs(matricAvg - oa) >= 15) {
    tips.push(
      "Your Matric and Intermediate averages differ a lot. Universities often look at recent (Inter) performance more closely — use that as your main signal."
    );
  }
  if (ranked[0]) {
    tips.push(
      `If you choose ${ranked[0].title}, start building a small portfolio or entry-test habit early — that often matters as much as marks.`
    );
  }
  return tips;
}

export const STUDY_SUBJECTS = {
  matric: {
    bio: ["Biology", "Chemistry", "Physics", "English"],
    cs: ["Computer", "Math", "Physics", "English"],
    arts: ["Civics", "History", "Geography", "English"],
  },
  intermediate: {
    "pre-med": ["Biology", "Chemistry", "Physics", "English"],
    "pre-eng": ["Math", "Physics", "Chemistry", "English"],
    ics: ["Computer", "Math", "Physics", "English"],
    arts: ["Sociology", "Psychology", "English", "Civics"],
    icom: ["Accounting", "Economics", "Business Math", "English"],
  },
};

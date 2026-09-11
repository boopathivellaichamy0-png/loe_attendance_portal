const assert = require('assert');

console.log("=================================================================");
console.log("           ATTENDANCE PORTAL AUTOMATED TEST SUITE                ");
console.log("=================================================================\n");

// =================================================================
// 1. VERIFY TYPEABLE BRANCH & SHORT FORM AUTO-FILL LOGIC
// =================================================================
console.log("--- 1. Testing Branch Analysis & Auto-Fill ---");

const ENGINEERING_COURSES = [
  { name: "Computer Science and Engineering", short: "CSE" },
  { name: "Artificial Intelligence and Machine Learning", short: "AIML" },
  { name: "Artificial Intelligence and Data Science", short: "AIDS" },
  { name: "Information Technology", short: "IT" },
  { name: "Electronics and Communication Engineering", short: "ECE" },
  { name: "Electrical and Electronics Engineering", short: "EEE" },
  { name: "Mechanical Engineering", short: "MECH" },
  { name: "Civil Engineering", short: "CIVIL" },
  { name: "Biomedical Engineering", short: "BME" },
  { name: "Biotechnology", short: "BT" },
  { name: "Chemical Engineering", short: "CHEM" },
  { name: "Aerospace Engineering", short: "AERO" },
  { name: "Automobile Engineering", short: "AUTO" },
  { name: "Mechatronics Engineering", short: "MCT" },
  { name: "Cyber Security", short: "CS" },
  { name: "Computer Science and Business Systems", short: "CSBS" },
  { name: "Robotics and Automation", short: "RA" },
  { name: "Agricultural Engineering", short: "AGRI" },
  { name: "Marine Engineering", short: "MARINE" },
  { name: "Aeronautical Engineering", short: "AERO" },
  { name: "Food Technology", short: "FT" }
];

function handleDeptType(typed) {
  typed = typed.trim();
  if (!typed) return '';

  const found = ENGINEERING_COURSES.find(c => c.name.toLowerCase() === typed.toLowerCase() || c.short.toLowerCase() === typed.toLowerCase());
  if (found) return found.short;

  const lower = typed.toLowerCase();
  if (lower.includes('machine learning') || lower.includes('aiml')) return 'AIML';
  if (lower.includes('data science') || lower.includes('aids')) return 'AIDS';
  if (lower.includes('computer science') || lower.includes('cse')) return 'CSE';
  if (lower.includes('information technology') || lower.includes('it')) return 'IT';
  if (lower.includes('electronics and communication') || lower.includes('ece')) return 'ECE';
  if (lower.includes('electrical and electronics') || lower.includes('eee')) return 'EEE';
  if (lower.includes('mechanical') || lower.includes('mech')) return 'MECH';
  if (lower.includes('civil')) return 'CIVIL';
  if (lower.includes('biomedical') || lower.includes('bme')) return 'BME';
  if (lower.includes('biotechnology') || lower.includes('biotech') || lower.includes('bt')) return 'BT';
  if (lower.includes('chemical')) return 'CHEM';
  if (lower.includes('aerospace')) return 'AERO';
  if (lower.includes('automobile')) return 'AUTO';
  if (lower.includes('mechatronics') || lower.includes('mct')) return 'MCT';
  if (lower.includes('cyber')) return 'CS';
  if (lower.includes('robotics')) return 'RA';
  if (lower.includes('agricultural') || lower.includes('agriculture')) return 'AGRI';
  if (lower.includes('marine')) return 'MARINE';
  if (lower.includes('aeronautical')) return 'AERO';
  if (lower.includes('food')) return 'FT';

  return 'ENGG';
}

function buildClassString(year, short, section) {
  if (!year) year = 'I';
  if (!short) short = 'ENGG';
  if (!section || section === 'None') {
    return `${year} ${short}`;
  }
  return `${year} ${short} - ${section}`;
}

// TEST 1.1: Exact typed matches
assert.strictEqual(handleDeptType("Computer Science and Engineering"), "CSE");
assert.strictEqual(handleDeptType("Mechanical Engineering"), "MECH");
assert.strictEqual(handleDeptType("Cyber Security"), "CS");
console.log("  [PASS] Exact branch typed values produce correct acronyms");

// TEST 1.2: Conversational / partial typed entries
assert.strictEqual(handleDeptType("dept of computer science"), "CSE");
assert.strictEqual(handleDeptType("artificial intelligence and machine learning"), "AIML");
assert.strictEqual(handleDeptType("robotics engineering"), "RA");
console.log("  [PASS] Conversational/sub-string branch queries match correctly");

// TEST 1.3: Class preview string building
assert.strictEqual(buildClassString("III", "CSE", "A"), "III CSE - A");
assert.strictEqual(buildClassString("IV", "MECH", "None"), "IV MECH");
console.log("  [PASS] Class designation string correctly generated\n");

// =================================================================
// 2. VERIFY HIERARCHICAL ATTENDANCE STORAGE & REPLACEMENT LOGIC
// =================================================================
console.log("--- 2. Testing Attendance Storage Hierarchy (Year -> Month -> Day -> Session) ---");

function saveAttendanceRecord(store, record) {
  const { year, month, day, session } = record;
  if (!store[year]) store[year] = {};
  if (!store[year][month]) store[year][month] = {};
  if (!store[year][month][day]) store[year][month][day] = {};

  const alreadyExisted = Boolean(store[year][month][day][session]);
  // Direct assignment guarantees replacement of previous session data
  store[year][month][day][session] = record;
  return alreadyExisted;
}

function deleteAttendanceSession(store, year, month, day, session) {
  if (store[year] && store[year][month] && store[year][month][day]) {
    delete store[year][month][day][session];
    if (Object.keys(store[year][month][day]).length === 0) {
      delete store[year][month][day];
    }
    if (Object.keys(store[year][month]).length === 0) {
      delete store[year][month];
    }
    if (Object.keys(store[year]).length === 0) {
      delete store[year];
    }
  }
}

// Simulated in-memory store
const mockStorage = {};

// TEST 2.1: First FN entry on 2026-09-11
const record1 = {
  date: "2026-09-11",
  displayDate: "11/09/2026",
  session: "FN",
  year: "2026",
  month: "09",
  day: "11",
  classSection: "III CSE - A",
  deptName: "Computer Science and Engineering",
  totalStudents: 50,
  presentCount: 47,
  absCount: 2,
  odCount: 1,
  percentage: 94,
  absentees: [{ roll: "101", name: "ALICE" }, { roll: "102", name: "BOB" }],
  onDuty: [{ roll: "103", name: "CHARLIE" }]
};

const wasReplaced1 = saveAttendanceRecord(mockStorage, record1);
assert.strictEqual(wasReplaced1, false, "Initial record should not report replacement");
assert.ok(mockStorage["2026"]["09"]["11"]["FN"], "FN session must exist under 2026 -> 09 -> 11");
assert.strictEqual(mockStorage["2026"]["09"]["11"]["FN"].presentCount, 47);
assert.strictEqual(mockStorage["2026"]["09"]["11"]["FN"].percentage, 94);
console.log("  [PASS] Hierarchical storage created: 2026 -> 09 -> 11 -> FN");

// TEST 2.2: Second AN entry on the same day (2026-09-11)
const record2 = {
  date: "2026-09-11",
  displayDate: "11/09/2026",
  session: "AN",
  year: "2026",
  month: "09",
  day: "11",
  classSection: "III CSE - A",
  deptName: "Computer Science and Engineering",
  totalStudents: 50,
  presentCount: 49,
  absCount: 1,
  odCount: 0,
  percentage: 98,
  absentees: [{ roll: "102", name: "BOB" }],
  onDuty: []
};

const wasReplaced2 = saveAttendanceRecord(mockStorage, record2);
assert.strictEqual(wasReplaced2, false, "AN record on same day is separate session, not a replacement");
assert.ok(mockStorage["2026"]["09"]["11"]["AN"], "AN session must exist under 2026 -> 09 -> 11");
assert.strictEqual(mockStorage["2026"]["09"]["11"]["FN"].presentCount, 47, "FN session must remain intact");
assert.strictEqual(mockStorage["2026"]["09"]["11"]["AN"].presentCount, 49, "AN session must have its own counts");
console.log("  [PASS] Both FN and AN coexist concurrently under the same day 11/09/2026");

// TEST 2.3: Same day FN attendance re-submitted (REPLACEMENT RULE)
const record1Updated = {
  date: "2026-09-11",
  displayDate: "11/09/2026",
  session: "FN", // Same session and same day
  year: "2026",
  month: "09",
  day: "11",
  classSection: "III CSE - A",
  deptName: "Computer Science and Engineering",
  totalStudents: 50,
  presentCount: 48, // Updated count (Alice arrived late, excused)
  absCount: 1,
  odCount: 1,
  percentage: 96,
  absentees: [{ roll: "102", name: "BOB" }],
  onDuty: [{ roll: "103", name: "CHARLIE" }]
};

const wasReplaced3 = saveAttendanceRecord(mockStorage, record1Updated);
assert.strictEqual(wasReplaced3, true, "Re-saving FN on 11/09/2026 must trigger replacement flag");
assert.strictEqual(mockStorage["2026"]["09"]["11"]["FN"].presentCount, 48, "FN present count must be replaced with 48");
assert.strictEqual(mockStorage["2026"]["09"]["11"]["FN"].absCount, 1, "FN abs count must be replaced with 1");
assert.strictEqual(mockStorage["2026"]["09"]["11"]["FN"].absentees.length, 1);
assert.strictEqual(mockStorage["2026"]["09"]["11"]["AN"].presentCount, 49, "AN session must not be disturbed by FN replacement");
console.log("  [PASS] REPLACEMENT RULE VERIFIED: Duplicate FN replaces existing record cleanly without disturbing AN");

// TEST 2.4: Storage across multiple days and months
const record3 = {
  date: "2026-10-01",
  displayDate: "01/10/2026",
  session: "FN",
  year: "2026",
  month: "10",
  day: "01",
  classSection: "III CSE - A",
  totalStudents: 50,
  presentCount: 50,
  absCount: 0,
  odCount: 0,
  percentage: 100,
  absentees: [],
  onDuty: []
};
saveAttendanceRecord(mockStorage, record3);
assert.ok(mockStorage["2026"]["10"]["01"]["FN"], "October 1st FN session stored properly");
console.log("  [PASS] Multi-month hierarchy supports seamless navigation across months/years");

// TEST 2.5: Deletion logic and recursive key cleanup
deleteAttendanceSession(mockStorage, "2026", "10", "01", "FN");
assert.strictEqual(mockStorage["2026"]["10"], undefined, "Month '10' removed when its only day has all sessions deleted");
console.log("  [PASS] Deletion removes session and cleans up empty parents cleanly\n");

// =================================================================
// 3. VERIFY AUTOMATIC DATE, TIME & SESSION DETECTION LOGIC
// =================================================================
console.log("--- 3. Testing Automatic Date, Time & Session Detection ---");

function getAutoSession(hours, minutes) {
  return (hours < 12 || (hours === 12 && minutes < 30)) ? 'FN' : 'AN';
}

function computeAutoDateTime(simulatedDate) {
  const yyyy = String(simulatedDate.getFullYear());
  const mm = String(simulatedDate.getMonth() + 1).padStart(2, '0');
  const dd = String(simulatedDate.getDate()).padStart(2, '0');
  const dateVal = `${yyyy}-${mm}-${dd}`;
  const fd = `${dd}/${mm}/${yyyy}`;
  const hours = simulatedDate.getHours();
  const minutes = simulatedDate.getMinutes();
  const session = getAutoSession(hours, minutes);
  const timeStr = simulatedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return { yyyy, mm, dd, dateVal, fd, timeStr, session };
}

// TEST 3.1: Morning Forenoon (FN) - e.g. 10:15 AM
const morning = new Date(2026, 8, 11, 10, 15, 0); // 11 Sept 2026 10:15 AM
const mRes = computeAutoDateTime(morning);
assert.strictEqual(mRes.session, "FN", "10:15 AM must automatically detect Forenoon (FN)");
assert.strictEqual(mRes.fd, "11/09/2026");
console.log("  [PASS] Morning 10:15 AM auto-detects Session: FN & Date: 11/09/2026");

// TEST 3.2: 12:20 PM - still Forenoon period before lunch
const noonBeforeCutoff = new Date(2026, 8, 11, 12, 20, 0);
const nRes = computeAutoDateTime(noonBeforeCutoff);
assert.strictEqual(nRes.session, "FN", "12:20 PM must automatically detect Forenoon (FN)");
console.log("  [PASS] Midday 12:20 PM auto-detects Session: FN");

// TEST 3.3: 12:45 PM - Afternoon (AN) after 12:30 PM cutoff
const noonAfterCutoff = new Date(2026, 8, 11, 12, 45, 0);
const naRes = computeAutoDateTime(noonAfterCutoff);
assert.strictEqual(naRes.session, "AN", "12:45 PM must automatically detect Afternoon (AN)");
console.log("  [PASS] Midday 12:45 PM auto-detects Session: AN");

// TEST 3.4: Afternoon (AN) - e.g. 2:30 PM
const afternoon = new Date(2026, 8, 11, 14, 30, 0);
const aRes = computeAutoDateTime(afternoon);
assert.strictEqual(aRes.session, "AN", "2:30 PM must automatically detect Afternoon (AN)");
console.log("  [PASS] Afternoon 02:30 PM auto-detects Session: AN");

// TEST 3.5: Automated storage entry preserves session
const autoRecord = {
  date: aRes.dateVal,
  displayDate: aRes.fd,
  time: aRes.timeStr,
  session: aRes.session,
  year: aRes.yyyy,
  month: aRes.mm,
  day: aRes.dd,
  classSection: "III CSE - A",
  deptName: "Computer Science and Engineering",
  totalStudents: 50,
  presentCount: 48,
  absCount: 2,
  odCount: 0,
  percentage: 96,
  absentees: [{ roll: "101", name: "ALICE" }, { roll: "102", name: "BOB" }],
  onDuty: [],
  savedAt: afternoon.toISOString()
};
saveAttendanceRecord(mockStorage, autoRecord);
assert.strictEqual(mockStorage["2026"]["09"]["11"]["AN"].session, "AN");
console.log("  [PASS] Automated storage record preserves automatic session");

// TEST 3.6: Report text format does NOT include time string
function buildReportHeader(dateDisplay, session) {
  return `${dateDisplay} (${session})`;
}
const reportHeader = buildReportHeader(aRes.fd, aRes.session);
assert.strictEqual(reportHeader, "11/09/2026 (AN)");
assert.strictEqual(reportHeader.includes(":"), false, "Report text must not include any time format");
console.log("  [PASS] Report text contains only Date and Session: '11/09/2026 (AN)' without time");

// TEST 3.7: Absent and OD counts display as 0 when null or empty
function getStatDisplay(count) {
  return (count === null || count === undefined || count === '') ? 0 : count;
}
assert.strictEqual(getStatDisplay(null), 0);
assert.strictEqual(getStatDisplay(undefined), 0);
assert.strictEqual(getStatDisplay(0), 0);
assert.strictEqual(getStatDisplay(3), 3);
console.log("  [PASS] Absent and OD count correctly evaluate to 0 when null, empty, or 0");

// TEST 3.8: Storage Date dropdown filtering
function filterStorageDays(monthData, selectedDate) {
  const allDays = Object.keys(monthData).sort((a, b) => parseInt(b) - parseInt(a));
  if (!selectedDate || selectedDate === 'all') return allDays;
  return allDays.filter(d => d === selectedDate);
}

const mockMonthData = {
  "10": { "FN": { presentCount: 50 } },
  "11": { "FN": { presentCount: 48 }, "AN": { presentCount: 49 } }
};
assert.deepStrictEqual(filterStorageDays(mockMonthData, 'all'), ["11", "10"]);
assert.deepStrictEqual(filterStorageDays(mockMonthData, '11'), ["11"]);
assert.deepStrictEqual(filterStorageDays(mockMonthData, '10'), ["10"]);
assert.deepStrictEqual(filterStorageDays(mockMonthData, '05'), []);
console.log("  [PASS] Storage Date dropdown correctly filters days ('all' vs specific date)");

// TEST 3.9: In-place report displays full student names without home page redirection
function buildInlineReportData(rec) {
  const absLines = (rec.absCount > 0 && rec.absentees)
    ? rec.absentees.map(a => `${a.roll} - ${a.name}`)
    : [];
  const odLines = (rec.odCount > 0 && rec.onDuty)
    ? rec.onDuty.map(o => `${o.roll} - ${o.name}`)
    : [];
  return {
    heading: `${rec.displayDate} (${rec.session})`,
    classSec: rec.classSection,
    absenteesWithNames: absLines,
    onDutyWithNames: odLines
  };
}

const testRec = {
  displayDate: "11/09/2026",
  session: "FN",
  classSection: "III CSE - A",
  absCount: 2,
  absentees: [{ roll: "101", name: "ALICE SMITH" }, { roll: "102", name: "BOB JONES" }],
  odCount: 1,
  onDuty: [{ roll: "103", name: "CHARLIE BROWN" }]
};

const inlineData = buildInlineReportData(testRec);
assert.strictEqual(inlineData.heading, "11/09/2026 (FN)");
assert.strictEqual(inlineData.absenteesWithNames.length, 2);
assert.strictEqual(inlineData.absenteesWithNames[0], "101 - ALICE SMITH");
assert.strictEqual(inlineData.absenteesWithNames[1], "102 - BOB JONES");
assert.strictEqual(inlineData.onDutyWithNames[0], "103 - CHARLIE BROWN");
console.log("  [PASS] Inline report renders student names (Roll - Name) in-place without page redirect");

// TEST 3.10: 1st tab date option selection parsing
function parseSelectedDate(dateValStr) {
  if (!dateValStr) {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  }
  const [y, m, d] = dateValStr.split('-');
  return `${d}/${m}/${y}`;
}
assert.strictEqual(parseSelectedDate("2026-09-10"), "10/09/2026");
assert.strictEqual(parseSelectedDate("2026-09-11"), "11/09/2026");
console.log("  [PASS] 1st tab Date input correctly processes user-selected dates");

// TEST 3.11: Storage Date options contain only numeric day values
function buildStorageDateOptions(recordedDays) {
  return [
    { value: 'all', text: 'All' },
    ...recordedDays.map(d => ({ value: d, text: String(d) }))
  ];
}
const dateOptions = buildStorageDateOptions(["11", "10", "09"]);
assert.strictEqual(dateOptions[0].text, "All");
assert.strictEqual(dateOptions[1].text, "11");
assert.strictEqual(dateOptions[2].text, "10");
assert.strictEqual(dateOptions[3].text, "09");
assert.ok(dateOptions.slice(1).every(opt => /^\d+$/.test(opt.text)), "Storage date options must contain only numbers");
console.log("  [PASS] Storage Date dropdown correctly populates only numeric day values (e.g., '11', '10')");

// TEST 3.12: Single-click 'GET RESULT' executes calculation and automatic storage
function executeGetResultWorkflow(store, students, absRolls, odRolls, simulatedDate) {
  const totalStudents = Object.keys(students).length;
  const lab = absRolls.length;
  const lod = odRolls.length;
  const pr = totalStudents - lab - lod;
  const npc = Math.round((pr / totalStudents) * 100);

  const autoRes = computeAutoDateTime(simulatedDate);
  const record = {
    date: autoRes.dateVal,
    displayDate: autoRes.fd,
    session: autoRes.session,
    year: autoRes.yyyy,
    month: autoRes.mm,
    day: autoRes.dd,
    totalStudents,
    presentCount: pr,
    absCount: lab,
    odCount: lod,
    percentage: npc,
    absentees: absRolls.map(r => ({ roll: r, name: students[r] || "Unknown" })),
    onDuty: odRolls.map(r => ({ roll: r, name: students[r] || "Unknown" }))
  };

  saveAttendanceRecord(store, record);
  return { record, present: pr, percentage: npc };
}

const studentsRoster = { "101": "ALICE", "102": "BOB", "103": "CHARLIE" };
const runResult = executeGetResultWorkflow(mockStorage, studentsRoster, ["101"], [], new Date(2026, 8, 11, 10, 0, 0));
assert.strictEqual(runResult.present, 2);
assert.strictEqual(runResult.percentage, 67);
assert.ok(mockStorage["2026"]["09"]["11"]["FN"], "Record must be automatically saved in storage on GET RESULT");
assert.strictEqual(mockStorage["2026"]["09"]["11"]["FN"].presentCount, 2);
console.log("  [PASS] GET RESULT workflow successfully calculates attendance AND saves directly to storage");

console.log("\n=================================================================");
console.log("        ALL AUTOMATED DATE, TIME & STORAGE TESTS PASSED!         ");
console.log("=================================================================");

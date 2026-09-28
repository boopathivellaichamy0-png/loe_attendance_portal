# 🎓 College Attendance Portal

A secure, multi-department web application for college faculty to manage student rosters, upload class Excel/CSV sheets, and generate automated attendance reports.

## 🚀 Features

1. **🏛️ Department & Engineering Courses Dropdown**
   - In both **Create Account (Register)** and **Profile Settings**, select from an extensive list of all major engineering branches:
     - Computer Science and Engineering (CSE)
     - Artificial Intelligence and Machine Learning (AIML)
     - Artificial Intelligence and Data Science (AIDS)
     - Information Technology (IT)
     - Electronics and Communication Engineering (ECE)
     - Electrical and Electronics Engineering (EEE)
     - Mechanical Engineering (MECH)
     - Civil Engineering (CIVIL)
     - Biomedical Engineering (BME)
     - Biotechnology (BT)
     - Chemical Engineering (CHEM)
     - Aerospace Engineering (AERO)
     - Automobile Engineering (AUTO)
     - Mechatronics Engineering (MCT)
     - Cyber Security (CS)
     - Computer Science and Business Systems (CSBS)
     - Robotics and Automation (RA), and more.

2. **⚡ Intelligent Auto-Analysis & Class Details Breakdown**
   - **Year**: Select `I (1st Year)`, `II (2nd Year)`, `III (3rd Year)`, or `IV (4th Year)`.
   - **Dept (Short Form)**: Dropdown with all engineering abbreviations.
   - **Section**: Select `A`, `B`, `C`, `D`, `E`, or `None`.
   - **Auto-Fill Analysis**: When a Department Name is chosen from the course dropdown, the application analyzes the name and **automatically selects the corresponding short form** in the Class Details dropdown!
   - **Live Class Designation Preview**: As Year, Dept Short Form, or Section are chosen, the live tag automatically renders the combined designation (e.g. `III CSE - A`).

3. **✏️ Editable Faculty Login ID**
   - In **Profile Settings**, the **Faculty Email / Login ID** is now fully editable.
   - Saves updates directly to your profile with duplicate conflict protection.

4. **📊 Excel & CSV Student Roster Upload & Edit with Mobile Numbers**
   - Drag and drop `.xlsx`, `.xls`, or `.csv` class roster files.
   - Stores students with Roll Number, Name, and **Mobile Number** (`{ [rollNo]: { name, mobile } }`).
   - **✏️ Edit Student**: Modify student roll number, name, or mobile number directly with the interactive edit modal.
   - **🗑️ Delete Student**: Remove students individually.
   - **➕ Add Student**: Add new or transfer students manually with Mobile Number.
   - **📥 Download Template**: Clean `.xlsx` and `.csv` templates pre-configured with Mobile Number fields.

5. **📱 Automated Absent Student Messaging & Instant Dispatch**
   - When attendance is calculated, absent students automatically receive/generate formatted notification messages: `"you are marked as absent in the [day], [date], [session]"` (e.g. `"you are marked as absent in the Friday, 11/09/2026, FN"`).
   - **💬 WhatsApp Integration**: One-click direct link to message absent students via WhatsApp.
   - **📱 SMS Link**: Direct cellular SMS deep link.
   - **📋 One-Click Copy & Batch Copy**: Copy individual absent student messages or all absent messages at once for instant dispatch.

6. **📅 Hierarchical Attendance Storage & Replacement System**
   - **Daily Sessions**: Track both **Forenoon (FN)** and **Afternoon (AN)** attendance sessions.
   - **Data Hierarchy**: Organizes records strictly by **Year $\rightarrow$ Month $\rightarrow$ Day $\rightarrow$ Session (FN/AN)**:
     ```json
     store["2026"]["09"]["11"]["FN"] = { ...record };
     store["2026"]["09"]["11"]["AN"] = { ...record };
     ```
   - **Automatic Replacement Rule**: If attendance is logged again for the same day and session (`FN` or `AN`), it **replaces/overwrites** the existing entry while preserving the other session.
   - **Monthly Register & Report Viewer**:
     - Filter and browse stored records by Year and Month.
     - View side-by-side cards for Forenoon and Afternoon sessions showing Present count, Attendance %, Absentees with Mobile Numbers and Absent Messages, and On-Duty students.
     - Click **"📄 View Report"** to load the complete historical report and stats cards.
   - **📊 Monthly Export**:
     - Export entire monthly attendance registers as **Excel (.xlsx)** or **CSV** spreadsheets with comprehensive student, mobile, and session details.

7. **📏 Dynamic Length & Attendance Calculations**
   - Automatically computes total students dynamically: `Object.keys(studentDict).length`.
   - Computes physical present, absentees, on-duty, and attendance percentages.
   - Five overview stat cards positioned **below the input box** and revealed only on **GET RESULT**.
   - Absent and OD stat numbers remain blank (`&nbsp;`) when 0.
   - One-click formatted report generation with **Copy** and **Save TXT**.

---

## 💻 Quick Start

Open [atteance.html](atteance.html) or [index.html](index.html) in your web browser:
```bash
# Optional local web server
python -m http.server 8000
```
Run tests:
```bash
node test_attendance_system.js
```

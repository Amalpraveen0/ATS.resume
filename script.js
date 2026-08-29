let educationCount = 0;
let projectCount = 0;


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(page) {

    document.querySelectorAll(".page").forEach(section => {

        section.classList.remove("active");

    });


    const target =
        document.getElementById(page);


    if (target) {

        target.classList.add("active");

    }


    document.querySelectorAll(".step").forEach(step => {

        step.classList.remove("active");


        if (step.dataset.page === page) {

            step.classList.add("active");

        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    updatePreview();

}


/* Continue buttons */

document.querySelectorAll(".next").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.next);

    });

});


/* Back buttons */

document.querySelectorAll(".back").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.back);

    });

});


/* Sidebar */

document.querySelectorAll(".step").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});


/* =========================
   HELPER
========================= */

function value(id, fallback = "") {

    const element =
        document.getElementById(id);


    if (!element) {

        return fallback;

    }


    return element.value.trim() || fallback;

}


/* =========================
   EDUCATION
========================= */

document
    .getElementById("addEducation")
    .addEventListener("click", addEducation);


function addEducation() {

    educationCount++;


    const card =
        document.createElement("div");


    card.className =
        "education-card";


    card.innerHTML = `

        <div class="card-title">

            <strong>
                Education ${educationCount}
            </strong>

            <button class="remove">
                Remove
            </button>

        </div>


        <div class="grid">

            <div class="input">

                <label>
                    Degree / Course
                </label>

                <input
                    class="eduDegree"
                    placeholder="BCA">

            </div>


            <div class="input">

                <label>
                    College / Institution
                </label>

                <input
                    class="eduCollege"
                    placeholder="Your College">

            </div>


            <div class="input">

                <label>
                    University
                </label>

                <input
                    class="eduUniversity"
                    placeholder="University">

            </div>


            <div class="input">

                <label>
                    Graduation year
                </label>

                <input
                    class="eduYear"
                    placeholder="2027">

            </div>


            <div class="input">

                <label>
                    CGPA / Percentage
                </label>

                <input
                    class="eduGrade"
                    placeholder="8.2 CGPA">

            </div>

        </div>
    `;


    card
        .querySelector(".remove")
        .addEventListener("click", () => {

            card.remove();

            updatePreview();

        });


    document
        .getElementById("educationList")
        .appendChild(card);

}


/* =========================
   PROJECTS
========================= */

document
    .getElementById("addProject")
    .addEventListener("click", addProject);


function addProject() {

    projectCount++;


    const card =
        document.createElement("div");


    card.className =
        "project-card";


    card.innerHTML = `

        <div class="card-title">

            <strong>
                Project ${projectCount}
            </strong>

            <button class="remove">
                Remove
            </button>

        </div>


        <div class="input">

            <label>
                Project name
            </label>

            <input
                class="projectName"
                placeholder="Portfolio Website">

        </div>


        <div class="input">

            <label>
                Technologies
            </label>

            <input
                class="projectTech"
                placeholder="HTML, CSS, JavaScript">

        </div>


        <div class="input">

            <label>
                Project description
            </label>

            <textarea
                class="projectDescription"
                placeholder="Explain what you built and what you achieved."></textarea>

        </div>

    `;


    card
        .querySelector(".remove")
        .addEventListener("click", () => {

            card.remove();

            updatePreview();

        });


    document
        .getElementById("projectList")
        .appendChild(card);

}


/* =========================
   EXPERIENCE
========================= */

const fresher =
    document.getElementById("fresher");

const experienced =
    document.getElementById("experienced");

const experienceForm =
    document.getElementById("experienceForm");


fresher.addEventListener("click", () => {

    fresher.classList.add("selected");

    experienced.classList.remove("selected");

    experienceForm.classList.add("hidden");

    updatePreview();

});


experienced.addEventListener("click", () => {

    experienced.classList.add("selected");

    fresher.classList.remove("selected");

    experienceForm.classList.remove("hidden");

    updatePreview();

});



/* =========================
   AI PROFESSIONAL SUMMARY
========================= */

function collectEducationForAI() {

    return Array.from(
        document.querySelectorAll(".education-card")
    ).map(card => ({
        degree: card.querySelector(".eduDegree")?.value.trim() || "",
        college: card.querySelector(".eduCollege")?.value.trim() || "",
        university: card.querySelector(".eduUniversity")?.value.trim() || "",
        year: card.querySelector(".eduYear")?.value.trim() || "",
        grade: card.querySelector(".eduGrade")?.value.trim() || ""
    })).filter(item =>
        Object.values(item).some(Boolean)
    );

}


function collectProjectsForAI() {

    return Array.from(
        document.querySelectorAll(".project-card")
    ).map(card => ({
        name: card.querySelector(".projectName")?.value.trim() || "",
        technologies: card.querySelector(".projectTech")?.value.trim() || "",
        description: card.querySelector(".projectDescription")?.value.trim() || ""
    })).filter(item =>
        Object.values(item).some(Boolean)
    );

}


function collectExperienceForAI() {

    if (fresher.classList.contains("selected")) {

        return {
            status: "Fresher"
        };

    }

    return {
        status: "Experienced",
        company: value("company"),
        position: value("position"),
        startDate: value("startDate"),
        endDate: value("endDate"),
        responsibilities: value("responsibilities")
    };

}


async function generateAISummary() {

    const button =
        document.getElementById("generateSummary");

    const status =
        document.getElementById("summaryAIStatus");

    const summary =
        document.getElementById("summaryText");

    if (!button || !summary) {

        return;

    }

    const targetRole =
        value("targetRole");

    const education =
        collectEducationForAI();

    const skills = {
        technical: value("skillInput"),
        tools: value("tools"),
        soft: value("softSkills")
    };

    const projects =
        collectProjectsForAI();

    const experience =
        collectExperienceForAI();

    const extras = {
        certifications: value("certifications"),
        achievements: value("achievements"),
        languages: value("languages")
    };

    const hasDetails =
        targetRole ||
        education.length ||
        Object.values(skills).some(Boolean) ||
        projects.length ||
        Object.values(experience).some(Boolean) ||
        Object.values(extras).some(Boolean);

    if (!hasDetails) {

        status.textContent =
            "Add some resume details first.";

        status.className =
            "ai-status error";

        return;

    }

    button.disabled = true;

    button.textContent =
        "⏳ Generating...";

    status.textContent =
        "Creating your ATS-friendly summary...";

    status.className =
        "ai-status";

    try {

        const response =
            await fetch("/api/generate-summary", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    targetRole,
                    education,
                    skills,
                    experience,
                    projects,
                    extras

                })

            });

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Could not generate summary."
            );

        }

        if (!data.summary) {

            throw new Error(
                "AI did not return a summary."
            );

        }

        summary.value =
            data.summary.trim();

        updatePreview();

        saveData();

        status.textContent =
            "✓ Summary generated successfully.";

        status.className =
            "ai-status success";

    }
    catch (error) {

        console.error(
            "AI summary error:",
            error
        );

        status.textContent =
            "Could not generate summary. Check your API setup.";

        status.className =
            "ai-status error";

    }
    finally {

        button.disabled = false;

        button.textContent =
            "✨ Generate with AI";

    }

}


const generateSummaryButton =
    document.getElementById("generateSummary");

if (generateSummaryButton) {

    generateSummaryButton.addEventListener(
        "click",
        generateAISummary
    );

}


/* =========================
   LIVE UPDATE
========================= */

document.addEventListener("input", () => {

    updatePreview();

    saveData();

});


/* =========================
   PREVIEW
========================= */

function updatePreview() {

    document.getElementById("pName").textContent =
        value("name", "Your Name");


    document.getElementById("pEmail").textContent =
        value("email", "email@example.com");


    document.getElementById("pPhone").textContent =
        value("phone", "Phone");


    document.getElementById("pLocation").textContent =
        value("location", "Location");


    document.getElementById("pLinkedin").textContent =
        value("linkedin", "");


    document.getElementById("pGithub").textContent =
        value("github", "");


    /* SUMMARY */

    document.getElementById("pSummary").textContent =
        value(
            "summaryText",
            "Your professional summary will appear here."
        );


    /* EDUCATION */

    const educationPreview =
        document.getElementById("pEducation");


    educationPreview.innerHTML = "";


    const educationCards =
        document.querySelectorAll(".education-card");


    if (educationCards.length === 0) {

        educationPreview.textContent =
            "Add your education.";

    }
    else {

        educationCards.forEach(card => {

            const degree =
                card.querySelector(".eduDegree").value;

            const college =
                card.querySelector(".eduCollege").value;

            const university =
                card.querySelector(".eduUniversity").value;

            const year =
                card.querySelector(".eduYear").value;

            const grade =
                card.querySelector(".eduGrade").value;


            const item =
                document.createElement("div");


            item.innerHTML = `

                <strong>
                    ${degree || "Degree"}
                </strong>

                <br>

                ${college || "College"}

                ${university
                    ? " | " + university
                    : ""}

                ${year
                    ? " | " + year
                    : ""}

                ${grade
                    ? " | " + grade
                    : ""}

            `;


            item.style.marginBottom =
                "10px";


            educationPreview.appendChild(item);

        });

    }


    /* SKILLS */

    const skills = value("skillInput");

    const tools = value("tools");

    const softSkills = value("softSkills");


    const skillParts = [];


    if (skills) {

        skillParts.push(skills);

    }


    if (tools) {

        skillParts.push(tools);

    }


    if (softSkills) {

        skillParts.push(softSkills);

    }


    document.getElementById("pSkills").textContent =
        skillParts.length
            ? skillParts.join(", ")
            : "Add your skills.";


    /* PROJECTS */

    const projectsPreview =
        document.getElementById("pProjects");


    projectsPreview.innerHTML = "";


    const projects =
        document.querySelectorAll(".project-card");


    if (projects.length === 0) {

        projectsPreview.textContent =
            "Add your projects.";

    }
    else {

        projects.forEach(card => {

            const name =
                card.querySelector(".projectName").value;

            const tech =
                card.querySelector(".projectTech").value;

            const description =
                card.querySelector(".projectDescription").value;


            const item =
                document.createElement("div");


            item.innerHTML = `

                <strong>
                    ${name || "Project"}
                </strong>

                ${
                    tech
                    ? `<br><b>Technologies:</b> ${tech}`
                    : ""
                }

                ${
                    description
                    ? `<br>${description}`
                    : ""
                }

            `;


            item.style.marginBottom =
                "12px";


            projectsPreview.appendChild(item);

        });

    }


    /* EXPERIENCE */

    const experiencePreview =
        document.getElementById("pExperience");


    if (fresher.classList.contains("selected")) {

        experiencePreview.textContent =
            "Fresher";

    }
    else {

        experiencePreview.innerHTML = `

            <strong>
                ${value("position", "Position")}
            </strong>

            <br>

            ${value("company", "Company")}

            <br>

            ${value("startDate")}

            ${
                value("endDate")
                ? " - " + value("endDate")
                : ""
            }

            <br>

            ${value("responsibilities")}

        `;

    }


    /* CERTIFICATIONS */

    document
        .getElementById("pCertifications")
        .textContent =
            value("certifications", "-");


    /* ACHIEVEMENTS */

    document
        .getElementById("pAchievements")
        .textContent =
            value("achievements", "-");


    /* LANGUAGES */

    document
        .getElementById("pLanguages")
        .textContent =
            value("languages", "-");

}


/* =========================
   ATS CHECK
========================= */

function runATSCheck() {

    let score = 0;

    const warnings = [];


    /* NAME */

    if (value("name")) {

        score += 10;

    }
    else {

        warnings.push(
            "❌ Add your full name."
        );

    }


    /* EMAIL */

    if (value("email")) {

        score += 10;

    }
    else {

        warnings.push(
            "❌ Add your email."
        );

    }


    /* PHONE */

    if (value("phone")) {

        score += 10;

    }
    else {

        warnings.push(
            "❌ Add your phone number."
        );

    }


    /* SUMMARY */

    if (
        value("summaryText").length >= 30
    ) {

        score += 15;

    }
    else {

        warnings.push(
            "⚠️ Add a stronger professional summary."
        );

    }


    /* EDUCATION */

    if (
        document.querySelectorAll(
            ".education-card"
        ).length > 0
    ) {

        score += 15;

    }
    else {

        warnings.push(
            "❌ Add at least one education entry."
        );

    }


    /* SKILLS */

    if (
        value("skillInput") ||
        value("tools")
    ) {

        score += 15;

    }
    else {

        warnings.push(
            "⚠️ Add technical skills."
        );

    }


    /* PROJECTS */

    if (
        document.querySelectorAll(
            ".project-card"
        ).length > 0
    ) {

        score += 10;

    }
    else {

        warnings.push(
            "⚠️ Add at least one project."
        );

    }


    /* EXTRAS */

    if (
        value("certifications") ||
        value("achievements")
    ) {

        score += 15;

    }
    else {

        warnings.push(
            "💡 Consider adding certifications or achievements."
        );

    }


    document.getElementById("score").textContent =
        score + "%";


    if (score >= 80) {

        document.getElementById("scoreText").textContent =
            "Excellent ATS readiness!";

    }
    else if (score >= 60) {

        document.getElementById("scoreText").textContent =
            "Good, but you can improve it.";

    }
    else {

        document.getElementById("scoreText").textContent =
            "Your resume needs more information.";

    }


    const warningBox =
        document.getElementById("warnings");


    warningBox.innerHTML = "";


    warnings.forEach(message => {

        const div =
            document.createElement("div");


        div.className =
            "warning";


        div.textContent =
            message;


        warningBox.appendChild(div);

    });


    if (warnings.length === 0) {

        warningBox.innerHTML =
            '<div class="good">✓ No major issues found.</div>';

    }

}


/* =========================
   REVIEW BUTTON
========================= */

document
    .querySelector('[data-next="review"]')
    .addEventListener("click", () => {

        setTimeout(() => {

            runATSCheck();

        }, 100);

    });


/* =========================
   SAVE DATA
========================= */

function saveData() {

    const data = {};


    document
        .querySelectorAll("input, textarea")
        .forEach(input => {

            if (input.id) {

                data[input.id] =
                    input.value;

            }

        });


    localStorage.setItem(
        "atsResumeData",
        JSON.stringify(data)
    );


    document.getElementById("saved").textContent =
        "● Saved";

}


/* =========================
   LOAD DATA
========================= */

function loadData() {

    const saved =
        localStorage.getItem(
            "atsResumeData"
        );


    if (!saved) {

        return;

    }


    try {

        const data =
            JSON.parse(saved);


        Object.keys(data).forEach(key => {

            const input =
                document.getElementById(key);


            if (input) {

                input.value =
                    data[key];

            }

        });

    }
    catch (error) {

        console.log(
            "Saved data could not be loaded."
        );

    }


    updatePreview();

}


/* =========================
   PDF DOWNLOAD
========================= */

document
    .getElementById("generate")
    .addEventListener("click", () => {


        updatePreview();

        runATSCheck();


        const resume =
            document.getElementById("resume");


        const name =
            value(
                "name",
                "Resume"
            )
            .replace(
                /[^a-zA-Z0-9]/g,
                "_"
            );


        const options = {

            margin: [
                0.4,
                0.5,
                0.4,
                0.5
            ],

            filename:
                `${name}_ATS_Resume.pdf`,

            image: {

                type: "jpeg",

                quality: 1

            },

            html2canvas: {

                scale: 2,

                useCORS: true

            },

            jsPDF: {

                unit: "in",

                format: "a4",

                orientation: "portrait"

            },

            pagebreak: {

                mode: [
                    "avoid-all",
                    "css",
                    "legacy"
                ]

            }

        };


        html2pdf()

            .set(options)

            .from(resume)

            .save();

    });


/* =========================
   START
========================= */

loadData();

updatePreview();

document.querySelectorAll(".next").forEach(button => {

    button.addEventListener("click", async () => {

        const nextPage = button.dataset.next;

        if (nextPage === "review") {

            await generateAIResume();

        }

        showPage(nextPage);

    });

});

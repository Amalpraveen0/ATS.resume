const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Server is missing GEMINI_API_KEY."
    });
  }

  try {
    const {
      targetRole,
      education,
      skills,
      experience,
      projects,
      extras
    } = req.body || {};

    const prompt = `
You are an expert ATS resume writer.

Create ONLY a professional summary from the user's real resume information below.

TARGET ROLE:
${targetRole || "Not provided"}

EDUCATION:
${JSON.stringify(education || [], null, 2)}

SKILLS:
${JSON.stringify(skills || {}, null, 2)}

EXPERIENCE:
${JSON.stringify(experience || {}, null, 2)}

PROJECTS:
${JSON.stringify(projects || [], null, 2)}

ADDITIONAL INFORMATION:
${JSON.stringify(extras || {}, null, 2)}

STRICT REQUIREMENTS:
- Write 2 to 4 concise sentences.
- Aim for about 40 to 70 words.
- Make it ATS-friendly and professional.
- Naturally include relevant skills and keywords from the user's information.
- Prioritize the target role when it is provided.
- If the user is a fresher, present them as a student/aspiring professional without inventing experience.
- Never invent skills, experience, education, projects, achievements, certifications, or technologies.
- Do not mention information that is not supported by the user's data.
- Do not use bullet points.
- Do not use headings.
- Do not add quotes around the summary.
- Return ONLY the summary text.
`;

    const geminiResponse = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini API Error:", errText);

      return res.status(500).json({
        error: "Failed to generate AI summary."
      });
    }

    const data = await geminiResponse.json();

    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!summary) {
      return res.status(500).json({
        error: "AI returned an empty summary."
      });
    }

    return res.status(200).json({
      summary
    });

  } catch (error) {
    console.error("Gemini Summary Error:", error);

    return res.status(500).json({
      error: "Failed to generate AI summary."
    });
  }
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
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

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt
    });

    const summary =
      response.output_text?.trim();

    if (!summary) {
      return res.status(500).json({
        error: "AI returned an empty summary."
      });
    }

    return res.status(200).json({
      summary
    });

  } catch (error) {
    console.error("OpenAI Summary Error:", error);

    return res.status(500).json({
      error: "Failed to generate AI summary."
    });
  }
}


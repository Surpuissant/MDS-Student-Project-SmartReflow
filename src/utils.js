import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// config worker
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

const setPrompt = (focus) => {
  return `
    Tu es un assistant chargé d'analyser des documents d'appel d'offre (DOC1 et DOC2).
    Ton rôle est d'identifier les ${focus} filtres les plus pertinents **parmi la liste existante** en te basant sur le CONTENU PRINCIPAL et l'OBJET de l'appel d'offres, pas uniquement sur les moyens de communication utilisés.
    Limite toi à EXACTEMENT ${focus} resultats. Ceci est très important.

    **Critères de priorisation :**
    1. **Secteur d'activité principal** de l'organisation (ex: tourisme, patrimoine, culture)
    2. **Nature des prestations demandées** (ex: contenu éditorial, production vidéo)
    3. **Public cible et finalité** du projet
    4. Les moyens de communication ne sont considérés qu'en dernier recours

    **Instructions :**
    - Analyse d'abord le contexte général (qui est l'organisation, quel est son secteur)
    - Identifie ensuite les thématiques principales des prestations demandées
    - Privilégie les filtres liés au secteur d'activité plutôt qu'aux outils utilisés
    - Si l'organisation est touristique/patrimoniale, privilégie Tourism/History/Culture même si elle fait du marketing

    Voici la liste des filtres à utiliser pour identifier les thèmes :
    [votre liste de filtres existante]

    ATTENTION : **Ne retourne aucun texte supplémentaire en dehors du JSON** qui doit être au format suivant:
    {
      filtres_excel:
        [...]
    }
  `;
};

// ------------------ Extraction texte ------------------ //
export async function extractTextFromFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    text += strings.join(" ") + "\n";
  }
  return text;
}

export async function getFiltersFromDocument(files, focus) {
  try {
    const filesArray = Array.isArray(files) ? files : [files];
    const docs = await Promise.all(
      filesArray.map((file) => extractTextFromFile(file))
    );

    const input_text = docs
      .map((doc, idx) => `DOC${idx + 1}: ${doc}`)
      .join("\n\n");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        max_tokens: 500,
        messages: [
          { role: "system", content: setPrompt(focus) },
          { role: "user", content: input_text },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.log(`Erreur API: ${err}`);
      return;
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    // Remove Markdown code block markers if present
    if (content.startsWith("```")) {
      content = content.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "");
    }
    const filters = JSON.parse(content);
    setOutput(filters);
  } catch (e) {
    console.log(`Erreur: ${e.message}`);
  }
}

import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// config worker
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

const PROMPT_SYSTEM = `
Tu es un assistant chargé d’analyser des documents d’appel d’offre (DOC1 et DOC2).
Ton rôle est d’identifier uniquement les filtres pertinents **parmi la liste existante**. Limite toi à 10 filtres retournés mais seulement les plus pertinents.

Voici la liste des filtres à utiliser pour identifier les thèmes :
Clothing/Fashion, Arts/Culture, Technical, Economics, Food-processing industry, Tourism (general),
General, Environment/Ecology, Touristic accomodation - Hotel, Mountain tourism, Watchmaking/Jewelry,
Bank/Finance/Accounting/Audit, Defense/Military, Marketing/Public relations, Education/Pedagogy,
Mechanical industry, Technical textiles, Energy/Power generation, Law (General), Rurban tourism,
Seaside tourism, Zoology, Ressources humaines, History, Government/Politics, Administrative/Official Documents,
Management sciences, Touristic accomodation - Campsite, Construction industry, Gastronomy,
Corporate Communication, Media, Law (Expert), Science, Culinary arts, Sports (General), Contracts (Law),
Literature, Home textiles, Cooking/Culinary, Oenology/Viticulture, Beauty/Cosmetics, Electronics industry,
Sports (Expert), Agriculture, Film Industry, Automotive industry, Medicine, Psychology, Home equipment,
Law, Ship building industry, Medical (General), Technology, Pharmaceutical industry, Telecommunications,
Lingerie, Furniture, Corporate Social Responsability - CSR, Atout France, Computer science, Aerospace/Aviation,
Business/E-Commerce, Music, Nutrition, Biodiversity, Health/Wellbeing, Catering, Architecture,
Hospitality equipment, Textile machinery industry, Nuclear industry, Touristic accomodation - Other, Veterinary,
Religion, Botany, Transport/Logistics, Medical (Expert), Paramedical (Expert), Patents, Chemical industry,
Business/Trade, Paramedical (General), IT, Photography, Software editing, Geology, Fishery, Railway industry,
Software Localisation, Astronomy, Mathematics/Statistics, Demography, Transcreation, Internet,
Wines and spirits, Human sciences

ATTENTION : **Ne retourne aucun texte supplémentaire en dehors du JSON.**
`;

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

export async function startAnalyse(file1, file2) {
  try {
    const doc1 = await extractTextFromFile(file1);
    const doc2 = await extractTextFromFile(file2);

    const input_text = `DOC1: ${doc1}\n\nDOC2: ${doc2}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        max_tokens: 500,
        messages: [
          { role: "system", content: PROMPT_SYSTEM },
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
    const output_text = data.choices[0].message.content;

    console.log(output_text);
  } catch (e) {
    console.log(`Erreur: ${e.message}`);
  }
}

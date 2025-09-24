import { extractTextFromFile } from "./textExtraction";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

const setPrompt = (focus) => {
  return `
    Tu es un assistant chargé d'analyser des documents d'appel d'offre (DOC1 et DOC2).
    Ton rôle est d'identifier les ${focus} filtres les plus pertinents **parmi la liste existante** ainsi que leurs score de pertinance qui doit se situer entre 0 et 100 (qui sera plus tard traduit en pourcentage) en te basant sur le CONTENU PRINCIPAL et l'OBJET de l'appel d'offres, pas uniquement sur les moyens de communication utilisés.
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

    ATTENTION : **Ne retourne aucun texte supplémentaire en dehors du JSON** qui doit être au format suivant:
    {
      "filtres_excel": [
        { "filter": "NomDuFiltre1", "relevance_score": 92 },
        { "filter": "NomDuFiltre2", "relevance_score": 87 },
        ...
      ]
    }

    EXTREMEMENT IMPORTANT: Le nom du filtre doit être exactement le même que celui dans la liste que je te fournit. Le texte entre parenthèse doit rester.
  `;
};

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
      console.error(`Erreur API: ${err}`);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    if (content.startsWith("```")) {
      content = content.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "");
    }
    const filters = JSON.parse(content);
    return filters;
  } catch (e) {
    console.error(`Erreur: ${e.message}`);
    throw e;
  }
}

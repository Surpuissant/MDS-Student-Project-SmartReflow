async function extractTextFromPDF(file) {
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

async function extractTexteFromDocX(file) {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function extractTextFromFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  switch (ext) {
    case "pdf":
      return extractTextFromPDF(file);
    case "docx":
      return extractTexteFromDocX(file);
    case "txt":
      return await file.text();
    default:
      break;
  }

  throw new Error(`Type de fichier non supporté: ${ext}`);
}

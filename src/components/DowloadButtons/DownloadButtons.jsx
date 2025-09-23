import { useState } from "react";
import ExcelDownload from "../ExcelDownload/ExcelDownload.jsx";

export default function DownloadButtons(excelData) {
  const [output, setOutput] = useState(null);
  const [filteredExcelData, setFilteredExcelData] = useState(null);

  return (
    <div>
      <ExcelDownload filteredData={filteredExcelData} />
    </div>
  );
}

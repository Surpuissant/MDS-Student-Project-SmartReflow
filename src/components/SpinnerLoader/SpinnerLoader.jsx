import React, { useEffect, useState } from "react";

export default function SPLoader() {
  const [text, setText] = useState("");
  const [showImg, setShowImg] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowImg(false);
    }, 3000);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="sp-loader">
      {showImg ? (
        <img src="/sp.svg" alt="loader" width="35px" />
      ) : (
        <h3>{text}</h3>
      )}
    </div>
  );
}

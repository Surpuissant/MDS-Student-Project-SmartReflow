// components/SpinnerLoader.js
import React, { useEffect, useState } from 'react';

export default function SPLoader() {
  const [text, setText] = useState('');
  const [showImg, setShowImg] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowImg(false);
      setText('yes');
    }, 3000);

    return () => clearTimeout(t); // nettoyage
  }, []);

  return (
    <div className="sp-loader">
      {showImg ? (
        // si tu l'as importé : <img src={sp} alt="loader" />
        // si l'image est dans public : <img src="/sp.svg" alt="loader" />
        <img src="/sp.svg" alt="loader" />
      ) : (
        <h3>{text}</h3>
      )}
    </div>
  );
}
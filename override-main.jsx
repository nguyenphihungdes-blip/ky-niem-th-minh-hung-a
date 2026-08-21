import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const fallback = [
  { file: "481121356_1160820002164838_1849105123518326710_n.jpg", title: "Dưới mái trường thân yêu" },
  { file: "1787146981426_1211615717094287656_1211615717094287656_732ecc9b559a8bac3f00f6cc468880b6.jpg", title: "Những người gieo chữ" },
  { file: "500642850_122121580376835738_3437948042854909025_n.jpg", title: "Ngày vui của các em" },
];

const musicUrl = `${import.meta.env.BASE_URL}audio/mong-uoc-ky-niem-xua.mp3`;

function App() {
  const [photos, setPhotos] = useState(fallback);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [entered, setEntered] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const musicPlayer = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}photos.json?ts=${Date.now()}`)
      .then((response) => response.json())
      .then((items) => items.length && setPhotos(items))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!playing || !entered || photos.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % photos.length), 5200);
    return () => window.clearInterval(timer);
  }, [playing, entered, photos.length]);

  const active = photos[index] || photos[0];
  const photoUrl = useMemo(() => `${import.meta.env.BASE_URL}photos/${active.file}`, [active]);

  const move = (step) => {
    setIndex((value) => (value + step + photos.length) % photos.length);
    setPlaying(false);
  };

  const enterAlbum = () => {
    setEntered(true);
    setPlaying(true);
    musicPlayer.current?.play()
      .then(() => setMusicOn(true))
      .catch(() => setMusicOn(false));
  };

  const toggleMusic = () => {
    const next = !musicOn;
    if (next) {
      musicPlayer.current?.play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
    } else {
      musicPlayer.current?.pause();
      setMusicOn(false);
    }
  };

  return (
    <main className={entered ? "album album--entered" : "album"}>
      <audio ref={musicPlayer} className="music-player" src={musicUrl} loop preload="auto" />
      <section className="cover" aria-hidden={entered}>
        <div className="cover__photo" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}photos/${photos[1]?.file || fallback[1].file})` }} />
        <div className="cover__shade" />
        <div className="cover__ornament">✦</div>
        <p className="eyebrow">Kỷ niệm · TH Minh Hưng A</p>
        <h1>Một thời<br /><em>để nhớ</em></h1>
        <p className="cover__copy">Có những tháng năm đi qua, nhưng kỷ niệm thì còn ở lại.</p>
        <button className="enter" onClick={enterAlbum}>
          <span>Mở cuốn kỷ yếu</span><b aria-hidden="true">→</b>
        </button>
        <p className="cover__year">Tập ảnh lưu niệm</p>
      </section>

      <section className="viewer" aria-label="Trình chiếu ảnh kỷ niệm">
        <header className="viewer__header">
          <button className="wordmark" onClick={() => setEntered(false)} aria-label="Trở về trang bìa">
            <span>TH</span> Minh Hưng A
          </button>
          <div className="viewer__meta">Kỷ yếu trực tuyến · {photos.length} khoảnh khắc</div>
        </header>

        <div className="stage">
          <div className="stage__backdrop" style={{ backgroundImage: `url(${photoUrl})` }} />
          <img key={photoUrl} className="stage__image" src={photoUrl} alt={active.title || "Ảnh kỷ niệm TH Minh Hưng A"} />
          <div className="stage__vignette" />
          <div className="stage__caption">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{active.title || "Một khoảnh khắc thân thương"}</h2>
            <p>TH Minh Hưng A</p>
          </div>
        </div>

        <footer className="controls">
          <button onClick={() => move(-1)} aria-label="Ảnh trước">←</button>
          <button className="controls__play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Tạm dừng" : "Tiếp tục"}>
            {playing ? "Ⅱ" : "▶"}
          </button>
          <button onClick={() => move(1)} aria-label="Ảnh sau">→</button>
          <button className={`music ${musicOn ? "music--on" : ""}`} onClick={toggleMusic} aria-label={musicOn ? "Tắt nhạc" : "Bật nhạc"}>
            <span aria-hidden="true">♫</span><b>{musicOn ? "Nhạc đang phát" : "Bật nhạc"}</b>
          </button>
          <div className="progress" aria-hidden="true"><i style={{ width: `${((index + 1) / photos.length) * 100}%` }} /></div>
          <span className="count">{index + 1} / {photos.length}</span>
        </footer>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

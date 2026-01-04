import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const BACKGROUNDS = [
  '/static/backgrounds/slide-1.svg',
  '/static/backgrounds/slide-2.svg',
  '/static/backgrounds/slide-3.svg'
];

export default function Layout({ children }) {
  const backgrounds = useMemo(() => BACKGROUNDS, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousIndex(activeIndex);
      setActiveIndex((index) => (index + 1) % backgrounds.length);
      setIsFading(true);
      const timer = setTimeout(() => setIsFading(false), 900);
      return () => clearTimeout(timer);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, backgrounds.length]);

  return (
    <div className="page">
      <div className="background">
        <div
          className={`background-layer ${isFading ? 'fade-out' : ''}`}
          style={{ backgroundImage: `url(${backgrounds[previousIndex]})` }}
        />
        <div
          className={`background-layer ${isFading ? 'fade-in' : ''}`}
          style={{ backgroundImage: `url(${backgrounds[activeIndex]})` }}
        />
      </div>
      <header className="header">
        <div className="header-content">
          <Link className="logo" to="/">
            花礼提问箱
          </Link>
          <nav className="nav">
            <NavLink to="/" end>
              提交
            </NavLink>
            <NavLink to="/message">留言</NavLink>
            <NavLink to="/history">历史</NavLink>
            <a href="/admin/" target="_blank" rel="noreferrer">
              管理后台
            </a>
          </nav>
        </div>
      </header>
      <main className="content">{children}</main>
      <footer className="footer">
        <span>花礼 harei.cn · 通过 /message 浏览提问箱</span>
      </footer>
    </div>
  );
}

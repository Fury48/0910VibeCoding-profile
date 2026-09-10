"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import profile from "@/data/profile.json";

type Project = {
  title: string;
  description: string;
  url: string;
};

type LinkItem = {
  label: string;
  url: string;
};

const HAGYE: [number, number] = [37.6355, 127.068];
const NOWON: [number, number] = [37.6542, 127.0568];
const SEOUL: [number, number] = [37.5665, 126.978];
const KOREA: [number, number] = [36.35, 127.85];

export default function Home() {
  const [libsReady, setLibsReady] = useState(0);

  useEffect(() => {
    if (libsReady < 3) return;

    const w = window as unknown as { L: any; d3: any; topojson: any };
    const { L, d3, topojson } = w;
    if (!L || !d3 || !topojson) return;

    const sky = document.getElementById("sky") as HTMLCanvasElement;
    const globeEl = document.getElementById("globe") as HTMLCanvasElement;
    const sctx = sky.getContext("2d")!;
    const gctx = globeEl.getContext("2d")!;

    let W = 0;
    let H = 0;
    let dpr = 1;
    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      for (const c of [sky, globeEl]) {
        c.width = W * dpr;
        c.height = H * dpr;
        c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }
    size();
    const onResize = () => {
      size();
      stars = makeStars();
    };
    window.addEventListener("resize", onResize);

    function makeStars() {
      return d3.range(340).map(() => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.25,
        a: Math.random() * 0.7 + 0.15,
        tw: Math.random() * 6.28,
      }));
    }
    let stars = makeStars();
    let starAlpha = 1;
    function drawSky(t: number) {
      sctx.clearRect(0, 0, W, H);
      const g = sctx.createRadialGradient(
        W * 0.5,
        H * 0.5,
        0,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.75
      );
      g.addColorStop(0, "#080d14");
      g.addColorStop(1, "#030508");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, W, H);
      sctx.globalAlpha = starAlpha;
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(t / 700 + s.tw);
        sctx.fillStyle = `rgba(226,236,255,${s.a * tw})`;
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.r, 0, 6.284);
        sctx.fill();
      }
      sctx.globalAlpha = 1;
    }

    const proj = d3.geoOrthographic().clipAngle(90);
    const path = d3.geoPath(proj, gctx);
    let land: any = null;
    let korea: any = null;
    let globeAlpha = 1;
    function drawGlobe(rot: [number, number], scale: number) {
      gctx.clearRect(0, 0, W, H);
      if (globeAlpha <= 0) return;
      gctx.globalAlpha = globeAlpha;
      proj.translate([W / 2, H / 2]).rotate(rot).scale(scale);
      const halo = gctx.createRadialGradient(
        W / 2,
        H / 2,
        scale * 0.92,
        W / 2,
        H / 2,
        scale * 1.35
      );
      halo.addColorStop(0, "rgba(90,160,255,.30)");
      halo.addColorStop(1, "rgba(90,160,255,0)");
      gctx.fillStyle = halo;
      gctx.beginPath();
      gctx.arc(W / 2, H / 2, scale * 1.35, 0, 6.284);
      gctx.fill();
      gctx.beginPath();
      path({ type: "Sphere" });
      const oc = gctx.createRadialGradient(
        W / 2 - scale * 0.3,
        H / 2 - scale * 0.35,
        scale * 0.1,
        W / 2,
        H / 2,
        scale * 1.05
      );
      oc.addColorStop(0, "#12314f");
      oc.addColorStop(1, "#050d18");
      gctx.fillStyle = oc;
      gctx.fill();
      if (land) {
        gctx.beginPath();
        path(land);
        gctx.fillStyle = "#1d3a30";
        gctx.fill();
        gctx.lineWidth = 0.5;
        gctx.strokeStyle = "rgba(140,200,175,.35)";
        gctx.stroke();
      }
      if (korea) {
        gctx.beginPath();
        path(korea);
        gctx.fillStyle = "rgba(120,220,170,.9)";
        gctx.fill();
      }
      const sh = gctx.createRadialGradient(
        W / 2 - scale * 0.35,
        H / 2 - scale * 0.4,
        scale * 0.2,
        W / 2,
        H / 2,
        scale * 1.02
      );
      sh.addColorStop(0, "rgba(255,255,255,.06)");
      sh.addColorStop(0.55, "rgba(0,0,0,0)");
      sh.addColorStop(1, "rgba(0,0,0,.55)");
      gctx.beginPath();
      path({ type: "Sphere" });
      gctx.fillStyle = sh;
      gctx.fill();
      gctx.globalAlpha = 1;
    }

    const mapEl = document.getElementById("map") as HTMLDivElement;
    const map = L.map(mapEl, {
      zoomControl: false,
      attributionControl: true,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
      zoomSnap: 0,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);
    map.setView(KOREA, 6);
    const pin = L.marker(HAGYE, {
      icon: L.divIcon({
        className: "",
        html: '<div class="pin"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      }),
      opacity: 0,
    }).addTo(map);

    function setStage(i: number, name: string, sub: string) {
      const scaleEl = document.getElementById("scale");
      const subEl = document.getElementById("sub");
      if (scaleEl) scaleEl.textContent = name;
      if (subEl) subEl.textContent = sub;
      document.querySelectorAll("#ladder div").forEach((d) => {
        const el = d as HTMLElement;
        el.classList.toggle("on", Number(el.dataset.s) <= i);
      });
    }

    const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));
    const easeIn = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * t);
    let t0: number | null = null;
    let raf = 0;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let done = false;
    const R0 = () => Math.min(W, H) * 0.11;
    const R1 = () => Math.min(W, H) * 7.2;

    function frame(ts: number) {
      if (t0 === null) t0 = ts;
      const t = ts - t0;
      drawSky(ts);
      const HOLD = 1500;
      const ZOOM = 3600;
      const k = ease((t - HOLD) / ZOOM);
      const scale = R0() * Math.pow(R1() / R0(), k);
      const rot: [number, number] = [
        d3.interpolate(-18, -127.07)(k),
        d3.interpolate(-8, -37.63)(k),
      ];
      starAlpha = 1 - easeIn((t - HOLD) / (ZOOM * 0.75));
      globeAlpha = 1 - easeIn((t - HOLD - ZOOM * 0.82) / (ZOOM * 0.22));
      drawGlobe(rot, scale);
      if (!done) raf = requestAnimationFrame(frame);
    }

    function schedule() {
      const T = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
      setStage(0, "우주", "SOL · III · 관측 시작");
      T(1500, () => setStage(1, "지구", "EARTH · 접근 중"));
      T(4400, () => {
        document.getElementById("map")?.classList.add("on");
        map.invalidateSize();
        setStage(2, "대한민국", "KOREA · 36.4 N 127.9 E");
      });
      T(5600, () => {
        map.flyTo(SEOUL, 10.4, { duration: 2.6 });
        setStage(2, "서울특별시", "SEOUL · 37.57 N 126.98 E");
      });
      T(8400, () => {
        map.flyTo(NOWON, 13.2, { duration: 2.4 });
        setStage(3, "노원구", "NOWON-GU · 37.65 N 127.06 E");
      });
      T(11000, () => {
        map.flyTo(HAGYE, 16.2, { duration: 2.6 });
        setStage(4, "하계동", "HAGYE-DONG · 37.6355 N 127.0680 E");
      });
      T(13700, () => pin.setOpacity(1));
      T(14300, () => finish());
    }

    function finish() {
      done = true;
      cancelAnimationFrame(raf);
      document.getElementById("card")?.classList.add("on");
      document.getElementById("skip")?.classList.add("gone");
      const eyebrow = document.getElementById("eyebrow");
      if (eyebrow) eyebrow.textContent = "POSITION LOCKED";
      setStage(4, "하계동", "HAGYE-DONG · 도착");
    }

    function jump() {
      timers.forEach(clearTimeout);
      timers = [];
      globeAlpha = 0;
      starAlpha = 0;
      gctx.clearRect(0, 0, W, H);
      document.getElementById("map")?.classList.add("on");
      map.invalidateSize();
      map.setView(HAGYE, 16.2);
      pin.setOpacity(1);
      finish();
    }

    function start() {
      timers.forEach(clearTimeout);
      timers = [];
      done = false;
      t0 = null;
      globeAlpha = 1;
      starAlpha = 1;
      document.getElementById("card")?.classList.remove("on");
      document.getElementById("skip")?.classList.remove("gone");
      const eyebrow = document.getElementById("eyebrow");
      if (eyebrow) eyebrow.textContent = "POSITION LOCK";
      map.setView(KOREA, 6);
      pin.setOpacity(0);
      document.getElementById("map")?.classList.remove("on");
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
      schedule();
    }

    const skipBtn = document.getElementById("skip");
    const replayBtn = document.getElementById("replay");
    skipBtn?.addEventListener("click", jump);
    replayBtn?.addEventListener("click", start);

    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json")
      .then((topo: any) => {
        const fc = topojson.feature(topo, topo.objects.countries);
        land = fc;
        korea = {
          type: "FeatureCollection",
          features: fc.features.filter((f: any) => /Korea/.test(f.properties.name)),
        };
      })
      .catch(() => {});

    start();

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      skipBtn?.removeEventListener("click", jump);
      replayBtn?.removeEventListener("click", start);
      map.remove();
    };
  }, [libsReady]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha384-sHL9NAb7lN7rfvG5lfHpm643Xkcjzp4jFvuavGOndn6pjVqS6ny56CAt3nsEVT4H"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onReady={() => setLibsReady((n) => n + 1)}
      />
      <Script
        src="https://unpkg.com/d3@7.9.0/dist/d3.min.js"
        integrity="sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onReady={() => setLibsReady((n) => n + 1)}
      />
      <Script
        src="https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js"
        integrity="sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onReady={() => setLibsReady((n) => n + 1)}
      />

      <div id="stage">
        <canvas id="sky" />
        <canvas id="globe" />
        <div id="map" />
      </div>

      <div id="hud">
        <div id="eyebrow">POSITION LOCK</div>
        <div id="scale">우주</div>
        <div id="sub">SOL · III</div>
      </div>

      <div id="ladder">
        <div data-s="0">
          <span>우주</span>
          <i />
        </div>
        <div data-s="1">
          <span>지구</span>
          <i />
        </div>
        <div data-s="2">
          <span>대한민국</span>
          <i />
        </div>
        <div data-s="3">
          <span>노원구</span>
          <i />
        </div>
        <div data-s="4">
          <span>하계동</span>
          <i />
        </div>
      </div>

      <button id="skip">SKIP ↓</button>

      <div id="card">
        <div className="chead">
          <div>
            <h1>{profile.name}</h1>
            <div className="affil">{profile.affiliation}</div>
          </div>
          <div className="coord">
            37.6355° N 127.0680° E
            <br />
            서울 노원구 하계동
          </div>
        </div>
        <div className="body">
          <div className="sec">
            <div className="lbl">INTRO</div>
            <div className="txt">{profile.intro}</div>
          </div>
          <div className="sec">
            <div className="lbl">INTERESTS</div>
            <div className="txt">
              <ul>
                {profile.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="sec">
            <div className="lbl">PROJECTS</div>
            <div className="txt">
              <ul>
                {(profile.projects as Project[]).map((project) => (
                  <li key={project.title}>
                    {project.url ? (
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                    <span className="desc">└ {project.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="sec">
            <div className="lbl">LINKS</div>
            <div className="links">
              {(profile.links as LinkItem[])
                .filter((link) => link.url)
                .map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label.toUpperCase()}
                  </a>
                ))}
            </div>
          </div>
        </div>
        <div className="cfoot">
          <span>ARRIVED · 하계동, 노원구, 서울</span>
          <button id="replay">다시 진입 ↺</button>
        </div>
      </div>
    </>
  );
}

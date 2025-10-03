
import { useEffect } from "react";

export default function useHeroVideo() {
  useEffect(() => {
    const video = document.getElementById("heroVideo");
    const btn = document.getElementById("ctaBtn");

    if (!video || !btn) return;

    // Función para cargar la fuente del video desde data-src (lazy load)
    function ensureVideoLoaded(v) {
      if (!v) return;
      const sourceEl = v.querySelector("source");
      if (!sourceEl) return;

      if (!sourceEl.src) {
        const src = v.dataset.src;
        if (!src) return;
        sourceEl.src = src;
        v.src = src; // Compatibilidad
        v.load();
      }
    }

    // Intentar reproducir y atrapar errores
    async function tryPlay(v) {
      try {
        await v.play();
      } catch (err) {
        // Políticas de autoplay
      }
    }

    // Pause seguro
    function safePause(v) {
      try {
        v.pause();
      } catch (e) {}
    }

    // IntersectionObserver para detectar visibilidad
    if ("IntersectionObserver" in window) {
      const ioOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.55,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target === video) {
            if (entry.isIntersecting) {
              ensureVideoLoaded(video);
              tryPlay(video);
            } else {
              safePause(video);
            }
          }
        });
      }, ioOptions);

      observer.observe(video);
    } else {
      // Fallback
      ensureVideoLoaded(video);
    }

    // Botón que hace scroll al video y lo reproduce
    const handleBtnClick = (e) => {
      e.preventDefault();

      const headerOffset = 150;
      const elementPosition = video.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      ensureVideoLoaded(video);

        // Desactivar mute
        video.muted = false;

      tryPlay(video);
    };

    btn.addEventListener("click", handleBtnClick);

    // Cleanup
    return () => {
      btn.removeEventListener("click", handleBtnClick);
    };
  }, []);
}

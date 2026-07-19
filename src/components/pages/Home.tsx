'use client';

/*
 * Homepage ConejoCreative — migración 1:1 de html/index.html.
 * El marcado, los estilos (home.css) y el comportamiento de los cinco
 * scripts del prototipo se conservan sin cambios visuales ni funcionales.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react';
import './home.css';

type ContactStatus = {
  text: string;
  state?: 'success' | 'error';
};

export function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [year, setYear] = useState(2026);
  const [sending, setSending] = useState(false);
  const [contactStatus, setContactStatus] = useState<ContactStatus>({ text: '' });

  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const portfolioRef = useRef<HTMLElement | null>(null);
  const sendTimer = useRef<number | null>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    // El prototipo estampa "2026" y lo actualiza al cargar; se replica igual.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  useEffect(
    () => () => {
      if (sendTimer.current !== null) window.clearTimeout(sendTimer.current);
    },
    []
  );

  /* Carrusel de soluciones — mismo comportamiento del script del prototipo:
     autoplay, pausa en hover/focus, dots, flechas, wrap circular y expansión
     por clic en móvil. */
  useEffect(() => {
    const carousel = solutionsRef.current;
    if (!carousel) return;

    const track = carousel.querySelector<HTMLElement>('[data-cc-carousel-track]');
    const dotsRoot = carousel.querySelector<HTMLElement>('[data-cc-carousel-dots]');
    const prev = carousel.querySelector<HTMLButtonElement>('[data-cc-carousel-prev]');
    const next = carousel.querySelector<HTMLButtonElement>('[data-cc-carousel-next]');
    if (!track || !dotsRoot || !prev || !next) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>('.cc-carousel-card'));
    if (cards.length === 0) return;

    const controller = new AbortController();
    const { signal } = controller;

    const duration = 3800;
    let index = 0;
    let timer: number | null = null;
    let paused = false;

    carousel.style.setProperty('--cc-carousel-duration', `${duration}ms`);

    const normalize = (value: number) => (value + cards.length) % cards.length;

    function update() {
      const cardWidth = cards[0]?.offsetWidth ?? 0;
      const gap = 18;

      cards.forEach((card, cardIndex) => {
        let rel = (cardIndex - index + cards.length) % cards.length;
        if (rel > cards.length / 2) rel -= cards.length;
        card.style.setProperty('--cc-shift', `${rel * (cardWidth + gap)}px`);

        card.classList.remove('is-active', 'is-near');
        if (cardIndex === index) card.classList.add('is-active');

        const prevIndex = normalize(index - 1);
        const nextIndex = normalize(index + 1);
        if (cardIndex === prevIndex || cardIndex === nextIndex) {
          card.classList.add('is-near');
        }
      });

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
        dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
      });
    }

    function goTo(newIndex: number) {
      index = normalize(newIndex);
      update();
    }

    function stop() {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
    }

    function start() {
      if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      stop();
      timer = window.setInterval(() => goTo(index + 1), duration);
    }

    function restart() {
      stop();
      start();
    }

    function setPaused(value: boolean) {
      paused = value;
      carousel?.classList.toggle('is-paused', paused);
      if (paused) stop();
      else start();
    }

    const dots = cards.map((_, cardIndex) => {
      const dot = document.createElement('button');
      dot.className = 'cc-carousel-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ver solución ${cardIndex + 1}`);
      dot.addEventListener(
        'click',
        () => {
          goTo(cardIndex);
          restart();
        },
        { signal }
      );
      dotsRoot.appendChild(dot);
      return dot;
    });

    prev.addEventListener(
      'click',
      () => {
        goTo(index - 1);
        restart();
      },
      { signal }
    );

    next.addEventListener(
      'click',
      () => {
        goTo(index + 1);
        restart();
      },
      { signal }
    );

    carousel.addEventListener('mouseenter', () => setPaused(true), { signal });
    carousel.addEventListener('mouseleave', () => setPaused(false), { signal });
    carousel.addEventListener('focusin', () => setPaused(true), { signal });
    carousel.addEventListener(
      'focusout',
      (event) => {
        if (!carousel.contains(event.relatedTarget as Node | null)) setPaused(false);
      },
      { signal }
    );

    cards.forEach((card, cardIndex) => {
      card.addEventListener(
        'click',
        (event) => {
          if ((event.target as HTMLElement).closest('a')) return;

          if (index !== cardIndex) {
            goTo(cardIndex);
          } else {
            card.classList.toggle('is-expanded');
          }
        },
        { signal }
      );
    });

    window.addEventListener('resize', update, { passive: true, signal });

    update();
    start();

    return () => {
      controller.abort();
      stop();
      dots.forEach((dot) => dot.remove());
      cards.forEach((card) => {
        card.classList.remove('is-active', 'is-near', 'is-expanded');
        card.style.removeProperty('--cc-shift');
      });
      carousel.classList.remove('is-paused');
    };
  }, []);

  /* Flechas del carrusel del portfolio — mismo desplazamiento del prototipo. */
  useEffect(() => {
    const section = portfolioRef.current;
    if (!section) return;

    const controller = new AbortController();
    const { signal } = controller;

    const moveTrack = (name: string, direction: number) => {
      const track = section.querySelector<HTMLElement>(`[data-portfolio-track="${name}"]`);
      if (!track) return;

      const card = track.querySelector<HTMLElement>('.cc-portfolio-card');
      const distance = card ? card.getBoundingClientRect().width + 18 : 310;

      track.scrollBy({ left: distance * direction, behavior: 'smooth' });
    };

    section.querySelectorAll<HTMLButtonElement>('[data-portfolio-prev]').forEach((button) => {
      button.addEventListener('click', () => moveTrack(button.dataset.portfolioPrev ?? '', -1), {
        signal,
      });
    });

    section.querySelectorAll<HTMLButtonElement>('[data-portfolio-next]').forEach((button) => {
      button.addEventListener('click', () => moveTrack(button.dataset.portfolioNext ?? '', 1), {
        signal,
      });
    });

    return () => controller.abort();
  }, []);

  /* Formulario de contacto — validación nativa y estado visual, sin backend
     (igual que el prototipo). */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      setContactStatus({ text: 'Revisa los campos obligatorios.', state: 'error' });
      return;
    }

    setSending(true);
    setContactStatus({ text: 'Solicitud preparada correctamente.', state: 'success' });

    if (sendTimer.current !== null) window.clearTimeout(sendTimer.current);
    sendTimer.current = window.setTimeout(() => setSending(false), 900);
  };

  return (
    <div className="cc-home-root">
      <section className="hero" id="inicio">
        <div className="ambient" aria-hidden="true"></div>
        <div className="noise" aria-hidden="true"></div>

        <header className="nav">
          <a className="brand" href="#inicio" aria-label="ConejoCreative">
            <span className="brand__icon"><img src="/assets/home/brand-rabbit.png" alt="" /></span>
            <span className="brand__text"><strong>CONEJO</strong><span>CREATIVE</span></span>
          </a>

          <nav className="nav__links" aria-label="Navegación principal">
            <a className="active" href="#inicio">Inicio</a>
            <a href="#propuesta-valor">Quiénes somos</a>
            <a href="#soluciones">Servicios</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <a className="nav__cta" href="#contacto"><i>→</i><span>Quiero un presupuesto</span></a>

          <button className={menuOpen ? 'menu open' : 'menu'} type="button" aria-label="Abrir menú" onClick={() => setMenuOpen((open) => !open)}><span></span><span></span></button>
        </header>

        <nav className={menuOpen ? 'mobile-nav open' : 'mobile-nav'} aria-label="Navegación móvil">
          <a href="#inicio" onClick={closeMenu}>Inicio</a>
          <a href="#propuesta-valor" onClick={closeMenu}>Quiénes somos</a>
          <a href="#soluciones" onClick={closeMenu}>Servicios</a>
          <a href="#portfolio" onClick={closeMenu}>Portfolio</a>
          <a href="#contacto" onClick={closeMenu}>Contacto</a>
        </nav>

        <section className="hero__content">
          <div className="eyebrow">Web, software y automatización para empresas</div>
          <h1>Tecnología para vender más<span>y trabajar mejor</span></h1>
          <p className="lead">Creamos webs, software y automatizaciones que ayudan a tu empresa a <strong>captar clientes, ahorrar tiempo y crecer con más control.</strong></p>
          <a className="hero__cta" href="#contacto"><i>→</i><span>Solicitar diagnóstico</span></a>
        </section>

        <a className="scroll" href="#portfolio" aria-label="Explorar nuestro portfolio">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="circlePath" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"></path></defs>
            <text><textPath href="#circlePath">EXPLORA NUESTRO PORTFOLIO · EXPLORA NUESTRO PORTFOLIO · </textPath></text>
          </svg>
          <span className="scroll__circle">↓</span>
        </a>

        <div className="horizon" aria-hidden="true"></div>
      </section>


      <section className="cc-problem" id="problema-solucion" aria-labelledby="cc-problem-title">
        <div className="cc-problem__noise" aria-hidden="true"></div>

        <div className="cc-problem__inner">
          <h2 className="cc-problem__title" id="cc-problem-title">
            Tu empresa no necesita más herramientas.<br />
            <span>Necesita que todo <em>funcione mejor.</em></span>
          </h2>

          <div className="cc-problem__mark-wrap" aria-hidden="true">
            <span className="cc-problem__cross cc-problem__cross--horizontal"></span>
            <span className="cc-problem__cross cc-problem__cross--vertical"></span>
            <div className="cc-problem__mark">
              <img src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
            </div>
          </div>

          <div className="cc-problem__columns">
            <article className="cc-problem__column">
              <h3 className="cc-problem__label">Problema</h3>
              <p className="cc-problem__text">
                Las consultas se pierden, las tareas se repiten y la información queda repartida entre diferentes herramientas. Mientras tanto, una presencia digital poco clara dificulta que nuevos clientes entiendan, valoren y elijan tu empresa.
              </p>
            </article>

            <article className="cc-problem__column">
              <h3 className="cc-problem__label">Solución</h3>
              <p className="cc-problem__text">
                En <strong>ConejoCreative</strong> conectamos presencia digital, atención y procesos. Creamos soluciones adaptadas a tu empresa para atraer mejores oportunidades, responder con más rapidez y trabajar de forma más eficiente.
              </p>
            </article>
          </div>
        </div>
      </section>





      <section className="cc-value" id="propuesta-valor" aria-labelledby="cc-value-title">
        <div className="cc-value__noise" aria-hidden="true"></div>

        <div className="cc-value__inner">
          <header className="cc-value__header">
            <p className="cc-value__eyebrow">Propuesta de valor</p>
            <h2 className="cc-value__title" id="cc-value-title">
              No basta con estar en internet.<br />
              <span>Hay que estar preparado para <em>crecer.</em></span>
            </h2>
            <p className="cc-value__intro">
              Una buena solución digital mejora <strong>cada punto que conecta tu empresa con sus clientes y su equipo.</strong>
            </p>
          </header>

          <div className="cc-value__map">
            <article className="cc-value__card cc-value__card--one">
              <span className="cc-value__number" aria-hidden="true">01</span>
              <h3>Cómo te encuentran</h3>
              <p>Hacemos que tu empresa sea más visible, clara y fácil de elegir.</p>
            </article>

            <article className="cc-value__card cc-value__card--two">
              <span className="cc-value__number" aria-hidden="true">02</span>
              <h3>Cómo te perciben</h3>
              <p>Construimos una imagen profesional que transmite confianza y diferenciación.</p>
            </article>

            <div className="cc-value__center" aria-label="ConejoCreative">
              <div className="cc-value__rabbit-wrap" aria-hidden="true">
                <div className="cc-value__rabbit">
                  <img src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                </div>
              </div>
              <p className="cc-value__brand">ConejoCreative</p>
              <p className="cc-value__brand-sub">Soluciones digitales</p>
            </div>

            <article className="cc-value__card cc-value__card--three">
              <span className="cc-value__number" aria-hidden="true">03</span>
              <h3>Cómo conviertes</h3>
              <p>Organizamos la atención y el seguimiento para aprovechar cada oportunidad.</p>
            </article>

            <article className="cc-value__card cc-value__card--four">
              <span className="cc-value__number" aria-hidden="true">04</span>
              <h3>Cómo trabajas</h3>
              <p>Simplificamos procesos para reducir errores, costes y tareas repetitivas.</p>
            </article>

            <div className="cc-value__arrows" aria-hidden="true">
              <svg className="cc-value__arrow cc-value__arrow--top" viewBox="0 0 108 74">
                <path d="M10 55C30 25 70 18 96 42"/>
                <polyline points="83,39 98,43 91,29"/>
              </svg>
              <svg className="cc-value__arrow cc-value__arrow--right" viewBox="0 0 108 74">
                <path d="M10 55C30 25 70 18 96 42"/>
                <polyline points="83,39 98,43 91,29"/>
              </svg>
              <svg className="cc-value__arrow cc-value__arrow--bottom" viewBox="0 0 108 74">
                <path d="M10 55C30 25 70 18 96 42"/>
                <polyline points="83,39 98,43 91,29"/>
              </svg>
              <svg className="cc-value__arrow cc-value__arrow--left" viewBox="0 0 108 74">
                <path d="M10 55C30 25 70 18 96 42"/>
                <polyline points="83,39 98,43 91,29"/>
              </svg>
            </div>
          </div>

          <blockquote className="cc-value__quote">
            Conectamos <strong>estrategia y tecnología</strong> para que toda tu empresa avance en la misma dirección.
          </blockquote>
        </div>
      </section>





      <section className="cc-solutions" id="soluciones" aria-labelledby="cc-solutions-title">
        <div className="cc-solutions__inner">
          <header className="cc-solutions__header">
            <div className="cc-solutions__eyebrow">
              <img className="cc-brand-mark cc-solutions__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
              <span>Soluciones</span>
            </div>

            <h2 className="cc-solutions__title" id="cc-solutions-title">
              Soluciones para atraer, convertir y <em>trabajar mejor</em>
            </h2>

            <p className="cc-solutions__intro">
              Analizamos qué está frenando tu crecimiento y desarrollamos la solución que realmente necesita tu empresa.
            </p>
          </header>

          <div className="cc-solutions-carousel" ref={solutionsRef}>
            <div className="cc-solutions-carousel__track" data-cc-carousel-track>

            <article className="cc-carousel-card" id="presencia-digital" tabIndex={0}>
              <div className="cc-carousel-card__visual" aria-hidden="true">
                <div className="cc-carousel-card__orb"></div>
                <div className="cc-carousel-card__mesh"></div>

                <svg className="cc-carousel-card__icon" viewBox="0 0 100 100" fill="none">
                  <g stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">

                <rect x="19" y="22" width="62" height="48" rx="8"/>
                <path d="M19 35h62M31 28h.1M41 28h.1M31 48h38M31 59h25"/>

                  </g>
                </svg>
              </div>

              <div className="cc-carousel-card__shade"></div>

              <div className="cc-carousel-card__content">
                <span className="cc-carousel-card__number">01</span>
                <h3>Presencia digital</h3>
                <p className="cc-carousel-card__subtitle">Convierte tu web en una herramienta comercial.</p>

                <div className="cc-carousel-card__more">
                  <p>Creamos páginas rápidas, profesionales y preparadas para transformar visitas en contactos.</p>
                  <a href="#contacto">
                    Mejorar mi web
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3.5 8h9M8.5 4l4 4-4 4"
                        stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>

              <span className="cc-carousel-card__progress" aria-hidden="true"></span>
            </article>

            <article className="cc-carousel-card" id="branding-posicionamiento" tabIndex={0}>
              <div className="cc-carousel-card__visual" aria-hidden="true">
                <div className="cc-carousel-card__orb"></div>
                <div className="cc-carousel-card__mesh"></div>

                <svg className="cc-carousel-card__icon" viewBox="0 0 100 100" fill="none">
                  <g stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">

                <path d="m50 16 28 23-28 43-28-43 28-23Z"/>
                <path d="m22 39 28 10 28-10M50 49v33"/>

                  </g>
                </svg>
              </div>

              <div className="cc-carousel-card__shade"></div>

              <div className="cc-carousel-card__content">
                <span className="cc-carousel-card__number">02</span>
                <h3>Branding y posicionamiento</h3>
                <p className="cc-carousel-card__subtitle">Haz que tu empresa sea reconocible y fácil de recordar.</p>

                <div className="cc-carousel-card__more">
                  <p>Creamos una identidad coherente que refuerza tu posicionamiento y aumenta la confianza.</p>
                  <a href="#contacto">
                    Fortalecer mi marca
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3.5 8h9M8.5 4l4 4-4 4"
                        stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>

              <span className="cc-carousel-card__progress" aria-hidden="true"></span>
            </article>

            <article className="cc-carousel-card" id="redes-contenidos" tabIndex={0}>
              <div className="cc-carousel-card__visual" aria-hidden="true">
                <div className="cc-carousel-card__orb"></div>
                <div className="cc-carousel-card__mesh"></div>

                <svg className="cc-carousel-card__icon" viewBox="0 0 100 100" fill="none">
                  <g stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">

                <circle cx="50" cy="50" r="25"/>
                <circle cx="50" cy="50" r="6"/>
                <circle cx="27" cy="36" r="5"/>
                <circle cx="73" cy="36" r="5"/>
                <circle cx="50" cy="77" r="5"/>
                <path d="m32 39 12 7M68 39l-12 7M50 71V58"/>

                  </g>
                </svg>
              </div>

              <div className="cc-carousel-card__shade"></div>

              <div className="cc-carousel-card__content">
                <span className="cc-carousel-card__number">03</span>
                <h3>Redes y contenidos</h3>
                <p className="cc-carousel-card__subtitle">Comunica con claridad y propósito.</p>

                <div className="cc-carousel-card__more">
                  <p>Organizamos tu imagen y tus contenidos para atraer atención y reforzar tus objetivos comerciales.</p>
                  <a href="#contacto">
                    Mejorar mi comunicación
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3.5 8h9M8.5 4l4 4-4 4"
                        stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>

              <span className="cc-carousel-card__progress" aria-hidden="true"></span>
            </article>

            <article className="cc-carousel-card" id="atencion-conversion" tabIndex={0}>
              <div className="cc-carousel-card__visual" aria-hidden="true">
                <div className="cc-carousel-card__orb"></div>
                <div className="cc-carousel-card__mesh"></div>

                <svg className="cc-carousel-card__icon" viewBox="0 0 100 100" fill="none">
                  <g stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">

                <path d="M19 23h62v44H48L31 82V67H19V23Z"/>
                <path d="m37 47 9 9 18-20"/>

                  </g>
                </svg>
              </div>

              <div className="cc-carousel-card__shade"></div>

              <div className="cc-carousel-card__content">
                <span className="cc-carousel-card__number">04</span>
                <h3>Atención y conversión</h3>
                <p className="cc-carousel-card__subtitle">Evita que las oportunidades se pierdan.</p>

                <div className="cc-carousel-card__more">
                  <p>Conectamos WhatsApp, CRM y seguimiento para responder mejor y convertir más contactos.</p>
                  <a href="#contacto">
                    Mejorar mi atención
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3.5 8h9M8.5 4l4 4-4 4"
                        stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>

              <span className="cc-carousel-card__progress" aria-hidden="true"></span>
            </article>

            <article className="cc-carousel-card" id="software-medida" tabIndex={0}>
              <div className="cc-carousel-card__visual" aria-hidden="true">
                <div className="cc-carousel-card__orb"></div>
                <div className="cc-carousel-card__mesh"></div>

                <svg className="cc-carousel-card__icon" viewBox="0 0 100 100" fill="none">
                  <g stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">

                <path d="M36 29 18 50l18 21M64 29l18 21-18 21M57 20 43 80"/>

                  </g>
                </svg>
              </div>

              <div className="cc-carousel-card__shade"></div>

              <div className="cc-carousel-card__content">
                <span className="cc-carousel-card__number">05</span>
                <h3>Software a medida</h3>
                <p className="cc-carousel-card__subtitle">Tu empresa no debería adaptarse a un sistema limitado.</p>

                <div className="cc-carousel-card__more">
                  <p>Creamos software a medida para centralizar información, controlar procesos y facilitar el trabajo diario.</p>
                  <a href="#contacto">
                    Crear mi solución
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3.5 8h9M8.5 4l4 4-4 4"
                        stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>

              <span className="cc-carousel-card__progress" aria-hidden="true"></span>
            </article>

            <article className="cc-carousel-card" id="automatizacion-ia" tabIndex={0}>
              <div className="cc-carousel-card__visual" aria-hidden="true">
                <div className="cc-carousel-card__orb"></div>
                <div className="cc-carousel-card__mesh"></div>

                <svg className="cc-carousel-card__icon" viewBox="0 0 100 100" fill="none">
                  <g stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">

                <path d="M24 31h32a15 15 0 0 1 15 15v2"/>
                <path d="m63 40 8 8 8-8"/>
                <path d="M76 69H44a15 15 0 0 1-15-15v-2"/>
                <path d="m37 60-8-8-8 8"/>

                  </g>
                </svg>
              </div>

              <div className="cc-carousel-card__shade"></div>

              <div className="cc-carousel-card__content">
                <span className="cc-carousel-card__number">06</span>
                <h3>Automatización e IA</h3>
                <p className="cc-carousel-card__subtitle">Automatiza lo repetitivo. Aprovecha mejor el tiempo.</p>

                <div className="cc-carousel-card__more">
                  <p>Conectamos herramientas y aplicamos inteligencia artificial para reducir errores y acelerar procesos.</p>
                  <a href="#contacto">
                    Automatizar mi empresa
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3.5 8h9M8.5 4l4 4-4 4"
                        stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>

              <span className="cc-carousel-card__progress" aria-hidden="true"></span>
            </article>

            </div>

            <div className="cc-solutions-carousel__controls">
              <button className="cc-carousel-control" type="button" data-cc-carousel-prev aria-label="Solución anterior">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M15 10H5M9 6l-4 4 4 4"
                    stroke="currentColor" strokeWidth="1.7"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="cc-carousel-dots" data-cc-carousel-dots aria-label="Seleccionar solución"></div>

              <button className="cc-carousel-control" type="button" data-cc-carousel-next aria-label="Siguiente solución">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 10h10M11 6l4 4-4 4"
                    stroke="currentColor" strokeWidth="1.7"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <p className="cc-solutions__note">
              Descubre cómo podemos ayudarte.
            </p>
          </div>
        </div>
      </section>





      <section className="cc-results" id="resultados-empresariales" aria-labelledby="cc-results-title">
        <p className="cc-results__ambient-word" aria-hidden="true">resultados</p>

        <svg className="cc-results__shape" viewBox="0 0 500 500" aria-hidden="true">
          <path d="M39 402C74 309 136 242 228 201C320 160 390 92 439 36"/>
          <path d="M20 449C91 365 167 319 250 307C345 293 405 231 466 151"/>
          <path d="M75 479C133 410 198 377 270 377C355 377 416 340 479 275"/>
          <path d="M6 326C82 263 150 221 212 201C287 177 344 132 397 64"/>
        </svg>

        <div className="cc-results__inner">
          <header className="cc-results__header">
            <div className="cc-results__eyebrow">
              <img className="cc-brand-mark cc-results__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
              <span>Resultados empresariales</span>
            </div>

            <h2 className="cc-results__title" id="cc-results-title">
              Tecnología que se traduce en <em>resultados reales</em>
            </h2>

            <p className="cc-results__intro">
              <strong>Cada proyecto parte de un objetivo concreto:</strong> atraer oportunidades, mejorar la conversión, reducir costes o simplificar el trabajo.
            </p>
          </header>

          <div className="cc-results__cards">
            <article className="cc-result-card">
              <h3 className="cc-result-card__title">Más <em>confianza</em></h3>
              <p className="cc-result-card__text">
                Una presencia profesional transmite seguridad antes del primer contacto.
              </p>
            </article>

            <article className="cc-result-card">
              <h3 className="cc-result-card__title">Más <em>oportunidades</em></h3>
              <p className="cc-result-card__text">
                Una estrategia clara facilita que más clientes encuentren, entiendan y contacten tu empresa.
              </p>
            </article>

            <article className="cc-result-card">
              <h3 className="cc-result-card__title">Mejor <em>conversión</em></h3>
              <p className="cc-result-card__text">
                Una atención rápida y organizada evita que los contactos interesados se pierdan.
              </p>
            </article>

            <article className="cc-result-card">
              <h3 className="cc-result-card__title">Menos <em>costes</em></h3>
              <p className="cc-result-card__text">
                Automatizar procesos reduce errores, tareas manuales y costes operativos.
              </p>
            </article>

            <article className="cc-result-card">
              <h3 className="cc-result-card__title">Más <em>tiempo</em></h3>
              <p className="cc-result-card__text">
                Tu equipo recupera tiempo para atender clientes y hacer crecer la empresa.
              </p>
            </article>

            <article className="cc-result-card">
              <h3 className="cc-result-card__title">Más <em>control</em></h3>
              <p className="cc-result-card__text">
                Centralizar la información permite tomar decisiones con más rapidez y seguridad.
              </p>
            </article>
          </div>

          <footer className="cc-results__footer">
            <blockquote className="cc-results__quote">
              <strong>No aplicamos tecnología para seguir tendencias.</strong> La aplicamos para resolver problemas y mejorar resultados.
            </blockquote>

            <a className="cc-results__cta" href="#contacto">
              <span className="cc-results__cta-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5"
                    stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>{' '}
              Analizar mi empresa
            </a>
          </footer>
        </div>
      </section>





      <section
        className="cc-sofa"
        id="competencia"
        aria-labelledby="cc-sofa-title"
        role="img"
        aria-label="Un conejo sentado en un sofá azul oscuro, comiendo una zanahoria."
      >
        <div className="cc-sofa__content">
          <h2 className="cc-sofa__title" id="cc-sofa-title">
            <span>Tu competencia ya corre.</span>
            <em>¿Tu negocio sigue en el sofá?</em>
          </h2>

          <p className="cc-sofa__subtitle">
            Da el siguiente salto con soluciones creadas para <strong>atraer clientes, ahorrar tiempo y hacer crecer tu empresa.</strong>
          </p>

          <div className="cc-sofa__line" aria-hidden="true"></div>
        </div>
      </section>





      <section className="cc-process" id="como-trabajamos" aria-labelledby="cc-process-title">
        <p className="cc-process__ambient" aria-hidden="true">proceso</p>

        <div className="cc-process__inner">
          <header className="cc-process__header">
            <div>
              <span className="cc-process__eyebrow">Cómo trabajamos</span>

              <h2 className="cc-process__title" id="cc-process-title">
                Primero entendemos tu empresa.{' '}
                <em>Después construimos la solución.</em>
              </h2>
            </div>

            <p className="cc-process__intro">
              Trabajamos con un proceso claro para <strong>reducir riesgos, definir prioridades y mantenerte informado</strong> durante todo el proyecto.
            </p>
          </header>

          <div className="cc-process__timeline" aria-label="Proceso de trabajo en cuatro etapas">
            <article className="cc-process-step" style={{ '--cc-order': 0 } as CSSProperties}>
              <div className="cc-process-step__rail" aria-hidden="true">
                <span className="cc-process-step__dot">01</span>
              </div>

              <div className="cc-process-step__card">
                <div className="cc-process-step__meta">
                  <span className="cc-process-step__label">Diagnóstico</span>
                  <span className="cc-process-step__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7"/>
                      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>

                <h3 className="cc-process-step__title">Analizamos</h3>

                <p className="cc-process-step__text">
                  Analizamos tu situación, tus procesos y los objetivos que quieres alcanzar.
                </p>

                <ul className="cc-process-step__details">
                  <li>Situación digital actual</li>
                  <li>Procesos y herramientas</li>
                  <li>Objetivos y prioridades</li>
                </ul>
              </div>
            </article>

            <article className="cc-process-step" style={{ '--cc-order': 1 } as CSSProperties}>
              <div className="cc-process-step__rail" aria-hidden="true">
                <span className="cc-process-step__dot">02</span>
              </div>

              <div className="cc-process-step__card">
                <div className="cc-process-step__meta">
                  <span className="cc-process-step__label">Estrategia</span>
                  <span className="cc-process-step__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 18 10 13l3 3 6-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 8h4v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>

                <h3 className="cc-process-step__title">Priorizamos</h3>

                <p className="cc-process-step__text">
                  Detectamos las oportunidades con mayor impacto y definimos el mejor punto de partida.
                </p>

                <ul className="cc-process-step__details">
                  <li>Problemas con mayor impacto</li>
                  <li>Orden de implementación</li>
                  <li>Alcance, tiempos y métricas</li>
                </ul>
              </div>
            </article>

            <article className="cc-process-step" style={{ '--cc-order': 2 } as CSSProperties}>
              <div className="cc-process-step__rail" aria-hidden="true">
                <span className="cc-process-step__dot">03</span>
              </div>

              <div className="cc-process-step__card">
                <div className="cc-process-step__meta">
                  <span className="cc-process-step__label">Ejecución</span>
                  <span className="cc-process-step__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="m7 17 10-10M8.5 7H17v8.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 12v7h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>

                <h3 className="cc-process-step__title">Implementamos</h3>

                <p className="cc-process-step__text">
                  Diseñamos, desarrollamos y validamos cada solución antes de ponerla en marcha.
                </p>

                <ul className="cc-process-step__details">
                  <li>Diseño y desarrollo</li>
                  <li>Integración y automatización</li>
                  <li>Pruebas y puesta en marcha</li>
                </ul>
              </div>
            </article>

            <article className="cc-process-step" style={{ '--cc-order': 3 } as CSSProperties}>
              <div className="cc-process-step__rail" aria-hidden="true">
                <span className="cc-process-step__dot">04</span>
              </div>

              <div className="cc-process-step__card">
                <div className="cc-process-step__meta">
                  <span className="cc-process-step__label">Evolución</span>
                  <span className="cc-process-step__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M6 8.5A7 7 0 1 1 5.5 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                      <path d="M6 4.5v4H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>

                <h3 className="cc-process-step__title">Medimos y acompañamos</h3>

                <p className="cc-process-step__text">
                  Acompañamos la adaptación, medimos el funcionamiento y aplicamos las mejoras necesarias.
                </p>

                <ul className="cc-process-step__details">
                  <li>Revisión de resultados</li>
                  <li>Formación del equipo</li>
                  <li>Soporte y mejoras</li>
                </ul>
              </div>
            </article>
          </div>

          <footer className="cc-process__footer">
            <blockquote className="cc-process__quote">
              <strong>Siempre sabrás qué estamos haciendo, qué viene después</strong> y qué resultado buscamos.
            </blockquote>

            <a className="cc-process__cta" href="#contacto">
              <span className="cc-process__cta-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5"
                    stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>{' '}
              Solicitar diagnóstico
            </a>
          </footer>
        </div>
      </section>





      <section className="cc-testimonials" id="testimonios" aria-labelledby="cc-testimonials-title">
        <p className="cc-testimonials__ambient" aria-hidden="true">testimonios</p>

        <div className="cc-testimonials__inner">
          <header className="cc-testimonials__header">
            <div className="cc-testimonials__eyebrow">
              <img className="cc-brand-mark cc-testimonials__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
              <span>Experiencias de clientes</span>
            </div>

            <h2 className="cc-testimonials__title" id="cc-testimonials-title">
              La mejor prueba está en{' '}
              <em>quienes ya dieron el salto</em>
            </h2>

            <p className="cc-testimonials__intro">
              Empresas que transformaron problemas cotidianos en procesos más claros, rápidos y eficientes.
            </p>


          </header>

          <div className="cc-testimonials__scene">
            <svg className="cc-testimonials__map" viewBox="0 0 1100 500" aria-hidden="true">
              <defs>
                <pattern id="cc-map-dots" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="2.2" cy="2.2" r="2.1" fill="#36b7f0" opacity=".23"/>
                </pattern>

                <filter id="cc-map-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <g fill="url(#cc-map-dots)" filter="url(#cc-map-glow)">
                <path d="M67 111 111 84 169 76 211 89 239 115 217 139 180 142 160 166 123 157 96 136 70 137Z"/>
                <path d="M196 171 225 185 241 219 233 253 249 286 239 338 217 381 190 366 182 326 165 295 174 249 154 217 167 186Z"/>
                <path d="M335 99 384 77 453 83 501 101 540 132 519 154 466 153 435 174 386 163 351 141Z"/>
                <path d="M426 170 477 176 512 202 527 244 511 291 482 331 454 367 428 338 420 298 400 263 405 222Z"/>
                <path d="M546 110 610 82 684 86 744 102 803 95 858 113 900 145 864 167 808 165 768 187 722 181 685 201 631 183 590 156 549 150Z"/>
                <path d="M786 205 824 198 860 220 866 254 843 273 809 263 788 240Z"/>
                <path d="M878 305 920 292 966 308 992 339 968 364 929 369 893 350Z"/>
                <path d="M986 182 1022 168 1052 184 1042 209 1008 214Z"/>
              </g>

              <path d="M132 125C305 91 424 130 548 237C671 342 842 330 980 330"
                fill="none" stroke="#8ee9ff" strokeOpacity=".09" strokeWidth="1.2"
                strokeDasharray="5 9"/>
            </svg>

            <div className="cc-testimonials__orbit" aria-hidden="true"></div>

            <div className="cc-testimonials__hub" aria-label="ConejoCreative">
              <img src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
            </div>

            <article className="cc-testimonial cc-testimonial--left">
              <div className="cc-testimonial__top">
                <div className="cc-testimonial__avatar" aria-hidden="true">MR</div>

                <div>
                  <h3 className="cc-testimonial__name">Empresa de reformas</h3>
                  <p className="cc-testimonial__role">Valencia · Testimonio de ejemplo</p>
                </div>
              </div>

              <blockquote className="cc-testimonial__quote">
                “Antes dependíamos casi por completo de recomendaciones.
                Ahora tenemos una web que <strong>explica bien nuestro trabajo</strong>,
                filtra mejor las consultas y nos ayuda a presentar presupuestos
                con mucha más confianza.”
              </blockquote>

              <div className="cc-testimonial__result">
                Mejor percepción y contactos más cualificados
              </div>
            </article>

            <article className="cc-testimonial cc-testimonial--right">
              <div className="cc-testimonial__top">
                <div className="cc-testimonial__avatar" aria-hidden="true">CL</div>

                <div>
                  <h3 className="cc-testimonial__name">Clínica de servicios</h3>
                  <p className="cc-testimonial__role">Madrid · Testimonio de ejemplo</p>
                </div>
              </div>

              <blockquote className="cc-testimonial__quote">
                “La automatización nos permitió dejar de responder siempre
                las mismas preguntas y organizar mejor cada oportunidad.
                El equipo dedica menos tiempo a tareas repetitivas y{' '}
                <strong>más tiempo a atender al cliente</strong>.”
              </blockquote>

              <div className="cc-testimonial__result">
                Atención más rápida y procesos más ordenados
              </div>
            </article>

            <span className="cc-testimonials__person cc-testimonials__person--1" aria-hidden="true">EV</span>
            <span className="cc-testimonials__person cc-testimonials__person--2" aria-hidden="true">JM</span>
            <span className="cc-testimonials__person cc-testimonials__person--3" aria-hidden="true">AS</span>
            <span className="cc-testimonials__person cc-testimonials__person--4" aria-hidden="true">LP</span>
            <span className="cc-testimonials__person cc-testimonials__person--5" aria-hidden="true">NG</span>

            <span className="cc-testimonials__ring cc-testimonials__ring--1" aria-hidden="true"></span>
            <span className="cc-testimonials__ring cc-testimonials__ring--2" aria-hidden="true"></span>
            <span className="cc-testimonials__ring cc-testimonials__ring--3" aria-hidden="true"></span>
          </div>
        </div>
      </section>





      <section className="cc-portfolio" id="portfolio" aria-labelledby="cc-portfolio-title" ref={portfolioRef}>
        <div className="cc-portfolio__inner">
          <div className="cc-portfolio__top">
            <header className="cc-portfolio__heading">
              <div className="cc-portfolio__eyebrow">
                <img className="cc-brand-mark cc-portfolio__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span>Proyectos seleccionados</span>
              </div>

              <h2 className="cc-portfolio__title" id="cc-portfolio-title">
                Proyectos creados para resolver <em>problemas reales</em>
              </h2>

              <p className="cc-portfolio__intro">
                Webs, plataformas y sistemas desarrollados para mejorar la captación, la gestión y los procesos de cada negocio.
              </p>
            </header>

            <div className="cc-portfolio__track-shell">
              <div className="cc-portfolio__track" data-portfolio-track="top">
                <article className="cc-portfolio-card">
                  <div className="cc-portfolio-card__visual">
                    <div className="cc-device">
                      <div className="cc-device__screen">
                        <div className="cc-device__nav"><span></span><span></span><span></span></div>
                        <div className="cc-device__hero"><b></b><i></i><em></em></div>
                        <div className="cc-device__blocks"><span></span><span></span><span></span></div>
                      </div>
                    </div>
                  </div>
                  <div className="cc-portfolio-card__body">
                    <span className="cc-portfolio-card__number">01.</span>
                    <h3 className="cc-portfolio-card__title">Jornafy</h3>
                    <p className="cc-portfolio-card__type">Control horario y gestión de equipos</p>
                  </div>
                </article>

                <article className="cc-portfolio-card cc-portfolio-card--crm">
                  <div className="cc-portfolio-card__visual">
                    <div className="cc-device">
                      <div className="cc-device__screen">
                        <div className="cc-device__nav"><span></span><span></span><span></span></div>
                        <div className="cc-device__hero"><b></b><i></i><em></em></div>
                        <div className="cc-device__blocks"><span></span><span></span><span></span></div>
                      </div>
                    </div>
                  </div>
                  <div className="cc-portfolio-card__body">
                    <span className="cc-portfolio-card__number">02.</span>
                    <h3 className="cc-portfolio-card__title">Conejo CRM</h3>
                    <p className="cc-portfolio-card__type">Seguimiento comercial centralizado</p>
                  </div>
                </article>

                <article className="cc-portfolio-card cc-portfolio-card--ai">
                  <div className="cc-portfolio-card__visual">
                    <div className="cc-device">
                      <div className="cc-device__screen">
                        <div className="cc-device__nav"><span></span><span></span><span></span></div>
                        <div className="cc-device__hero"><b></b><i></i><em></em></div>
                        <div className="cc-device__blocks"><span></span><span></span><span></span></div>
                      </div>
                    </div>
                  </div>
                  <div className="cc-portfolio-card__body">
                    <span className="cc-portfolio-card__number">03.</span>
                    <h3 className="cc-portfolio-card__title">Atención con IA</h3>
                    <p className="cc-portfolio-card__type">Respuestas, llamadas y citas automatizadas</p>
                  </div>
                </article>

                <article className="cc-portfolio-card cc-portfolio-card--ecommerce">
                  <div className="cc-portfolio-card__visual">
                    <div className="cc-device">
                      <div className="cc-device__screen">
                        <div className="cc-device__nav"><span></span><span></span><span></span></div>
                        <div className="cc-device__hero"><b></b><i></i><em></em></div>
                        <div className="cc-device__blocks"><span></span><span></span><span></span></div>
                      </div>
                    </div>
                  </div>
                  <div className="cc-portfolio-card__body">
                    <span className="cc-portfolio-card__number">04.</span>
                    <h3 className="cc-portfolio-card__title">Repuestos Aire Acondicionado</h3>
                    <p className="cc-portfolio-card__type">Ecommerce orientado a la venta</p>
                  </div>
                </article>
              </div>

              <div className="cc-portfolio__controls">
                <button className="cc-portfolio__control" type="button" data-portfolio-prev="top" aria-label="Ver proyectos anteriores">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M15 10H5M9 6l-4 4 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button className="cc-portfolio__control" type="button" data-portfolio-next="top" aria-label="Ver proyectos siguientes">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <footer className="cc-portfolio__footer">
            <p>
              <strong>Cada proyecto comienza con un problema concreto</strong> y termina con una solución preparada para crecer.
            </p>

            <a className="cc-portfolio__cta" href="#contacto">
              <span aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5"
                    stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>{' '}
              Cuéntanos tu proyecto
            </a>
          </footer>
        </div>
      </section>





      <section className="cc-support" id="soporte-formacion" aria-labelledby="cc-support-title">
        <div className="cc-support__inner">
          <header className="cc-support__header">
            <div className="cc-support__eyebrow">
              <img className="cc-brand-mark cc-support__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
              <span>Soporte y formación</span>
            </div>

            <h2 className="cc-support__title" id="cc-support-title">
              Tecnología con <em>un equipo a tu lado</em>
            </h2>

            <p className="cc-support__intro">
              No desaparecemos después de la entrega. <strong>Acompañamos a tu empresa</strong> para resolver dudas, facilitar la adaptación y asegurar que cada solución se aproveche correctamente.
            </p>
          </header>

          <div className="cc-support__grid">
            <article className="cc-support-card cc-support-card--human">
              <div className="cc-support-card__visual" aria-hidden="true">
                <span className="cc-support-card__glow"></span>

                <div className="cc-support-people">
                  <span className="cc-support-people__person cc-support-people__person--main">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M5 20c.5-4.2 2.8-6.3 7-6.3s6.5 2.1 7 6.3"
                        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </span>

                  <span className="cc-support-people__person cc-support-people__person--left">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M5 20c.5-4.2 2.8-6.3 7-6.3s6.5 2.1 7 6.3"
                        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </span>

                  <span className="cc-support-people__person cc-support-people__person--right">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M5 20c.5-4.2 2.8-6.3 7-6.3s6.5 2.1 7 6.3"
                        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="cc-support-card__content">
                <span className="cc-support-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 17.5V10a7 7 0 0 1 14 0v7.5"
                      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    <path d="M5 14H3.8A1.8 1.8 0 0 0 2 15.8v2.4A1.8 1.8 0 0 0 3.8 20H6v-6H5Zm14 0h1.2a1.8 1.8 0 0 1 1.8 1.8v2.4a1.8 1.8 0 0 1-1.8 1.8H18v-6h1Z"
                      stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                  </svg>
                </span>

                <h3 className="cc-support-card__title">Soporte humano</h3>
                <p className="cc-support-card__text">
                  Hablas directamente con personas que conocen tu proyecto y pueden ayudarte.
                </p>
              </div>
            </article>

            <article className="cc-support-card cc-support-card--training">
              <div className="cc-support-card__visual" aria-hidden="true">
                <div className="cc-support-training">
                  <span className="cc-support-training__screen"></span>
                  <span className="cc-support-training__base"></span>
                </div>
              </div>

              <div className="cc-support-card__content">
                <span className="cc-support-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="m3 9 9-5 9 5-9 5-9-5Z"
                      stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                    <path d="M7 12v4.2c2.7 2.4 7.3 2.4 10 0V12"
                      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                </span>

                <h3 className="cc-support-card__title">Formación práctica</h3>
                <p className="cc-support-card__text">
                  Preparamos a tu equipo para utilizar las herramientas con seguridad y autonomía.
                </p>
              </div>
            </article>

            <article className="cc-support-card cc-support-card--clear">
              <div className="cc-support-card__visual" aria-hidden="true">
                <div className="cc-support-clear">
                  <span className="cc-support-clear__line"></span>
                  <span className="cc-support-clear__line"></span>
                  <span className="cc-support-clear__line"></span>
                  <span className="cc-support-clear__line"></span>

                  <div className="cc-support-clear__message">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>

              <div className="cc-support-card__content">
                <span className="cc-support-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 5.5h16v11H8l-4 3v-14Z"
                      stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                    <path d="M8 9h8M8 12.5h5"
                      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                </span>

                <h3 className="cc-support-card__title">Comunicación clara</h3>
                <p className="cc-support-card__text">
                  Explicamos cada decisión con claridad y sin tecnicismos innecesarios.
                </p>
              </div>
            </article>

            <article className="cc-support-card cc-support-card--evolution">
              <div className="cc-support-card__visual" aria-hidden="true">
                <div className="cc-support-evolution">
                  <span className="cc-support-evolution__orbit"></span>

                  <span className="cc-support-evolution__core">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M6 8.5A7 7 0 1 1 5.5 16"
                        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                      <path d="M6 4.5v4H2"
                        stroke="currentColor" strokeWidth="1.7"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="cc-support-card__content">
                <span className="cc-support-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 17 10 11l3 3 7-8"
                      stroke="currentColor" strokeWidth="1.7"
                      strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 6h4v4"
                      stroke="currentColor" strokeWidth="1.7"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>

                <h3 className="cc-support-card__title">Evolución</h3>
                <p className="cc-support-card__text">
                  Las soluciones pueden evolucionar a medida que cambian tus necesidades.
                </p>
              </div>
            </article>
          </div>

          <footer className="cc-support__footer">
            <blockquote className="cc-support__quote">
              <strong>No solo entregamos una solución.</strong> Ayudamos a convertirla en parte del crecimiento de tu empresa.
            </blockquote>

            <a className="cc-support__cta" href="#contacto">
              <span aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5"
                    stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>{' '}
              Hablar con el equipo
            </a>
          </footer>
        </div>
      </section>


      <section className="cc-trust-strip" aria-label="Principios de trabajo de ConejoCreative">
        <div className="cc-trust-strip__viewport">
          <div className="cc-trust-strip__track">
            <div className="cc-trust-strip__group">
              <div className="cc-trust-strip__item">
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Soluciones a medida</span><span className="cc-trust-strip__separator"></span>
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Atención en español y portugués</span><span className="cc-trust-strip__separator"></span>
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Proyectos para toda España</span><span className="cc-trust-strip__separator"></span>
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Procesos transparentes</span><span className="cc-trust-strip__separator"></span>
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Soporte humano</span><span className="cc-trust-strip__separator"></span>
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Tecnología orientada a resultados</span><span className="cc-trust-strip__separator"></span>
              </div>
            </div>

            <div className="cc-trust-strip__group" aria-hidden="true">
              <div className="cc-trust-strip__item">
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Soluciones a medida</span><span className="cc-trust-strip__separator"></span>
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Atención en español y portugués</span><span className="cc-trust-strip__separator"></span>
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Proyectos para toda España</span><span className="cc-trust-strip__separator"></span>
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Procesos transparentes</span><span className="cc-trust-strip__separator"></span>
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Soporte humano</span><span className="cc-trust-strip__separator"></span>
                <img className="cc-brand-mark cc-trust-strip__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span className="cc-trust-strip__label">Tecnología orientada a resultados</span><span className="cc-trust-strip__separator"></span>
              </div>
            </div>
          </div>
        </div>
      </section>





      <section className="cc-faq" id="faq" aria-labelledby="cc-faq-title">
        <p className="cc-faq__ambient" aria-hidden="true">FAQ</p>

        <div className="cc-faq__inner">
          <div className="cc-faq__layout">
            <header className="cc-faq__content">
              <div className="cc-faq__eyebrow">
                <img className="cc-brand-mark cc-faq__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span>Preguntas frecuentes</span>
              </div>

              <h2 className="cc-faq__title" id="cc-faq-title">
                FAQ{' '}
                <span>Respuestas claras antes de empezar</span>
              </h2>

              <p className="cc-faq__intro">
                Todo lo que necesitas saber sobre nuestros servicios, plazos y forma de trabajar.
              </p>

              <a className="cc-faq__cta" href="#contacto">
                <span className="cc-faq__cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5"
                      stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>{' '}
                Resolver otra duda
              </a>
            </header>

            <div className="cc-faq__list">
              <details className="cc-faq-item">
                <summary className="cc-faq-item__question">
                  <span className="cc-faq-item__number">01</span>
                  <span className="cc-faq-item__label">
                    No tengo página web. ¿Podéis crear todo desde cero?
                  </span>
                  <span className="cc-faq-item__toggle" aria-hidden="true"></span>
                </summary>

                <div className="cc-faq-item__answer">
                  <p>
                    Sí. Podemos definir la estrategia, la identidad, los contenidos y la página web para construir una presencia digital profesional desde el inicio.
                  </p>
                </div>
              </details>

              <details className="cc-faq-item">
                <summary className="cc-faq-item__question">
                  <span className="cc-faq-item__number">02</span>
                  <span className="cc-faq-item__label">
                    Ya tengo una web. ¿Podéis mejorarla?
                  </span>
                  <span className="cc-faq-item__toggle" aria-hidden="true"></span>
                </summary>

                <div className="cc-faq-item__answer">
                  <p>
                    Sí. Analizamos lo que ya existe, identificamos los puntos que limitan los resultados y proponemos las mejoras más útiles.
                  </p>
                </div>
              </details>

              <details className="cc-faq-item">
                <summary className="cc-faq-item__question">
                  <span className="cc-faq-item__number">03</span>
                  <span className="cc-faq-item__label">
                    No sé qué solución necesita mi empresa. ¿Podéis orientarme?
                  </span>
                  <span className="cc-faq-item__toggle" aria-hidden="true"></span>
                </summary>

                <div className="cc-faq-item__answer">
                  <p>
                    Sí. Cuéntanos qué problema quieres resolver. Analizaremos tu situación y te recomendaremos el mejor punto de partida.
                  </p>
                </div>
              </details>

              <details className="cc-faq-item">
                <summary className="cc-faq-item__question">
                  <span className="cc-faq-item__number">04</span>
                  <span className="cc-faq-item__label">
                    ¿Trabajáis con pequeñas empresas?
                  </span>
                  <span className="cc-faq-item__toggle" aria-hidden="true"></span>
                </summary>

                <div className="cc-faq-item__answer">
                  <p>
                    Sí. Adaptamos cada proyecto a las necesidades, prioridades y posibilidades de la empresa.
                  </p>
                </div>
              </details>

              <details className="cc-faq-item">
                <summary className="cc-faq-item__question">
                  <span className="cc-faq-item__number">05</span>
                  <span className="cc-faq-item__label">
                    ¿Tendré soporte después de la entrega?
                  </span>
                  <span className="cc-faq-item__toggle" aria-hidden="true"></span>
                </summary>

                <div className="cc-faq-item__answer">
                  <p>
                    Sí. Definimos el soporte necesario según el tipo de proyecto y las necesidades de tu equipo.
                  </p>
                </div>
              </details>

              <details className="cc-faq-item">
                <summary className="cc-faq-item__question">
                  <span className="cc-faq-item__number">06</span>
                  <span className="cc-faq-item__label">
                    ¿Enseñáis al equipo a utilizar las herramientas?
                  </span>
                  <span className="cc-faq-item__toggle" aria-hidden="true"></span>
                </summary>

                <div className="cc-faq-item__answer">
                  <p>
                    Sí. Cuando es necesario, formamos al equipo para utilizar correctamente las herramientas y los nuevos procesos.
                  </p>
                </div>
              </details>

              <details className="cc-faq-item">
                <summary className="cc-faq-item__question">
                  <span className="cc-faq-item__number">07</span>
                  <span className="cc-faq-item__label">
                    ¿Cuánto cuesta trabajar con ConejoCreative?
                  </span>
                  <span className="cc-faq-item__toggle" aria-hidden="true"></span>
                </summary>

                <div className="cc-faq-item__answer">
                  <p>
                    Depende del alcance y la complejidad. Primero analizamos la necesidad y después presentamos una propuesta clara, detallada y sin costes ocultos.
                  </p>
                </div>
              </details>

              <details className="cc-faq-item">
                <summary className="cc-faq-item__question">
                  <span className="cc-faq-item__number">08</span>
                  <span className="cc-faq-item__label">
                    ¿Cuánto tarda un proyecto?
                  </span>
                  <span className="cc-faq-item__toggle" aria-hidden="true"></span>
                </summary>

                <div className="cc-faq-item__answer">
                  <p>
                    Depende del tipo de solución. Antes de empezar definimos las etapas, los plazos estimados y las prioridades.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>





      <section className="cc-contact" id="contacto" aria-labelledby="cc-contact-title">
        <p className="cc-contact__ambient" aria-hidden="true">contacto</p>

        <div className="cc-contact__inner">
          <div className="cc-contact__layout">
            <div className="cc-contact__content">
              <div className="cc-contact__eyebrow">
                <img className="cc-brand-mark cc-contact__mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />
                <span>Hablemos de tu empresa</span>
              </div>

              <h2 className="cc-contact__title" id="cc-contact-title">
                ¿Preparado para{' '}
                <em>el siguiente salto?</em>
              </h2>

              <p className="cc-contact__intro">
                Cuéntanos qué está frenando tu empresa. Analizaremos tu situación y te propondremos <strong>el siguiente paso más útil.</strong>
              </p>

              <ul className="cc-contact__benefits">
                <li>Primera conversación sin compromiso.</li>
                <li>Recomendación adaptada a tu empresa.</li>
                <li>Alcance, plazos y costes transparentes.</li>
              </ul>

              <a
                className="cc-contact__whatsapp"
                href="#"
                aria-label="Contactar con ConejoCreative por WhatsApp"
              >
                <span className="cc-contact__whatsapp-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z"
                      stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                    <path d="M9 8.5c.5 3 2 4.5 5 5"
                      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                </span>{' '}
                Hablar ahora por WhatsApp
              </a>
            </div>

            <div className="cc-contact__form-shell">
              <form className="cc-contact__form" noValidate onSubmit={handleSubmit}>
                <header className="cc-contact__form-header">
                  <h3 className="cc-contact__form-title">Cuéntanos qué quieres mejorar</h3>
                  <p className="cc-contact__form-copy">
                    Te responderemos con una orientación clara.
                  </p>
                </header>

                <div className="cc-contact__fields">
                  <div className="cc-contact-field">
                    <label htmlFor="cc-contact-name">Nombre</label>
                    <input
                      id="cc-contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Tu nombre"
                      required />
                  </div>

                  <div className="cc-contact-field">
                    <label htmlFor="cc-contact-company">Empresa</label>
                    <input
                      id="cc-contact-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Nombre de la empresa"
                      required />
                  </div>

                  <div className="cc-contact-field">
                    <label htmlFor="cc-contact-email">Correo electrónico</label>
                    <input
                      id="cc-contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="nombre@empresa.com"
                      required />
                  </div>

                  <div className="cc-contact-field">
                    <label htmlFor="cc-contact-phone">WhatsApp</label>
                    <input
                      id="cc-contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+34 600 000 000"
                      required />
                  </div>

                  <div className="cc-contact-field cc-contact-field--full">
                    <label htmlFor="cc-contact-need">¿Cuál es tu principal necesidad?</label>
                    <select id="cc-contact-need" name="need" required defaultValue="">
                      <option value="" disabled>Selecciona una opción</option>
                      <option value="web">Presencia digital o página web</option>
                      <option value="branding">Branding y posicionamiento</option>
                      <option value="social">Redes sociales y contenidos</option>
                      <option value="attention">Atención, CRM o WhatsApp</option>
                      <option value="software">Software a medida</option>
                      <option value="automation">Automatización e inteligencia artificial</option>
                      <option value="other">Necesito orientación</option>
                    </select>
                  </div>

                  <div className="cc-contact-field">
                    <label htmlFor="cc-contact-deadline">Plazo deseado</label>
                    <select id="cc-contact-deadline" name="deadline" defaultValue="">
                      <option value="">Sin definir</option>
                      <option value="urgent">Lo antes posible</option>
                      <option value="1-2">Entre 1 y 2 meses</option>
                      <option value="3-4">Entre 3 y 4 meses</option>
                      <option value="later">Más adelante</option>
                    </select>
                  </div>

                  <div className="cc-contact-field">
                    <label htmlFor="cc-contact-budget">Presupuesto aproximado</label>
                    <select id="cc-contact-budget" name="budget" defaultValue="">
                      <option value="">Prefiero hablarlo</option>
                      <option value="under-1500">Hasta 1.500 €</option>
                      <option value="1500-3000">Entre 1.500 € y 3.000 €</option>
                      <option value="3000-6000">Entre 3.000 € y 6.000 €</option>
                      <option value="over-6000">Más de 6.000 €</option>
                    </select>
                  </div>

                  <div className="cc-contact-field cc-contact-field--full">
                    <label htmlFor="cc-contact-message">Cuéntanos brevemente qué necesitas</label>
                    <textarea
                      id="cc-contact-message"
                      name="message"
                      placeholder="Qué problema quieres resolver, qué tienes actualmente y qué resultado buscas."
                      required
                    ></textarea>
                  </div>
                </div>

                <label className="cc-contact__consent">
                  <input type="checkbox" name="privacy" required />
                  <span>
                    Acepto la política de privacidad y el uso de mis datos para responder a esta solicitud.
                  </span>
                </label>

                <div className="cc-contact__actions">
                  <button className="cc-contact__submit" type="submit" disabled={sending}>
                    Solicitar diagnóstico
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5"
                        stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <p className="cc-contact__status" data-state={contactStatus.state} aria-live="polite">{contactStatus.text}</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>





      <footer className="cc-footer" aria-labelledby="cc-footer-brand">
        <div className="cc-footer__top-line" aria-hidden="true"></div>

        <div className="cc-footer__pattern" aria-hidden="true">
          <svg viewBox="0 0 1600 520" preserveAspectRatio="none" fill="none">
            <g stroke="#8ee9ff" strokeWidth="2">
              <path opacity=".23" d="M92 126c-18-54 12-94 37-44 12-64 52-56 42 0-8 46-27 82-50 96-26-10-40-27-29-52Z"/>
              <path opacity=".17" d="M218 312c-19-45 8-76 31-34 8-51 39-45 34 0-5 40-22 67-42 78-20-8-30-21-23-44Z"/>
              <path opacity=".20" d="M405 91c-17-52 10-88 34-41 10-57 45-51 38 0-6 43-24 75-45 88-23-9-35-24-27-47Z"/>
              <path opacity=".16" d="M550 368c-16-48 9-82 32-38 9-54 42-47 36 0-6 42-23 70-43 82-22-9-32-23-25-44Z"/>
              <path opacity=".21" d="M730 132c-18-55 11-94 36-44 11-63 50-56 41 0-7 46-26 81-49 95-25-10-39-27-28-51Z"/>
              <path opacity=".16" d="M884 321c-17-49 9-84 33-39 9-55 43-49 37 0-6 42-24 72-44 84-22-9-33-24-26-45Z"/>
              <path opacity=".21" d="M1040 91c-17-52 10-88 34-41 10-57 45-51 38 0-6 43-24 75-45 88-23-9-35-24-27-47Z"/>
              <path opacity=".16" d="M1215 364c-16-48 9-82 32-38 9-54 42-47 36 0-6 42-23 70-43 82-22-9-32-23-25-44Z"/>
              <path opacity=".22" d="M1411 117c-18-54 12-94 37-44 12-64 52-56 42 0-8 46-27 82-50 96-26-10-40-27-29-52Z"/>

              <path opacity=".13" d="M28 411c92-31 121 35 45 49-70 13-111-3-132-26 19-11 48-19 87-23Z"/>
              <path opacity=".13" d="M300 226c89-30 117 34 43 48-68 12-107-4-128-26 19-10 47-18 85-22Z"/>
              <path opacity=".13" d="M635 454c91-31 120 35 44 49-69 12-110-4-131-27 20-10 48-18 87-22Z"/>
              <path opacity=".13" d="M955 227c89-30 117 34 43 48-68 12-107-4-128-26 19-10 47-18 85-22Z"/>
              <path opacity=".13" d="M1285 448c91-31 120 35 44 49-69 12-110-4-131-27 20-10 48-18 87-22Z"/>
            </g>
          </svg>
        </div>

        <div className="cc-footer__inner">
          <div className="cc-footer__main">
            <div className="cc-footer__brand">
              <a className="cc-footer__logo" href="#inicio" id="cc-footer-brand" aria-label="ConejoCreative, volver al inicio">
                <img className="cc-footer__logo-mark" src="/assets/icons/icon-conejo-creative.png" alt="" aria-hidden="true" />

                <span className="cc-footer__logo-name">
                  Conejo<strong>Creative</strong>
                </span>
              </a>

              <p className="cc-footer__description">
                Creamos <strong>webs, software y automatizaciones</strong> que ayudan a las empresas a captar clientes, ahorrar tiempo y crecer con más control.
              </p>

              <div className="cc-footer__socials" aria-label="Redes sociales">
                <a className="cc-footer__social" href="#" aria-label="ConejoCreative en Instagram">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.7"/>
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7"/>
                    <circle cx="17.4" cy="6.8" r="1" fill="currentColor"/>
                  </svg>
                  Instagram
                </a>

                <a className="cc-footer__social" href="#" aria-label="ConejoCreative en LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 9v9M6 6.4v.1M10.5 18v-5.1c0-2 1.2-3.3 3-3.3 1.9 0 3 1.3 3 3.3V18M10.5 10v8"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>

            <nav aria-label="Mapa del sitio">
              <h2 className="cc-footer__column-title">Mapa del sitio</h2>

              <ul className="cc-footer__nav">
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#soluciones">Soluciones</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#como-trabajamos">Cómo trabajamos</a></li>
                <li><a href="#faq">Preguntas frecuentes</a></li>
                <li><a href="#contacto">Contacto</a></li>
              </ul>
            </nav>

            <div>
              <h2 className="cc-footer__column-title">Contacto</h2>

              <ul className="cc-footer__contact-list">
                <li className="cc-footer__contact-item">
                  <span className="cc-footer__contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z"
                        stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                      <path d="M9 8.5c.5 3 2 4.5 5 5"
                        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    </svg>
                  </span>

                  <a href="#">WhatsApp</a>
                </li>

                <li className="cc-footer__contact-item">
                  <span className="cc-footer__contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 6h16v12H4V6Z"
                        stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                      <path d="m5 7 7 6 7-6"
                        stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                    </svg>
                  </span>

                  <a href="mailto:hola@conejocreative.com">
                    hola@conejocreative.com
                  </a>
                </li>

                <li className="cc-footer__contact-item">
                  <span className="cc-footer__contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"
                        stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="2.1" stroke="currentColor" strokeWidth="1.7"/>
                    </svg>
                  </span>

                  <span>Valencia, España</span>
                </li>
              </ul>

              <a className="cc-footer__cta" href="#contacto">
                <span className="cc-footer__cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5"
                      stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>{' '}
                Solicitar diagnóstico
              </a>
            </div>
          </div>

          <div className="cc-footer__bottom">
            <p className="cc-footer__copyright">
              © <span>{year}</span> ConejoCreative.
              Todos los derechos reservados.
            </p>

            <div className="cc-footer__legal">
              <a href="#">Aviso legal</a>
              <a href="#">Política de privacidad</a>
              <a href="#">Política de cookies</a>
              <span>Creado con <span className="cc-footer__heart">♥</span> en Valencia</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

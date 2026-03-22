/* ═══════════════════════════════════════════════════
   script.js — Portfólio Pessoal
   Módulos:
   1. Pixel Avatar (geração programática)
   2. Tema claro / escuro (com persistência)
   3. Active link no menu ao rolar
   4. Scroll Reveal (IntersectionObserver)
   5. Validação e envio simulado do formulário
═══════════════════════════════════════════════════ */

/* ─── 1. PIXEL AVATAR ───────────────────────────── */
/**
 * Gera o avatar em pixel art dinamicamente.
 * O mapa numérico representa as cores:
 *   0 = transparente
 *   1 = roxo principal  (px-p)
 *   2 = roxo claro      (px-l)
 *   3 = roxo escuro     (px-d)
 */
(function gerarPixelAvatar() {
  const mapa = [
    0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 1, 2, 2, 2, 2, 2, 2, 1, 0,
    1, 2, 3, 2, 3, 2, 3, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 3, 2, 2, 2, 2, 3, 2, 1,
    1, 2, 2, 3, 3, 3, 3, 2, 2, 1,
    0, 1, 2, 2, 2, 2, 2, 2, 1, 0,
    0, 0, 1, 2, 2, 2, 2, 1, 0, 0,
    0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  const classes = ['px-0', 'px-p', 'px-l', 'px-d'];
  const container = document.getElementById('pixelAvatar');

  if (!container) return;

  mapa.forEach(function (valor) {
    const pixel = document.createElement('div');
    pixel.className = classes[valor];
    container.appendChild(pixel);
  });
})();


/* ─── 2. TEMA CLARO / ESCURO ────────────────────── */
/**
 * Alterna entre data-theme="dark" e "light" no <html>.
 * Persiste a preferência no localStorage para
 * manter o tema entre visitas.
 */
(function inicializarTema() {
  const html      = document.documentElement;
  const botao     = document.getElementById('themeToggle');
  const CHAVE     = 'tema-portfolio';
  const temaSalvo = localStorage.getItem(CHAVE);

  // Aplicar tema salvo antes de qualquer render
  let modoEscuro = temaSalvo !== 'claro';

  function aplicarTema() {
    if (modoEscuro) {
      html.setAttribute('data-theme', 'dark');
      botao.textContent = '🌙';
    } else {
      html.setAttribute('data-theme', 'light');
      botao.textContent = '☀️';
    }
    localStorage.setItem(CHAVE, modoEscuro ? 'escuro' : 'claro');
  }

  // Aplicar imediatamente ao carregar
  aplicarTema();

  // Alternar ao clicar
  botao.addEventListener('click', function () {
    modoEscuro = !modoEscuro;
    aplicarTema();
  });
})();


/* ─── 3. ACTIVE LINK NO MENU AO ROLAR ───────────── */
/**
 * Observa qual seção está visível na viewport
 * e destaca o link correspondente no menu.
 */
(function ativarLinkNoScroll() {
  const secoes   = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const opcoes = {
    rootMargin: '-40% 0px -55% 0px',
  };

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        // Remove active de todos
        links.forEach(function (link) {
          link.classList.remove('active');
        });

        // Adiciona active ao link da seção visível
        const linkAtivo = document.querySelector(
          '.nav-links a[href="#' + entrada.target.id + '"]'
        );
        if (linkAtivo) {
          linkAtivo.classList.add('active');
        }
      }
    });
  }, opcoes);

  secoes.forEach(function (secao) {
    observador.observe(secao);
  });
})();


/* ─── 4. SCROLL REVEAL ──────────────────────────── */
/**
 * Anima elementos com a classe .reveal
 * quando eles entram na viewport.
 * Usa delay escalonado para grupos de elementos.
 */
(function inicializarScrollReveal() {
  const elementos = document.querySelectorAll('.reveal');

  const opcoes = {
    threshold: 0.12,
  };

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada, indice) {
      if (entrada.isIntersecting) {
        // Delay escalonado para cada elemento
        setTimeout(function () {
          entrada.target.classList.add('visible');
        }, indice * 80);

        // Para de observar após animar
        observador.unobserve(entrada.target);
      }
    });
  }, opcoes);

  elementos.forEach(function (el) {
    observador.observe(el);
  });
})();


/* ─── 5. VALIDAÇÃO DO FORMULÁRIO ────────────────── */
/**
 * Valida os campos Nome, E-mail e Mensagem.
 * Exibe erros individuais por campo.
 * Simula o envio com loading e mensagem de sucesso.
 */
(function inicializarFormulario() {
  const formulario = document.getElementById('contactForm');
  if (!formulario) return;

  const campos = ['nome', 'email', 'mensagem'];

  // Limpa erro ao focar no campo
  campos.forEach(function (id) {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('focus', function () {
        limparErro(id);
      });
    }
  });

  // Valida e-mail com expressão regular
  function validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  // Exibe ou oculta mensagem de erro de um campo
  function mostrarErro(id, idErro, temErro) {
    const campo = document.getElementById(id);
    const erro  = document.getElementById(idErro);

    if (temErro) {
      campo.classList.add('error');
      erro.classList.add('visible');
    } else {
      campo.classList.remove('error');
      erro.classList.remove('visible');
    }

    return !temErro; // true = campo válido
  }

  // Remove erro de um campo
  function limparErro(id) {
    const campo = document.getElementById(id);
    const erro  = document.getElementById(id + 'Error');
    if (campo) campo.classList.remove('error');
    if (erro)  erro.classList.remove('visible');
  }

  // Submissão do formulário
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nome     = document.getElementById('nome').value.trim();
    const email    = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    // Valida cada campo e captura resultado
    const nomeValido     = mostrarErro('nome',     'nomeError',     nome.length < 2);
    const emailValido    = mostrarErro('email',    'emailError',    !validarEmail(email));
    const mensagemValida = mostrarErro('mensagem', 'mensagemError', mensagem.length < 10);

    // Só prossegue se tudo for válido
    if (!nomeValido || !emailValido || !mensagemValida) return;

    // Simula envio
    const botaoEnviar = formulario.querySelector('button[type="submit"]');
    botaoEnviar.textContent = 'Enviando…';
    botaoEnviar.disabled = true;

    setTimeout(function () {
      formulario.style.display = 'none';
      document.getElementById('formSuccess').classList.add('visible');
    }, 1200);
  });
})();
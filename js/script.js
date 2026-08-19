/**
 * script.js — TECCERAMICA
 * -----------------------------------------------------------------------
 * JavaScript Vanilla puro, sem bibliotecas externas. Organizado em
 * pequenas funções, uma por responsabilidade, todas chamadas a partir
 * do init() no final do arquivo. Os dados editáveis (WhatsApp, telefone,
 * e-mail, endereço, horários) vêm de js/config.js — carregado ANTES
 * deste arquivo no index.html, então o objeto `siteConfig` já existe
 * aqui.
 *
 * Sumário:
 *   1. Utilitários (link do WhatsApp, formatação)
 *   2. Aplicação dos dados de config.js no HTML
 *   3. Header: sombra ao rolar + menu mobile
 *   4. Rolagem suave para links internos (fecha o menu mobile)
 *   5. Botão "voltar ao topo"
 *   6. Animações de entrada ao rolar (IntersectionObserver)
 *   7. Filtro do portfólio
 *   8. Lightbox do portfólio
 *   9. Formulário de contato (validação + envio)
 *   10. Ano automático no rodapé
 * -----------------------------------------------------------------------
 */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     1. UTILITÁRIOS
     --------------------------------------------------------------------- */

  /** Monta a URL do WhatsApp (wa.me) com mensagem pré-preenchida. */
  function buildWhatsappUrl(customMessage) {
    var number = (siteConfig.whatsappNumber || "").replace(/\D/g, "");
    var message = encodeURIComponent(customMessage || siteConfig.whatsappMessage || "");
    return "https://wa.me/" + number + (message ? "?text=" + message : "");
  }

  function whatsappConfigured() {
    return Boolean((siteConfig.whatsappNumber || "").replace(/\D/g, "").length >= 10);
  }

  /* ---------------------------------------------------------------------
     2. APLICAÇÃO DOS DADOS DE CONFIG.JS
     --------------------------------------------------------------------- */
  function applySiteConfig() {
    // Todos os links/botões de WhatsApp usam a classe "js-whatsapp-link".
    var whatsappLinks = document.querySelectorAll(".js-whatsapp-link");
    var configured = whatsappConfigured();

    whatsappLinks.forEach(function (link) {
      if (configured) {
        var customMessage = link.getAttribute("data-whatsapp-message");
        link.href = buildWhatsappUrl(customMessage);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        // Sem número configurado ainda: não geramos um link falso.
        link.setAttribute("aria-disabled", "true");
        link.classList.add("is-disabled");
        link.href = "#contato";
        link.title = "WhatsApp ainda não configurado — preencha js/config.js";
      }
    });

    // Telefone
    var phoneEls = document.querySelectorAll(".js-phone-display");
    var phoneLinks = document.querySelectorAll(".js-phone-link");
    if (siteConfig.phoneDisplay) {
      phoneEls.forEach(function (el) {
        el.textContent = siteConfig.phoneDisplay;
      });
      phoneLinks.forEach(function (el) {
        el.href = "tel:" + (siteConfig.phoneDial || siteConfig.phoneDisplay).replace(/\D/g, "");
      });
    } else {
      phoneEls.forEach(function (el) {
        el.textContent = "Telefone em breve";
      });
      phoneLinks.forEach(function (el) {
        el.setAttribute("aria-disabled", "true");
        el.removeAttribute("href");
      });
    }

    // E-mail
    var emailEls = document.querySelectorAll(".js-email-display");
    var emailLinks = document.querySelectorAll(".js-email-link");
    if (siteConfig.email) {
      emailEls.forEach(function (el) {
        el.textContent = siteConfig.email;
      });
      emailLinks.forEach(function (el) {
        el.href = "mailto:" + siteConfig.email;
      });
    } else {
      emailEls.forEach(function (el) {
        el.textContent = "E-mail em breve";
      });
      emailLinks.forEach(function (el) {
        el.setAttribute("aria-disabled", "true");
        el.removeAttribute("href");
      });
    }

    // Endereço
    var addressEls = document.querySelectorAll(".js-address-display");
    var cityStateEls = document.querySelectorAll(".js-city-state");
    var cityState = [siteConfig.address.city, siteConfig.address.state].filter(Boolean).join(" – ");

    addressEls.forEach(function (el) {
      if (siteConfig.address.street) {
        el.textContent = siteConfig.address.street + (siteConfig.address.zip ? " — CEP " + siteConfig.address.zip : "");
      } else {
        el.textContent = "Endereço completo em breve";
      }
    });
    cityStateEls.forEach(function (el) {
      el.textContent = cityState || "Endereço em breve";
    });

    // Horário de funcionamento — existe mais de um bloco ".js-hours-list"
    // na página (seção de contato e rodapé), por isso usamos
    // querySelectorAll e preenchemos todos, respeitando a tag de cada um
    // (uma <ul> no rodapé precisa de <li>, o bloco de contato usa <span>).
    document.querySelectorAll(".js-hours-list").forEach(function (hoursList) {
      hoursList.innerHTML = "";
      var itemTag = hoursList.tagName === "UL" ? "li" : "span";

      if (siteConfig.businessHours && siteConfig.businessHours.length) {
        siteConfig.businessHours.forEach(function (line) {
          var item = document.createElement(itemTag);
          item.textContent = line;
          hoursList.appendChild(item);
        });
      } else {
        var fallback = document.createElement(itemTag);
        fallback.textContent = "Horário de funcionamento em breve";
        hoursList.appendChild(fallback);
      }
    });

    // Redes sociais: oculta ícones sem link configurado
    document.querySelectorAll("[data-social]").forEach(function (el) {
      var key = el.getAttribute("data-social");
      var url = siteConfig.social && siteConfig.social[key];
      if (url) {
        el.href = url;
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      } else {
        el.style.display = "none";
      }
    });

    // CNPJ no rodapé
    var cnpjEl = document.querySelector(".js-cnpj");
    if (cnpjEl) {
      if (siteConfig.cnpj) {
        cnpjEl.textContent = "CNPJ " + siteConfig.cnpj;
      } else {
        cnpjEl.style.display = "none";
      }
    }

    // Mapa incorporado (usa mapQuery até o endereço completo ser definido)
    var mapFrame = document.querySelector(".js-map-frame");
    if (mapFrame) {
      var query = encodeURIComponent(
        siteConfig.address.street
          ? siteConfig.address.street + ", " + cityState
          : siteConfig.mapQuery
      );
      mapFrame.src = "https://www.google.com/maps?q=" + query + "&output=embed";
    }
  }

  /* ---------------------------------------------------------------------
     3. HEADER: sombra ao rolar + menu mobile
     --------------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (!header) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
      });

      // Fecha o menu ao clicar em qualquer link interno
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }
  }

  /* ---------------------------------------------------------------------
     5. BOTÃO "VOLTAR AO TOPO"
     --------------------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 600);
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
     6. ANIMAÇÕES DE ENTRADA AO ROLAR
     --------------------------------------------------------------------- */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     7. FILTRO DO PORTFÓLIO
     --------------------------------------------------------------------- */
  function initPortfolioFilter() {
    var buttons = document.querySelectorAll(".filter-btn");
    var items = document.querySelectorAll(".portfolio__item");
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");

        var category = button.getAttribute("data-filter");

        items.forEach(function (item) {
          var matches = category === "all" || item.getAttribute("data-category") === category;
          item.classList.toggle("is-hidden", !matches);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     8. LIGHTBOX DO PORTFÓLIO
     --------------------------------------------------------------------- */
  function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll(".portfolio__trigger"));
    var lightbox = document.querySelector(".js-lightbox");
    if (!triggers.length || !lightbox) return;

    var imageEl = lightbox.querySelector(".js-lightbox-image");
    var captionEl = lightbox.querySelector(".js-lightbox-caption");
    var closeBtn = lightbox.querySelector(".lightbox__close");
    var prevBtn = lightbox.querySelector(".lightbox__prev");
    var nextBtn = lightbox.querySelector(".lightbox__next");
    var currentIndex = 0;
    var lastFocusedElement = null;

    function openLightbox(index) {
      currentIndex = index;
      updateLightboxContent();
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lastFocusedElement = document.activeElement;
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeydown);
      if (lastFocusedElement) lastFocusedElement.focus();
    }

    function updateLightboxContent() {
      var trigger = triggers[currentIndex];
      var fullSrc = trigger.getAttribute("data-full") || trigger.querySelector("img").src;
      var caption = trigger.getAttribute("data-caption") || "";
      imageEl.src = fullSrc;
      imageEl.alt = trigger.querySelector("img").alt || "";
      captionEl.textContent = caption;
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % triggers.length;
      updateLightboxContent();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      updateLightboxContent();
    }

    function onKeydown(event) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrev();
    }

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", showNext);
    prevBtn.addEventListener("click", showPrev);

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  /* ---------------------------------------------------------------------
     9. FORMULÁRIO DE CONTATO
     --------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.querySelector(".js-contact-form");
    if (!form) return;

    var feedbackSuccess = form.querySelector(".js-feedback-success");
    var feedbackError = form.querySelector(".js-feedback-error");
    var feedbackSuccessText = feedbackSuccess.querySelector(".js-feedback-success-text");
    var feedbackErrorText = feedbackError.querySelector(".js-feedback-error-text");

    var validators = {
      nome: function (value) {
        return value.trim().length >= 3 ? "" : "Informe seu nome completo.";
      },
      clinica: function () {
        return ""; // opcional
      },
      whatsapp: function (value) {
        var digits = value.replace(/\D/g, "");
        return digits.length >= 10 ? "" : "Informe um WhatsApp válido com DDD.";
      },
      email: function (value) {
        if (!value) return ""; // opcional
        var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        return isValid ? "" : "Informe um e-mail válido.";
      },
      cidade: function () {
        return ""; // opcional
      },
      especialidade: function () {
        return ""; // opcional
      },
      mensagem: function (value) {
        return value.trim().length >= 10 ? "" : "Conte um pouco mais sobre o que você precisa (mín. 10 caracteres).";
      },
    };

    // Máscara simples de telefone/WhatsApp: (99) 99999-9999
    var whatsappInput = form.querySelector("#field-whatsapp");
    if (whatsappInput) {
      whatsappInput.addEventListener("input", function () {
        var digits = whatsappInput.value.replace(/\D/g, "").slice(0, 11);
        var formatted = digits;
        if (digits.length > 2) {
          formatted = "(" + digits.slice(0, 2) + ") " + digits.slice(2);
        }
        if (digits.length > 7) {
          formatted = "(" + digits.slice(0, 2) + ") " + digits.slice(2, 7) + "-" + digits.slice(7);
        }
        whatsappInput.value = formatted;
      });
    }

    function showFieldError(field, message) {
      var group = field.closest(".form-group");
      var errorEl = group ? group.querySelector(".form-error") : null;
      if (errorEl) errorEl.textContent = message;
      if (group) group.classList.toggle("has-error", Boolean(message));
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validateField(field) {
      var validator = validators[field.name];
      if (!validator) return true;
      var message = validator(field.value);
      showFieldError(field, message);
      return !message;
    }

    // Validação ao sair do campo (blur)
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field.name || !validators[field.name]) return;
      field.addEventListener("blur", function () {
        validateField(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      feedbackSuccess.classList.remove("is-visible");
      feedbackError.classList.remove("is-visible");

      var isFormValid = true;
      Array.prototype.forEach.call(form.elements, function (field) {
        if (!field.name || !validators[field.name]) return;
        if (!validateField(field)) isFormValid = false;
      });

      if (!isFormValid) {
        feedbackErrorText.textContent = "Verifique os campos destacados antes de enviar.";
        feedbackError.classList.add("is-visible");
        var firstInvalid = form.querySelector(".has-error input, .has-error textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = {
        nome: form.nome.value.trim(),
        clinica: form.clinica.value.trim(),
        whatsapp: form.whatsapp.value.trim(),
        email: form.email.value.trim(),
        cidade: form.cidade.value.trim(),
        especialidade: form.especialidade.value.trim(),
        mensagem: form.mensagem.value.trim(),
      };

      if (siteConfig.formEndpoint) {
        // Backend configurado: envia via fetch (JSON) e trata a resposta.
        fetch(siteConfig.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then(function (response) {
            if (!response.ok) throw new Error("Falha no envio");
            feedbackSuccessText.textContent = "Mensagem enviada! Em breve entraremos em contato.";
            feedbackSuccess.classList.add("is-visible");
            form.reset();
          })
          .catch(function () {
            feedbackErrorText.textContent = "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.";
            feedbackError.classList.add("is-visible");
          });
      } else if (whatsappConfigured()) {
        // Sem backend ainda: encaminha os dados preenchidos para o WhatsApp,
        // em vez de simular um envio que não existe de verdade.
        var whatsappText =
          "Olá! Vim pelo site da Tecceramica.\n" +
          "Nome: " + data.nome + "\n" +
          (data.clinica ? "Clínica: " + data.clinica + "\n" : "") +
          (data.cidade ? "Cidade: " + data.cidade + "\n" : "") +
          (data.especialidade ? "Especialidade: " + data.especialidade + "\n" : "") +
          "Mensagem: " + data.mensagem;

        window.open(buildWhatsappUrl(whatsappText), "_blank", "noopener noreferrer");
        feedbackSuccessText.textContent = "Abrimos o WhatsApp com sua mensagem pronta para envio.";
        feedbackSuccess.classList.add("is-visible");
        form.reset();
      } else {
        feedbackErrorText.textContent =
          "O formulário ainda não está conectado a um backend ou WhatsApp. Configure js/config.js para ativar o envio.";
        feedbackError.classList.add("is-visible");
      }
    });
  }

  /* ---------------------------------------------------------------------
     10. ANO AUTOMÁTICO NO RODAPÉ
     --------------------------------------------------------------------- */
  function initFooterYear() {
    var yearEl = document.querySelector(".js-current-year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------------------
     INICIALIZAÇÃO
     --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    applySiteConfig();
    initHeader();
    initBackToTop();
    initScrollReveal();
    initPortfolioFilter();
    initLightbox();
    initContactForm();
    initFooterYear();
  });
})();

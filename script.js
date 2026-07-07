/* =========================================================
   BARBOSA DEV — GESTÃO DA EMPRESA
   Dados mockados + interações + formulários (modal)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------------------------
     0. ÍCONES REUTILIZÁVEIS
  --------------------------------------------------------- */
  const ICON_EDIT = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ICON_DELETE = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V4h6v3m-8 0l1 13a2 2 0 002 2h4a2 2 0 002-2l1-13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ICON_TREND_UP = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M18 6H9M18 6v9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ICON_TREND_DOWN = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 18H9M18 18V9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  let uidCounter = 1000;
  const nextId = () => `id-${uidCounter++}`;

  const escHtml = (str) => {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  };

  const formatBRL = (value) =>
    Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const initials = (name) =>
    (name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || "")
      .join("") || "??";

  /* ---------------------------------------------------------
     0.1 CLIENTE DA API (dados de caixa)
  --------------------------------------------------------- */
  const API_BASE = "https://api-crm-barbosadev.onrender.com";

  async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`);
    const json = await res.json().catch(() => null);
    if (!res.ok || !json) throw new Error(`Falha ao buscar ${path}`);
    return json;
  }

  async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json) throw new Error(`Falha ao enviar para ${path}`);
    return json;
  }

  async function apiDelete(path) {
    const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
    const json = await res.json().catch(() => ({ success: res.ok }));
    if (!res.ok) throw new Error(`Falha ao excluir ${path}`);
    return json;
  }

  async function apiPut(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json) throw new Error(`Falha ao atualizar ${path}`);
    return json;
  }

  /* ---------------------------------------------------------
     1. DADOS (caixa vem da API; o restante segue mockado)
  --------------------------------------------------------- */
  let caixaData = []; // preenchido via GET /caixa

  const activitiesData = {
    daily: [
      {
        id: nextId(),
        title: "Criar landing page cliente XPTO",
        category: "Desenvolvimento",
        date: "Hoje, 09:40",
        status: "andamento",
        progress: 70,
      },
      {
        id: nextId(),
        title: "Revisar copy da campanha Instagram",
        category: "Marketing",
        date: "Hoje, 11:15",
        status: "pendente",
        progress: 15,
      },
      {
        id: nextId(),
        title: "Reunião de alinhamento com Studio Nix",
        category: "Comercial",
        date: "Hoje, 14:00",
        status: "concluido",
        progress: 100,
      },
      {
        id: nextId(),
        title: "Ajustar responsividade do checkout",
        category: "Desenvolvimento",
        date: "Hoje, 16:30",
        status: "atrasado",
        progress: 40,
      },
    ],
    weekly: [
      {
        id: nextId(),
        title: "Entrega do site institucional Delta Corp",
        category: "Desenvolvimento",
        date: "Seg → Sex",
        status: "andamento",
        progress: 82,
      },
      {
        id: nextId(),
        title: "Setup de tráfego pago — Loja Vitrine",
        category: "Tráfego Pago",
        date: "Ter → Qui",
        status: "andamento",
        progress: 55,
      },
      {
        id: nextId(),
        title: "Manutenção mensal — 6 clientes ativos",
        category: "Manutenção",
        date: "Qua → Sex",
        status: "pendente",
        progress: 20,
      },
      {
        id: nextId(),
        title: "Proposta comercial — Grupo Aurora",
        category: "Comercial",
        date: "Qui",
        status: "concluido",
        progress: 100,
      },
      {
        id: nextId(),
        title: "Otimização de SEO — Clínica Vida+",
        category: "Marketing",
        date: "Sex",
        status: "atrasado",
        progress: 30,
      },
    ],
    monthly: [
      {
        id: nextId(),
        title: "Roadmap de produto — Q3 2026",
        category: "Estratégia",
        date: "Julho/2026",
        status: "andamento",
        progress: 45,
      },
      {
        id: nextId(),
        title: "Fechamento financeiro do mês",
        category: "Financeiro",
        date: "Julho/2026",
        status: "pendente",
        progress: 10,
      },
      {
        id: nextId(),
        title: "Onboarding de 3 novos clientes",
        category: "Comercial",
        date: "Julho/2026",
        status: "andamento",
        progress: 60,
      },
      {
        id: nextId(),
        title: "Campanha institucional de aniversário",
        category: "Marketing",
        date: "Julho/2026",
        status: "concluido",
        progress: 100,
      },
    ],
  };
  let currentPeriod = "daily";

  const statusLabels = {
    andamento: "Em andamento",
    concluido: "Concluído",
    pendente: "Pendente",
    atrasado: "Atrasado",
  };

  let metasData = []; // preenchido via GET /metas

  let clientsData = [
    {
      id: nextId(),
      name: "Empresa XPTO",
      avatar: "XP",
      contact: "WhatsApp",
      site: "xpto.com.br",
      desc: "Landing page para vendas",
      value: 1500,
      service: "Landing Page",
      status: "ativo",
    },
    {
      id: nextId(),
      name: "Delta Corp",
      avatar: "DC",
      contact: "E-mail",
      site: "deltacorp.com",
      desc: "Site institucional completo",
      value: 4200,
      service: "Desenvolvimento",
      status: "ativo",
    },
    {
      id: nextId(),
      name: "Loja Vitrine",
      avatar: "LV",
      contact: "WhatsApp",
      site: "lojavitrine.com.br",
      desc: "E-commerce com integração de pagamento",
      value: 6800,
      service: "E-commerce",
      status: "ativo",
    },
    {
      id: nextId(),
      name: "Clínica Vida+",
      avatar: "CV",
      contact: "Telefone",
      site: "clinicavidamais.com.br",
      desc: "Otimização de SEO e conteúdo",
      value: 950,
      service: "Manutenção",
      status: "pausado",
    },
    {
      id: nextId(),
      name: "Studio Nix",
      avatar: "SN",
      contact: "WhatsApp",
      site: "studionix.design",
      desc: "Tráfego pago para lançamento",
      value: 2300,
      service: "Tráfego Pago",
      status: "ativo",
    },
    {
      id: nextId(),
      name: "Grupo Aurora",
      avatar: "GA",
      contact: "E-mail",
      site: "grupoaurora.com.br",
      desc: "Proposta de site + campanha",
      value: 3100,
      service: "Desenvolvimento",
      status: "proposta",
    },
    {
      id: nextId(),
      name: "Café Raiz",
      avatar: "CR",
      contact: "WhatsApp",
      site: "cafraiz.com.br",
      desc: "Landing page para delivery",
      value: 1200,
      service: "Landing Page",
      status: "ativo",
    },
    {
      id: nextId(),
      name: "Nova Fit",
      avatar: "NF",
      contact: "Instagram",
      site: "novafit.app",
      desc: "Manutenção mensal do site",
      value: 700,
      service: "Manutenção",
      status: "ativo",
    },
  ];

  let campaignsData = [
    {
      id: nextId(),
      name: "Lançamento Loja Vitrine",
      channel: "Meta Ads",
      invested: 500,
      cpi: 3.2,
      cpv: 12,
      leads: 120,
      sales: 15,
      chart: [30, 45, 40, 60, 55, 75, 90],
    },
    {
      id: nextId(),
      name: "Institucional Delta Corp",
      channel: "Google Ads",
      invested: 820,
      cpi: 4.1,
      cpv: 18,
      leads: 96,
      sales: 9,
      chart: [50, 40, 55, 48, 62, 58, 70],
    },
    {
      id: nextId(),
      name: "Reativação Clínica Vida+",
      channel: "Meta Ads",
      invested: 340,
      cpi: 2.8,
      cpv: 9,
      leads: 74,
      sales: 11,
      chart: [20, 35, 30, 42, 50, 45, 60],
    },
    {
      id: nextId(),
      name: "Awareness Studio Nix",
      channel: "TikTok Ads",
      invested: 610,
      cpi: 3.6,
      cpv: 14,
      leads: 150,
      sales: 18,
      chart: [40, 55, 65, 60, 80, 85, 95],
    },
  ];

  const generateChart = () => {
    let v = 30 + Math.random() * 20;
    const arr = [];
    for (let i = 0; i < 7; i++) {
      v += (Math.random() - 0.3) * 15;
      v = Math.max(10, Math.min(100, v));
      arr.push(Math.round(v));
    }
    return arr;
  };

  /* ---------------------------------------------------------
     2. ANIMAÇÃO DE ENTRADA (stagger)
  --------------------------------------------------------- */
  document.querySelectorAll("[data-reveal]").forEach((el, i) => {
    el.style.animationDelay = `${0.15 + i * 0.08}s`;
  });

  /* ---------------------------------------------------------
     3. COUNT-UP / ANÉIS DE PROGRESSO
  --------------------------------------------------------- */
  function animateCountUp(el, duration = 1600) {
    const target = parseFloat(el.dataset.target);
    if (Number.isNaN(target)) return;
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = current.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      if (progress < 1) requestAnimationFrame(tick);
      else
        el.textContent = target.toLocaleString("pt-BR", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
    }
    requestAnimationFrame(tick);
  }

  function animateRing(circle) {
    const progress = parseFloat(circle.dataset.progress) || 0;
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => {
      circle.style.strokeDashoffset =
        circumference - (Math.min(progress, 100) / 100) * circumference;
    });
  }

  /* ---------------------------------------------------------
     4. MODAL — sistema genérico de formulários
  --------------------------------------------------------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalFields = document.getElementById("modalFields");
  const modalForm = document.getElementById("modalForm");
  const modalDelete = document.getElementById("modalDelete");
  const modalCancel = document.getElementById("modalCancel");
  const modalClose = document.getElementById("modalClose");
  const toastEl = document.getElementById("toast");
  let toastTimer = null;
  let modalContext = null;

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  function renderField(f) {
    if (f.type === "custom") return f.html;
    const wrapClass = f.full ? "field field--full" : "field";
    const val = f.value ?? "";
    if (f.type === "select") {
      const opts = f.options
        .map(
          (o) =>
            `<option value="${escHtml(o.value)}" ${String(val) === String(o.value) ? "selected" : ""}>${escHtml(o.label)}</option>`,
        )
        .join("");
      return `<label class="${wrapClass}"><span>${f.label}</span><select name="${f.name}" ${f.required ? "required" : ""}>${opts}</select></label>`;
    }
    if (f.type === "textarea") {
      return `<label class="${wrapClass}"><span>${f.label}</span><textarea name="${f.name}" ${f.required ? "required" : ""} placeholder="${escHtml(f.placeholder || "")}">${escHtml(val)}</textarea></label>`;
    }
    const min = f.min !== undefined ? `min="${f.min}"` : "";
    const max = f.max !== undefined ? `max="${f.max}"` : "";
    const step = f.step ? `step="${f.step}"` : "";
    return `<label class="${wrapClass}"><span>${f.label}</span><input type="${f.type}" name="${f.name}" value="${escHtml(val)}" ${f.required ? "required" : ""} ${min} ${max} ${step} placeholder="${escHtml(f.placeholder || "")}"></label>`;
  }

  function openModal({ title, fields, onSubmit, onDelete, onRender }) {
    modalTitle.textContent = title;
    modalFields.innerHTML = fields.map(renderField).join("");
    modalDelete.hidden = !onDelete;
    modalContext = { onSubmit, onDelete };
    modalOverlay.classList.add("is-open");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (onRender) onRender(modalFields);
    setTimeout(
      () => modalFields.querySelector("input, select, textarea")?.focus(),
      60,
    );
  }

  function closeModal() {
    modalOverlay.classList.remove("is-open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalContext = null;
    modalForm.reset();
  }

  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!modalContext) return;
    const data = new FormData(modalForm);
    const values = {};
    for (const [k, v] of data.entries()) values[k] = v;

    const submitBtn = modalForm.querySelector(".btn--primary");
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Salvando...";

    try {
      await modalContext.onSubmit(values);
      closeModal();
    } catch (err) {
      console.error(err);
      showToast("Não foi possível salvar. Verifique a conexão com a API.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });

  modalDelete.addEventListener("click", () => {
    if (
      modalContext?.onDelete &&
      confirm("Tem certeza que deseja excluir este item?")
    ) {
      modalContext.onDelete();
      closeModal();
    }
  });

  modalCancel.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("is-open"))
      closeModal();
  });

  /* ---------------------------------------------------------
     5. FINANCEIRO — dados reais da API (/caixa, /faturamento, /despesas)
  --------------------------------------------------------- */
  const apiStatusEl = document.getElementById("apiStatus");
  const caixaBody = document.getElementById("caixaBody");
  const caixaEmpty = document.getElementById("caixaEmpty");

  function setApiStatus(state, label) {
    apiStatusEl.classList.remove("is-online", "is-offline");
    if (state) apiStatusEl.classList.add(state);
    apiStatusEl.innerHTML = `<span class="status-dot"></span>${escHtml(label)}`;
  }

  function computeTotals() {
    const totalFaturamento = caixaData.reduce(
      (s, r) => s + Number(r.faturamento || 0),
      0,
    );
    const totalDespesas = caixaData.reduce(
      (s, r) => s + Number(r.despesas || 0),
      0,
    );
    const totalLucro = caixaData.reduce(
      (s, r) =>
        s +
        Number(r.lucro ?? Number(r.faturamento || 0) - Number(r.despesas || 0)),
      0,
    );
    const margin =
      totalFaturamento > 0 ? (totalLucro / totalFaturamento) * 100 : 0;
    return { totalFaturamento, totalDespesas, totalLucro, margin };
  }

  function computeTrend(field) {
    if (caixaData.length < 2) return { percent: 0, dir: "up" };
    const last = Number(caixaData[caixaData.length - 1][field] || 0);
    const prev = Number(caixaData[caixaData.length - 2][field] || 0);
    if (prev === 0) return { percent: 0, dir: "up" };
    const diff = ((last - prev) / prev) * 100;
    return { percent: Math.abs(diff), dir: diff >= 0 ? "up" : "down" };
  }

  function updateTrendUI(trendElId, { percent, dir }) {
    const el = document.getElementById(trendElId);
    el.classList.remove("trend--up", "trend--down");
    el.classList.add(dir === "up" ? "trend--up" : "trend--down");
    el.querySelector("svg").outerHTML =
      dir === "up" ? ICON_TREND_UP : ICON_TREND_DOWN;
    el.querySelector("span").textContent =
      `${percent.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  }

  function renderFinanceCards() {
    const { totalFaturamento, totalDespesas, totalLucro, margin } =
      computeTotals();
    const n = caixaData.length;

    const revenueValueEl = document.getElementById("revenueValue");
    revenueValueEl.dataset.target = totalFaturamento;
    animateCountUp(revenueValueEl);
    updateTrendUI("revenueTrend", computeTrend("faturamento"));
    document.getElementById("revenueNote").textContent = n
      ? `${n} registro${n > 1 ? "s" : ""} na API`
      : "sem registros ainda";

    const profitValueEl = document.getElementById("profitValue");
    profitValueEl.dataset.target = totalLucro;
    animateCountUp(profitValueEl);
    document.getElementById("profitTrend").querySelector("span").textContent =
      `Margem de ${margin.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
    const ring = document.getElementById("profitRing");
    ring.dataset.progress = Math.max(0, Math.min(100, margin));
    animateRing(ring);
    document.getElementById("profitNote").textContent =
      margin >= 50 ? "margem saudável" : n ? "atenção à margem" : "sem dados";

    const expensesValueEl = document.getElementById("expensesValue");
    expensesValueEl.dataset.target = totalDespesas;
    animateCountUp(expensesValueEl);
    updateTrendUI("expensesTrend", computeTrend("despesas"));
    document.getElementById("expensesNote").textContent = n
      ? "com base na API"
      : "sem registros ainda";
  }

  function renderFinanceChart() {
    // sparkline real do card de faturamento
    const polyline = document.querySelector(
      ".fin-card--revenue .fin-card__spark polyline",
    );
    if (polyline) {
      if (caixaData.length === 0) {
        polyline.setAttribute("points", "0,28 100,28");
      } else {
        const values = caixaData.map((r) => Number(r.faturamento || 0));
        const max = Math.max(...values);
        const min = Math.min(...values, 0);
        const range = max - min || 1;
        const stepX = values.length > 1 ? 100 / (values.length - 1) : 0;
        const points = values
          .map((v, i) => {
            const x = values.length > 1 ? i * stepX : 50;
            const y = 28 - ((v - min) / range) * 24;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(" ");
        polyline.setAttribute("points", points);
      }
    }

    // barras reais do card de despesas (últimos 6 registros)
    const barsContainer = document.querySelector(
      ".fin-card--expenses .fin-card__bars",
    );
    if (barsContainer) {
      const values = caixaData.slice(-6).map((r) => Number(r.despesas || 0));
      barsContainer.classList.remove("is-animated");
      if (values.length === 0) {
        barsContainer.innerHTML = Array.from({ length: 6 })
          .map(() => `<span style="--h:4%"></span>`)
          .join("");
      } else {
        const max = Math.max(...values, 1);
        barsContainer.innerHTML = values
          .map(
            (v) => `<span style="--h:${Math.max(4, (v / max) * 100)}%"></span>`,
          )
          .join("");
      }
      requestAnimationFrame(() =>
        setTimeout(() => barsContainer.classList.add("is-animated"), 50),
      );
    }
  }

  function renderCaixaTable() {
    caixaBody.innerHTML = "";
    caixaEmpty.hidden = caixaData.length !== 0;

    caixaData.forEach((r, i) => {
      const lucro = Number(
        r.lucro ?? Number(r.faturamento || 0) - Number(r.despesas || 0),
      );
      const row = document.createElement("tr");
      row.style.animationDelay = `${i * 0.05}s`;
      row.innerHTML = `
        <td>${escHtml(r.data)}</td>
        <td>${formatBRL(r.faturamento)}</td>
        <td>${formatBRL(r.despesas)}</td>
        <td class="${lucro >= 0 ? "text-positive" : "text-negative"}">${formatBRL(lucro)}</td>
        <td class="td-actions">
          <div class="card-actions">
            <button type="button" class="icon-action icon-action--text" data-action="edit-faturamento" data-id="${r.id}" aria-label="Editar faturamento" title="Editar faturamento">${ICON_EDIT}<span>Fat.</span></button>
            <button type="button" class="icon-action icon-action--text" data-action="edit-despesas" data-id="${r.id}" aria-label="Editar despesas" title="Editar despesas">${ICON_EDIT}<span>Desp.</span></button>
            <button type="button" class="icon-action icon-action--danger" data-action="delete-caixa" data-id="${r.id}" aria-label="Excluir registro" title="Excluir registro">${ICON_DELETE}</button>
          </div>
        </td>
      `;
      caixaBody.appendChild(row);
    });
  }

  function renderFinance() {
    renderFinanceCards();
    renderFinanceChart();
    renderCaixaTable();
  }

  async function loadCaixaData({ silent = false } = {}) {
    if (!silent) setApiStatus("", "Conectando à API...");
    try {
      const res = await apiGet("/caixa");
      caixaData = Array.isArray(res.data) ? res.data : [];
      setApiStatus(
        "is-online",
        `Conectado — ${caixaData.length} registro${caixaData.length !== 1 ? "s" : ""}`,
      );
    } catch (err) {
      console.error(err);
      caixaData = [];
      setApiStatus("is-offline", "Não foi possível conectar à API");
      showToast("Falha ao carregar dados de /caixa.");
    } finally {
      renderFinance();
    }
  }

  async function performDeleteCaixa(id) {
    try {
      await apiDelete(`/caixa/${id}`);
      caixaData = caixaData.filter((r) => r.id !== id);
      renderFinance();
      showToast("Registro de caixa excluído.");
    } catch (err) {
      console.error(err);
      showToast("Não foi possível excluir. Verifique a conexão com a API.");
    }
  }

  function deleteCaixaWithConfirm(id) {
    if (
      confirm(
        "Excluir este registro de caixa? Essa ação não pode ser desfeita.",
      )
    )
      performDeleteCaixa(id);
  }

  function openCaixaModal() {
    openModal({
      title: "Novo registro de caixa",
      fields: [
        {
          name: "data",
          label: "Período",
          type: "text",
          required: true,
          full: true,
          value: "",
          placeholder: "Ex: Julho/2026",
        },
        {
          name: "faturamento",
          label: "Faturamento (R$)",
          type: "number",
          step: "0.01",
          required: true,
          value: 0,
        },
        {
          name: "despesas",
          label: "Despesas (R$)",
          type: "number",
          step: "0.01",
          required: true,
          value: 0,
        },
      ],
      async onSubmit(values) {
        const body = {
          data: values.data.trim(),
          faturamento: parseFloat(values.faturamento) || 0,
          despesas: parseFloat(values.despesas) || 0,
        };
        const res = await apiPost("/caixa", body);
        if (res.data) caixaData.push(res.data);
        else await loadCaixaData({ silent: true });
        renderFinance();
        showToast("Registro de caixa adicionado.");
      },
    });
  }

  function openEditFaturamentoModal(id) {
    const record = caixaData.find((r) => r.id === id);
    if (!record) return;
    openModal({
      title: `Atualizar faturamento — ${record.data}`,
      fields: [
        {
          name: "faturamento",
          label: "Novo faturamento (R$)",
          type: "number",
          step: "0.01",
          required: true,
          full: true,
          value: record.faturamento,
        },
      ],
      async onSubmit(values) {
        const novoValor = parseFloat(values.faturamento) || 0;
        const res = await apiPost("/faturamento", {
          id,
          faturamento: novoValor,
        });
        if (res.data) Object.assign(record, res.data);
        else {
          record.faturamento = novoValor;
          record.lucro = novoValor - Number(record.despesas || 0);
        }
        renderFinance();
        showToast("Faturamento atualizado.");
      },
    });
  }

  function openEditDespesasModal(id) {
    const record = caixaData.find((r) => r.id === id);
    if (!record) return;
    openModal({
      title: `Atualizar despesas — ${record.data}`,
      fields: [
        {
          name: "despesas",
          label: "Novas despesas (R$)",
          type: "number",
          step: "0.01",
          required: true,
          full: true,
          value: record.despesas,
        },
      ],
      async onSubmit(values) {
        const novoValor = parseFloat(values.despesas) || 0;
        const res = await apiPost("/despesas", { id, despesas: novoValor });
        if (res.data) Object.assign(record, res.data);
        else {
          record.despesas = novoValor;
          record.lucro = Number(record.faturamento || 0) - novoValor;
        }
        renderFinance();
        showToast("Despesas atualizadas.");
      },
    });
  }

  document
    .getElementById("addCaixaBtn")
    .addEventListener("click", openCaixaModal);

  loadCaixaData();

  /* ---------------------------------------------------------
     6. ATIVIDADES — listar, filtrar, adicionar, editar, excluir
  --------------------------------------------------------- */
  const activityList = document.getElementById("activityList");
  const segmentedBtns = document.querySelectorAll(".segmented__btn");

  function renderActivities(period) {
    currentPeriod = period;
    const items = activitiesData[period] || [];
    activityList.innerHTML = "";

    if (items.length === 0) {
      activityList.innerHTML = `<p class="table-empty">Nenhuma tarefa cadastrada neste período.</p>`;
      return;
    }

    items.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "activity-card";
      card.style.animationDelay = `${i * 0.07}s`;
      card.innerHTML = `
        <div class="activity-card__head">
          <span class="activity-card__title">${escHtml(item.title)}</span>
          <div class="activity-card__head-right">
            <span class="activity-card__status status--${item.status}">${statusLabels[item.status]}</span>
            <div class="card-actions">
              <button type="button" class="icon-action" data-action="edit-activity" data-id="${item.id}" aria-label="Editar tarefa">${ICON_EDIT}</button>
              <button type="button" class="icon-action icon-action--danger" data-action="delete-activity" data-id="${item.id}" aria-label="Excluir tarefa">${ICON_DELETE}</button>
            </div>
          </div>
        </div>
        <div class="activity-card__meta">
          <span class="activity-card__tag">${escHtml(item.category)}</span>
          <span>${escHtml(item.date)}</span>
        </div>
        <div class="activity-card__progress">
          <div class="progress-track"><div class="progress-fill" style="width:0%" data-progress="${item.progress}"></div></div>
          <div class="progress-label"><span>Progresso</span><span>${item.progress}%</span></div>
        </div>
      `;
      activityList.appendChild(card);
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        activityList.querySelectorAll(".progress-fill").forEach((bar) => {
          bar.style.width = bar.dataset.progress + "%";
        });
      }, 50);
    });
  }

  segmentedBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      segmentedBtns.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      renderActivities(btn.dataset.period);
    });
  });

  function performDeleteActivity(period, id) {
    activitiesData[period] = activitiesData[period].filter((a) => a.id !== id);
    renderActivities(currentPeriod);
    showToast("Tarefa excluída.");
  }
  function deleteActivityWithConfirm(period, id) {
    if (confirm("Excluir esta tarefa?")) performDeleteActivity(period, id);
  }

  function openActivityModal(period, id) {
    const isEdit = !!id;
    const item = isEdit
      ? activitiesData[period].find((a) => a.id === id)
      : null;

    const fields = [
      {
        name: "title",
        label: "Título da tarefa",
        type: "text",
        required: true,
        full: true,
        value: item?.title || "",
      },
      {
        name: "category",
        label: "Categoria",
        type: "text",
        required: true,
        value: item?.category || "",
      },
      {
        name: "date",
        label: "Data / prazo",
        type: "text",
        required: true,
        value: item?.date || "",
        placeholder: "Ex: Hoje, 14:00",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        value: item?.status || "pendente",
        options: [
          { value: "pendente", label: "Pendente" },
          { value: "andamento", label: "Em andamento" },
          { value: "concluido", label: "Concluído" },
          { value: "atrasado", label: "Atrasado" },
        ],
      },
      {
        name: "progress",
        label: "Progresso (%)",
        type: "number",
        required: true,
        min: 0,
        max: 100,
        value: item?.progress ?? 0,
      },
      {
        name: "period",
        label: "Período",
        type: "select",
        required: true,
        value: period,
        options: [
          { value: "daily", label: "Diário" },
          { value: "weekly", label: "Semanal" },
          { value: "monthly", label: "Mensal" },
        ],
      },
    ];

    openModal({
      title: isEdit ? "Editar tarefa" : "Nova tarefa",
      fields,
      onSubmit(values) {
        const progress = Math.max(
          0,
          Math.min(100, parseInt(values.progress, 10) || 0),
        );
        const payload = {
          title: values.title.trim(),
          category: values.category.trim(),
          date: values.date.trim(),
          status: values.status,
          progress,
        };
        const targetPeriod = values.period;

        if (isEdit) {
          activitiesData[period] = activitiesData[period].filter(
            (a) => a.id !== id,
          );
          activitiesData[targetPeriod].unshift({ id, ...payload });
        } else {
          activitiesData[targetPeriod].unshift({ id: nextId(), ...payload });
        }

        if (targetPeriod !== currentPeriod) {
          segmentedBtns.forEach((b) => {
            const isTarget = b.dataset.period === targetPeriod;
            b.classList.toggle("is-active", isTarget);
            b.setAttribute("aria-selected", String(isTarget));
          });
        }
        renderActivities(targetPeriod);
        showToast(isEdit ? "Tarefa atualizada." : "Tarefa adicionada.");
      },
      onDelete: isEdit ? () => performDeleteActivity(period, id) : null,
    });
  }

  document
    .getElementById("addActivityBtn")
    .addEventListener("click", () => openActivityModal(currentPeriod, null));

  renderActivities("daily");

  /* ---------------------------------------------------------
     7. METAS — meta principal + metas secundárias
  --------------------------------------------------------- */
  const goalMainEl = document.getElementById("goalMain");
  const goalListEl = document.getElementById("goalList");

  function renderGoals() {
    const mainGoal = metasData.find((m) => m.type === "lucro");
    const secondary = metasData.filter((m) => m.type !== "lucro");

    if (mainGoal) {
      const target = parseFloat(mainGoal.name) || 0;
      const current = parseFloat(mainGoal.description) || 0;
      const pct =
        target > 0
          ? Math.min(100, Math.round((current / target) * 1000) / 10)
          : 0;
      goalMainEl.innerHTML = `
        <div class="card-actions">
          <button type="button" class="icon-action" data-action="edit-goal-main" data-id="${mainGoal.id_meta}" aria-label="Editar meta mensal">${ICON_EDIT}</button>
          <button type="button" class="icon-action icon-action--danger" data-action="delete-goal" data-id="${mainGoal.id_meta}" aria-label="Excluir meta mensal">${ICON_DELETE}</button>
        </div>
        <div class="goal-main__labels">
          <span>Meta mensal</span>
          <span class="goal-main__value">R$ <span class="count-up" data-target="${target}" data-decimals="0">0</span></span>
        </div>
        <div class="goal-bar"><div class="goal-bar__fill" id="goalMainFill" data-progress="${pct}" style="width:0%"></div></div>
        <div class="goal-main__foot">
          <span>Atual: <strong>R$ <span class="count-up" data-target="${current}" data-decimals="0">0</span></strong></span>
          <span class="goal-main__pct">${pct.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</span>
        </div>
      `;
    } else {
      goalMainEl.innerHTML = `
        <div class="goal-main__empty">
          <p>Nenhuma meta de lucro cadastrada ainda.</p>
          <button type="button" class="add-btn" data-action="create-main-goal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
            Definir meta mensal
          </button>
        </div>
      `;
    }

    goalListEl.innerHTML = "";
    if (secondary.length === 0) {
      goalListEl.innerHTML = `<li class="table-empty">Nenhuma meta adicional cadastrada.</li>`;
    }
    secondary.forEach((g, i) => {
      const progress = Math.max(0, Math.min(100, g.progress ?? 0));
      const li = document.createElement("li");
      li.className = "goal-item";
      li.style.animationDelay = `${i * 0.07}s`;
      li.innerHTML = `
        <div class="goal-ring">
          <svg viewBox="0 0 44 44">
            <circle class="ring__track" cx="22" cy="22" r="18"></circle>
            <circle class="ring__value" cx="22" cy="22" r="18" data-progress="${progress}"></circle>
          </svg>
          <span class="goal-ring__pct">${progress}%</span>
        </div>
        <div class="goal-item__info">
          <span class="goal-item__title">${escHtml(g.name)}</span>
          <span class="goal-item__sub">${escHtml(g.description)}</span>
        </div>
        <div class="card-actions">
          <button type="button" class="icon-action" data-action="edit-goal" data-id="${g.id_meta}" aria-label="Editar meta">${ICON_EDIT}</button>
          <button type="button" class="icon-action icon-action--danger" data-action="delete-goal" data-id="${g.id_meta}" aria-label="Excluir meta">${ICON_DELETE}</button>
        </div>
      `;
      goalListEl.appendChild(li);
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        goalMainEl
          .querySelectorAll(".count-up")
          .forEach((el) => animateCountUp(el, 1200));
        const fill = document.getElementById("goalMainFill");
        if (fill) fill.style.width = fill.dataset.progress + "%";
        goalListEl.querySelectorAll(".ring__value").forEach(animateRing);
      }, 50);
    });
  }

  async function loadMetasData() {
    try {
      const res = await apiGet("/metas");
      metasData = Array.isArray(res.data)
        ? res.data
        : res.data
          ? [res.data]
          : [];
    } catch (err) {
      console.error(err);
      metasData = [];
      showToast("Falha ao carregar metas da API.");
    } finally {
      renderGoals();
    }
  }

  async function performDeleteGoal(id) {
    try {
      await apiDelete(`/metas/${id}`);
      metasData = metasData.filter((m) => m.id_meta !== id);
      renderGoals();
      showToast("Meta excluída.");
    } catch (err) {
      console.error(err);
      showToast(
        "Não foi possível excluir a meta. Verifique a conexão com a API.",
      );
    }
  }
  function deleteGoalWithConfirm(id) {
    if (confirm("Excluir esta meta?")) performDeleteGoal(id);
  }

  function getGoalPrefill(type, meta) {
    if (!meta || meta.type !== type) {
      return type === "lucro"
        ? { targetValue: 0, currentValue: 0 }
        : { name: "", description: "", progress: 0 };
    }
    return type === "lucro"
      ? {
          targetValue: parseFloat(meta.name) || 0,
          currentValue: parseFloat(meta.description) || 0,
        }
      : {
          name: meta.name || "",
          description: meta.description || "",
          progress: meta.progress ?? 0,
        };
  }

  function paintGoalValueFields(container, type, meta) {
    const anchor = container.querySelector("#metaValueFields");
    if (!anchor) return;
    const p = getGoalPrefill(type, meta);
    const fields =
      type === "lucro"
        ? [
            {
              name: "targetValue",
              label: "Meta mensal (R$)",
              type: "number",
              step: "0.01",
              required: true,
              value: p.targetValue,
            },
            {
              name: "currentValue",
              label: "Valor atual (R$)",
              type: "number",
              step: "0.01",
              required: true,
              value: p.currentValue,
            },
          ]
        : [
            {
              name: "name",
              label: "Nome da meta",
              type: "text",
              required: true,
              full: true,
              value: p.name,
            },
            {
              name: "description",
              label: "Detalhe / descrição",
              type: "text",
              required: true,
              full: true,
              value: p.description,
              placeholder: "Ex: 8 de 10 fechados",
            },
            {
              name: "progress",
              label: "Progresso (%)",
              type: "number",
              required: true,
              min: 0,
              max: 100,
              value: p.progress,
            },
          ];
    anchor.innerHTML = fields.map(renderField).join("");
  }

  function openGoalModal(id, defaultType = "meta") {
    const isEdit = !!id;
    const meta = isEdit ? metasData.find((m) => m.id_meta === id) : null;
    const initialType = meta?.type || defaultType;

    openModal({
      title: isEdit ? "Editar meta" : "Nova meta",
      fields: [
        {
          name: "type",
          label: "Tipo de meta",
          type: "select",
          required: true,
          value: initialType,
          options: [
            { value: "lucro", label: "Lucro (meta mensal)" },
            { value: "meta", label: "Meta padrão" },
          ],
        },
        {
          name: "dataCaixa",
          label: "Referente ao caixa (mês)",
          type: "select",
          required: true,
          full: true,
          value: meta?.dataCaixa || caixaData[0]?.id || "",
          options: caixaData.length
            ? caixaData.map((r) => ({ value: r.id, label: r.data }))
            : [{ value: "", label: "Nenhum registro de caixa disponível" }],
        },
        {
          type: "custom",
          html: '<div class="field--full" id="metaValueFields" style="display:grid;grid-template-columns:1fr 1fr;gap:14px 12px;"></div>',
        },
      ],
      onRender(container) {
        const typeSelect = container.querySelector('[name="type"]');
        paintGoalValueFields(container, typeSelect.value, meta);
        typeSelect.addEventListener("change", () =>
          paintGoalValueFields(container, typeSelect.value, meta),
        );
      },
      async onSubmit(values) {
        const type = values.type;
        let payload;

        if (type === "lucro") {
          const target = parseFloat(values.targetValue) || 0;
          const current = parseFloat(values.currentValue) || 0;
          const progress =
            target > 0 ? Math.round((current / target) * 1000) / 10 : 0;
          payload = {
            name: String(target),
            description: String(current),
            dataCaixa: values.dataCaixa,
            type: "lucro",
            progress,
          };
        } else {
          payload = {
            name: values.name.trim(),
            description: values.description.trim(),
            dataCaixa: values.dataCaixa,
            type: "meta",
            progress: Math.max(
              0,
              Math.min(100, parseInt(values.progress, 10) || 0),
            ),
          };
        }

        if (isEdit) {
          const res = await apiPut("/metas", { id, data: payload });
          Object.assign(meta, res.data || payload);
        } else {
          const res = await apiPost("/metas", payload);
          metasData.push(res.data || { id_meta: nextId(), ...payload });
        }
        renderGoals();
        showToast(isEdit ? "Meta atualizada." : "Meta adicionada.");
      },
      onDelete: isEdit ? () => performDeleteGoal(id) : null,
    });
  }

  document
    .getElementById("addGoalBtn")
    .addEventListener("click", () => openGoalModal(null, "meta"));

  loadMetasData();

  /* ---------------------------------------------------------
     8. CLIENTES — tabela, busca, filtro, adicionar/editar/excluir
  --------------------------------------------------------- */
  const clientsBody = document.getElementById("clientsBody");
  const clientsEmpty = document.getElementById("clientsEmpty");
  const clientSearch = document.getElementById("clientSearch");
  const serviceFilter = document.getElementById("serviceFilter");

  const statusBadgeLabels = {
    ativo: "Ativo",
    proposta: "Em proposta",
    pausado: "Pausado",
  };
  const contactIcons = {
    WhatsApp: "💬",
    "E-mail": "✉️",
    Telefone: "📞",
    Instagram: "📸",
  };

  function renderClients() {
    const query = clientSearch.value.trim().toLowerCase();
    const service = serviceFilter.value;

    const filtered = clientsData.filter((c) => {
      const matchesQuery =
        c.name.toLowerCase().includes(query) ||
        c.desc.toLowerCase().includes(query);
      const matchesService = service === "todos" || c.service === service;
      return matchesQuery && matchesService;
    });

    clientsBody.innerHTML = "";
    clientsEmpty.hidden = filtered.length !== 0;

    filtered.forEach((c, i) => {
      const row = document.createElement("tr");
      row.style.animationDelay = `${i * 0.05}s`;
      row.innerHTML = `
        <td>
          <div class="client-name">
            <span class="client-avatar">${escHtml(c.avatar)}</span>
            ${escHtml(c.name)}
          </div>
        </td>
        <td><span class="contact-link">${contactIcons[c.contact] || ""} ${escHtml(c.contact)}</span></td>
        <td><a class="site-link" href="#" onclick="return false;">${escHtml(c.site)}</a></td>
        <td><span class="client-desc">${escHtml(c.desc)}</span></td>
        <td><span class="client-value">${formatBRL(c.value)}</span></td>
        <td><span class="service-tag">${escHtml(c.service)}</span></td>
        <td><span class="status-badge status-badge--${c.status}">${statusBadgeLabels[c.status]}</span></td>
        <td class="td-actions">
          <div class="card-actions">
            <button type="button" class="icon-action" data-action="edit-client" data-id="${c.id}" aria-label="Editar cliente">${ICON_EDIT}</button>
            <button type="button" class="icon-action icon-action--danger" data-action="delete-client" data-id="${c.id}" aria-label="Excluir cliente">${ICON_DELETE}</button>
          </div>
        </td>
      `;
      clientsBody.appendChild(row);
    });
  }

  clientSearch.addEventListener("input", renderClients);
  serviceFilter.addEventListener("change", renderClients);

  function performDeleteClient(id) {
    clientsData = clientsData.filter((c) => c.id !== id);
    renderClients();
    showToast("Cliente removido.");
  }
  function deleteClientWithConfirm(id) {
    if (confirm("Excluir este cliente?")) performDeleteClient(id);
  }

  function openClientModal(id) {
    const isEdit = !!id;
    const c = isEdit ? clientsData.find((x) => x.id === id) : null;

    openModal({
      title: isEdit ? "Editar cliente" : "Novo cliente",
      fields: [
        {
          name: "name",
          label: "Nome do cliente",
          type: "text",
          required: true,
          full: true,
          value: c?.name || "",
        },
        {
          name: "contact",
          label: "Contato",
          type: "select",
          required: true,
          value: c?.contact || "WhatsApp",
          options: [
            { value: "WhatsApp", label: "WhatsApp" },
            { value: "E-mail", label: "E-mail" },
            { value: "Telefone", label: "Telefone" },
            { value: "Instagram", label: "Instagram" },
          ],
        },
        {
          name: "site",
          label: "Site",
          type: "text",
          required: true,
          value: c?.site || "",
          placeholder: "exemplo.com.br",
        },
        {
          name: "value",
          label: "Valor (R$)",
          type: "number",
          step: "0.01",
          required: true,
          value: c?.value ?? 0,
        },
        {
          name: "service",
          label: "Serviço",
          type: "select",
          required: true,
          value: c?.service || "Desenvolvimento",
          options: [
            { value: "Desenvolvimento", label: "Desenvolvimento" },
            { value: "Landing Page", label: "Landing Page" },
            { value: "E-commerce", label: "E-commerce" },
            { value: "Tráfego Pago", label: "Tráfego Pago" },
            { value: "Manutenção", label: "Manutenção" },
          ],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          value: c?.status || "ativo",
          options: [
            { value: "ativo", label: "Ativo" },
            { value: "proposta", label: "Em proposta" },
            { value: "pausado", label: "Pausado" },
          ],
        },
        {
          name: "desc",
          label: "Descrição",
          type: "textarea",
          required: true,
          full: true,
          value: c?.desc || "",
        },
      ],
      onSubmit(values) {
        const payload = {
          name: values.name.trim(),
          avatar: initials(values.name),
          contact: values.contact,
          site: values.site.trim(),
          desc: values.desc.trim(),
          value: parseFloat(values.value) || 0,
          service: values.service,
          status: values.status,
        };
        if (isEdit) Object.assign(c, payload);
        else clientsData.unshift({ id: nextId(), ...payload });
        renderClients();
        showToast(isEdit ? "Cliente atualizado." : "Cliente adicionado.");
      },
      onDelete: isEdit ? () => performDeleteClient(id) : null,
    });
  }

  document
    .getElementById("addClientBtn")
    .addEventListener("click", () => openClientModal(null));

  renderClients();

  /* ---------------------------------------------------------
     9. CAMPANHAS — cards, adicionar/editar/excluir
  --------------------------------------------------------- */
  const campaignGrid = document.getElementById("campaignGrid");

  function renderCampaigns() {
    campaignGrid.innerHTML = "";

    if (campaignsData.length === 0) {
      campaignGrid.innerHTML = `<p class="table-empty">Nenhuma campanha cadastrada.</p>`;
      return;
    }

    campaignsData.forEach((camp, i) => {
      const maxVal = Math.max(...camp.chart, 1);
      const card = document.createElement("div");
      card.className = "campaign-card";
      card.style.animationDelay = `${i * 0.08}s`;
      const bars = camp.chart
        .map((v) => `<span style="--h:${(v / maxVal) * 100}%"></span>`)
        .join("");

      card.innerHTML = `
        <div class="campaign-card__head">
          <div class="campaign-card__head-info">
            <span class="campaign-card__name">${escHtml(camp.name)}</span>
            <span class="campaign-card__channel">${escHtml(camp.channel)}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="icon-action" data-action="edit-campaign" data-id="${camp.id}" aria-label="Editar campanha">${ICON_EDIT}</button>
            <button type="button" class="icon-action icon-action--danger" data-action="delete-campaign" data-id="${camp.id}" aria-label="Excluir campanha">${ICON_DELETE}</button>
          </div>
        </div>
        <div class="campaign-card__stats">
          <div class="campaign-stat"><span class="campaign-stat__label">Investido</span><span class="campaign-stat__value">${formatBRL(camp.invested)}</span></div>
          <div class="campaign-stat"><span class="campaign-stat__label">Interessados</span><span class="campaign-stat__value">${camp.leads}</span></div>
          <div class="campaign-stat"><span class="campaign-stat__label">CPI</span><span class="campaign-stat__value">${formatBRL(camp.cpi)}</span></div>
          <div class="campaign-stat"><span class="campaign-stat__label">CPV</span><span class="campaign-stat__value">${formatBRL(camp.cpv)}</span></div>
        </div>
        <div class="campaign-card__chart">${bars}</div>
        <div class="campaign-card__conv">
          <span>Vendas geradas</span>
          <strong>${camp.sales} vendas</strong>
        </div>
      `;
      campaignGrid.appendChild(card);
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        campaignGrid
          .querySelectorAll(".campaign-card__chart")
          .forEach((el) => el.classList.add("is-animated"));
      }, 100);
    });
  }

  function performDeleteCampaign(id) {
    campaignsData = campaignsData.filter((c) => c.id !== id);
    renderCampaigns();
    showToast("Campanha removida.");
  }
  function deleteCampaignWithConfirm(id) {
    if (confirm("Excluir esta campanha?")) performDeleteCampaign(id);
  }

  function openCampaignModal(id) {
    const isEdit = !!id;
    const c = isEdit ? campaignsData.find((x) => x.id === id) : null;

    openModal({
      title: isEdit ? "Editar campanha" : "Nova campanha",
      fields: [
        {
          name: "name",
          label: "Nome da campanha",
          type: "text",
          required: true,
          full: true,
          value: c?.name || "",
        },
        {
          name: "channel",
          label: "Canal",
          type: "select",
          required: true,
          value: c?.channel || "Meta Ads",
          options: [
            { value: "Meta Ads", label: "Meta Ads" },
            { value: "Google Ads", label: "Google Ads" },
            { value: "TikTok Ads", label: "TikTok Ads" },
            { value: "LinkedIn Ads", label: "LinkedIn Ads" },
          ],
        },
        {
          name: "invested",
          label: "Valor investido (R$)",
          type: "number",
          step: "0.01",
          required: true,
          value: c?.invested ?? 0,
        },
        {
          name: "cpi",
          label: "CPI (R$)",
          type: "number",
          step: "0.01",
          required: true,
          value: c?.cpi ?? 0,
        },
        {
          name: "cpv",
          label: "CPV (R$)",
          type: "number",
          step: "0.01",
          required: true,
          value: c?.cpv ?? 0,
        },
        {
          name: "leads",
          label: "Interessados",
          type: "number",
          required: true,
          min: 0,
          value: c?.leads ?? 0,
        },
        {
          name: "sales",
          label: "Vendas",
          type: "number",
          required: true,
          min: 0,
          value: c?.sales ?? 0,
        },
      ],
      onSubmit(values) {
        const payload = {
          name: values.name.trim(),
          channel: values.channel,
          invested: parseFloat(values.invested) || 0,
          cpi: parseFloat(values.cpi) || 0,
          cpv: parseFloat(values.cpv) || 0,
          leads: parseInt(values.leads, 10) || 0,
          sales: parseInt(values.sales, 10) || 0,
        };
        if (isEdit) {
          Object.assign(c, payload);
        } else {
          campaignsData.unshift({
            id: nextId(),
            ...payload,
            chart: generateChart(),
          });
        }
        renderCampaigns();
        showToast(isEdit ? "Campanha atualizada." : "Campanha adicionada.");
      },
      onDelete: isEdit ? () => performDeleteCampaign(id) : null,
    });
  }

  document
    .getElementById("addCampaignBtn")
    .addEventListener("click", () => openCampaignModal(null));

  renderCampaigns();

  /* ---------------------------------------------------------
     10. DELEGAÇÃO GLOBAL DE CLIQUES (editar/excluir nos itens)
  --------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;

    switch (action) {
      case "edit-activity":
        openActivityModal(currentPeriod, id);
        break;
      case "delete-activity":
        deleteActivityWithConfirm(currentPeriod, id);
        break;
      case "edit-goal-main":
        openGoalModal(id, "lucro");
        break;
      case "create-main-goal":
        openGoalModal(null, "lucro");
        break;
      case "edit-goal":
        openGoalModal(id);
        break;
      case "delete-goal":
        deleteGoalWithConfirm(id);
        break;
      case "edit-client":
        openClientModal(id);
        break;
      case "delete-client":
        deleteClientWithConfirm(id);
        break;
      case "edit-campaign":
        openCampaignModal(id);
        break;
      case "delete-campaign":
        deleteCampaignWithConfirm(id);
        break;
      case "edit-faturamento":
        openEditFaturamentoModal(id);
        break;
      case "edit-despesas":
        openEditDespesasModal(id);
        break;
      case "delete-caixa":
        deleteCaixaWithConfirm(id);
        break;
    }
  });

  /* ---------------------------------------------------------
     11. TOPBAR — sombra ao rolar
  --------------------------------------------------------- */
  const topbar = document.getElementById("topbar");
  window.addEventListener("scroll", () => {
    topbar.style.boxShadow =
      window.scrollY > 8 ? "0 12px 30px -18px rgba(0,0,0,0.7)" : "none";
  });
});

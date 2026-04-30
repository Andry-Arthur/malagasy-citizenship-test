(() => {
  "use strict";

  const APP_VERSION = "1.0.0";
  const DEFAULT_LANG = "mg";
  const LANGS = /** @type {const} */ (["mg", "fr", "en"]);

  /** @typedef {"mg"|"fr"|"en"} Lang */

  /** @type {Record<Lang, Record<string, string>>} */
  const UI = {
    mg: {
      appTitle: "Malagasy Citizenship Screening Test",
      appSubtitle: "Fanontaniana fanazaran-tena amin’ny teny Malagasy, Frantsay, na Anglisy.",
      startTitle: "Atomboka ny fitsapana",
      startBody:
        "Ity dia fanazaran-tena fotsiny. Tsy fitsapana ofisialy izy ity, ary tsy manolo ny torohevitra ara-dalàna na ny toromarika avy amin’ny tompon’andraikitra.",
      startButton: "Hanomboka",
      pickLanguage: "Fidio ny fiteny",
      question: "Fanontaniana",
      of: "amin’ny",
      next: "Manaraka",
      back: "Miverina",
      finish: "Vita",
      restart: "Averina indray",
      reviewAnswers: "Jereo ny valiny",
      yourScore: "Isa azonao",
      feedbackGood: "Tena tsara. Tohizo ny famerenana sy famakiana.",
      feedbackOk: "Tsara. Mbola mila fanazaran-tena kely.",
      feedbackLow: "Aza kivy. Avereno indray ary vakio ny lohahevitra fototra.",
      submitStatusOn: "Mandefa vokatra (tsy misy mombamomba anao).",
      submitStatusOff: "Tsy mandefa vokatra (ao an-toerana ihany).",
      submitOk: "Vokatra voaray.",
      submitFail: "Tsy afaka nandefa vokatra (tsy misy olana).",
      timeTaken: "Fotoana lany",
      seconds: "segondra",
      minutes: "minitra",
      privacyNote:
        "Tsy mandefa anarana na mailaka izahay. Ny isa, fiteny, ary fotoana lany ihany no alefa raha mandeha ny backend.",
    },
    fr: {
      appTitle: "Test de présélection de citoyenneté malgache",
      appSubtitle: "Questions d’entraînement en malgache, français ou anglais.",
      startTitle: "Commencer le test",
      startBody:
        "Ceci est un quiz d’entraînement. Il ne s’agit pas d’un examen officiel et il ne remplace pas les informations fournies par les autorités compétentes.",
      startButton: "Démarrer",
      pickLanguage: "Choisir la langue",
      question: "Question",
      of: "sur",
      next: "Suivant",
      back: "Précédent",
      finish: "Terminer",
      restart: "Recommencer",
      reviewAnswers: "Revoir les réponses",
      yourScore: "Votre score",
      feedbackGood: "Très bien. Continuez à réviser et à lire.",
      feedbackOk: "Bien. Un peu plus de pratique aidera.",
      feedbackLow: "Courage. Recommencez et révisez les notions de base.",
      submitStatusOn: "Envoi des résultats (anonymes).",
      submitStatusOff: "Résultats non envoyés (local uniquement).",
      submitOk: "Résultat enregistré.",
      submitFail: "Impossible d’envoyer (ce n’est pas grave).",
      timeTaken: "Temps écoulé",
      seconds: "secondes",
      minutes: "minutes",
      privacyNote:
        "Nous n’envoyons ni nom ni email. Seulement le score, la langue et la durée si le backend est activé.",
    },
    en: {
      appTitle: "Malagasy Citizenship Screening Test",
      appSubtitle: "Practice questions in Malagasy, French, or English.",
      startTitle: "Start the test",
      startBody:
        "This is a practice quiz. It is not an official government examination and does not replace guidance from the relevant authorities.",
      startButton: "Start",
      pickLanguage: "Choose language",
      question: "Question",
      of: "of",
      next: "Next",
      back: "Back",
      finish: "Finish",
      restart: "Restart",
      reviewAnswers: "Review answers",
      yourScore: "Your score",
      feedbackGood: "Great work. Keep reviewing and reading.",
      feedbackOk: "Good. A bit more practice will help.",
      feedbackLow: "Keep going. Try again and review the basics.",
      submitStatusOn: "Submitting results (anonymous).",
      submitStatusOff: "Not submitting results (local only).",
      submitOk: "Result received.",
      submitFail: "Could not submit (that’s okay).",
      timeTaken: "Time taken",
      seconds: "seconds",
      minutes: "minutes",
      privacyNote:
        "We do not send names or emails. Only score, language, and duration if the backend is enabled.",
    },
  };

  /**
   * Each question has:
   * - `prompt` translated to mg/fr/en
   * - `choices` translated to mg/fr/en
   * - `correctIndex` (shared across languages)
   *
   * Notes:
   * - These are practice questions, not an official exam.
   */
  const QUESTIONS = [
    {
      id: "geo_capital",
      category: "Civics & Geography",
      prompt: {
        mg: "Inona no renivohitr’i Madagasikara?",
        fr: "Quelle est la capitale de Madagascar ?",
        en: "What is the capital of Madagascar?",
      },
      choices: {
        mg: ["Antananarivo", "Toamasina", "Mahajanga", "Fianarantsoa"],
        fr: ["Antananarivo", "Toamasina", "Mahajanga", "Fianarantsoa"],
        en: ["Antananarivo", "Toamasina", "Mahajanga", "Fianarantsoa"],
      },
      correctIndex: 0,
    },
    {
      id: "geo_island",
      category: "Geography",
      prompt: {
        mg: "Madagasikara dia nosy ao amin’ny ranomasina iza?",
        fr: "Madagascar est une île dans quel océan ?",
        en: "Madagascar is an island in which ocean?",
      },
      choices: {
        mg: ["Ranomasimbe Indianina", "Ranomasimbe Atlantika", "Ranomasina Pasifika", "Ranomasina Mediterane"],
        fr: ["Océan Indien", "Océan Atlantique", "Océan Pacifique", "Mer Méditerranée"],
        en: ["Indian Ocean", "Atlantic Ocean", "Pacific Ocean", "Mediterranean Sea"],
      },
      correctIndex: 0,
    },
    {
      id: "lang_official",
      category: "Culture & Language",
      prompt: {
        mg: "Iza amin’ireto no anisan’ny fiteny ofisialy ao Madagasikara?",
        fr: "Laquelle de ces langues est une langue officielle à Madagascar ?",
        en: "Which of these is an official language in Madagascar?",
      },
      choices: {
        mg: ["Malagasy", "Portogey", "Sinoa", "Alemà"],
        fr: ["Le malgache", "Le portugais", "Le chinois", "L’allemand"],
        en: ["Malagasy", "Portuguese", "Chinese", "German"],
      },
      correctIndex: 0,
    },
    {
      id: "flag_colors",
      category: "Symbols",
      prompt: {
        mg: "Inona avy ireo loko hita amin’ny sainam-pirenena Malagasy?",
        fr: "Quelles couleurs figurent sur le drapeau malgache ?",
        en: "Which colors appear on the Malagasy flag?",
      },
      choices: {
        mg: ["Fotsy, mena, maitso", "Manga, fotsy, mena", "Mainty, mavo, mena", "Mena, volomboasary, maitso"],
        fr: ["Blanc, rouge, vert", "Bleu, blanc, rouge", "Noir, jaune, rouge", "Rouge, orange, vert"],
        en: ["White, red, green", "Blue, white, red", "Black, yellow, red", "Red, orange, green"],
      },
      correctIndex: 0,
    },
    {
      id: "geo_regions_count",
      category: "Administration",
      prompt: {
        mg: "Firy eo ho eo ny faritra (régions) ao Madagasikara?",
        fr: "Combien de régions y a-t-il à Madagascar (environ) ?",
        en: "Approximately how many regions are there in Madagascar?",
      },
      choices: {
        mg: ["22", "6", "12", "30"],
        fr: ["22", "6", "12", "30"],
        en: ["22", "6", "12", "30"],
      },
      correctIndex: 0,
    },
    {
      id: "civics_republic",
      category: "Civics",
      prompt: {
        mg: "Madagasikara dia firenena amin’ny rafitra inona?",
        fr: "Madagascar est un pays avec quel régime ?",
        en: "Madagascar is a country with what form of government?",
      },
      choices: {
        mg: ["Repoblika", "Fanjakana mpanjaka", "Empira", "Fanjakana federaly"],
        fr: ["République", "Monarchie", "Empire", "État fédéral"],
        en: ["Republic", "Monarchy", "Empire", "Federal state"],
      },
      correctIndex: 0,
    },
    {
      id: "culture_independence_month",
      category: "History",
      prompt: {
        mg: "Amin’ny volana firy no ankalazaina matetika ny fetim-pirenena (Fahaleovantena) ao Madagasikara?",
        fr: "En quel mois célèbre-t-on généralement la fête nationale (Indépendance) à Madagascar ?",
        en: "In which month is Madagascar’s Independence Day typically celebrated?",
      },
      choices: {
        mg: ["Jona", "Janoary", "Martsa", "Oktobra"],
        fr: ["Juin", "Janvier", "Mars", "Octobre"],
        en: ["June", "January", "March", "October"],
      },
      correctIndex: 0,
    },
    {
      id: "geo_main_city_port",
      category: "Geography",
      prompt: {
        mg: "Iza amin’ireto no tanàna lehibe amorontsiraka any atsinanana?",
        fr: "Laquelle de ces villes est une grande ville portuaire sur la côte Est ?",
        en: "Which of these is a major port city on the east coast?",
      },
      choices: {
        mg: ["Toamasina", "Antsiranana", "Toliara", "Ambositra"],
        fr: ["Toamasina", "Antsiranana", "Toliara", "Ambositra"],
        en: ["Toamasina", "Antsiranana", "Toliara", "Ambositra"],
      },
      correctIndex: 0,
    },
    {
      id: "civics_citizen_rights",
      category: "Civics",
      prompt: {
        mg: "Iza amin’ireto no ohatra amin’ny zo fototra (amin’ny ankapobeny)?",
        fr: "Lequel de ces éléments est un exemple de droit fondamental (en général) ?",
        en: "Which of these is an example of a fundamental right (in general)?",
      },
      choices: {
        mg: ["Fahalalahana miteny", "Tsy maintsy mandoa hetra foana", "Tsy mahazo mifidy mihitsy", "Tsy mahazo mianatra"],
        fr: ["Liberté d’expression", "Obligation de payer des impôts", "Interdiction permanente de voter", "Interdiction d’étudier"],
        en: ["Freedom of expression", "Always paying taxes", "Never being allowed to vote", "Not being allowed to study"],
      },
      correctIndex: 0,
    },
    {
      id: "civics_duties",
      category: "Civics",
      prompt: {
        mg: "Iza amin’ireto no adidy iombonan’ny olom-pirenena (amin’ny ankapobeny)?",
        fr: "Lequel de ces éléments est un devoir civique courant (en général) ?",
        en: "Which of these is a common civic duty (in general)?",
      },
      choices: {
        mg: ["Manaja ny lalàna", "Manao herisetra", "Mandà ny fitsipika rehetra", "Manimba fananana iombonana"],
        fr: ["Respecter la loi", "User de violence", "Refuser toutes les règles", "Détruire les biens publics"],
        en: ["Respecting the law", "Using violence", "Rejecting all rules", "Damaging public property"],
      },
      correctIndex: 0,
    },
    {
      id: "env_biodiversity",
      category: "Environment",
      prompt: {
        mg: "Inona no mampiavaka an’i Madagasikara eo amin’ny zava-maniry sy biby?",
        fr: "Qu’est-ce qui caractérise Madagascar en termes de faune et de flore ?",
        en: "What is Madagascar known for regarding plants and animals?",
      },
      choices: {
        mg: ["Biby sy zava-maniry maro tsy fahita afa-tsy eto (endémique)", "Tsy misy karazany miavaka", "Tsy misy ala velively", "Biby an-dranomasina ihany"],
        fr: ["Beaucoup d’espèces endémiques", "Aucune espèce particulière", "Aucune forêt", "Uniquement des espèces marines"],
        en: ["Many endemic species", "No distinctive species", "No forests at all", "Only marine animals"],
      },
      correctIndex: 0,
    },
    {
      id: "culture_fihavanana",
      category: "Culture",
      prompt: {
        mg: "Inona no hevitra ankapoben’ny teny hoe “fihavanana”?",
        fr: "Que signifie généralement le terme « fihavanana » ?",
        en: "What does “fihavanana” generally refer to?",
      },
      choices: {
        mg: ["Firaisankina sy fihavanam-piarahamonina", "Fifaninanana tsy misy farany", "Fandavana ny fianakaviana", "Fanaovana tsinontsinona ny hafa"],
        fr: ["Solidarité et lien social", "Compétition permanente", "Rejet de la famille", "Mépris des autres"],
        en: ["Solidarity and social bonds", "Endless competition", "Rejecting family", "Disrespecting others"],
      },
      correctIndex: 0,
    },
    {
      id: "geo_neighbor_ocean",
      category: "Geography",
      prompt: {
        mg: "Iza no firenena lehibe indrindra akaiky an’i Madagasikara manerana ny Lakandranon’i Mozambika?",
        fr: "Quel grand pays se trouve en face de Madagascar de l’autre côté du canal du Mozambique ?",
        en: "Which large country lies across the Mozambique Channel from Madagascar?",
      },
      choices: {
        mg: ["Mozambika", "Alzeria", "Gabon", "Somalia"],
        fr: ["Le Mozambique", "L’Algérie", "Le Gabon", "La Somalie"],
        en: ["Mozambique", "Algeria", "Gabon", "Somalia"],
      },
      correctIndex: 0,
    },
    {
      id: "civics_respect_symbols",
      category: "Civics & Symbols",
      prompt: {
        mg: "Inona no fihetsika mety haneho fanajana ny sainam-pirenena?",
        fr: "Quel comportement peut montrer du respect envers le drapeau national ?",
        en: "Which action can show respect for the national flag?",
      },
      choices: {
        mg: ["Mitahiry azy amin’ny toerana madio sy mendrika", "Mampiasa azy ho lamba fanadiovana", "Manipy azy amin’ny tany", "Manimba azy an-tsitrapo"],
        fr: ["Le conserver proprement et dignement", "L’utiliser comme chiffon", "Le jeter au sol", "Le dégrader volontairement"],
        en: ["Keeping it clean and properly stored", "Using it as a cleaning cloth", "Throwing it on the ground", "Damaging it on purpose"],
      },
      correctIndex: 0,
    },
    {
      id: "history_kingdom",
      category: "History",
      prompt: {
        mg: "Iza amin’ireto no anisan’ny fanjakana manan-tantara teo afovoan-tany taloha?",
        fr: "Lequel de ces royaumes est historiquement associé aux Hautes Terres ?",
        en: "Which kingdom is historically associated with the central highlands?",
      },
      choices: {
        mg: ["Merina", "Zulu", "Maya", "Viking"],
        fr: ["Merina", "Zoulou", "Maya", "Viking"],
        en: ["Merina", "Zulu", "Maya", "Viking"],
      },
      correctIndex: 0,
    },
    {
      id: "civics_law",
      category: "Civics",
      prompt: {
        mg: "Inona no anjara asan’ny lalàna amin’ny fiarahamonina (amin’ny ankapobeny)?",
        fr: "Quel est le rôle de la loi dans une société (en général) ?",
        en: "What is the role of law in society (in general)?",
      },
      choices: {
        mg: ["Mampandamina sy miaro zo", "Manimba hatrany", "Tsy misy ilana azy", "Manome tombontsoa ho an’olona vitsy ihany"],
        fr: ["Organiser et protéger les droits", "Toujours nuire", "Ne servir à rien", "Servir uniquement une minorité"],
        en: ["Organize society and protect rights", "Always cause harm", "Be useless", "Only benefit a few people"],
      },
      correctIndex: 0,
    },
    {
      id: "culture_family",
      category: "Culture",
      prompt: {
        mg: "Amin’ny kolontsaina maro eto Madagasikara, inona no anjara toerana lehibe an’ny fianakaviana?",
        fr: "Dans de nombreuses cultures à Madagascar, quel rôle important joue la famille ?",
        en: "In many Malagasy communities, what important role does family often play?",
      },
      choices: {
        mg: ["Fanohanana sy firaisankina", "Fisarahana tanteraka", "Tsy misy ifandraisany", "Fifandirana tsy mitsahatra"],
        fr: ["Soutien et solidarité", "Séparation totale", "Aucun lien", "Conflit permanent"],
        en: ["Support and solidarity", "Complete separation", "No connection", "Constant conflict"],
      },
      correctIndex: 0,
    },
    {
      id: "geo_climate",
      category: "Geography",
      prompt: {
        mg: "Amin’ny ankapobeny, ahoana ny toetr’andro eto Madagasikara?",
        fr: "De manière générale, quel est le climat de Madagascar ?",
        en: "In general, what is Madagascar’s climate like?",
      },
      choices: {
        mg: ["Mafana tropikaly misy vanim-potoana", "Mangatsiaka arktika", "Maina efitra tanteraka", "Tsy miova mandrakariva"],
        fr: ["Tropical avec des saisons", "Arctique", "Désertique partout", "Toujours identique"],
        en: ["Tropical with seasons", "Arctic", "Desert everywhere", "Always the same"],
      },
      correctIndex: 0,
    },
    {
      id: "civics_community",
      category: "Civics",
      prompt: {
        mg: "Iza amin’ireto no fomba iray tsara handray anjara amin’ny fiarahamonina?",
        fr: "Lequel est un bon moyen de participer à la vie civique ?",
        en: "Which is a good way to participate in civic life?",
      },
      choices: {
        mg: ["Manao asa an-tsitrapo sy manampy", "Manimba fananana iombonana", "Mampiely tsaho", "Manararaotra ny hafa"],
        fr: ["Faire du bénévolat et aider", "Détruire les biens publics", "Propager des rumeurs", "Exploiter les autres"],
        en: ["Volunteering and helping", "Damaging public property", "Spreading rumors", "Exploiting others"],
      },
      correctIndex: 0,
    },
    {
      id: "history_currency",
      category: "Economy",
      prompt: {
        mg: "Inona no vola ampiasaina eto Madagasikara?",
        fr: "Quelle est la monnaie utilisée à Madagascar ?",
        en: "What currency is used in Madagascar?",
      },
      choices: {
        mg: ["Ariary", "Franc CFA", "Rand", "Euro"],
        fr: ["Ariary", "Franc CFA", "Rand", "Euro"],
        en: ["Ariary", "CFA franc", "Rand", "Euro"],
      },
      correctIndex: 0,
    },
    {
      id: "civics_public_services",
      category: "Civics",
      prompt: {
        mg: "Inona no atao hoe “tolotra ho an’ny daholobe” (ohatra)?",
        fr: "Lequel est un exemple de « service public » ?",
        en: "Which is an example of a public service?",
      },
      choices: {
        mg: ["Sekoly sy tobim-pahasalamana", "Tsy fampianarana mihitsy", "Serivisy miafina manokana", "Fanaovana tsirambina ny lalàna"],
        fr: ["Écoles et centres de santé", "Aucune éducation", "Service secret privé", "Ignorer la loi"],
        en: ["Schools and health centers", "No education at all", "Private secret service", "Ignoring the law"],
      },
      correctIndex: 0,
    },
    {
      id: "culture_respect_elders",
      category: "Culture",
      prompt: {
        mg: "Amin’ny fomba amam-panao maro, inona no lanjan’ny fanajana ny zokiolona?",
        fr: "Dans de nombreuses traditions, quelle est l’importance du respect des aînés ?",
        en: "In many traditions, why is respecting elders important?",
      },
      choices: {
        mg: ["Fanehoana hasina sy fianarana amin’ny traikefa", "Satria tsy misy akory ny zokiolona", "Mba hanakantsakana ny fianarana", "Tsy misy ifandraisany amin’ny fiainana"],
        fr: ["Montrer du respect et apprendre de l’expérience", "Parce qu’il n’y a pas d’aînés", "Pour empêcher l’apprentissage", "Sans lien avec la vie"],
        en: ["Showing respect and learning from experience", "Because elders do not exist", "To prevent learning", "It has no relevance"],
      },
      correctIndex: 0,
    },
    {
      id: "geo_highlands",
      category: "Geography",
      prompt: {
        mg: "Aiza no misy ny “Hautes Terres” (afovoan-tany) amin’ny ankapobeny?",
        fr: "Où se situent généralement les Hautes Terres (plateau central) ?",
        en: "Where are the Highlands (central plateau) generally located?",
      },
      choices: {
        mg: ["Eo afovoan’ny nosy", "Any amin’ny ranomasina", "Any amin’ny tendrontany", "Any amin’ny nosy hafa"],
        fr: ["Au centre de l’île", "En mer", "Aux pôles", "Sur une autre île"],
        en: ["In the center of the island", "In the sea", "At the poles", "On another island"],
      },
      correctIndex: 0,
    },
  ];

  const STORAGE = {
    lang: "mct_lang",
    lastResult: "mct_last_result",
  };

  /** @param {unknown} v */
  function isLang(v) {
    return typeof v === "string" && /** @type {string[]} */ (LANGS).includes(v);
  }

  /** @returns {Lang} */
  function loadLang() {
    try {
      const v = localStorage.getItem(STORAGE.lang);
      if (isLang(v)) return /** @type {Lang} */ (v);
    } catch {}
    return DEFAULT_LANG;
  }

  /** @param {Lang} lang */
  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE.lang, lang);
    } catch {}
  }

  /** @param {number} min @param {number} max */
  function clamp(min, max) {
    return (n) => Math.max(min, Math.min(max, n));
  }
  const clamp01 = clamp(0, 1);

  /** @param {number} ms */
  function formatDuration(lang, ms) {
    const seconds = Math.max(0, Math.round(ms / 1000));
    if (seconds < 120) return `${seconds} ${UI[lang].seconds}`;
    const minutes = Math.round(seconds / 60);
    return `${minutes} ${UI[lang].minutes}`;
  }

  /** @template {HTMLElement} T @param {string} sel @param {ParentNode} root */
  function q(sel, root = document) {
    const el = root.querySelector(sel);
    if (!el) throw new Error(`Missing element: ${sel}`);
    return /** @type {T} */ (el);
  }

  /** @param {string} s */
  function escapeHtml(s) {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function cryptoUUID() {
    if (globalThis.crypto && "randomUUID" in globalThis.crypto) return globalThis.crypto.randomUUID();
    const r = () => Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0");
    return `${r()}-${r().slice(0, 4)}-${r().slice(0, 4)}-${r().slice(0, 4)}-${r()}`;
  }

  function getWorkerUrl() {
    const v = /** @type {any} */ (globalThis).__WORKER_URL__;
    if (typeof v !== "string") return "";
    const trimmed = v.trim().replace(/\/+$/, "");
    return trimmed;
  }

  /** @param {Lang} lang */
  function renderAppShell(lang) {
    document.documentElement.lang = lang;

    return `
      <div class="app">
        <main class="container">
          <header class="topbar">
            <div class="brand" aria-label="${escapeHtml(UI[lang].appTitle)}">
              <h1 class="brand__title">${escapeHtml(UI[lang].appTitle)}</h1>
              <p class="brand__subtitle">${escapeHtml(UI[lang].appSubtitle)}</p>
            </div>
            <label class="pill" for="langSelect">
              <span class="sr-only">${escapeHtml(UI[lang].pickLanguage)}</span>
              <select id="langSelect" class="select">
                <option value="mg">Malagasy</option>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </label>
          </header>
          <div id="view"></div>
        </main>
      </div>
    `;
  }

  /** @param {Lang} lang */
  function renderStart(lang) {
    const workerUrl = getWorkerUrl();
    const submitNote = workerUrl ? UI[lang].submitStatusOn : UI[lang].submitStatusOff;
    return `
      <section class="card" aria-label="${escapeHtml(UI[lang].startTitle)}">
        <div class="card__header">
          <h2 class="card__title">${escapeHtml(UI[lang].startTitle)}</h2>
          <p class="card__meta">${escapeHtml(UI[lang].startBody)}</p>
        </div>
        <div class="card__body">
          <p class="helper">${escapeHtml(submitNote)}<br>${escapeHtml(UI[lang].privacyNote)}</p>
          <div class="actions">
            <button class="btn btn--primary" id="startBtn">${escapeHtml(UI[lang].startButton)}</button>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * @param {Lang} lang
   * @param {number} idx
   * @param {number} total
   * @param {{ id: string; category: string; prompt: Record<Lang, string>; choices: Record<Lang, string[]>; correctIndex: number }} qn
   * @param {number | null} selectedIndex
   */
  function renderQuestion(lang, idx, total, qn, selectedIndex) {
    const progress = clamp01((idx + 1) / total) * 100;
    const choices = qn.choices[lang]
      .map((c, i) => {
        const checked = selectedIndex === i ? "checked" : "";
        return `
          <label class="choice">
            <input type="radio" name="choice" value="${i}" ${checked} />
            <span class="choice__label">${escapeHtml(c)}</span>
          </label>
        `;
      })
      .join("");

    return `
      <section class="card" aria-label="${escapeHtml(UI[lang].question)} ${idx + 1}">
        <div class="card__header">
          <div class="question">
            <div class="question__category"><span class="question__categoryDot"></span>${escapeHtml(qn.category)}</div>
            <h2 class="card__title">
              ${escapeHtml(UI[lang].question)} ${idx + 1} ${escapeHtml(UI[lang].of)} ${total}
            </h2>
            <div class="progress" aria-hidden="true">
              <div class="progress__bar" style="width:${progress.toFixed(2)}%"></div>
            </div>
            <p class="question__text">${escapeHtml(qn.prompt[lang])}</p>
          </div>
        </div>
        <div class="card__body">
          <form id="choiceForm" class="choices">${choices}</form>
          <div class="actions">
            <button class="btn" id="backBtn" ${idx === 0 ? "disabled" : ""}>${escapeHtml(UI[lang].back)}</button>
            <button class="btn btn--primary" id="nextBtn" disabled>
              ${escapeHtml(idx === total - 1 ? UI[lang].finish : UI[lang].next)}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * @param {Lang} lang
   * @param {{ score: number; total: number; durationMs: number; answers: number[]; submissionId: string }} result
   * @param {{ id: string; category: string; prompt: Record<Lang, string>; choices: Record<Lang, string[]>; correctIndex: number }[]} quizQuestions
   * @param {boolean} submitted
   * @param {string | null} submitError
   */
  function renderResults(lang, result, quizQuestions, submitted, submitError) {
    const pct = result.total === 0 ? 0 : result.score / result.total;
    let badge = { cls: "badge--bad", text: UI[lang].feedbackLow };
    if (pct >= 0.8) badge = { cls: "", text: UI[lang].feedbackGood };
    else if (pct >= 0.55) badge = { cls: "badge--warn", text: UI[lang].feedbackOk };

    const workerUrl = getWorkerUrl();
    const submitLine = workerUrl
      ? submitted
        ? UI[lang].submitOk
        : submitError
          ? UI[lang].submitFail
          : UI[lang].submitStatusOn
      : UI[lang].submitStatusOff;

    const reviewItems = quizQuestions
      .map((q, i) => {
        const selected = result.answers[i];
        const ok = selected === q.correctIndex;
        const userChoice = q.choices[lang][selected] ?? "";
        const correctChoice = q.choices[lang][q.correctIndex] ?? "";
        const label = ok ? "✔" : "✘";
        const detail = ok ? escapeHtml(userChoice) : `${escapeHtml(userChoice)} → ${escapeHtml(correctChoice)}`;
        return `
          <div class="score">
            <div class="helper">${label} ${escapeHtml(q.category)}</div>
            <div>${escapeHtml(q.prompt[lang])}</div>
            <div class="helper">${detail}</div>
          </div>
        `;
      })
      .join("");

    return `
      <section class="card" aria-label="${escapeHtml(UI[lang].yourScore)}">
        <div class="card__header">
          <h2 class="card__title">${escapeHtml(UI[lang].yourScore)}</h2>
          <p class="card__meta">${escapeHtml(UI[lang].timeTaken)}: ${escapeHtml(formatDuration(lang, result.durationMs))}</p>
        </div>
        <div class="card__body">
          <div class="score">
            <div class="score__value">${result.score} / ${result.total}</div>
            <span class="badge ${badge.cls}">${escapeHtml(badge.text)}</span>
            <div class="helper">${escapeHtml(submitLine)}</div>
          </div>
          <div class="actions">
            <button class="btn btn--primary" id="restartBtn">${escapeHtml(UI[lang].restart)}</button>
            <button class="btn" id="toggleReviewBtn">${escapeHtml(UI[lang].reviewAnswers)}</button>
          </div>
          <div id="review" style="display:none; margin-top: 12px;">
            <div style="display:grid; gap: 10px;">${reviewItems}</div>
          </div>
        </div>
      </section>
    `;
  }

  /** @param {Lang} lang */
  function setFooterText(lang) {
    const footer = document.getElementById("app-footer");
    if (!footer) return;
    const p = footer.querySelector(".app-footer__text");
    if (!p) return;
    // Keep the footer as English-only by default; we can localize later without changing the disclaimer meaning.
    if (lang === "mg") {
      p.textContent = "Fanazaran-tena fotsiny ity. Tsy fitsapana ofisialy avy amin’ny fanjakana izy ity.";
    } else if (lang === "fr") {
      p.textContent = "Ceci est un quiz d’entraînement. Ce n’est pas un examen officiel du gouvernement.";
    } else {
      p.textContent = "This is a practice screening quiz for educational purposes only. It is not an official government examination.";
    }
  }

  function main() {
    const app = document.getElementById("app");
    if (!app) return;

    /** @type {Lang} */
    let lang = loadLang();

    /** @type {"start" | "quiz" | "results"} */
    let route = "start";

    /** @type {number} */
    let index = 0;

    /** @type {{ id: string; category: string; prompt: Record<Lang, string>; choices: Record<Lang, string[]>; correctIndex: number }[]} */
    let quizQuestions = [];

    /** @type {number[]} */
    let answers = [];

    /** @type {number} */
    let startedAt = 0;

    /** @type {{ score: number; total: number; durationMs: number; answers: number[]; submissionId: string } | null} */
    let lastResult = null;

    /** @type {boolean} */
    let submitted = false;

    /** @type {string | null} */
    let submitError = null;

    function setLang(nextLang) {
      lang = nextLang;
      saveLang(lang);
      setFooterText(lang);
      render();
    }

    function pickQuestions() {
      // Fixed-size sample for a quick test. If fewer available, take all.
      const count = Math.min(12, QUESTIONS.length);
      const shuffled = QUESTIONS.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      quizQuestions = shuffled.slice(0, count);
      answers = new Array(quizQuestions.length).fill(-1);
    }

    function startQuiz() {
      route = "quiz";
      index = 0;
      submitted = false;
      submitError = null;
      startedAt = Date.now();
      pickQuestions();
      render();
    }

    function computeScore() {
      let score = 0;
      for (let i = 0; i < quizQuestions.length; i++) {
        if (answers[i] === quizQuestions[i].correctIndex) score++;
      }
      return score;
    }

    async function submitResult(result) {
      const base = getWorkerUrl();
      if (!base) return { ok: false, skipped: true };
      try {
        const payload = {
          version: APP_VERSION,
          submissionId: result.submissionId,
          language: lang,
          score: result.score,
          totalQuestions: result.total,
          durationMs: result.durationMs,
          clientTs: new Date().toISOString(),
        };
        const res = await fetch(`${base}/api/results`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) return { ok: false, skipped: false };
        return { ok: true, skipped: false };
      } catch {
        return { ok: false, skipped: false };
      }
    }

    async function finishQuiz() {
      const durationMs = Date.now() - startedAt;
      const score = computeScore();
      lastResult = { score, total: quizQuestions.length, durationMs, answers: answers.slice(), submissionId: cryptoUUID() };
      route = "results";
      render();

      try {
        localStorage.setItem(STORAGE.lastResult, JSON.stringify({ ...lastResult, lang, storedAt: new Date().toISOString() }));
      } catch {}

      const out = await submitResult(lastResult);
      submitted = out.ok;
      submitError = out.ok || out.skipped ? null : "submit_failed";
      render();
    }

    function render() {
      app.innerHTML = renderAppShell(lang);
      const langSelect = q(/** @type {any} */ ("#langSelect"), app);
      langSelect.value = lang;
      langSelect.addEventListener("change", (e) => {
        const v = /** @type {HTMLSelectElement} */ (e.currentTarget).value;
        if (isLang(v)) setLang(/** @type {Lang} */ (v));
      });

      setFooterText(lang);

      const view = q(/** @type {any} */ ("#view"), app);

      if (route === "start") {
        view.innerHTML = renderStart(lang);
        q(/** @type {any} */ ("#startBtn"), view).addEventListener("click", () => startQuiz());
        return;
      }

      if (route === "quiz") {
        const qn = quizQuestions[index];
        const selected = answers[index] >= 0 ? answers[index] : null;
        view.innerHTML = renderQuestion(lang, index, quizQuestions.length, qn, selected);

        const nextBtn = q(/** @type {any} */ ("#nextBtn"), view);
        const backBtn = q(/** @type {any} */ ("#backBtn"), view);
        const form = q(/** @type {any} */ ("#choiceForm"), view);

        const updateNextEnabled = () => {
          nextBtn.disabled = answers[index] < 0;
        };

        updateNextEnabled();
        form.addEventListener("change", (e) => {
          const t = /** @type {HTMLInputElement} */ (e.target);
          if (!t || t.name !== "choice") return;
          const v = Number(t.value);
          if (Number.isFinite(v)) answers[index] = v;
          updateNextEnabled();
        });

        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (index <= 0) return;
          index--;
          render();
        });

        nextBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          if (answers[index] < 0) return;
          if (index >= quizQuestions.length - 1) {
            await finishQuiz();
            return;
          }
          index++;
          render();
        });
        return;
      }

      if (route === "results" && lastResult) {
        view.innerHTML = renderResults(lang, lastResult, quizQuestions, submitted, submitError);
        q(/** @type {any} */ ("#restartBtn"), view).addEventListener("click", () => {
          route = "start";
          render();
        });
        q(/** @type {any} */ ("#toggleReviewBtn"), view).addEventListener("click", () => {
          const review = q(/** @type {any} */ ("#review"), view);
          const isHidden = review.style.display === "none" || review.style.display === "";
          review.style.display = isHidden ? "block" : "none";
        });
        return;
      }
    }

    render();
  }

  window.addEventListener("DOMContentLoaded", main);
})();

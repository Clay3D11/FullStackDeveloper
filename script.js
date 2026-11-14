/* ==========================================================================
   ClainerDev.com
   1. Helpers
   2. Toggles (core skills, resume tags and details, project details)
   3. Projects, Services, Process, Contact cards + popup content
   4. Scroll reveal
   5. Mobile menu
   6. Popups (Projects, Services, Process, Contact, Bio, Resume)
   7. Contact form (Web3Forms)
   ========================================================================== */

/* ---------- 1. Helpers ---------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menuButton = $(".menu-button");
const siteNav = $(".site-nav");
const projectsModal = $("#projectsModal");
const servicesModal = $("#servicesModal");
const processModal = $("#processModal");
const contactModal = $("#contactModal");
const bioModal = $(".bio-modal");
const resumeModal = $("[aria-labelledby='resumeTitle']");
const contactForm = $("#contactForm");
const formStatus = $(".form-status");

/* ---------- 2. Toggles ---------- */
function setupToggle(button, target) {
  if (!button || !target) return;

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    target.hidden = isOpen;
  });
}

/* Builds a "View ..." button that shows and hides `content` */
function makeToggle({ wrapperClass, buttonClass = "tag-toggle-button", label, ariaLabel, contentId }) {
  const wrapper = document.createElement("div");
  const button = document.createElement("button");

  wrapper.className = wrapperClass;
  button.className = buttonClass;
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", contentId);
  if (ariaLabel) button.setAttribute("aria-label", ariaLabel);

  return { wrapper, button };
}

/* Resume: each tag list collapses behind "View <section title>" */
$$(".resume-body .resume-tags").forEach((list, index) => {
  if (list.closest(".tag-toggle")) return;

  const title = list.closest("section")?.querySelector("h3")?.textContent?.replace(/:$/, "").trim();
  list.id ||= `resumeTags${index + 1}`;
  list.hidden = true;
  list.classList.add("tag-toggle-list");

  const { wrapper, button } = makeToggle({
    wrapperClass: "tag-toggle",
    label: title ? `View ${title}` : "View tags",
    contentId: list.id,
  });

  list.before(wrapper);
  wrapper.append(button, list);
  setupToggle(button, list);
});

/* Resume: job paragraphs collapse behind "View details" */
$$(".resume-body [data-resume-details]").forEach((item, index) => {
  if (item.querySelector(".resume-details-toggle")) return;

  const paragraphs = [...item.children].filter((child) => child.tagName === "P" && !child.classList.contains("eyebrow"));
  if (!paragraphs.length) return;

  const details = document.createElement("div");
  details.id = `resumeDetails${index + 1}`;
  details.className = "resume-details tag-toggle-list";
  details.hidden = true;

  const { wrapper, button } = makeToggle({
    wrapperClass: "tag-toggle resume-details-toggle",
    label: "View details",
    contentId: details.id,
  });

  paragraphs[0].before(wrapper);
  paragraphs.forEach((paragraph) => details.append(paragraph));
  wrapper.append(button, details);
  setupToggle(button, details);
});

/* Toggles written in the HTML (core skills, bio "About Me") */
$$("[data-tag-toggle]").forEach((button) => {
  setupToggle(button, document.getElementById(button.getAttribute("aria-controls")));
});

/* ---------- 3. Projects, Services, Process, Contact cards + popup content ---------- */
const projectCards = $$("#projectsModal .project-card");

/* Each card: description and tags collapse behind "View details" */
projectCards.forEach((card, index) => {
  const list = $(".projects-tags", card);
  if (!list || list.closest(".project-tag-toggle")) return;

  const title = $("div:last-child > span", card)?.textContent?.trim();
  const paragraph = $("p", card);
  const details = document.createElement("div");
  details.id = `projectDetails${index + 1}`;
  details.className = "project-toggle-content tag-toggle-list";
  details.hidden = true;

  const { wrapper, button } = makeToggle({
    wrapperClass: "tag-toggle project-tag-toggle",
    buttonClass: "tag-toggle-button project-tag-toggle-button",
    label: "View details",
    ariaLabel: title ? `Toggle ${title} details and tags` : "Toggle project details and tags",
    contentId: details.id,
  });

  (paragraph || list).before(wrapper);
  if (paragraph) details.append(paragraph);
  details.append(list);
  wrapper.append(button, details);
  setupToggle(button, details);
});

/* Each card: links move onto the cover image */
projectCards.forEach((card) => {
  const visual = $(".project-visual", card);
  const links = $$(".project-link", card);
  if (!visual || !links.length || $(".project-visual-actions", visual)) return;

  const actions = document.createElement("div");
  actions.className = "project-visual-actions";
  links.forEach((link) => actions.append(link));
  visual.append(actions);
});

/* Landing card: project count + one small preview per card (cover classes come from the cards) */
$$("[data-project-count]").forEach((el) => (el.textContent = projectCards.length));

const launchPreviews = $(".work-launch-previews");
projectCards.forEach((card) => {
  const cover = [...($(".project-visual", card)?.classList || [])].find((name) => name.startsWith("visual-"));
  if (!launchPreviews || !cover) return;

  const thumb = document.createElement("span");
  thumb.className = `work-launch-thumb ${cover}`;
  launchPreviews.append(thumb);
});

/* Services, Process, Contact cards: count and previews come from the popup content.
   [data-count-for="<selector>"] shows how many items match,
   [data-preview-for="<selector>"] gets one small pill per match (its text). */
$$("[data-count-for]").forEach((el) => (el.textContent = $$(el.dataset.countFor).length));

$$("[data-preview-for]").forEach((previews) => {
  $$(previews.dataset.previewFor).forEach((item) => {
    const pill = document.createElement("span");
    pill.className = "work-launch-pill";
    pill.textContent = item.textContent.trim();
    previews.append(pill);
  });
});

/* ---------- 4. Scroll reveal ---------- */
const revealItems = $$(".stats-band article, .section-heading, .work-launch");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal-ready");
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("revealed"));
}

/* ---------- 5. Mobile menu ---------- */
menuButton?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("open") || false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (!event.target.matches("a, button")) return;
  siteNav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
});

/* ---------- 6. Popups ---------- */
let activeElementBeforeModal = null;

function openModal(modal) {
  if (!modal) return;
  activeElementBeforeModal = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  $(".resume-close", modal)?.focus();
}

function closeModal(modal) {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  if (!$(".resume-modal:not([hidden])")) document.body.classList.remove("modal-open");
  activeElementBeforeModal?.focus();
}

/* [data-open-<name>] opens a popup, [data-close-<name>] closes it */
const popups = { projects: projectsModal, services: servicesModal, process: processModal, contact: contactModal, bio: bioModal, resume: resumeModal };

Object.entries(popups).forEach(([name, modal]) => {
  $$(`[data-open-${name}]`).forEach((opener) => {
    opener.addEventListener("click", (event) => {
      event.preventDefault(); // links like <a href="#work"> open the popup instead of jumping
      Object.values(popups).forEach(closeModal); // one popup at a time (Bio -> Resume)
      openModal(modal);
    });
  });

  $$(`[data-close-${name}]`).forEach((closer) => {
    closer.addEventListener("click", () => closeModal(modal));
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") Object.values(popups).forEach(closeModal);
});

/* ---------- 7. Contact form (Web3Forms) ---------- */
contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = $("button[type='submit']", contactForm);
  const originalButtonText = submitButton?.textContent;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  if (formStatus) {
    formStatus.className = "form-status";
    formStatus.textContent = "Sending your message...";
  }

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Your message could not be sent.");
    }

    contactForm.reset();
    if (formStatus) {
      formStatus.classList.add("is-success");
      formStatus.textContent = "Message sent! I'll get back to you soon.";
    }
  } catch (error) {
    if (formStatus) {
      formStatus.classList.add("is-error");
      formStatus.textContent = `${error.message} Please try again or email me directly.`;
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
});

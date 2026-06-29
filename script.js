const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menuButton = $(".menu-button");
const siteNav = $(".site-nav");
const bioModal = $(".bio-modal");
const resumeModal = $("[aria-labelledby='resumeTitle']");
const contactForm = $("#contactForm");
const formStatus = $(".form-status");
let activeElementBeforeModal = null;

function setupToggle(button, target) {
  if (!button || !target) return;

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    target.hidden = isOpen;
  });
}

$$(".resume-body .resume-tags").forEach((list, index) => {
  if (list.closest(".tag-toggle")) return;

  const wrapper = document.createElement("div");
  const button = document.createElement("button");
  const title = list.closest("section")?.querySelector("h3")?.textContent?.replace(/:$/, "").trim();
  const listId = list.id || `resumeTags${index + 1}`;

  list.id = listId;
  list.hidden = true;
  list.classList.add("tag-toggle-list");
  wrapper.className = "tag-toggle";
  button.className = "tag-toggle-button";
  button.type = "button";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", listId);
  button.textContent = title ? `View ${title}` : "View tags";

  list.before(wrapper);
  wrapper.append(button, list);
  setupToggle(button, list);
});

$$(".resume-body [data-resume-details]").forEach((item, index) => {
  if (item.querySelector(".resume-details-toggle")) return;

  const paragraphs = [...item.children].filter((child) => {
    return child.tagName === "P" && !child.classList.contains("eyebrow");
  });

  if (!paragraphs.length) return;

  const wrapper = document.createElement("div");
  const button = document.createElement("button");
  const details = document.createElement("div");
  const detailsId = `resumeDetails${index + 1}`;

  wrapper.className = "tag-toggle resume-details-toggle";
  button.className = "tag-toggle-button";
  button.type = "button";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", detailsId);
  button.textContent = "View details";
  details.className = "resume-details tag-toggle-list";
  details.id = detailsId;
  details.hidden = true;

  paragraphs[0].before(wrapper);
  paragraphs.forEach((paragraph) => details.append(paragraph));
  wrapper.append(button, details);
  setupToggle(button, details);
});

$$("[data-tag-toggle]").forEach((button) => {
  setupToggle(button, document.getElementById(button.getAttribute("aria-controls")));
});

$$("#work .projects-tags").forEach((list, index) => {
  if (list.closest(".project-tag-toggle")) return;

  const wrapper = document.createElement("div");
  const button = document.createElement("button");
  const projectTitle = list.closest(".project-card")?.querySelector("h3")?.textContent?.trim();
  const listId = list.id || `projectTags${index + 1}`;

  list.id = listId;
  list.hidden = true;
  list.classList.add("tag-toggle-list");
  wrapper.className = "tag-toggle project-tag-toggle";
  button.className = "tag-toggle-button project-tag-toggle-button";
  button.type = "button";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", listId);
  button.setAttribute("aria-label", projectTitle ? `Toggle ${projectTitle} tags` : "Toggle project tags");
  button.textContent = "View tags";

  list.before(wrapper);
  wrapper.append(button, list);
  setupToggle(button, list);
});

$$("#work .project-card").forEach((card) => {
  const visual = $(".project-visual", card);
  const links = $$(".project-link", card);

  if (!visual || !links.length || visual.querySelector(".project-visual-actions")) return;

  const actions = document.createElement("div");
  actions.className = "project-visual-actions";

  links.forEach((link) => actions.append(link));
  visual.append(actions);
});

const revealItems = $$(
  ".stats-band article, .section-heading, .project-card, .service-list article, .timeline article, .contact-form"
);

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

menuButton?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("open") || false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (!event.target.matches("a, button")) return;
  siteNav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
});

function openModal(modal) {
  if (!modal) return;
  activeElementBeforeModal = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  $(".resume-close", modal)?.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  activeElementBeforeModal?.focus();
}

$$("[data-open-bio]").forEach((button) => {
  button.addEventListener("click", () => openModal(bioModal));
});

$$("[data-close-bio]").forEach((button) => {
  button.addEventListener("click", () => closeModal(bioModal));
});

$("[data-open-resume]")?.addEventListener("click", () => openModal(resumeModal));

$$("[data-close-resume]").forEach((button) => {
  button.addEventListener("click", () => closeModal(resumeModal));
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (bioModal && !bioModal.hidden) closeModal(bioModal);
  if (resumeModal && !resumeModal.hidden) closeModal(resumeModal);
});

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

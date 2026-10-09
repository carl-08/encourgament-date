(() => {
  "use strict";

  const envelope = document.getElementById("envelopeContainer");
  const waxSeal = document.getElementById("waxSealTrigger");
  const letter = document.getElementById("slidingLetter");
  const closeButton = document.getElementById("closeSlideBtn");
  const yesButton = document.getElementById("yesSlideBtn");
  const laterButton = document.getElementById("noSlideBtn");
  const title = document.getElementById("letterTitle");
  const message = document.getElementById("letterMessage");
  const signature = document.getElementById("letterSignature");
  const responseNote = document.getElementById("responseNote");
  const toast = document.getElementById("toastMsg");

  if (!envelope || !letter || !closeButton || !yesButton || !laterButton) {
    console.error("Invitation setup failed: one or more required elements are missing.");
    return;
  }

  const originalCopy = {
    title: title.innerHTML,
    message: message.textContent,
    signature: signature.innerHTML,
    note: responseNote.textContent
  };

  let isOpened = false;
  let hasResponded = false;
  let toastTimer = null;
  let openTimer = null;
  let shatterTimer = null;
  let focusBeforeOpen = null;

  function setImportantStyles(element, styles) {
    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, value, "important");
    });
  }

  function applyLetterPresentation(visible) {
    // Inline fallback ensures the modal remains styled even if a mobile browser
    // serves an older cached stylesheet or a selector fails to apply.
    setImportantStyles(letter, {
      position: "fixed",
      "z-index": "10000",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      display: "block",
      "box-sizing": "border-box",
      width: "min(34rem, calc(100vw - 2rem))",
      "max-width": "calc(100vw - 2rem)",
      "max-height": "min(88vh, 48rem)",
      margin: "0",
      padding: "clamp(2.8rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 3rem) 2rem",
      overflow: "auto",
      border: "1px solid rgba(197,161,91,.8)",
      "border-radius": "9px",
      background: "#fffaf4",
      color: "#382a2a",
      "box-shadow": "0 24px 75px rgba(67,30,38,.3), 0 0 0 5px rgba(255,250,244,.76), 0 0 0 6px rgba(197,161,91,.42)",
      opacity: visible ? "1" : "0",
      visibility: visible ? "visible" : "hidden",
      "pointer-events": visible ? "auto" : "none",
      transform: visible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, calc(-50% + 1.25rem)) scale(.98)",
      transition: "opacity .4s ease, transform .45s ease, visibility .4s",
      "font-family": "Inter, system-ui, sans-serif"
    });

    if (window.matchMedia("(max-width: 640px)").matches) {
      setImportantStyles(letter, {
        width: "calc(100vw - 1.25rem)",
        "max-width": "calc(100vw - 1.25rem)",
        "max-height": "calc(100vh - 1.25rem)",
        padding: "3rem 1.25rem 1.4rem"
      });
    }

    setImportantStyles(closeButton, {
      position: "absolute", top: ".95rem", right: ".95rem", "z-index": "3",
      display: "grid", "place-items": "center", width: "2.5rem", height: "2.5rem",
      border: "1px solid rgba(118,47,64,.16)", "border-radius": "50%",
      color: "#762f40", background: "#fff9f3", "font-size": "1.6rem", cursor: "pointer"
    });
    setImportantStyles(title, {
      display: "block", margin: "0", color: "#762f40",
      "font-family": "'Playfair Display', Georgia, serif",
      "font-size": "clamp(2rem, 5vw, 2.8rem)", "line-height": "1.15", "text-align": "center"
    });
    setImportantStyles(message, {
      display: "block", "max-width": "26rem", margin: "1.3rem auto 1.5rem",
      color: "#493638", "font-family": "Lora, Georgia, serif",
      "font-size": "1.08rem", "line-height": "1.8", "text-align": "center"
    });
    setImportantStyles(signature, {
      display: "block", margin: "0", color: "#7a6261",
      "font-family": "Lora, Georgia, serif", "line-height": "1.8", "text-align": "center"
    });
    setImportantStyles(document.getElementById("letterButtons"), {
      display: "flex", "flex-wrap": "wrap", "justify-content": "center",
      "align-items": "center", gap: ".8rem", margin: "1.8rem 0 0"
    });
    setImportantStyles(yesButton, {
      display: "inline-flex", "align-items": "center", "justify-content": "center",
      "min-height": "3rem", padding: ".85rem 1.3rem", border: "1px solid #762f40",
      "border-radius": "999px", color: "#fffaf6", background: "#762f40",
      "font-family": "Inter, system-ui, sans-serif", "font-size": ".82rem", "font-weight": "600", opacity: "1"
    });
    setImportantStyles(laterButton, {
      display: "inline-flex", "align-items": "center", "justify-content": "center",
      "min-height": "3rem", padding: ".85rem 1.3rem", border: "1px solid #d9b6b7",
      "border-radius": "999px", color: "#762f40", background: "#fff3ef",
      "font-family": "Inter, system-ui, sans-serif", "font-size": ".82rem", "font-weight": "600", opacity: "1"
    });
    if (window.matchMedia("(max-width: 640px)").matches) {
      setImportantStyles(document.getElementById("letterButtons"), {
        "flex-direction": "column", "align-items": "stretch"
      });
      setImportantStyles(yesButton, { width: "100%" });
      setImportantStyles(laterButton, { width: "100%" });
    }
  }

  function showToast(text) {
    if (toastTimer) window.clearTimeout(toastTimer);
    toast.textContent = text;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      toastTimer = null;
    }, 3200);
  }

  function openLetter() {
    if (isOpened) return;
    isOpened = true;
    focusBeforeOpen = document.activeElement;
    applyLetterPresentation(false);

    // The letter must not exist in the visible layout before its reveal.
    letter.hidden = false;
    letter.classList.remove("slide-up");
    letter.setAttribute("aria-hidden", "true");
    applyLetterPresentation(false);

    // Do not add the .open class here. The envelope must remain closed during
    // the entire seal animation and the three-second pause.
    envelope.classList.remove("is-hidden", "open");
    document.body.classList.add("letter-open");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const totalDelay = reduceMotion ? 0 : 3000;
    const shatterDuration = reduceMotion ? 30 : 1800;
    const flapDuration = reduceMotion ? 0 : 720;

    if (waxSeal) {
      waxSeal.classList.remove("shattering", "broken");
      void waxSeal.offsetWidth;
      waxSeal.classList.add("shattering");
    }

    // The 3-second timer starts at the tap, not after the fragments finish.
    openTimer = window.setTimeout(() => {
      if (waxSeal) {
        waxSeal.classList.remove("shattering");
        waxSeal.classList.add("broken");
      }

      // This is the first point at which the envelope is allowed to open.
      envelope.classList.add("open");
      envelope.setAttribute("aria-label", "Envelope opened");

      openTimer = window.setTimeout(() => {
        letter.classList.add("slide-up");
        applyLetterPresentation(true);
        letter.setAttribute("aria-hidden", "false");
        closeButton.focus({ preventScroll: true });
        openTimer = null;
      }, flapDuration + (reduceMotion ? 0 : 180));
    }, totalDelay);
  }

  function resetResponse() {
    hasResponded = false;
    title.innerHTML = originalCopy.title;
    message.textContent = originalCopy.message;
    signature.innerHTML = originalCopy.signature;
    responseNote.textContent = originalCopy.note;
    yesButton.disabled = false;
    laterButton.disabled = false;
    laterButton.removeAttribute("aria-disabled");
    laterButton.classList.remove("response-locked");
    yesButton.hidden = false;
    laterButton.hidden = false;
  }

  function closeLetter() {
    if (!isOpened) return;
    if (openTimer) {
      window.clearTimeout(openTimer);
      openTimer = null;
    }
    if (shatterTimer) {
      window.clearTimeout(shatterTimer);
      shatterTimer = null;
    }
    if (waxSeal) {
      waxSeal.classList.remove("shattering", "broken");
    }
    letter.classList.remove("slide-up");
    applyLetterPresentation(false);
    letter.setAttribute("aria-hidden", "true");
    letter.hidden = true;
    document.body.classList.remove("letter-open");
    envelope.classList.remove("open");
    envelope.classList.remove("is-hidden");
    envelope.setAttribute("aria-label", "Open the envelope");
    resetResponse();
    isOpened = false;

    if (focusBeforeOpen && typeof focusBeforeOpen.focus === "function") {
      focusBeforeOpen.focus({ preventScroll: true });
    } else {
      envelope.focus({ preventScroll: true });
    }
  }

  function respondYes() {
    if (hasResponded) return;
    hasResponded = true;
    title.textContent = "That makes me happy!";
    message.textContent = "Yay! I’m looking forward to spending Sunday together. Let’s make it a lovely encouragement date.";
    signature.innerHTML = "With a happy heart,<br><span>Carl John</span>";
    responseNote.textContent = "Your yes has been noted — see you Sunday!";
    yesButton.disabled = true;
    laterButton.disabled = false;
    laterButton.setAttribute("aria-disabled", "true");
    laterButton.classList.add("response-locked");
    showToast("Invitation accepted with a little love ♡");
  }

  function respondLater() {
    if (hasResponded) return;
    hasResponded = true;
    title.textContent = "Thank you for letting me know";
    message.textContent = "No worries at all. Take your time, and thank you for reading my little invitation.";
    signature.innerHTML = "Wishing you a lovely day,<br><span>Carl John</span>";
    responseNote.textContent = "No pressure. Maybe another time.";
    yesButton.disabled = true;
    laterButton.disabled = false;
    laterButton.setAttribute("aria-disabled", "true");
    laterButton.classList.add("response-locked");
    showToast("That’s completely okay ♡");
  }

  envelope.addEventListener("click", openLetter);
  envelope.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLetter();
    }
  });
  yesButton.addEventListener("click", respondYes);
  laterButton.addEventListener("click", respondLater);
  closeButton.addEventListener("click", closeLetter);

  document.addEventListener("keydown", (event) => {
    if (!isOpened) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeLetter();
      return;
    }

    if (event.key !== "Tab" || letter.getAttribute("aria-hidden") === "true") return;
    const focusable = Array.from(letter.querySelectorAll('button:not(:disabled):not([hidden]), [href], [tabindex]:not([tabindex="-1"])'))
      .filter((element) => !element.hasAttribute("disabled") && element.getClientRects().length > 0);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  console.info("Encouragement Date invitation ready.");
})();

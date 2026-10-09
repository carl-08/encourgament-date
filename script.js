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
    letter.setAttribute("aria-hidden", "true");
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

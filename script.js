(function() {
  // DOM elements
  const envelopeContainer = document.getElementById('envelopeContainer');
  const waxSeal = document.getElementById('waxSealTrigger');
  const slidingLetter = document.getElementById('slidingLetter');
  const closeSlideBtn = document.getElementById('closeSlideBtn');
  const yesBtn = document.getElementById('yesSlideBtn');
  const noBtn = document.getElementById('noSlideBtn');
  const toast = document.getElementById('toastMsg');
  
  let isOpened = false;
  let letterSlid = false;
  let noButtonActive = true;
  let noTouchCount = 0;

  // Helper: toast message
  function showToast(text, isHappy = true) {
    toast.textContent = text;
    toast.style.backgroundColor = isHappy ? '#52B788' : '#e11d48';
    toast.style.opacity = '1';
    toast.style.visibility = 'visible';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.visibility = 'hidden';
    }, 2600);
  }
  
  // Function to make No button move away (without triggering a "No" response)
  function moveNoButton() {
    if (noBtn.disabled) return;
    if (!noButtonActive) return;
    
    noTouchCount++;
    
    // Get button position and viewport dimensions
    const btnRect = noBtn.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate random new position (keep button within view)
    const maxX = viewportWidth - btnRect.width - 30;
    const maxY = viewportHeight - btnRect.height - 100;
    const minX = 20;
    const minY = 80;
    
    const newX = Math.random() * (maxX - minX) + minX;
    const newY = Math.random() * (maxY - minY) + minY;
    
    // Apply new position with smooth animation
    noBtn.style.position = 'fixed';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)';
    
    // Add bounce/shake effect
    noBtn.style.transform = 'scale(0.9) rotate(3deg)';
    setTimeout(() => {
      if (noBtn && !noBtn.disabled) {
        noBtn.style.transform = 'scale(1) rotate(0deg)';
      }
    }, 200);
    
    // Show playful message based on number of attempts
    if (noTouchCount < 3) {
      showToast(`Can't say no! 😜 (${3 - noTouchCount} tries left)`, false);
    } else if (noTouchCount === 3) {
      showToast("Okay okay! You got me! Date accepted! 🎉", true);
      
      // Transform No button into Yes button
      noBtn.innerHTML = "Yes! Let's go! 💕";
      noBtn.style.background = "var(--rose)";
      noBtn.style.color = "white";
      noBtn.style.boxShadow = "0 5px 0 #9f1239";
      noBtn.style.position = 'relative';
      noBtn.style.left = 'auto';
      noBtn.style.top = 'auto';
      noBtn.style.transform = 'scale(1)';
      noBtn.disabled = false;
      noButtonActive = true;
      
      // Remove the wiggle animation
      noBtn.style.animation = 'none';
      
      // Update the message
      const titleDiv = document.querySelector('.romantic-title');
      const msgDiv = document.querySelector('.romantic-text');
      const signatureSpan = document.querySelector('.signature');
      if (titleDiv) titleDiv.innerHTML = "YOU MADE THE RIGHT CHOICE! 💗";
      if (msgDiv) msgDiv.innerHTML = "Yay! Can't wait for our encouragement date this Sunday! See you there! 🌟";
      if (signatureSpan) signatureSpan.innerHTML = "— Excitedly yours, Carl John 💫";
      
      // Make it work as Yes button
      noBtn.removeEventListener('mouseenter', moveNoButton);
      noBtn.removeEventListener('touchstart', moveNoButton);
      noBtn.addEventListener('click', () => {
        showToast("Yun oh, Cyrene! See you Sunday! 🎉", true);
        noBtn.disabled = true;
        yesBtn.disabled = true;
      });
      
      // Disable original Yes button
      yesBtn.disabled = true;
      yesBtn.style.opacity = '0.6';
    } else {
      // After being caught, any further touches do nothing
      noBtn.style.pointerEvents = 'none';
    }
  }
  
  // Open envelope and trigger sliding letter reveal
  function openEnvelopeAndSlideLetter() {
    if (isOpened) return;
    isOpened = true;
    
    envelopeContainer.classList.add('open');
    
    setTimeout(() => {
      if (!letterSlid) {
        revealSlidingLetter();
      }
    }, 550);
  }
  
  function revealSlidingLetter() {
    if (letterSlid) return;
    letterSlid = true;
    
    slidingLetter.classList.add('slide-up');
    document.body.classList.add('letter-open');
    
    setTimeout(() => {
      const title = document.querySelector('.romantic-title');
      if(title) title.style.animation = 'gentlePulse 0.6s ease';
    }, 400);
  }
  
  function closeLetter() {
    if (!slidingLetter.classList.contains('slide-up')) return;
    slidingLetter.classList.remove('slide-up');
    document.body.classList.remove('letter-open');
    showToast("💌 Letter closed. Refresh to experience again 💌", false);
  }
  
  function handleYesResponse() {
    showToast("Yun oh, Cyrene! See you Sunday! 🎉", true);
    const msgDiv = document.querySelector('.romantic-text');
    const titleDiv = document.querySelector('.romantic-title');
    const signatureSpan = document.querySelector('.signature');
    if (titleDiv) titleDiv.innerHTML = "MATSALAB BOSS! 💗";
    if (msgDiv) msgDiv.innerHTML = "See you this Sunday! Can't wait to make chika and encouragement together! 🌟";
    if (signatureSpan) signatureSpan.innerHTML = "— Regards, Carl John 💫";
    yesBtn.disabled = true;
    noBtn.disabled = true;
    noButtonActive = false;
    yesBtn.style.opacity = '0.6';
    noBtn.style.opacity = '0.6';
  }
  
  // Event listeners
  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isOpened) openEnvelopeAndSlideLetter();
    });
  }
  
  if (envelopeContainer) {
    envelopeContainer.addEventListener('click', (e) => {
      if (e.target === waxSeal || waxSeal.contains(e.target)) return;
      if (!isOpened) openEnvelopeAndSlideLetter();
    });
  }
  
  if (yesBtn) yesBtn.addEventListener('click', handleYesResponse);
  
  // NO BUTTON: Moves away instead of accepting "No"
  if (noBtn) {
    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('touchstart', moveNoButton);
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveNoButton();
      return false;
    });
  }
  
  if (closeSlideBtn) closeSlideBtn.addEventListener('click', closeLetter);
  slidingLetter.addEventListener('click', (e) => e.stopPropagation());
  
  envelopeContainer.addEventListener('animationend', (e) => {
    if (e.animationName === 'envelopeFloatDown') {
      envelopeContainer.style.visibility = 'hidden';
      slidingLetter.style.zIndex = '250';
    }
  });
  
  window.addEventListener('resize', () => {
    if (slidingLetter.classList.contains('slide-up')) {
      slidingLetter.style.transform = 'translate(-50%, 50%)';
    }
  });
  
  console.log("Love letter ready! No button runs away on touch/hover!");
})();
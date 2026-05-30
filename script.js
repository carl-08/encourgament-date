// Track how many times No button was pressed
let noPressCount = 0;

function handleNoResponse() {
  noPressCount++;
  
  // If pressed less than 3 times, just move the button
  if (noPressCount < 3) {
    // Get button position
    const btnRect = noBtn.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Random new position (avoid edges)
    const newX = Math.random() * (viewportWidth - btnRect.width - 40) + 20;
    const newY = Math.random() * (viewportHeight - btnRect.height - 150) + 80;
    
    // Apply new position
    noBtn.style.position = 'fixed';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.transition = 'all 0.3s ease';
    
    // Shake effect
    noBtn.style.transform = 'rotate(2deg) scale(0.95)';
    setTimeout(() => {
      noBtn.style.transform = 'rotate(0deg) scale(1)';
    }, 200);
    
    showToast(`Nice try! Find the button 😜 (${3 - noPressCount} attempts left)`, false);
    
  } else {
    // After 3 attempts, show final message
    showToast("Okay okay! You win! Let's go on that date! 🎉", true);
    
    const msgDiv = document.querySelector('.romantic-text');
    const titleDiv = document.querySelector('.romantic-title');
    if (titleDiv) titleDiv.innerHTML = "YOU FOUND ME! 💗";
    if (msgDiv) msgDiv.innerHTML = "Okay fine! I'd love to go on that encouragement date with you! See you Sunday! 🌟";
    
    // Disable both buttons
    noBtn.disabled = true;
    yesBtn.disabled = true;
    noButtonActive = false;
    noBtn.style.opacity = '0.6';
    yesBtn.style.opacity = '0.6';
  }
}
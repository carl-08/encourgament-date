function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    const letter = document.querySelector('.letter');
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    // add floating class after a short delay so the letter starts hidden under the flap
    setTimeout(() => {
        letter.classList.add('floating');
    }, 80);
}

function moveButton() {
    const btn = document.getElementById("noBtn");
    const maxX = window.innerWidth - btn.offsetWidth - 20;
    const maxY = window.innerHeight - btn.offsetHeight - 20;
    
    btn.style.position = "absolute";
    btn.style.left = Math.random() * maxX + "px";
    btn.style.top = Math.random() * maxY + "px";
}
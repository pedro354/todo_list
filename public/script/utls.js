  const linesText = [
    "Verificando existência de tarefas...",
    "Dados recebidos, iniciando processamento..."
  ];

  const typingSpeed = 40;
  const backspaceSpeed = 30;
  const waitBeforeDelete = 1000;
  const waitBeforeType = 300;
  const fadeOutDelay = 1000;

  let textIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function nextPage() {
    document.body.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, fadeOutDelay);
  }

  function typeAndDelete() {
    const elText = document.getElementById("text");
    const currentText = linesText[textIndex];

    if (!deleting) {
      elText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex < currentText.length) {
        setTimeout(typeAndDelete, typingSpeed);
      } else {
        // Se for a última frase, vai direto para a próxima tela
        if (textIndex === linesText.length - 1) {
          setTimeout(nextPage, 1000); // pequena pausa antes do fade
        } else {
          // Caso contrário, espera e começa a deletar
          setTimeout(() => {
            deleting = true;
            setTimeout(typeAndDelete, backspaceSpeed);
          }, waitBeforeDelete);
        }
      }

    } else {
      elText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex > 0) {
        setTimeout(typeAndDelete, backspaceSpeed);
      } else {
        deleting = false;
        textIndex++;
        setTimeout(typeAndDelete, waitBeforeType);
      }
    }
  }
window.addEventListener("DOMContentLoaded", typeAndDelete)


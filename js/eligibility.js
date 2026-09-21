/**
 * ACUMEN GLOBAL - Interactive Visa Eligibility Assessment Quiz
 */

document.addEventListener('DOMContentLoaded', () => {
  initEligibilityQuiz();
});

function initEligibilityQuiz() {
  const quizContainer = document.getElementById('eligibility-quiz');
  if (!quizContainer) return;

  const steps = quizContainer.querySelectorAll('.quiz-step');
  const progressBar = quizContainer.querySelector('.eligibility-progress-fill');
  const prevBtns = quizContainer.querySelectorAll('.quiz-prev-btn');
  const nextBtns = quizContainer.querySelectorAll('.quiz-next-btn');
  const resultStep = quizContainer.querySelector('#quiz-step-result');

  let currentStepIndex = 0;
  const userAnswers = {
    destination: '',
    purpose: '',
    experience: '',
    investment: '',
    language: ''
  };

  // Option selection logic
  const optionCards = quizContainer.querySelectorAll('.quiz-option-card');
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const parentStep = card.closest('.quiz-step');
      const stepCards = parentStep.querySelectorAll('.quiz-option-card');
      stepCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const field = card.getAttribute('data-field');
      const value = card.getAttribute('data-value');
      if (field && value) {
        userAnswers[field] = value;
      }
    });
  });

  function updateProgress() {
    const totalSteps = steps.length - 1; // excluding result step
    const percentage = ((currentStepIndex + 1) / totalSteps) * 100;
    if (progressBar) {
      progressBar.style.width = Math.min(percentage, 100) + '%';
    }
  }

  function showStep(index) {
    steps.forEach((step, i) => {
      if (i === index) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    updateProgress();
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        showStep(currentStepIndex);

        // If reaching the results step
        if (currentStepIndex === steps.length - 1) {
          calculateAndDisplayResults();
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStepIndex > 0) {
        currentStepIndex--;
        showStep(currentStepIndex);
      }
    });
  });

  function calculateAndDisplayResults() {
    let score = 85; // baseline high compatibility
    if (userAnswers.experience === 'senior' || userAnswers.investment === 'high') {
      score = 96;
    } else if (userAnswers.purpose === 'study') {
      score = 92;
    }

    const scoreDisplay = document.getElementById('quiz-score-number');
    const destDisplay = document.getElementById('quiz-result-dest');
    const recPathway = document.getElementById('quiz-result-pathway');

    if (scoreDisplay) scoreDisplay.textContent = score + '%';
    if (destDisplay) destDisplay.textContent = userAnswers.destination || 'Global Priority Destination';
    if (recPathway) {
      if (userAnswers.purpose === 'business' || userAnswers.investment === 'high') {
        recPathway.textContent = 'Golden Visa / Residency by Investment & Corporate Transfer';
      } else if (userAnswers.purpose === 'study') {
        recPathway.textContent = 'Higher Education Pathway with Post-Study Work Visa';
      } else {
        recPathway.textContent = 'Skilled Migration / Express Entry Direct Permanent Residency';
      }
    }
  }

  // Quick Bar redirect handler on Home page
  const quickForm = document.getElementById('quick-eligibility-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = document.getElementById('quick-dest-select')?.value;
      const stream = document.getElementById('quick-stream-select')?.value;
      
      // Store in session and redirect to visas page
      if (dest || stream) {
        sessionStorage.setItem('prefill_dest', dest);
        sessionStorage.setItem('prefill_stream', stream);
      }
      window.location.href = 'visas.html#assessment';
    });
  }
}

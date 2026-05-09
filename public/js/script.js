function nextStep(stepNumber){

    const steps = document.querySelectorAll(".form-step");

    steps.forEach(step => {
        step.classList.remove("active");
    });

    document
        .getElementById(`step${stepNumber}`)
        .classList.add("active");
}
function nextStep(stepNumber){

    const steps = document.querySelectorAll(".form-step");

    steps.forEach(step => {
        step.classList.remove("active");
    });

    document
        .getElementById(`step${stepNumber}`)
        .classList.add("active");
}



// ===============================
// PREVIEW SYSTEM
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");

    if(form){

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            const formData = new FormData(form);

            const invoiceData = {};

            formData.forEach((value, key) => {

                if(key !== "designImages"){
                    invoiceData[key] = value;
                }

            });


            // STORE DATA
            localStorage.setItem(
                "invoiceData",
                JSON.stringify(invoiceData)
            );


            // STORE FILES TEMP FLAG
            localStorage.setItem(
                "hasImages",
                "true"
            );


            // REDIRECT TO PREVIEW
            window.location.href = "/preview";
        });

    }

});
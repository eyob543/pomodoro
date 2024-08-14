const reset_btn = document.querySelector("button") as HTMLButtonElement;
const form = document.querySelector("form") as HTMLFormElement;
const timerContainer = document.querySelector("div") as HTMLDivElement;
const timer = document.querySelector(".timer") as HTMLParagraphElement;
const errorMessage = document.createElement("p");
errorMessage.classList.add("errorMessage"); // error message styling

let repetition: number;
let minutes: number;
let break_minutes: number;
let seconds = 0;
let studyInterval: number;
let breakInterval: number;
const audio = new Audio("NBUK26X-alarm.mp3"); // Audio file to play when the timer ends

form.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    let isValid = true; // A flag to check if the form data is valid numbers
    const formData = new FormData(form); // Get the form data as an object and loop over it to get the keys and values
    for (const [key, value] of formData) {
        const inputValue = Number(value); // Convert each value to a number

        if (Number.isNaN(inputValue)) {
            errorMessage.textContent = "All values must be numbers"; // Error message if the value is not a number
            document.body.appendChild(errorMessage);
            isValid = false;
            break;
        }
        switch (key) {
            case "repetition":
                repetition = inputValue;
                break;
            case "minutes":
                minutes = inputValue;
                break;
            case "break":
                break_minutes = inputValue;
        }
    }
    if (isValid) {
        // Only hide the form and show the timer if all inputs are valid
        form.classList.add("hideForm");
        timerContainer.classList.remove("hideTimer");
        if (document.body.contains(errorMessage)) {
            document.body.removeChild(errorMessage); // Removes the error message if it is there
        }

        startTimers(); // Start the study and break timers
    }
});

// Reset to the original value
reset_btn.addEventListener("click", () => {
    clearInterval(studyInterval); // Clear any existing intervals
    clearInterval(breakInterval);
    form.reset();
    form.classList.remove("hideForm");
    timerContainer.classList.add("hideTimer");
});

function startTimers() {
    for (let i = 1; i <= repetition; i++) {
        studyInterval = setInterval(handleStudyTimer, 1000);
        setTimeout(() => {
            clearInterval(studyInterval);
            breakInterval = setInterval(handleBreakTimer, 1000);
        }, (minutes * 60 + seconds) * 1000);
    }
}

function handleStudyTimer() {
    timer.textContent = `${minutes} : ${seconds}`;
    if (minutes === 0 && seconds === 0) {
        audio.play(); // Play the audio when the study timer ends
        clearInterval(studyInterval); // Clear the interval
        return;
    }
    if (seconds <= 0) {
        seconds = 59;
        minutes--;
    }
    seconds--;
}

function handleBreakTimer() {
    timer.textContent = `${break_minutes} : ${seconds}`;
    if (break_minutes === 0 && seconds === 0) {
        audio.play(); // Play the audio when the break timer ends
        clearInterval(breakInterval); // Clear the interval
        return;
    }
    if (seconds <= 0) {
        seconds = 59;
        break_minutes--;
    }
    seconds--;
}

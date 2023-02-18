// Add event listener to close button
document.getElementById("warning-close").addEventListener("click", function () {
    document.getElementById("warning-bar").classList.add("hidden");
});

// Show warning message
function showWarning(message) {
    document.getElementById("warning-bar").classList.remove("hidden");
    document.getElementById("warning-bar").querySelector(".message").textContent = message;
}

///warning bar end

// Variables
const form = document.querySelector("#calculator");
const calculateButton = document.querySelector('#submitform');
let prevIncome, prevWorkHours, prevSleepHours;

// Function to calculate results and make POST request
function calculate(event) {
    event.preventDefault();

    // Get current input values
    const income = parseInt(document.getElementById('income').value);
    const workhours = parseInt(document.getElementById('workhours').value);
    const sleephours = parseInt(document.getElementById('sleephours').value);

    // Check if input values have changed
    if (income === prevIncome && workhours === prevWorkHours && sleephours === prevSleepHours) {
        return; // If input values haven't changed, do nothing
    }

    // Update previous input values
    prevIncome = income;
    prevWorkHours = workhours;
    prevSleepHours = sleephours;

    // Validate input values
    if (isNaN(income) || isNaN(workhours) || isNaN(sleephours)) {
        showWarning("All inputs are required and must be numbers");
        return;
    } else if (workhours + (sleephours * 7) > 168) {
        showWarning("Total work hours and sleep hours cannot exceed the total available hours a week (168 hours)");
        return;
    }


    //======================
    //formulas
    //======================
    const personaltimeformula = (income / ((workhours * 52) + ((sleephours + 2) * 365)));
    const worktimeformula = (income / (workhours * 52));
    const personalhoursformula = (168 - workhours - sleephours);
    //======================
    //end formulas
    //======================


    // Calculate results and round to 2 decimal places
    const personalTime = Math.round(personaltimeformula * 100) / 100;
    const workTime = workhours === 0 ? 0 : Math.round(worktimeformula * 100) / 100;
    const personalHours = Math.round(personalhoursformula * 100) / 100;


    // Display results on page
    const personalTimeOutput = document.getElementById('personaltime');
    const workTimeOutput = document.getElementById('worktime');
    const personalHoursOutput = document.getElementById('personalhours');
    personalTimeOutput.textContent = personalTime;
    workTimeOutput.textContent = workTime;
    personalHoursOutput.textContent = personalHours;

    // Make POST request to Google Sheets
    calculateButton.disabled = true;
    calculateButton.textContent = "Calculating...";
    let requestBody = new FormData(form);
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwzCBCNgwQL7XYh4i9qZL6G2lBwRsiO35bZ4mMKYQ0XFvNZXnT5-DitwUgYXUGaLaQ/exec';
    fetch(scriptURL, { method: 'POST', body: requestBody })
        .then(response => {
            console.log('Success!', response);
        })
        .catch(error => {
            console.log('Error!', error.message);
        })
        .finally(() => {
            calculateButton.disabled = false;
            calculateButton.textContent = "Recalculate";
        });
}

//clear all values
function clearForm() {
    document.getElementById("calculator").reset();
    document.getElementById('personaltime').textContent = "0";
    document.getElementById('worktime').textContent = "0";
    document.getElementById('personalhours').textContent = "0";
    calculateButton.textContent = "Calculate";
}

//run calculator on form submit
form.addEventListener('submit', calculate);

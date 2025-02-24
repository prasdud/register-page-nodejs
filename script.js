document.addEventListener("DOMContentLoaded", async () => {
    const fieldsDiv = document.getElementById("fields");

    // Fetch and display existing fields
    try {
        const response = await fetch("http://127.0.0.1:3000/fields");
        const fields = await response.json();

        fields.forEach(field => {
            addFieldToForm(field);
        });
    } catch (error) {
        console.error("Error fetching fields:", error);
    }

    // Add new field button functionality
    document.getElementById("addField").addEventListener("click", async () => {
        const fieldName = prompt("Enter field name:");
        if (!fieldName) return;

        console.log("Sending request to backend:", fieldName);

        try {
            const response = await fetch("http://127.0.0.1:3000/admin/addField", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fieldName })
            });

            const responseText = await response.text();
            console.log("Server response:", responseText);

            if (response.ok) {
                console.log("Field added successfully!");
                addFieldToForm(fieldName); // Add the new field to the form
            } else {
                console.error("Error adding field:", responseText);
                alert("Error adding field");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    });
});

document.getElementById("registerForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target);
    const dataObject = {};
    
    formData.forEach((value, key) => {
        dataObject[key] = value;
    });

    console.log("Form Data:", dataObject); // Log form data before sending

    fetch(event.target.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObject)
    })
    .then(response => response.json())
    .then(data => console.log("Server Response:", data))
    .catch(error => console.error("Error:", error));
});


// Function to add an input field to the form
function addFieldToForm(name) {
    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.name = name;
    newInput.placeholder = name;

    document.getElementById("fields").appendChild(newInput);
}

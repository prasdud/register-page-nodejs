document.addEventListener("DOMContentLoaded", async () => {
    const fieldsDiv = document.getElementById("fields");
    const isAdmin = document.body.dataset.page === "admin"; // Check if admin

    // Add edit/delete buttons for email and password if admin
    if (isAdmin) {
        document.querySelectorAll("#fields input").forEach(input => {
            addButtonsToField(input);
        });
    }

    // Fetch and display existing fields dynamically
    try {
        const response = await fetch("http://127.0.0.1:3000/fields");
        const fields = await response.json();
        fields.forEach(field => addFieldToForm(field, isAdmin));
    } catch (error) {
        console.error("Error fetching fields:", error);
    }

    // Handle adding a new field
    document.getElementById("addField").addEventListener("click", async () => {
        if (!isAdmin) return; // Ensure only admin can add fields

        const fieldName = prompt("Enter field name:");
        if (!fieldName) return;

        try {
            const response = await fetch("http://127.0.0.1:3000/admin/addField", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fieldName })
            });

            if (response.ok) {
                addFieldToForm(fieldName, isAdmin);
            } else {
                alert("Error adding field");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    });

    // Handle edit/delete button clicks (event delegation)
    fieldsDiv.addEventListener("click", async (event) => {
        if (event.target.classList.contains("edit-btn")) {
            const inputField = event.target.previousElementSibling;
            const oldName = inputField.name;

            const newName = prompt("Enter new field name:", oldName);
            if (!newName || newName.trim() === oldName) return;

            try {
                const response = await fetch("http://127.0.0.1:3000/admin/rename-field", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ oldName, newName })
                });

                if (response.ok) {
                    inputField.name = newName;
                    inputField.placeholder = newName;
                } else {
                    alert("Error renaming field");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        if (event.target.classList.contains("delete-btn")) {
            const inputField = event.target.previousElementSibling.previousElementSibling;
            const fieldName = inputField.name;

            if (!confirm(`Are you sure you want to delete "${fieldName}"?`)) return;

            try {
                const response = await fetch("http://127.0.0.1:3000/admin/delete-field", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fieldName })
                });

                if (response.ok) {
                    inputField.parentElement.remove();
                } else {
                    alert("Error deleting field");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    });
});

// Function to add an input field dynamically
function addFieldToForm(name, isAdmin) {
    const fieldContainer = document.createElement("div");
    fieldContainer.classList.add("field-container");

    const newInput = document.createElement("input");
    newInput.type = name.toLowerCase().includes("password") ? "password" : "text"; // Set type dynamically
    newInput.name = name;
    newInput.placeholder = name;

    fieldContainer.appendChild(newInput);

    if (isAdmin) {
        addButtonsToField(newInput);
    }

    document.getElementById("fields").appendChild(fieldContainer);
}


// Function to add edit & delete buttons (only on admin page)
function addButtonsToField(inputField) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    inputField.parentElement.appendChild(editButton);
    inputField.parentElement.appendChild(deleteButton);
}

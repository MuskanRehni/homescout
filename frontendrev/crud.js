let isEditMode = false;
let itemId = null;

document.getElementById("createButton").addEventListener("click", function () {
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    const location = document.getElementById("location").value;
    const experience = document.getElementById("experience").value;
    const contact = document.getElementById("contact").value;
    const gender = document.getElementById("gender").value;
    const workHours = document.getElementById("workhours").value;
    const fileHolder = document.getElementById("imageUpload").value;

    // Check if required fields are filled in
    if (
        !name ||
        !experience ||
        !contact ||
        !role ||
        !location ||
        !gender ||
        !workHours
    ) {
        alert("Please fill in all the required fields.");
        return;
    }

    if (experience <= 0) {
        alert("Experience cannot be negative or Zero");
        return;
    }

    if (!fileHolder && !isEditMode) {
        alert("Please upload an image");
        return;
    }

    if (workHours <= 0) {
        alert("Work Hours cannot be negative or Zero");
        return;
    }

    if (contact.length !== 10) {
        alert("Contact number should be of 10 digits");
        return;
    }

    const formData = new FormData();

    const imageUpload = document.getElementById("imageUpload").files[0];

    if (!imageUpload) {
        console.log("Image Upload");

        if (!isEditMode) {
            alert("Please upload an image");
            return;
        }
    } else {
        formData.append(
            "image",
            document.getElementById("imageUpload").files[0]
        );
    }
    formData.append("name", name);
    formData.append("workType", role);
    formData.append("location", location);
    formData.append("experience", experience);
    formData.append("contact", contact);
    formData.append("gender", gender);
    formData.append("workHours", workHours);

    const fetchURL = isEditMode
        ? `/api/services/${itemId}`
        : "/api/services/add";
    const method = isEditMode ? "PUT" : "POST";

    // Send data to the backend via a POST request
    fetch(fetchURL, {
        // Make sure your API endpoint is correct
        method: method,
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                // Assuming backend sends message
                alert("Data saved successfully!");
                // Optionally, display data on the page or redirect
                window.location.href = `${role}.html`; // Redirect to role-specific page
            } else {
                alert("Error saving data");
                console.error("Error details:", data); // Log response for debugging
            }
        })
        .catch((err) => {
            console.error("Error:", err);
            alert("Error saving data");
        });
});

const fetchIfEditMode = () => {
    const item = sessionStorage.getItem("editData");

    console.log("Item", item);

    if (!item) {
        return;
    }

    isEditMode = true;

    document.getElementById("createButton").innerText = "Update";

    const data = JSON.parse(item);

    itemId = data._id;

    console.log("Data", data);

    document.getElementById("name").value = data.name;
    document.getElementById("role").value = data.workType;
    document.getElementById("location").value = data.location;
    document.getElementById("experience").value = data.experience;
    document.getElementById("contact").value = data.contact;
    document.getElementById("gender").value = data.gender;
    document.getElementById("workhours").value = data.workHours;

    sessionStorage.removeItem("editItem");
};

document.addEventListener("DOMContentLoaded", () => {
    fetchIfEditMode();
});

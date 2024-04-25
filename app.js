document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('drop-zone');
    const resultParagraph = document.getElementById('classification-result');

    // Highlight the drop zone when dragging files over it
    dropZone.addEventListener("dragenter", highlight, false);
    dropZone.addEventListener("dragover", highlight, false);
    dropZone.addEventListener("dragleave", unhighlight, false);
    dropZone.addEventListener("drop", unhighlight, false);
    
    function highlight(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('hover');
    }

    function unhighlight(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('hover');
    }

    // Handle file drop
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('hover');

        const files = e.dataTransfer.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                document.body.appendChild(img);

                // Send the file to the backend
                const formData = new FormData();
                formData.append('image', file);
                console.log(file)

                fetch('http://localhost:5000/image', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    resultParagraph.innerText = JSON.stringify(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                    resultParagraph.innerText = 'Failed to classify image.';
                });
            };
            reader.readAsDataURL(file);
        }
    });


    const form = document.getElementById("classification-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Get form data
        const formData = new FormData(form);

        // Construct URL with query parameters
        const queryParams = new URLSearchParams(formData).toString();
        const requestURL = `http://localhost:5000/query?${queryParams}`;

        // Send GET request
        fetch(requestURL)
            .then(response => response.json())
            .then(data => {
                // Clear previous images
                const classificationResult = document.getElementById("classification-result");
                classificationResult.innerHTML = "";

                // Append images
                data.forEach(url => {
                    const img = document.createElement("img");
                    img.src = url;
                    classificationResult.appendChild(img);
                });
            })
            .catch(error => {
                console.error("Error getting image URLs:", error);
            });
    });
});

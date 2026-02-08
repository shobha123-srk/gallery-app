let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || {};
let images = JSON.parse(localStorage.getItem("images")) || [];

/* REGISTER */
function register() {
    const u = authUser.value.trim();
    const p = authPass.value.trim();

    if (!u || !p) return alert("Fill all fields");
    if (users[u]) return alert("User already exists");

    users[u] = p;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registered successfully! Now login.");
}

/* LOGIN */
function login() {
    const u = authUser.value.trim();
    const p = authPass.value.trim();

    if (users[u] && users[u] === p) {
        currentUser = u;
        authBox.style.display = "none";
        uploadBox.classList.remove("hidden");
        renderGallery();
    } else {
        alert("Invalid username or password");
    }
}

/* ADD IMAGE */
function addImage(file = null) {
    const imgFile = file || imageInput.files[0];
    if (!imgFile) return alert("Select an image");

    const reader = new FileReader();
    reader.onload = () => {
        images.push({
            src: reader.result,
            likes: 0,
            user: currentUser
        });
        save();
        renderGallery();
    };
    reader.readAsDataURL(imgFile);
}

/* RENDER GALLERY */
function renderGallery() {
    gallery.innerHTML = "";
    images.forEach((img, i) => {
        gallery.innerHTML += `
        <div class="gallery-item">
            <img src="${img.src}" onclick="openLightbox(this)">
            <div class="actions">
                <span onclick="likeImage(${i})">❤️ ${img.likes}</span>
                ${img.user === currentUser ? `<span onclick="deleteImage(${i})">🗑</span>` : ""}
            </div>
        </div>`;
    });
}

/* LIKE */
function likeImage(i) {
    images[i].likes++;
    save();
    renderGallery();
}

/* DELETE */
function deleteImage(i) {
    images.splice(i, 1);
    save();
    renderGallery();
}

/* SAVE */
function save() {
    localStorage.setItem("images", JSON.stringify(images));
}

/* LIGHTBOX */
function openLightbox(el) {
    lightbox.style.display = "flex";
    document.getElementById("lightbox-img").src = el.src;
}
function closeLightbox() {
    lightbox.style.display = "none";
}

/* DRAG & DROP */
dropArea.addEventListener("dragover", e => {
    e.preventDefault();
    dropArea.style.borderColor = "green";
});

dropArea.addEventListener("drop", e => {
    e.preventDefault();
    addImage(e.dataTransfer.files[0]);
});

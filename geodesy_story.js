// --- KHỞI TẠO BẢN ĐỒ ---
const initialCoords = [10.759666676302698, 106.67049668280809];
const initialZoom = 6;
const map = L.map('map', { zoomControl: false }).setView(initialCoords, initialZoom);


var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var baseMaps = {
    "Esri WorldImagery": Esri_WorldImagery,
    "OpenStreetMap": osm
};
var layerControl = L.control.layers(baseMaps).addTo(map);
var csnct = L.marker([10.759666676302698, 106.67049668280809]).bindPopup('<div><p>Trường Đại học Tài nguyên và Môi trường TPHCM - Cơ sở Nguyễn Chí Thanh</p><img style="width:100%; height: auto; border-radius: 8px;" src="img/nct.jpg" /></div>', { minWidth: 256 }).openPopup();
var csdn = L.marker([10.856847008983896, 106.93942478685219]).bindPopup('<div> <p>Trường Đại học Tài nguyên và Môi trường TPHCM - Cơ sở Đồng Nai</p><img style="width:100%; height: auto; border-radius: 8px;" src="img/ttdn.jpg" /></div>', { minWidth: 256 }).openPopup(); 0
var vhhn = L.marker([11.946636438070572, 108.45120031376797]).bindPopup('<div><p> Một góc khu đo thực tập ở Đà Lạt </p><img style="width:100%; height: auto; border-radius: 8px;" src="img/ttdl.jpg" /></div>', { minWidth: 256 }).openPopup();
var ch1 = L.layerGroup([csnct, csdn, vhhn])
var cslvs = L.marker([10.796600346484697, 106.66675501577072]).bindPopup('<div ><p> Trường Đại học Tài nguyên và Môi trường TPHCM - Cơ sở Lê Văn Sỹ <img style="width:100%; height: auto; border-radius: 8px;" src="img/datn.png" /></p> </div>', { minWidth: 256 }).openPopup();
const popupContent_stac = `
  <div style="width: 250px; text-align: center;"><p class="text-gray-700"> Trung tâm Ứng dụng Công nghệ Vũ trụ TP. Hồ Chí Minh - STAC
    <img id="popup-image-stac" src="img/tttn3.jpg" style="width: 100%; height: auto; border-radius: 8px;" />
    <div style="margin-top: 8px;">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onclick="nextImage_stac()">Ảnh khác</button>
    </div>
  </div>
`;
const images_stac = [
    'img/tttn3.jpg',
    'img/tttn2.jpg',
    'img/tttn1.jpg'
];
let currentImageIndex = 0;
function updatePopupImage_stac() {
    const img = document.getElementById("popup-image-stac");
    if (img) {
        img.src = images_stac[currentImageIndex];
    }
}
function nextImage_stac() {
    currentImageIndex = (currentImageIndex + 1) % images_stac.length;
    updatePopupImage_stac();
}

var stac = L.marker([10.78246586340858, 106.70144332535398])
    .bindPopup(popupContent_stac)
    .openPopup();
const popupContent_hptech = `
  <div style="width: 250px; text-align: center;"><p class="text-gray-700"> Một góc công ty
    <img id="popup-image-hptech" src="img/hptech.jpg" style="width: 100%; height: auto; border-radius: 8px;" />
    <div style="margin-top: 8px;">
    
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onclick="nextImage_hptech()">Ảnh khác</button>
    </div>
  </div>
`;
const images_hptech = [
    'img/hptech.jpg',
    'img/hptech2.jpg',
];
function updatePopupImage_hptech() {
    const img = document.getElementById("popup-image-hptech");
    if (img) {
        img.src = images_hptech[currentImageIndex];
    }
}
function nextImage_hptech() {
    currentImageIndex = (currentImageIndex + 1) % images_hptech.length;
    updatePopupImage_hptech();
}
var hptech = L.marker([10.78580171223922, 106.66742853101773]).bindPopup(popupContent_hptech).openPopup();
var all = L.layerGroup([csnct, csdn, vhhn, cslvs, hptech, stac])
// --- LOGIC CHÍNH ---
const storyPanel = document.getElementById('story-panel');
const sections = document.querySelectorAll('.story-section');
let activeSectionId = null;
let currentMarker = null;
function updateMap(section) {
    const lat = section.dataset.lat;
    const lon = section.dataset.lon;
    const zoom = section.dataset.zoom;
    const marker = window[section.dataset.marker]
    if (lat && lon && zoom && marker) {
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }
        map.flyTo([lat, lon], parseInt(zoom), {
            duration: 1.5
        });
        marker.addTo(map).openPopup()
        currentMarker = marker;
    }
}
function setActive(sectionId) {
    if (sectionId === activeSectionId) return;

    activeSectionId = sectionId;

    sections.forEach(sec => {
        const isActive = sec.id === activeSectionId;
        sec.classList.toggle('active', isActive);
        if (isActive) {
            updateMap(sec);
        }
    });
}
sections.forEach(section => {
    section.addEventListener('click', function () {
        this.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    });
});
storyPanel.addEventListener('scroll', () => {
    const panelMidPoint = storyPanel.getBoundingClientRect().top + storyPanel.clientHeight / 2;
    let newActiveSectionId = '';

    for (const section of sections) {
        if (section.getBoundingClientRect().top < panelMidPoint) {
            newActiveSectionId = section.id;
        } else {
            break;
        }
    }

    if (!newActiveSectionId && sections.length > 0) {
        newActiveSectionId = sections[0].id;
    }

    if (newActiveSectionId) {
        setActive(newActiveSectionId);
    }
});
window.onload = () => {
    if (sections.length > 0) {
        setActive(sections[0].id);
    }
};
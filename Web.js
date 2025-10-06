// 轮播图功能
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    // 显示指定幻灯片
    function showSlide(index) {
        // 隐藏所有幻灯片
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // 显示当前幻灯片
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }
    
    // 下一张幻灯片
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // 上一张幻灯片
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    // 添加事件监听器
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // 为指示器添加点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });
    
    // 自动轮播
    setInterval(nextSlide, 5000);
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// 导航栏高亮
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if(pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// 图片模态框
const galleryItems = document.querySelectorAll('.member-img, .photo-card img, .gallery-item img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentImageIndex = 0;
const allImages = Array.from(galleryItems);

function openModal(index) {
    currentImageIndex = index;
    const imgSrc = allImages[currentImageIndex].getAttribute('src');
    const imgAlt = allImages[currentImageIndex].getAttribute('alt');
    const parentElement = allImages[currentImageIndex].closest('.member-card, .photo-card, .gallery-item');
    let caption = '';
    
    if (parentElement) {
        const nameElement = parentElement.querySelector('.member-name, .photo-title, .gallery-caption');
        if (nameElement) {
            caption = nameElement.textContent;
        }
    }
    
    modalImg.setAttribute('src', imgSrc);
    modalImg.setAttribute('alt', imgAlt);
    modalCaption.textContent = caption || imgAlt;
    modal.style.display = 'flex';
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    openModal(currentImageIndex);
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    openModal(currentImageIndex);
}

galleryItems.forEach((item, index) => {
    item.addEventListener('click', function() {
        openModal(index);
    });
});

modalClose.addEventListener('click', function() {
    modal.style.display = 'none';
});

modalNext.addEventListener('click', nextImage);
modalPrev.addEventListener('click', prevImage);

modal.addEventListener('click', function(e) {
    if(e.target === modal) {
        modal.style.display = 'none';
    }
});

// 键盘导航
document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'flex') {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    }
});

// 滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// 音乐播放器功能
const musicPlayer = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const minimizeBtn = document.getElementById('minimizeBtn');
const trackName = document.getElementById('trackName');
const trackArtist = document.getElementById('trackArtist');
const playlistItems = document.querySelectorAll('.playlist-item');

// 创建音频元素
const audio = new Audio();
audio.volume = volumeSlider.value;

let currentTrackIndex = 0;
let isPlaying = false;

// 初始化播放列表
const playlist = Array.from(playlistItems).map(item => ({
    name: item.querySelector('span').textContent,
    src: item.getAttribute('data-src'),
    element: item
}));

// 加载并播放指定曲目
function loadTrack(index) {
    currentTrackIndex = index;
    const track = playlist[currentTrackIndex];
    
    audio.src = track.src;
    trackName.textContent = track.name;
    trackArtist.textContent = 'Ave Mujica';
    
    // 更新播放列表高亮
    playlistItems.forEach(item => item.classList.remove('active'));
    track.element.classList.add('active');
    
    if (isPlaying) {
        audio.play();
    }
}

// 播放/暂停功能
function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

// 下一曲
function nextTrack() {
    let nextIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(nextIndex);
}

// 上一曲
function prevTrack() {
    let prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(prevIndex);
}

// 事件监听器
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);

volumeSlider.addEventListener('input', function() {
    audio.volume = this.value;
});

minimizeBtn.addEventListener('click', function() {
    musicPlayer.classList.toggle('minimized');
    if (musicPlayer.classList.contains('minimized')) {
        minimizeBtn.innerHTML = '<i class="fas fa-window-restore"></i>';
    } else {
        minimizeBtn.innerHTML = '<i class="fas fa-window-minimize"></i>';
    }
});

// 播放列表项点击事件
playlistItems.forEach((item, index) => {
    item.addEventListener('click', function() {
        loadTrack(index);
        if (!isPlaying) {
            togglePlayPause();
        }
    });
});

// 音频结束时自动播放下一曲
audio.addEventListener('ended', nextTrack);

// 加载第一首曲目
loadTrack(0);
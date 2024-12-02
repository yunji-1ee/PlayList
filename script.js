const diskData = {
    1: { title: 'Supernatural', artist: 'NewJeans', duration: '3:11', audio: 'Supernatural.mp3' },
    2: { title: 'UP', artist: 'KARINA (Solo)', duration: '2:46', audio: 'up.mp3' },
    3: { title: '미리 메리 크리스마스', artist: '아이유(IU)', duration: '4:30', audio: '미리메리크리스마스.mp3' },
};

let currentTrackIndex = 0;
let isPlaying = false;

const trackTitle = document.getElementById('title');
const trackArtist = document.getElementById('artist');
const currentTime = document.getElementById('current-time');
const totalTime = document.getElementById('total-time');
const progressBar = document.getElementById('progress-bar');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const disks = document.querySelectorAll('.disk');

function updateTrackInfo(index) {
    const track = diskData[index + 1];
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    totalTime.textContent = track.duration;
    audioSource.src = track.audio;
    audioPlayer.load();
    progressBar.value = 0;
}

function togglePlayPause(diskId = null) {
    if (diskId !== null && diskId !== currentTrackIndex) {
        // 새 디스크 클릭 시 기존 곡 정지
        stopOtherDisks();
        currentTrackIndex = diskId;
        updateTrackInfo(currentTrackIndex);
        isPlaying = false; // 상태 초기화
    }

    const albumImage = disks[currentTrackIndex].querySelector('.album-image');
    const playIcon = document.getElementById('play-icon');

    if (isPlaying) {
        audioPlayer.pause();
        albumImage.classList.remove('spin');
        playIcon.src = 'play_btn.png'; // 재생 버튼 이미지로 변경
    } else {
        stopOtherDisks(); // 기존 곡 정지
        audioPlayer.play();
        albumImage.classList.add('spin');
        playIcon.src = 'pause_btn.png'; // 일시정지 버튼 이미지로 변경
    }

    isPlaying = !isPlaying;
}

function stopOtherDisks() {
    disks.forEach((disk, index) => {
        const albumImage = disk.querySelector('.album-image');
        if (index !== currentTrackIndex) {
            albumImage.classList.remove('spin'); // 다른 디스크 회전 멈춤
        }
    });

    audioPlayer.pause(); // 기존 재생 중지
    isPlaying = false; // 재생 상태 초기화
    const playIcon = document.getElementById('play-icon');
    playIcon.src = 'play_btn.png'; // 재생 버튼 이미지로 초기화
}

function updateProgress() {
    if (audioPlayer.duration) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = percentage;
        currentTime.textContent = formatTime(audioPlayer.currentTime);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// 이전 곡으로 이동
function playPreviousTrack() {
    stopOtherDisks();
    currentTrackIndex = (currentTrackIndex - 1 + disks.length) % disks.length;
    updateTrackInfo(currentTrackIndex);
    togglePlayPause(); // 새 곡 재생
}

// 다음 곡으로 이동
function playNextTrack() {
    stopOtherDisks();
    currentTrackIndex = (currentTrackIndex + 1) % disks.length;
    updateTrackInfo(currentTrackIndex);
    togglePlayPause(); // 새 곡 재생
}

// 진행바를 드래그할 때 음악 재생 시간 변경
progressBar.addEventListener('input', (e) => {
    const percentage = e.target.value;
    if (audioPlayer.duration) {
        const newTime = (percentage / 100) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
        currentTime.textContent = formatTime(newTime);
    }
});

// 디스크 및 앨범 이미지 클릭 이벤트 추가
disks.forEach((disk, index) => {
    const albumImage = disk.querySelector('.album-image');
    const diskId = index;

    disk.addEventListener('click', () => togglePlayPause(diskId));
    albumImage.addEventListener('click', (e) => {
        e.stopPropagation(); // 디스크 이벤트와 중복 방지
        togglePlayPause(diskId);
    });
});

// 버튼 이벤트 리스너
playPauseBtn.addEventListener('click', () => togglePlayPause());
prevBtn.addEventListener('click', playPreviousTrack);
nextBtn.addEventListener('click', playNextTrack);
audioPlayer.addEventListener('timeupdate', updateProgress);

// 초기 설정
updateTrackInfo(currentTrackIndex);

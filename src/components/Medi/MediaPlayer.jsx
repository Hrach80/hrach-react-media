import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute, FaSearch } from 'react-icons/fa';
import '../Medi/MediaPlayer.css';

const MediaPlayer = ({ clientId, category }) => {
    const [tracks, setTracks] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [searchArtistName, setSearchArtistName] = useState('');
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                let apiEndpoint = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&limit=10&order=downloads_week`;

                // Ստուգում ենք՝ արդյոք որոնվում է կատարողի անունով
                if (searchArtistName.trim() !== '') {
                    apiEndpoint += `&artist_name=${encodeURIComponent(searchArtistName.trim())}`;
                } else if (category !== 'all') {
                    // Եթե կատարողի անունով որոնում չկա, աշխատում ենք կատեգորիաներով
                    apiEndpoint += `&tags=${category}`;
                }

                const response = await fetch(apiEndpoint);
                const data = await response.json();

                if (data && data.results) {
                    const formattedTracks = data.results.map(track => ({
                        id: track.id,
                        title: track.name,
                        artist: track.artist_name,
                        albumImage: track.album_image,
                        url: track.audio
                    }));
                    setTracks(formattedTracks);
                    setCurrentTrackIndex(0);
                    setIsPlaying(false);
                } else {
                    console.error('API response is not as expected:', data);
                    setTracks([]);
                }
            } catch (error) {
                console.error('Error fetching tracks:', error);
            }
        };
        fetchTracks();
    }, [clientId, category, searchArtistName]); // Ավելացրել ենք searchArtistName-ը որպես dependency

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || tracks.length === 0) return;

        const setAudioData = () => {
            setDuration(audio.duration);
        };

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        audio.src = tracks[currentTrackIndex].url;

        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('ended', playNext);

        if (isPlaying) {
            audio.play().catch(e => console.error("Playback failed:", e));
        } else {
            audio.pause();
        }

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('ended', playNext);
        };
    }, [currentTrackIndex, tracks, isPlaying]);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const playNext = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    };

    const playPrev = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Որոնումն աշխատում է useEffect-ի շնորհիվ, երբ searchArtistName-ը փոխվում է
        // Այստեղ կարող ենք որևէ լրացուցիչ տրամաբանություն ավելացնել
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolume = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState);
        if (audioRef.current) {
            audioRef.current.muted = newMuteState;
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const currentTrack = tracks[currentTrackIndex];

    return (
        <div className="media-player-container neomorph">
            <div className="track-album-image">
                {currentTrack && currentTrack.albumImage && <img src={currentTrack.albumImage} alt="Album Art" className="neomorph-image" />}
            </div>

            <form onSubmit={handleSearch} className="search-bar">
                <input
                    type="text"
                    placeholder="Որոնել կատարողի անունով..."
                    value={searchArtistName}
                    onChange={(e) => setSearchArtistName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="neomorph-input"
                />
                <button type="submit" className="neomorph-button search-button">
                    <FaSearch />
                </button>
            </form>

            {tracks.length > 0 ? (
                <>
                    <div className="track-info">
                        <h3 className="track-title">{currentTrack.title}</h3>
                        <p className="track-artist">{currentTrack.artist}</p>
                    </div>

                    <div className="progress-container">
                        <input
                            type="range"
                            value={currentTime}
                            max={duration || 0}
                            onChange={handleSeek}
                            className="progress-bar neomorph-progress"
                        />
                        <div className="time-display">
                            <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="controls">
                        <button onClick={playPrev} className="neomorph-button">
                            <FaStepBackward />
                        </button>
                        <button onClick={togglePlayPause} className="neomorph-button play-pause">
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                        <button onClick={playNext} className="neomorph-button">
                            <FaStepForward />
                        </button>
                    </div>

                    <div className="volume-control">
                        <button onClick={toggleMute} className="neomorph-button volume-button">
                            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolume}
                            className="volume-bar neomorph-progress"
                        />
                    </div>
                </>
            ) : (
                <div className="no-results">
                    <p>Արդյունքներ չգտնվեցին։</p>
                </div>
            )}

            <audio ref={audioRef} />
        </div>
    );
};

export default MediaPlayer;
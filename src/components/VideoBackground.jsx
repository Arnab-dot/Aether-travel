
import React from 'react';

const VideoBackground = () => {
    // Placeholder image generated previously
    // In a real scenario, the user would replace '/path/to/video.mp4' with their actual video file
    // and potentially use the generated image as a poster.
    // Since I can't host the image I generated easily for the app to access via URL without moving it,
    // I will use a reliable placeholder service for now or just a CSS gradient that simulates the sunrise-sunset 
    // if the video is missing, but ideally, I'd move the generated image to public. 
    // construct: I'll assume the user will drop a video file named 'travel_bg.mp4' in the public folder.
    
    return (
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
            {/* Overlay for legibility */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
            
            {/* Video Element */}
            <video 
                autoPlay 
                loop 
                muted 
                className="w-full h-full object-cover opacity-80"
                // Poster is a fallback if video doesn't load
                poster="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
            >
                <source src="/travel_bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoBackground;

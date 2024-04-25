import React from 'react';

// Rename the component to avoid conflicts
export default function CustomLottieAnimation() {
  return (
    <div>
      {/* Remove the script tag */}
      <dotlottie-player
        src="https://lottie.host/fe6f0ee7-f250-4ccf-8ef8-0dad6f42180f/BP18byGQIt.json"
        background="transparent"
        speed="1"
        style={{ width: '300px', height: '300px' }}
        autoplay
      ></dotlottie-player>
    </div>
  );
}
import React from 'react';

export default function BlossomLayer() {
  const blossomCount = 8;
  const blossoms = Array.from({ length: blossomCount }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${7 + Math.random() * 7}s`,
    delay: `${Math.random() * 8}s`,
    size: `${5 + Math.random() * 4}px`,
  }));

  return (
    <div className="blossom-layer" aria-hidden="true">
      {blossoms.map((b) => (
        <div
          key={b.id}
          className="blossom"
          style={{
            left: b.left,
            animationDuration: b.duration,
            animationDelay: b.delay,
            width: b.size,
            height: b.size,
          }}
        />
      ))}
    </div>
  );
}

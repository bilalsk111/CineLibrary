// import React, { useEffect, useRef, useState } from 'react';

// const ReptileCursor = () => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [segments, setSegments] = useState([]);
//   const animationRef = useRef();
//   const lastTimeRef = useRef(0);

//   // Initialize segments
//   useEffect(() => {
//     const initialSegments = [];
//     for (let i = 0; i < 25; i++) {
//       initialSegments.push({
//         x: window.innerWidth / 2,
//         y: window.innerHeight / 2,
//         angle: 0,
//       });
//     }
//     setSegments(initialSegments);
//   }, []);

//   // Track mouse position
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     document.addEventListener('mousemove', handleMouseMove);
//     return () => document.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   // Animate segments
//   useEffect(() => {
//     const animate = (currentTime) => {
//       if (currentTime - lastTimeRef.current > 16) { // ~60fps
//         setSegments(prevSegments => {
//           const newSegments = [...prevSegments];
          
//           // Head follows mouse with slight delay
//           if (newSegments.length > 0) {
//             const head = newSegments[0];
//             const dx = mousePosition.x - head.x;
//             const dy = mousePosition.y - head.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);
            
//             if (distance > 1) {
//               const speed = 0.12;
//               newSegments[0] = {
//                 x: head.x + dx * speed,
//                 y: head.y + dy * speed,
//                 angle: Math.atan2(dy, dx),
//               };
//             }
//           }

//           // Body segments follow each other with physics
//           for (let i = 1; i < newSegments.length; i++) {
//             const current = newSegments[i];
//             const target = newSegments[i - 1];
            
//             // Variable segment distances for natural movement
//             let segmentDistance = 18;
//             if (i > 8) segmentDistance = 16;
//             if (i > 15) segmentDistance = 14;
//             if (i > 20) segmentDistance = 12;
            
//             const dx = target.x - current.x;
//             const dy = target.y - current.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);
            
//             if (distance > segmentDistance) {
//               const angle = Math.atan2(dy, dx);
//               const speed = 0.8; // How quickly segments catch up
              
//               newSegments[i] = {
//                 x: current.x + (target.x - Math.cos(angle) * segmentDistance - current.x) * speed,
//                 y: current.y + (target.y - Math.sin(angle) * segmentDistance - current.y) * speed,
//                 angle: angle,
//               };
//             }
//           }

//           return newSegments;
//         });
        
//         lastTimeRef.current = currentTime;
//       }
      
//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [mousePosition]);

//   return (
//     <div className="fixed inset-0 pointer-events-none z-50">
//       <svg
//         className="absolute inset-0 w-full h-full"
//         style={{ overflow: 'visible' }}
//       >
//         {/* Connecting spine */}
//         {segments.length > 1 && (
//           <path
//             d={`M ${segments.map(s => `${s.x},${s.y}`).join(' L ')}`}
//             fill="none"
//             stroke="rgba(255, 255, 255, 0.3)"
//             strokeWidth={2}
//             style={{ mixBlendMode: 'difference' }}
//           />
//         )}

//         {segments.map((segment, index) => {
//           const isHead = index === 0;
//           const isNeck = index >= 1 && index <= 3;
//           const isBody = index >= 4 && index <= 12;
//           const isBackend = index >= 13 && index <= 18;
//           const isTail = index >= 19;

//           // Head with detailed features
//           if (isHead) {
//             return (
//               <g key={index} style={{ mixBlendMode: 'difference' }}>
//                 {/* Head shape */}
//                 <ellipse
//                   cx={segment.x}
//                   cy={segment.y}
//                   rx={8}
//                   ry={6}
//                   fill="rgba(255, 255, 255, 0.9)"
//                   transform={`rotate(${segment.angle * 180 / Math.PI} ${segment.x} ${segment.y})`}
//                 />
//                 {/* Eyes */}
//                 <circle
//                   cx={segment.x + Math.cos(segment.angle + 0.4) * 5}
//                   cy={segment.y + Math.sin(segment.angle + 0.4) * 5}
//                   r={2}
//                   fill="rgba(255, 255, 255, 0.8)"
//                 />
//                 <circle
//                   cx={segment.x + Math.cos(segment.angle - 0.4) * 5}
//                   cy={segment.y + Math.sin(segment.angle - 0.4) * 5}
//                   r={2}
//                   fill="rgba(255, 255, 255, 0.8)"
//                 />
//                 {/* Snout */}
//                 <polygon
//                   points={`${segment.x + Math.cos(segment.angle) * 12},${segment.y + Math.sin(segment.angle) * 12} ${segment.x + Math.cos(segment.angle + 0.3) * 8},${segment.y + Math.sin(segment.angle + 0.3) * 8} ${segment.x + Math.cos(segment.angle - 0.3) * 8},${segment.y + Math.sin(segment.angle - 0.3) * 8}`}
//                   fill="rgba(255, 255, 255, 0.7)"
//                 />
//               </g>
//             );
//           }

//           // Neck vertebrae
//           if (isNeck) {
//             const size = 6 - (index * 0.5);
//             return (
//               <g key={index} style={{ mixBlendMode: 'difference' }}>
//                 <circle
//                   cx={segment.x}
//                   cy={segment.y}
//                   r={size}
//                   fill="none"
//                   stroke="rgba(255, 255, 255, 0.8)"
//                   strokeWidth={1.5}
//                 />
//                 {/* Small neck ribs */}
//                 <line
//                   x1={segment.x + Math.cos(segment.angle + Math.PI/2) * size}
//                   y1={segment.y + Math.sin(segment.angle + Math.PI/2) * size}
//                   x2={segment.x + Math.cos(segment.angle + Math.PI/2) * (size + 4)}
//                   y2={segment.y + Math.sin(segment.angle + Math.PI/2) * (size + 4)}
//                   stroke="rgba(255, 255, 255, 0.6)"
//                   strokeWidth={1}
//                 />
//                 <line
//                   x1={segment.x + Math.cos(segment.angle - Math.PI/2) * size}
//                   y1={segment.y + Math.sin(segment.angle - Math.PI/2) * size}
//                   x2={segment.x + Math.cos(segment.angle - Math.PI/2) * (size + 4)}
//                   y2={segment.y + Math.sin(segment.angle - Math.PI/2) * (size + 4)}
//                   stroke="rgba(255, 255, 255, 0.6)"
//                   strokeWidth={1}
//                 />
//               </g>
//             );
//           }

//           // Main body with large ribs
//           if (isBody) {
//             const size = 8 - ((index - 4) * 0.3);
//             const ribLength = 12 - ((index - 4) * 0.5);
//             return (
//               <g key={index} style={{ mixBlendMode: 'difference' }}>
//                 {/* Main vertebra */}
//                 <circle
//                   cx={segment.x}
//                   cy={segment.y}
//                   r={size}
//                   fill="none"
//                   stroke="rgba(255, 255, 255, 0.9)"
//                   strokeWidth={2}
//                 />
//                 {/* Large ribs */}
//                 <line
//                   x1={segment.x + Math.cos(segment.angle + Math.PI/2) * size}
//                   y1={segment.y + Math.sin(segment.angle + Math.PI/2) * size}
//                   x2={segment.x + Math.cos(segment.angle + Math.PI/2) * (size + ribLength)}
//                   y2={segment.y + Math.sin(segment.angle + Math.PI/2) * (size + ribLength)}
//                   stroke="rgba(255, 255, 255, 0.7)"
//                   strokeWidth={1.5}
//                 />
//                 <line
//                   x1={segment.x + Math.cos(segment.angle - Math.PI/2) * size}
//                   y1={segment.y + Math.sin(segment.angle - Math.PI/2) * size}
//                   x2={segment.x + Math.cos(segment.angle - Math.PI/2) * (size + ribLength)}
//                   y2={segment.y + Math.sin(segment.angle - Math.PI/2) * (size + ribLength)}
//                   stroke="rgba(255, 255, 255, 0.7)"
//                   strokeWidth={1.5}
//                 />
//                 {/* Rib tips */}
//                 <circle
//                   cx={segment.x + Math.cos(segment.angle + Math.PI/2) * (size + ribLength)}
//                   cy={segment.y + Math.sin(segment.angle + Math.PI/2) * (size + ribLength)}
//                   r={1.5}
//                   fill="rgba(255, 255, 255, 0.6)"
//                 />
//                 <circle
//                   cx={segment.x + Math.cos(segment.angle - Math.PI/2) * (size + ribLength)}
//                   cy={segment.y + Math.sin(segment.angle - Math.PI/2) * (size + ribLength)}
//                   r={1.5}
//                   fill="rgba(255, 255, 255, 0.6)"
//                 />
//               </g>
//             );
//           }

//           // Backend spine
//           if (isBackend) {
//             const size = 5 - ((index - 13) * 0.3);
//             const ribLength = 8 - ((index - 13) * 0.5);
//             return (
//               <g key={index} style={{ mixBlendMode: 'difference' }}>
//                 <circle
//                   cx={segment.x}
//                   cy={segment.y}
//                   r={size}
//                   fill="none"
//                   stroke="rgba(255, 255, 255, 0.8)"
//                   strokeWidth={1.5}
//                 />
//                 {/* Medium ribs */}
//                 <line
//                   x1={segment.x + Math.cos(segment.angle + Math.PI/2) * size}
//                   y1={segment.y + Math.sin(segment.angle + Math.PI/2) * size}
//                   x2={segment.x + Math.cos(segment.angle + Math.PI/2) * (size + ribLength)}
//                   y2={segment.y + Math.sin(segment.angle + Math.PI/2) * (size + ribLength)}
//                   stroke="rgba(255, 255, 255, 0.6)"
//                   strokeWidth={1}
//                 />
//                 <line
//                   x1={segment.x + Math.cos(segment.angle - Math.PI/2) * size}
//                   y1={segment.y + Math.sin(segment.angle - Math.PI/2) * size}
//                   x2={segment.x + Math.cos(segment.angle - Math.PI/2) * (size + ribLength)}
//                   y2={segment.y + Math.sin(segment.angle - Math.PI/2) * (size + ribLength)}
//                   stroke="rgba(255, 255, 255, 0.6)"
//                   strokeWidth={1}
//                 />
//               </g>
//             );
//           }

//           // Tail segments
//           if (isTail) {
//             const size = Math.max(2, 4 - ((index - 19) * 0.5));
//             return (
//               <g key={index} style={{ mixBlendMode: 'difference' }}>
//                 <circle
//                   cx={segment.x}
//                   cy={segment.y}
//                   r={size}
//                   fill="rgba(255, 255, 255, 0.7)"
//                   opacity={1 - ((index - 19) * 0.15)}
//                 />
//                 {/* Small tail spikes */}
//                 <line
//                   x1={segment.x}
//                   y1={segment.y}
//                   x2={segment.x + Math.cos(segment.angle + Math.PI/2) * (size + 3)}
//                   y2={segment.y + Math.sin(segment.angle + Math.PI/2) * (size + 3)}
//                   stroke="rgba(255, 255, 255, 0.5)"
//                   strokeWidth={0.8}
//                   opacity={1 - ((index - 19) * 0.15)}
//                 />
//                 <line
//                   x1={segment.x}
//                   y1={segment.y}
//                   x2={segment.x + Math.cos(segment.angle - Math.PI/2) * (size + 3)}
//                   y2={segment.y + Math.sin(segment.angle - Math.PI/2) * (size + 3)}
//                   stroke="rgba(255, 255, 255, 0.5)"
//                   strokeWidth={0.8}
//                   opacity={1 - ((index - 19) * 0.15)}
//                 />
//               </g>
//             );
//           }

//           return null;
//         })}

//         {/* Additional skeletal details */}
//         {segments.length > 5 && (
//           <g style={{ mixBlendMode: 'difference' }}>
//             {/* Shoulder blades */}
//             <line
//               x1={segments[4]?.x + Math.cos(segments[4]?.angle + Math.PI/2 + 0.5) * 15}
//               y1={segments[4]?.y + Math.sin(segments[4]?.angle + Math.PI/2 + 0.5) * 15}
//               x2={segments[6]?.x + Math.cos(segments[6]?.angle + Math.PI/2 + 0.3) * 12}
//               y2={segments[6]?.y + Math.sin(segments[6]?.angle + Math.PI/2 + 0.3) * 12}
//               stroke="rgba(255, 255, 255, 0.5)"
//               strokeWidth={1}
//             />
//             <line
//               x1={segments[4]?.x + Math.cos(segments[4]?.angle - Math.PI/2 - 0.5) * 15}
//               y1={segments[4]?.y + Math.sin(segments[4]?.angle - Math.PI/2 - 0.5) * 15}
//               x2={segments[6]?.x + Math.cos(segments[6]?.angle - Math.PI/2 - 0.3) * 12}
//               y2={segments[6]?.y + Math.sin(segments[6]?.angle - Math.PI/2 - 0.3) * 12}
//               stroke="rgba(255, 255, 255, 0.5)"
//               strokeWidth={1}
//             />
            
//             {/* Hip bones */}
//             <line
//               x1={segments[12]?.x + Math.cos(segments[12]?.angle + Math.PI/2 + 0.3) * 10}
//               y1={segments[12]?.y + Math.sin(segments[12]?.angle + Math.PI/2 + 0.3) * 10}
//               x2={segments[14]?.x + Math.cos(segments[14]?.angle + Math.PI/2 + 0.2) * 8}
//               y2={segments[14]?.y + Math.sin(segments[14]?.angle + Math.PI/2 + 0.2) * 8}
//               stroke="rgba(255, 255, 255, 0.4)"
//               strokeWidth={1}
//             />
//             <line
//               x1={segments[12]?.x + Math.cos(segments[12]?.angle - Math.PI/2 - 0.3) * 10}
//               y1={segments[12]?.y + Math.sin(segments[12]?.angle - Math.PI/2 - 0.3) * 10}
//               x2={segments[14]?.x + Math.cos(segments[14]?.angle - Math.PI/2 - 0.2) * 8}
//               y2={segments[14]?.y + Math.sin(segments[14]?.angle - Math.PI/2 - 0.2) * 8}
//               stroke="rgba(255, 255, 255, 0.4)"
//               strokeWidth={1}
//             />
//           </g>
//         )}
//       </svg>
//     </div>
//   );
// };

// export default ReptileCursor;
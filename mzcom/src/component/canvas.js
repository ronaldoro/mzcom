import React, { useRef, useEffect } from 'react';

const CanvasComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 예제: 사각형 그리기
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 100, 100);

    // 추가적인 그리기 작업을 수행할 수 있습니다.

    // 컴포넌트가 언마운트되거나 업데이트될 때 cleanup 작업을 수행합니다.
    return () => {
      // cleanup 작업 (예: 타이머 제거 등)
    };
  }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.

  return <canvas ref={canvasRef} width={400} height={200} />;
};

export default CanvasComponent;

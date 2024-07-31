import React, { useRef, useEffect, useState, useCallback } from 'react';
import { drawCavaseRuler } from './utils'; // Assuming this function exists

interface Props {
  scale: number;
  palette: object;
  vertical: boolean;
  start: number;
  width: number;
  height: number;
  selectStart: number;
  selectLength: number;
  canvasWidth: number;
  canvasHeight: number;
  rate: number;
  gridRatio: number;
}

const CanvasRuler: React.FC<Props> = ({
  scale,
  palette,
  vertical,
  start,
  width,
  height,
  selectStart,
  selectLength,
  canvasWidth,
  canvasHeight,
  rate,
  gridRatio,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [ratioValue, setRatioValue] = useState(window.devicePixelRatio || 1);

  useEffect(() => {
    const handleResize = () => {
      setRatioValue(window.devicePixelRatio || 1);
      updateCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      setCanvasContext(ctx);
      updateCanvas();
    }
  }, [canvasRef]);

  const updateCanvas = useCallback(() => {
    if (canvasRef.current && canvasContext) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      canvasContext.font = `${12 * ratioValue}px -apple-system, "Helvetica Neue", ".SFNSText-Regular", "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`;
      canvasContext.lineWidth = 1;
      canvasContext.textBaseline = 'middle';

      drawRuler();
    }
  }, [width, height, ratioValue]);

  const drawRuler = useCallback(() => {
    const options = {
      scale: scale / rate,
      width,
      height,
      palette,
      canvasWidth: canvasWidth * rate,
      canvasHeight: canvasHeight * rate,
      ratio: ratioValue,
      rate,
      gridRatio,
    };

    if (canvasContext) {
      drawCavaseRuler(
        canvasContext,
        start * rate,
        selectStart,
        selectLength,
        options,
        !vertical
      );
    }
  }, [scale, rate, width, height, palette, canvasWidth, canvasHeight, ratioValue, start, selectStart, selectLength, vertical]);

  useEffect(() => {
    drawRuler();
  }, [drawRuler]);

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    // Emit event if needed
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="ruler"
      style={{
        [vertical ? 'borderRight' : 'borderBottom']: `1px solid ${palette.borderColor || '#eeeeef'}`,
      }}
      onMouseDown={handleDragStart}
    />
  );
};

export default CanvasRuler;
import React, { useState, useEffect } from 'react';
import RulerLine from './RulerLine';
import CanvasRuler from '../canvas-ruler/index';
import useLine from './useLine';
import styled from 'styled-components';
import { extendableBorder, verticalBorder } from './mixins.jsx';
// import { RulerWrapperProps } from '../index-types';


const RulerComponent = ({
  scale,
  thick,
  canvasWidth,
  canvasHeight,
  palette,
  vertical,
  width,
  height,
  start,
  startOther,
  lines,
  selectStart,
  selectLength,
  isShowReferLine,
  rate,
  snapThreshold,
  snapsObj,
  gridRatio,
  lockLine,
}) => {
  const [isLockLine, setIsLockLine] = useState(lockLine);
  const [isdragle, setIsDragle] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [startValue, setStartValue] = useState(startOther - thick / 2);
  const { actionStyle, handleMouseMove, handleMouseDown, labelContent } = useLine(
    {
      palette,
      scale,
      snapsObj,
      lines,
      canvasWidth,
      canvasHeight,
      snapThreshold,
      rate,
      lockLine: isLockLine,
    },
    !vertical
  );

  const rwClassName = vertical ? 'v-container' : 'h-container';

  const cpuLines = vertical ? lines.h : lines.v;

  const indicatorStyle = {
    left: vertical ? undefined : `${(startValue - startOther) * scale + thick}px`,
    top: vertical ? `${(startValue - startOther) * scale + thick}px` : undefined,
    cursor: vertical ? 'ew-resize' : 'ns-resize',
    borderLeft: vertical ? undefined : `1px ${palette.lineType} ${palette.lineColor}`,
    borderBottom: vertical ? `1px ${palette.lineType} ${palette.lineColor}` : undefined,
  };

  const mousedown = (e) => {
    setIsDragle(true);
    setIsLockLine(false);
    setStartValue(Math.round(startOther - thick / 2));
    setTimeout(async () => {
      await handleMouseDown(e);
      setIsDragle(false);
    }, 0);
  };

  useEffect(() => {
    setIsLockLine(lockLine);
  }, [lockLine]);

  const Indicator = styled.div`
  ${props => props.vertical ? verticalBorder(props.topBottomWidth, props.width, props.offset) : extendableBorder(props.topBottomWidth, props.leftRightWidth, props.offset)}
`;

  return (

    <div className={rwClassName}>
      <Indicator vertical={true} topBottomWidth="4px" leftRightWidth="100vw" offset="-4px">
        <CanvasRuler
          vertical={vertical}
          style={{ cursor: vertical ? 'ew-resize' : 'ns-resize' }}
          scale={scale}
          width={width}
          height={height}
          start={start}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          selectStart={selectStart}
          selectLength={selectLength}
          palette={palette}
          rate={rate}
          gridRatio={gridRatio}
          onHandleDragStart={mousedown}
        />
        {isShowReferLine && (
          <div className="lines">
            {cpuLines.map((v, i) => (
              <RulerLine
                key={`${v}-${i}`}
                lockLine={isLockLine}
                index={i}
                value={Math.floor(v)}
                scale={scale}
                start={start}
                canvasWidth={canvasWidth}
                snapThreshold={snapThreshold}
                snapsObj={snapsObj}
                canvasHeight={canvasHeight}
                lines={lines}
                thick={thick}
                palette={palette}
                vertical={vertical}
                isShowReferLine={isShowReferLine}
                rate={rate}
              />
            ))}
          </div>
        )}
        {isShowReferLine && (
          <div
            className="indicator"
            onMouseEnter={() => setShowLabel(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowLabel(false)}
            hidden={!isdragle}
            style={[indicatorStyle, { cursor: vertical ? 'ew-resize' : 'ns-resize' }]}
          >
            <div className="action" style={actionStyle}>
              {showLabel && <span className="value">{labelContent}</span>}
            </div>
          </div>
        )}
      </Indicator>
    </div>

  );
};

export default RulerComponent;

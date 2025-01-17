import { useState, useEffect, useMemo } from 'react'
import RulerLine from './RulerLine'
import CanvasRuler from '../canvas-ruler/index'
import useLine from './useLine'
import type { RulerWrapperProps } from '../index-types'
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
  propStyle,
  showShadowText,
  handleLine
}: RulerWrapperProps) => {
  const [isLockLine, setIsLockLine] = useState(lockLine)
  const [isdragle, setIsDragle] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const { actionStyle, handleMouseMove, handleMouseDown, labelContent, startValue, setStartValue } =
    useLine(
      {
        palette,
        scale,
        snapsObj,
        lines,
        canvasWidth,
        canvasHeight,
        snapThreshold,
        lockLine: isLockLine,
        rate,
        handleLine
      },
      !vertical
    )

  const rwClassName = vertical ? 'v-container' : 'h-container'

  const cpuLines = useMemo(() => {
    return vertical ? lines.h : lines.v
  }, [vertical, lines])

  const indicatorStyle = useMemo(() => {
    const lineType = palette.lineType
    let positionKey = vertical ? 'left' : 'top'
    let gepKey = vertical ? 'top' : 'left'
    let boderKey = vertical ? 'borderLeft' : 'borderBottom'
    const offsetPx = (startValue - startOther) * scale + thick
    return {
      [positionKey]: offsetPx + 'px',
      [gepKey]: -thick + 'px',
      cursor: vertical ? 'ew-resize' : 'ns-resize',
      [boderKey]: `1px ${lineType} ${palette.lineColor}`
    }
  }, [startValue, startOther, vertical, palette.lineType, scale, palette.lineColor, thick])

  const mousedown = async (e: React.MouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent as MouseEvent
    setIsDragle(true)
    setIsLockLine(false)
    let tempStartValue = Math.round(
      startOther - thick / scale + (vertical ? offsetX : offsetY) / scale
    )
    setStartValue(tempStartValue)
    await handleMouseDown(e, tempStartValue)
    setIsDragle(false)
  }

  useEffect(() => {
    setIsLockLine(lockLine)
  }, [lockLine])

  return (
    <div className={rwClassName} style={propStyle}>
      <CanvasRuler
        vertical={vertical}
        scale={scale}
        width={width}
        height={height}
        start={start}
        showShadowText={showShadowText}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        selectStart={selectStart}
        selectLength={selectLength}
        palette={palette}
        rate={rate}
        onDragStart={mousedown}
        gridRatio={gridRatio}
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
              palette={palette}
              vertical={vertical}
              isShowReferLine={isShowReferLine}
              handleLine={handleLine}
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
          style={indicatorStyle}
        >
          <div className="action" style={actionStyle}>
            {showLabel && <span className="value">{labelContent}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export default RulerComponent

import { eye64, closeEye64 } from './cornerImg64'
import React, { useState, useEffect, useMemo, useImperativeHandle, useRef } from 'react'
import './index.less'
import RulerWrapper from './RulerWrapper'
import type { SketchRulerProps, PaletteType, SketchRulerMethods } from '../index-types'

const usePaletteConfig = (palette: PaletteType) => {
  return useMemo(
    () => ({
      bgColor: '#f6f7f9',
      longfgColor: '#BABBBC',
      fontColor: '#7D8694', // ruler font color
      fontShadowColor: '#106ebe',
      shadowColor: '#e9f7fe', // ruler shadow color
      lineColor: '#51d6a9',
      lineType: 'solid',
      lockLineColor: '#d4d7dc',
      hoverBg: '#000',
      hoverColor: '#fff',
      borderColor: '#eeeeef',
      ...palette
    }),
    [palette]
  )
}

const SketchRule = React.forwardRef<SketchRulerMethods, SketchRulerProps>(
  (
    {
      showRuler = true,
      zoomLevel = 1,
      offsetX = 0,
      offsetY = 0,
      rate = 1,
      thick = 16,
      width = 1400,
      height = 800,
      eyeIcon,
      closeEyeIcon,
      paddingRatio = 0.2,
      autoCenter = true,
      showShadowText = true,
      shadow = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      lines = {
        h: [],
        v: []
      },
      isShowReferLine = true,
      canvasWidth = 1000,
      canvasHeight = 700,
      snapsObj = {
        h: [],
        v: []
      },
      palette,
      snapThreshold = 5,
      gridRatio = 1,
      lockLine = false,
      children,
      onHandleCornerClick,
      handleLine
    }: SketchRulerProps,
    ref
  ) => {
    const paletteConfig = usePaletteConfig(palette || {})
    const [cursorClass, setCursorClass] = useState('defaultCursor')
    const [showReferLine, setShowReferLine] = useState(isShowReferLine)
    const rectWidth = useMemo(() => width - thick, [width, thick])
    const rectHeight = useMemo(() => height - thick, [height, thick])

    const commonProps = {
      thick,
      lines,
      snapThreshold,
      snapsObj,
      isShowReferLine: showReferLine,
      canvasWidth,
      canvasHeight,
      rate,
      palette: paletteConfig,
      gridRatio,
      showShadowText,
      lockLine,
      scale: zoomLevel,
      handleLine
    }

    const cornerStyle = useMemo(() => {
      return {
        backgroundImage: showReferLine
          ? `url(${eyeIcon || eye64})`
          : `url(${closeEyeIcon || closeEye64})`,
        width: `${thick}px`,
        height: `${thick}px`,
        borderRight: `1px solid ${paletteConfig.borderColor}`,
        borderBottom: `1px solid ${paletteConfig.borderColor}`
      }
    }, [showReferLine, eyeIcon, closeEyeIcon, paletteConfig])

    const rectStyle = useMemo(() => {
      return {
        position: 'relative',
        background: paletteConfig.bgColor,
        left: thick + 'px',
        top: thick + 'px',
        width: rectWidth + 'px',
        height: rectHeight + 'px',
        // overflow: 'auto'
      }
    }, [rectHeight, rectWidth, paletteConfig])

    // const handleSpaceKeyDown = (e: KeyboardEvent) => {
    //   if (e.key === ' ') {
    //     setCursorClass('grabCursor')
    //     e.preventDefault()
    //   }
    // }

    // const handleSpaceKeyUp = (e: KeyboardEvent) => {
    //   if (e.key === ' ') {
    //     setCursorClass('defaultCursor')
    //   }
    // }

    // /**
    //  * @desc: 居中算法
    //  */
    // const calculateTransform = () => {
    //   const scaleX = (rectWidth * (1 - paddingRatio)) / canvasWidth
    //   const scaleY = (rectHeight * (1 - paddingRatio)) / canvasHeight
    //   const scale = Math.min(scaleX, scaleY)
    //   zoomStartX = rectWidth / 2 - canvasWidth / 2
    //   if (scale < 1) {
    //     zoomStartY =
    //       ((canvasHeight * scale) / 2 - canvasHeight / 2) / scale -
    //       (canvasHeight * scale - rectHeight) / scale / 2
    //   } else if (scale > 1) {
    //     zoomStartY =
    //       (canvasHeight * scale - canvasHeight) / 2 / scale +
    //       (rectHeight - canvasHeight * scale) / scale / 2
    //   } else {
    //     zoomStartY = 0
    //   }
    //   return scale
    // }

    const handleCornerClick = () => {
      setShowReferLine(!showReferLine)
      if (onHandleCornerClick) {
        onHandleCornerClick(!showReferLine)
      }
    }

    useEffect(() => {
      setShowReferLine(isShowReferLine)
    }, [isShowReferLine])

    // 处理children
    const [defaultSlot, btnSlot] = React.Children.toArray(children).reduce(
      (acc: [React.ReactNode | null, React.ReactNode | null], child: React.ReactNode) => {
        if (React.isValidElement(child)) {
          if (child.props.slot === 'default') {
            acc[0] = child
          } else if (child.props.slot === 'btn') {
            acc[1] = child
          }
        }
        return acc
      },
      [null, null] // 初始化 acc 为数组
    )
    return (
      <div className="StyledRuler" id="sketch-ruler">
        {btnSlot}
        <div className={`canvasedit-parent ${cursorClass}`} style={rectStyle}>
          {defaultSlot}
        </div>
        {showRuler && (
          <RulerWrapper
            {...commonProps}
            width={width!}
            propStyle={{ marginLeft: thick + 'px', width: rectWidth + 'px' }}
            height={thick!}
            start={offsetX!}
            startOther={offsetY!}
            selectStart={shadow.x!}
            selectLength={shadow.width}
            vertical={false}
          />
        )}
        {/* 竖直方向 */}
        {showRuler && (
          <RulerWrapper
            {...commonProps}
            propStyle={{ marginTop: thick + 'px', top: 0, height: rectHeight + 'px' }}
            width={thick!}
            height={height!}
            start={offsetY!}
            startOther={offsetX!}
            selectStart={shadow.y!}
            selectLength={shadow.height}
            vertical={true}
          />
        )}
        {showRuler && <a className="corner" style={cornerStyle} onClick={handleCornerClick} />}
      </div>
    )
  }
)

export default SketchRule

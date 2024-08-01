import React, { useState, useEffect, useRef } from 'react';
import SketchRule from '../src/index';
import bgImg from './assets/bg.png';
import { Demo, Top,Button, Wrapper, ImgStyle, Btns, Switch } from './styles';


const DemoComponent = () => {
  const [rectWidth, setRectWidth] = useState(1470);
  const [rectHeight, setRectHeight] = useState(872);
  const [canvasWidth, setCanvasWidth] = useState(1920);
  const [canvasHeight, setCanvasHeight] = useState(1080);
  const [rendIndex, setRendIndex] = useState(0);
  const [windowScale, setWindowScale] = useState(1);
  const sketchruleRef = useRef(null);
  const [showRuler, setShowRuler] = useState(true);
  const [panzoomOption, setPanzoomOption] = useState({
    maxScale: 3,
    minScale: 0.3,
    disablePan: false,
    disableZoom: false,
    handleStartEvent: (event) => {
      event.preventDefault();
      console.log('handleStartEvent', event);
    }
  });
  const [lockLine, setLockLine] = useState(false);
  const [snapsObj, setSnapsObj] = useState({ h: [0, 100, 200], v: [130] });

  const [state, setState] = useState({
    scale: 1,
    isBlack: false,
    lines: {
      h: [0, 250],
      v: [0, 500]
    },
    thick: 20,
    shadow: {
      x: 0,
      y: 0,
      width: 300,
      height: 300
    },
    isShowRuler: true,
    isShowReferLine: true
  });

  useEffect(() => {
    changeWindowScale();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {
    if (sketchruleRef.current) {
      changeWindowScale();
      sketchruleRef.current.initPanzoom();
    }
  };

  const changeWindowScale = () => {
    const num = Number(window.devicePixelRatio || 1);
    setWindowScale(num.toFixed(2) * 1);
  };

  const resetMethod = () => {
    if (sketchruleRef.current) {
      sketchruleRef.current.reset();
    }
  };

  const changeTheme = () => {
    setState(prevState => ({ ...prevState, isBlack: !prevState.isBlack }));
    setRendIndex(prevIndex => prevIndex + 1);
  };

  const zoomOutMethod = () => {
    if (sketchruleRef.current) {
      sketchruleRef.current.zoomOut();
    }
  };

  const handleShow = () => {
    setShowRuler(!showRuler);
  };

  const scaleChange = (e) => {
    const { value } = e.target;
    setState(prevState => ({ ...prevState, scale: value }));
    if (sketchruleRef.current) {
     sketchruleRef.current.zoom(value);
    }
  };

  const showLineClick = () => {
    setState(prevState => ({ ...prevState, isShowReferLine: !prevState.isShowReferLine }));
    console.log(state.isShowReferLine, 'state.isShowReferLine');
  };

  const snapsChange = (e) => {
    const arr = e.target.value.split(',');
    setSnapsObj(prevState => ({ ...prevState, h: arr.map(item => Number(item)) }));
  };

  const snapsChangeV = (e) => {
    const arr = e.target.value.split(',');
    setSnapsObj(prevState => ({ ...prevState, v: arr.map(item => Number(item)) }));
  };

  const changeScale = (e) => {
    setPanzoomOption(prevState => ({ ...prevState, disableZoom: e.target.checked }));
  };

  const changeMove = (e) => {
    setPanzoomOption(prevState => ({ ...prevState, disablePan: e.target.checked }));
  };

  const changeShadow = () => {
    setState(prevState => ({
      ...prevState,
      shadow: {
        ...prevState.shadow,
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight
      }
    }));
  };
  const handleCornerClick = (e: MouseEvent) => {
    console.log('handleCornerClick', e)
  }
  const cpuScale = state.scale.toFixed(2);
  const rectStyle = {
    width: `${rectWidth}px`,
    height: `${rectHeight}px`
  };
  const cpuPalette = state.isBlack
    ? {
        bgColor: 'transparent',
        hoverBg: '#fff',
        hoverColor: '#000',
        longfgColor: '#BABBBC',
        fontColor: '#DEDEDE',
        shadowColor: '#525252',
        lineColor: '#51d6a9',
        borderColor: '#B5B5B5',
        cornerActiveColor: '#fff'
      }
    : {
        bgColor: 'transparent',
        lineColor: '#51d6a9',
        lineType: 'dashed'
      };
  const canvasStyle = {
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`
  };





  return (
    <>
    <Demo>
      <Top>
        <div style={{ marginRight: '10px'}}> 缩放比例:{cpuScale} </div>
        <Button  onClick={showRuler ? () => setShowRuler(false) : handleShow}>隐藏规尺</Button>
        <Button  onClick={showLineClick}>辅助线开关</Button>
        <Button  onClick={() => setLockLine(true)}>锁定参考线</Button>
        <Button  onClick={changeShadow}>模拟阴影切换</Button>
        <Button  onClick={changeTheme}>主题切换</Button>
        <Button  onClick={resetMethod}>还原</Button>
        <Button  onClick={zoomOutMethod}>缩小</Button>
        <span>禁止缩放</span>
        <Switch  onChange={changeScale} />
        <span>禁止移动</span>
        <Switch  onChange={changeMove} />
        <input
          style={{ marginRight: '10px'}}
          type="range"
          value={state.scale}
          onChange={scaleChange}
          min="0.3"
          max="3"
          step="0.1"
          defaultValue="1"
        />
        <div style={{ marginRight: '10px'}}> 吸附横线: </div>
        <input style={{ marginRight: '10px'}} value={snapsObj.h.join(',')} onBlur={snapsChange} />
        <div style={{ marginRight: '10px'}}> 吸附纵线: </div>
        <input style={{ marginRight: '10px'}} value={snapsObj.v.join(',')} onBlur={snapsChangeV} />

        <a
          href="https://github.com/kakajun/vue3-sketch-ruler"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fas fa-external-link-alt"></i> git源码
        </a>
      </Top>

      <Wrapper style={rectStyle}>
        <SketchRule
          key={rendIndex}
          scale={state.scale}
          lockLine={lockLine}
          thick={state.thick}
          width={rectWidth}
          showRuler={showRuler}
          height={rectHeight}
          palette={cpuPalette}
          snapsObj={snapsObj}
          shadow={state.shadow}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          panzoomOption={panzoomOption}
          ref={sketchruleRef}
          isShowReferLine={state.isShowReferLine}
          onCornerClick={handleCornerClick}
          lines={state.lines}
        >
          <div data-type="page" style={canvasStyle}>
            <ImgStyle   src={bgImg} alt="" />
          </div>
          <Btns>
            <button  onClick={resetMethod}>还原</button>

            <button  onClick={zoomOutMethod}>缩小</button>
          </Btns>
        </SketchRule>
      </Wrapper>
    </Demo>
    </>
  );
};

export default DemoComponent;
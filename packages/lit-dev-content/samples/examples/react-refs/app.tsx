import {React} from './react.js';
import {createComponent} from '@lit-labs/react';
import {FlyingTriangles as FlyingTrianglesWC} from './flying-triangles.js';

/*
  The <flying-triangles> component is stateful and uncontrolled.

  A stateful component maintains state independent of React.
  Meaning component state must be reconciled with React state.
  This is usually accomplished through refs and callbacks.
  
  <flying-triangles> will dispatch a 'state-change' event when
  component state changes.
  
  The 'state-change' provides React an opportunity to update app
  UI based on the properties and attributes of
  a <flying-triangles> component.
*/

const {useCallback, useRef, useState} = React;

const FlyingTriangles = createComponent(React, 'flying-triangles', FlyingTrianglesWC, {
  onStateChange: 'state-change',
});

const initialState = {
  isPlaying: false,
  fps: 16,
};

export const App = () => {
  const ref = useRef(null);
  const [state, setState] = useState(initialState);

  // create input callbacks
  const onPlay = useCallback(() => ref.current?.play(), []);
  const onPause = useCallback(() => ref.current?.pause(), []);
  const onFps = useCallback((e) => {
    if (ref.current === null) return;

    ref.current.fps = e.target.value;
  }, []);

  // reconcile component state with app state
  const onStateChange = useCallback(() => {
    if (ref.current === null) return;

    const {isPlaying, fps} = ref.current;
    setState({isPlaying, fps});
  }, []);

  return (
    <>
      <FlyingTriangles ref={ref} onStateChange={onStateChange}></FlyingTriangles>
      <div>
        <button disabled={state.isPlaying} onClick={onPlay}>
          play
        </button>
        <button disabled={!state.isPlaying} onClick={onPause}>
          pause
        </button>
        <input
          type="range"
          min="4"
          max="30"
          value={state.fps}
          onChange={onFps}
        ></input>
      </div>
    </>
  );
};

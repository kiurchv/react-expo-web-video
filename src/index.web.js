import { createElement } from "react";

export default function Video({
  source: src,
  fullscreen,
  resizeMode,
  repeat: loop,
  paused: autoPlay,
  volume,
  rate,
  onLoadStart,
  onLoad,
  onProgress,
  onSeek,
  onEnd: onEnded,
  ...props
}) {
  src = src === Object(src) ? src.uri : src;

  if (onLoadStart) {
    onLoadStart = event => {
      const { currentSrc: uri } = event.target;

      return onLoadStart({ ...event, uri });
    };
  }

  const onLoadedMetadata = onLoad
    ? ({
        target: {
          duration,
          currentTime,
          videoWidth: width,
          videoHeight: height
        }
      }) =>
        onLoad({
          duration,
          currentTime,
          naturalSize: { width, height }
        })
    : undefined;

  if (onProgress) {
    onProgress = event => {
      const { currentTime, buffered: { length } } = event.target;

      return onProgress({ ...event, currentTime, playableDuration: length });
    };
  }

  let beforeSeekTime;

  const onSeeking = onSeek
    ? ({ target: { currentTime } }) => {
        beforeSeekTime = currentTime;
      }
    : undefined;

  const onSeeked = onSeek
    ? ({ target: { currentTime } }) =>
        onSeek({ currentTime: beforeSeekTime, seekTime: currentTime })
    : undefined;

  return createElement("video", {
    src,
    playsInline: !fullscreen,
    loop,
    autoPlay,
    onLoadStart,
    onLoadedMetadata,
    onProgress,
    onSeeking,
    onSeeked,
    onEnded,
    ...props
  });
}

import { createElement } from "react";

import { isObject, omitKeys } from "./utils";

const IGNORED_PROPS = [
  "resizeMode",
  "volume",
  "rate",
  "status",
  "progressUpdateIntervalMillis",
  "positionMillis",
  "shouldCorrectPitch",
  "callback",
  "onReadyForDisplay",
  "onIOSFullscreenUpdate"
];

export default function Video({
  videoRef: ref,
  source,
  src = isObject(source) ? source.uri : undefined,
  posterSource,
  usePoster,
  poster = usePoster && isObject(posterSource) ? posterSource.uri : undefined,
  useNativeControls: controls,
  fullscreen,
  playsInline = !fullscreen,
  paused,
  shouldPlay: autoPlay = !paused,
  repeat,
  isLooping,
  loop = repeat || isLooping,
  isMuted: muted,
  onLoadStart: givenOnLoadStart,
  onLoad,
  onLoadedMetadata: givenOnLoadedMetadata,
  onProgress: givenOnProgress,
  onSeek,
  onSeeking: givenOnSeeking,
  onSeeked: givenOnSeeked,
  onEnd: onEnded,
  ...props
}) {
  props = omitKeys(props, IGNORED_PROPS);

  const onLoadStart = givenOnLoadStart
    ? event => {
        const { currentSrc: uri } = event.target;

        return givenOnLoadStart({ ...event, uri });
      }
    : givenOnLoadStart;

  const onLoadedMetadata = onLoad
    ? event => {
        const { duration, currentTime, videoWidth, videoHeight } = event.target;

        onLoad({
          duration,
          currentTime,
          naturalSize: { width: videoWidth, height: videoHeight }
        });

        if (givenOnLoadedMetadata) return givenOnLoadedMetadata(event);
      }
    : givenOnLoadedMetadata;

  const onProgress = givenOnProgress
    ? event => {
        const { currentTime, buffered: { length } } = event.target;

        return givenOnProgress({
          ...event,
          currentTime,
          playableDuration: length
        });
      }
    : givenOnProgress;

  let beforeSeekTime;

  const onSeeking = onSeek
    ? event => {
        beforeSeekTime = event.target.currentTime;

        if (givenOnSeeking) return givenOnSeeking(event);
      }
    : givenOnSeeking;

  const onSeeked = onSeek
    ? event => {
        const { target: { currentTime: seekTime } } = event;

        onSeek({ currentTime: beforeSeekTime, seekTime });
        if (givenOnSeeked) return givenOnSeeked(event);
      }
    : givenOnSeeked;

  return createElement("video", {
    ref,
    src,
    poster,
    controls,
    playsInline,
    autoPlay,
    loop,
    muted,
    onLoadStart,
    onLoadedMetadata,
    onProgress,
    onSeeking,
    onSeeked,
    onEnded,
    ...props
  });
}

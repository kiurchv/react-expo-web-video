import { createElement } from "react";
import { Video as NativeVideo } from "expo";

import { omitKeys } from "./utils";

const IGNORED_PROPS = [
  "onAbort",
  "onCanplay",
  "onCanplayThrough",
  "onDurationChange",
  "onEmptied",
  "onEncrypted",
  "onEnded",
  "onInterruptBegin",
  "onInterruptEnd",
  "onLoadedData",
  "onPause",
  "onPlay",
  "onPlaying",
  "onRateChange",
  "onSeeking",
  "onStalled",
  "onSuspend",
  "onTimeUpdate",
  "onVolumeChange",
  "onWaiting"
];

export default function Video({
  ref: givenRef,
  src,
  source = { uri: src },
  poster,
  posterSource = poster ? { uri: poster } : undefined,
  usePoster = !!poster,
  controls: useNativeControls,
  autoPlay: shouldPlay,
  paused = !shouldPlay,
  loop: repeat,
  isLooping = repeat,
  muted,
  isMuted = muted,
  height,
  width,
  style = [{ width, height }, style],
  onLoadStart: givenOnLoadStart,
  onLoad: givenOnLoad,
  onLoadedMetadata,
  onProgress: givenOnProgress,
  onSeek: givenOnSeek,
  onSeeked,
  onEnded: onEnd,
  ...props
}) {
  props = omitKeys(props, IGNORED_PROPS);

  let target;

  const ref = video => {
    target = video;

    if (givenRef) return givenRef(video);
  };

  const onLoadStart = givenOnLoadStart
    ? args => givenOnLoadStart({ ...args, target })
    : givenOnLoadStart;

  const onLoad = onLoadedMetadata
    ? args => {
        onLoadedMetadata({ target });

        if (givenOnLoad) givenOnLoad(args);
      }
    : givenOnLoad;

  const onProgress = givenOnProgress
    ? args => givenOnProgress({ ...args, target })
    : givenOnProgress;

  const onSeek = onSeeked
    ? args => {
        onSeeked({ target });

        if (givenOnSeek) return givenOnSeek(args);
      }
    : givenOnSeek;

  return createElement(NativeVideo, {
    ref,
    source,
    poster,
    usePoster,
    useNativeControls,
    shouldPlay,
    paused,
    repeat,
    isLooping,
    muted,
    isMuted,
    style,
    onLoadStart,
    onLoad,
    onProgress,
    onSeek,
    onEnd,
    ...props
  });
}

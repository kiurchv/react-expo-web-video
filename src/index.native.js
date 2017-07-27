import { createElement } from "react";
import { Components } from "expo";

export default function Video({
  src: source,
  playsInline = true,
  resizeMode,
  loop: repeat,
  autoplay,
  volume,
  muted,
  rate,
  ref,
  height,
  width,
  style,
  onLoadStart,
  onLoad,
  onLoadedMetadata,
  onError,
  onProgress,
  onSeek,
  onSeeked,
  onEnd
}) {
  let target;

  ref = video => {
    target = video;
    return ref(video);
  };

  style = [{ width, height }, style];

  onLoadStart = onLoadStart
    ? args => onLoadStart({ ...args, target })
    : undefined;

  if (!onLoaded && onLoadedMetadata) {
    onLoaded = () => onLoadedMetadata({ target });
  }

  onProgress = onProgress
    ? args => onProgress({ ...args, target })
    : undefined;

  if (!onSeek && onSeeked) {
    onSeek = () => onSeeked({ target });
  }

  return createElement(Components.Video, {
    source,
    fullscreen: !playsInline,
    resizeMode,
    repeat,
    paused: !autoplay,
    volume,
    muted,
    rate,
    ref,
    style,
    onLoadStart,
    onLoad,
    onError,
    onProgress,
    onSeek,
    onEnd
  });
}

import { css as emotionCss, Interpolation, Theme } from '@emotion/react';
import { HTMLAttributes, useEffect, useMemo, useRef } from 'react';
import { useVegaEmbed } from 'react-vega';
import { View } from 'vega';
import { EmbedOptions, VisualizationSpec } from 'vega-embed/build/embed';

export type VegaNamedData = Record<string, object[]>;

type SignalListener = (name: string, value: unknown) => void;

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'ref' | 'onError'> & {
  spec: VisualizationSpec;
  data?: VegaNamedData;
  actions?: EmbedOptions['actions'];
  renderer?: EmbedOptions['renderer'];
  height?: number;
  width?: number;
  signalListeners?: Record<string, SignalListener>;
  onNewView?: (view: View) => void;
  onError?: (error: unknown) => void;
  css?: Interpolation<Theme>;
};

export const VegaLiteChart = ({
  spec,
  data,
  actions = false,
  renderer,
  height,
  width,
  signalListeners,
  onNewView,
  onError,
  style,
  css,
  ...divProps
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const options = useMemo<EmbedOptions>(
    () => ({
      mode: 'vega-lite',
      actions,
      ...(renderer ? { renderer } : {}),
    }),
    [actions, renderer],
  );
  const embed = useVegaEmbed({
    ref,
    spec,
    options,
    onError,
  });

  useEffect(() => {
    if (!embed) return;

    onNewView?.(embed.view);
  }, [embed, onNewView]);

  useEffect(() => {
    if (!embed || !data) return;

    Object.entries(data).forEach(([name, values]) => {
      embed.view.data(name, values);
    });
    void embed.view.runAsync();
  }, [embed, data]);

  useEffect(() => {
    if (!embed) return;

    let shouldRun = false;

    if (typeof width === 'number') {
      embed.view.width(width);
      shouldRun = true;
    }
    if (typeof height === 'number') {
      embed.view.height(height);
      shouldRun = true;
    }
    if (shouldRun) void embed.view.runAsync();
  }, [embed, height, width]);

  useEffect(() => {
    if (!embed || !signalListeners) return;

    const listeners = Object.entries(signalListeners);

    listeners.forEach(([signal, listener]) => {
      embed.view.addSignalListener(signal, listener);
    });

    return () => {
      listeners.forEach(([signal, listener]) => {
        embed.view.removeSignalListener(signal, listener);
      });
    };
  }, [embed, signalListeners]);

  const resolvedStyle = useMemo(
    () => ({
      ...(typeof width === 'number' ? { width: `${width}px` } : {}),
      ...(typeof height === 'number' ? { height: `${height}px` } : {}),
      ...style,
    }),
    [height, style, width],
  );

  const resolvedCss = useMemo(() => {
    if (typeof css === 'string') return emotionCss`${css}`;
    return css;
  }, [css]);

  return <div ref={ref} css={resolvedCss} style={resolvedStyle} {...divProps} />;
};

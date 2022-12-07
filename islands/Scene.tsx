import { useEffect, useRef } from "preact/hooks";
import * as Animation from "../components/animation.ts";

export default function Scene() {
  const canvas = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    if (canvas.current) {
      Animation.init(canvas.current);
    }
    return () => {
      Animation.cleanup();
    };
  }, []);

  return <canvas ref={canvas} />;
}

import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

export default function HeroCard() {
  const bind = useGesture({
    onMove: (state) => console.log(state),
    onHover: (state) => console.log(state),
  });

  return (
    <animated.div {...bind()} id="hero-card">
      <img src="https://picsum.photos/400/300" alt="random image" />
    </animated.div>
  );
}

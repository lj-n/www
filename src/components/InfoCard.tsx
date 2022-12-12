import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

export default function HeroCard({ children }: { children: ReactNode }) {
	const card = useRef<HTMLDivElement>(null);
	const [rect, setRect] = useState<DOMRect | null>(null);

	useEffect(() => {
		if (!card.current) return;
		setRect(card.current.getBoundingClientRect());
	}, [card.current]);

	const [spring, api] = useSpring(() => ({
		rotateX: 0,
		rotateY: 0,
		config: { mass: 4, tension: 400, friction: 40 },
	}));

	const bind = useGesture({
		onHover: ({ hovering }) => {
			if (!hovering) {
				api.start({ rotateY: 0, rotateX: 0 });
			}
		},
		onMove: ({ xy: [x, y] }) => {
			if (!rect) return;

			api.start({
				rotateY: ((x - rect.left) / rect.width - 0.5) * 14,
				rotateX: -((y - rect.top) / rect.height - 0.5) * 14,
			});
		},
	});

	return (
		<animated.div
			{...bind()}
			style={{ transform: "perspective(1000px)", transformStyle: "preserve-3d", ...spring }}
			id="info-card"
			ref={card}
		>
			{children}
		</animated.div>
	);
}

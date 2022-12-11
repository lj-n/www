import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MarchingCubes, MarchingCube, Bounds } from "@react-three/drei";
import { Physics, RigidBody, BallCollider, RigidBodyApi } from "@react-three/rapier";
import { useGesture } from "@use-gesture/react";
import { Shader } from "../shader";
import { ResizeObserver } from "@juggle/resize-observer";

type Point = { x: number; y: number };
type Point3Array = [number, number, number];

const vec = new THREE.Vector3();
const ballPositions: Point3Array[] = [
	[-0.5, 0, -1],
	[0.7, 0.3, -0.5],
	[0.4, -0.4, 0.7],
	[-0.4, -0.4, 0.7],
	[0.6, 0.2, 0.5],
	[0.3, -0.2, 0.5],
];

function changeCursor(type: "auto" | "grab" | "grabbing") {
	document.body.style.cursor = type;
}

function Ball({ position }: { position: Point3Array }) {
	const api = useRef<RigidBodyApi>(null);
	const [pointer, setPointer] = useState<Point | null>(null);

	useFrame(({ size }, delta) => {
		if (!api.current) return;

		if (pointer) {
			vec.copy(api.current.translation());
			const speed = 900 * delta;

			api.current.setLinvel(
				new THREE.Vector3(
					(pointer.x / size.width - vec.x) * speed,
					(-pointer.y / size.height - vec.y) * speed,
					vec.z * -0.5
				)
			);
			return;
		}

		api.current.applyImpulse(
			vec
				.copy(api.current.translation())
				.normalize()
				.multiplyScalar(delta * -0.05)
		);
	});

	const bind = useGesture(
		{
			onDrag: ({ event, dragging = false, offset: [x, y] }) => {
				event.stopPropagation();

				if (!dragging) {
					setPointer(null);
					return;
				}

				setPointer({ x, y });
				changeCursor("grabbing");
			},
			onHover: ({ event, hovering }) => {
				event.stopPropagation();
				changeCursor(hovering ? "grab" : "auto");
			},
		},
		{
			drag: {
				bounds: { left: -130, right: 130, top: -130, bottom: 130 },
				rubberband: true,
			},
		}
	);

	return (
		<RigidBody
			ref={api}
			colliders={false}
			linearDamping={4}
			angularDamping={0.95}
			type="dynamic"
			mass={0.02}
			position={position}
		>
			<MarchingCube strength={0.35} subtract={6} />
			<mesh {...(bind() as any)} visible={false}>
				<boxGeometry args={[0.2, 0.2, 0.2]} />
			</mesh>
			<BallCollider args={[0.1]} />
		</RigidBody>
	);
}

export default function Blob() {
	return (
		<Canvas
			camera={{ position: [0, 0, 5], fov: 30 }}
			gl={{ alpha: true }}
			resize={{ polyfill: ResizeObserver }}
		>
			<Physics gravity={[0, -0.5, 0]}>
				<MarchingCubes
					resolution={64}
					maxPolyCount={20000}
					enableUvs={false}
					enableColors={true}
				>
					<shaderMaterial attach="material" {...Shader} />
					{ballPositions.map((pos, i) => (
						<Ball position={pos} key={i} />
					))}
				</MarchingCubes>
			</Physics>
			<Bounds fit clip observe margin={1}>
				<mesh visible={false}>
					<boxGeometry args={[2]} />
				</mesh>
			</Bounds>
		</Canvas>
	);
}

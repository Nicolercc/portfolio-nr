import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	CanvasTexture,
	Color,
	Group,
	Line,
	LineBasicMaterial,
	LineLoop,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	PlaneGeometry,
	Points,
	Raycaster,
	Scene,
	ShaderMaterial,
	SphereGeometry,
	Sprite,
	SpriteMaterial,
	Vector2,
	Vector3,
	WebGLRenderer,
} from "three";

/**
 * The homepage star map: a spiral galaxy, a drifting nebula and one star system
 * per project. Plain three.js, loaded lazily so it never blocks the first paint.
 * The HTML labels are the real, focusable controls; this class only draws and
 * moves them to where each system sits on screen.
 */

export type SystemSpec = {
	slug: string;
	color: string;
	/** Number of orbiting moons, one per published metric. */
	moons: number;
};

type SystemNode = {
	slug: string;
	group: Group;
	core: Mesh;
	hit: Mesh;
	halo: Sprite;
	moons: { mesh: Mesh; radius: number; speed: number; phase: number; tilt: number }[];
	rings: LineLoop[];
	home: Vector3;
	wideHome: Vector3;
	narrowHome: Vector3;
	baseScale: number;
};

type Options = {
	container: HTMLElement;
	systems: SystemSpec[];
	labels: Map<string, HTMLElement>;
	reducedMotion: boolean;
	onHover?: (slug: string | null) => void;
	onSelect?: (slug: string) => void;
};

const STAR_VERT = /* glsl */ `
	attribute float aSize;
	attribute float aPhase;
	attribute vec3 aColor;
	uniform float uTime;
	uniform float uPixelRatio;
	uniform float uTwinkle;
	uniform float uOpacity;
	varying vec3 vColor;
	varying float vAlpha;
	void main() {
		vec4 mv = modelViewMatrix * vec4(position, 1.0);
		float tw = 0.65 + 0.35 * sin(uTime * (0.6 + fract(aPhase * 7.13) * 1.8) + aPhase * 6.2831);
		vAlpha = mix(1.0, tw, uTwinkle) * uOpacity;
		vColor = aColor;
		gl_PointSize = aSize * uPixelRatio * (220.0 / -mv.z);
		gl_Position = projectionMatrix * mv;
	}
`;

const STAR_FRAG = /* glsl */ `
	varying vec3 vColor;
	varying float vAlpha;
	void main() {
		vec2 uv = gl_PointCoord - 0.5;
		float d = length(uv);
		float core = smoothstep(0.5, 0.0, d);
		float a = pow(core, 2.2) * vAlpha;
		if (a < 0.01) discard;
		gl_FragColor = vec4(vColor, a);
	}
`;

const NEBULA_FRAG = /* glsl */ `
	uniform float uTime;
	uniform vec3 uRose;
	uniform vec3 uLilac;
	uniform vec3 uTeal;
	varying vec2 vUv;
	float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
	float noise(vec2 p) {
		vec2 i = floor(p); vec2 f = fract(p);
		vec2 u = f * f * (3.0 - 2.0 * f);
		return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
	}
	float fbm(vec2 p) {
		float v = 0.0; float a = 0.5;
		for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
		return v;
	}
	void main() {
		vec2 p = vUv * 3.0;
		float t = uTime * 0.015;
		vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
		float n = fbm(p + 2.0 * q);
		vec3 col = mix(uLilac, uRose, smoothstep(0.25, 0.75, n));
		col = mix(col, uTeal, smoothstep(0.55, 0.95, q.x) * 0.45);
		float edge = smoothstep(0.0, 0.35, vUv.x) * smoothstep(1.0, 0.6, vUv.x) * smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.65, vUv.y);
		float a = smoothstep(0.35, 0.85, n) * 0.22 * edge;
		gl_FragColor = vec4(col, a);
	}
`;

const NEBULA_VERT = /* glsl */ `
	varying vec2 vUv;
	void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

/** Seeded random so the galaxy is the same on every visit. */
function mulberry32(seed: number) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function glowTexture() {
	const size = 128;
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = size;
	const ctx = canvas.getContext("2d");
	if (ctx) {
		const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
		g.addColorStop(0, "rgba(255,255,255,1)");
		g.addColorStop(0.18, "rgba(255,255,255,0.55)");
		g.addColorStop(0.45, "rgba(255,255,255,0.12)");
		g.addColorStop(1, "rgba(255,255,255,0)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, size, size);
	}
	return new CanvasTexture(canvas);
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function webglAvailable() {
	try {
		const c = document.createElement("canvas");
		return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
	} catch {
		return false;
	}
}

export class StarMap {
	private renderer: WebGLRenderer;
	private scene = new Scene();
	private camera = new PerspectiveCamera(55, 1, 0.1, 2000);
	private galaxy: Points;
	private field: Points;
	private nebula: Mesh;
	private links: Line;
	private layoutWide: boolean | null = null;
	private nodes: SystemNode[] = [];
	private systemsRoot = new Group();
	private raycaster = new Raycaster();
	private pointer = new Vector2(9, 9);
	private parallax = new Vector2();
	private parallaxTarget = new Vector2();
	private hovered: string | null = null;
	private focused: string | null = null;
	private camFrom = new Vector3();
	private camTo = new Vector3();
	private lookFrom = new Vector3();
	private lookTo = new Vector3();
	private look = new Vector3();
	private flightStart = 0;
	private flightDuration = 1400;
	private scroll = 0;
	private wide = true;
	private frame = 0;
	private running = false;
	private visible = true;
	private start = performance.now();
	private observer: IntersectionObserver;
	private resizeObserver: ResizeObserver;
	private tmp = new Vector3();
	private glow = glowTexture();
	private opts: Options;

	constructor(opts: Options) {
		this.opts = opts;
		const { container } = opts;
		this.renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
		this.renderer.setClearColor(0x000000, 0);
		const canvas = this.renderer.domElement;
		canvas.setAttribute("aria-hidden", "true");
		canvas.className = "starmap__canvas";
		container.prepend(canvas);

		const small = Math.min(window.innerWidth, window.innerHeight) < 700;
		this.field = this.buildField(small ? 1800 : 4200);
		this.galaxy = this.buildGalaxy(small ? 7000 : 16000);
		this.nebula = this.buildNebula();
		this.scene.add(this.nebula, this.field, this.galaxy, this.systemsRoot);
		this.links = this.buildSystems(opts.systems);
		this.systemsRoot.add(this.links);

		this.camera.position.set(0, 18, 92);
		this.look.set(0, 0, 0);
		this.camTo.copy(this.camera.position);
		this.lookTo.copy(this.look);

		canvas.addEventListener("pointermove", this.onPointerMove);
		canvas.addEventListener("pointerleave", this.onPointerLeave);
		canvas.addEventListener("click", this.onClick);
		window.addEventListener("pointermove", this.onWindowPointer, { passive: true });
		document.addEventListener("visibilitychange", this.onVisibility);

		this.resizeObserver = new ResizeObserver(() => this.resize());
		this.resizeObserver.observe(container);
		this.observer = new IntersectionObserver(([entry]) => {
			this.visible = entry.isIntersecting;
			this.loop();
		});
		this.observer.observe(container);
		this.resize();
		this.loop();
	}

	// ── Building ────────────────────────────────────────────────────────────

	private starMaterial(twinkle: number, opacity = 1) {
		return new ShaderMaterial({
			vertexShader: STAR_VERT,
			fragmentShader: STAR_FRAG,
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending,
			uniforms: {
				uTime: { value: 0 },
				uPixelRatio: { value: this.renderer.getPixelRatio() },
				uTwinkle: { value: this.opts.reducedMotion ? 0 : twinkle },
				uOpacity: { value: opacity },
			},
		});
	}

	private buildField(count: number) {
		const rand = mulberry32(7);
		const pos = new Float32Array(count * 3);
		const col = new Float32Array(count * 3);
		const size = new Float32Array(count);
		const phase = new Float32Array(count);
		const palette = [new Color("#fffaf6"), new Color("#ffd9e3"), new Color("#c9b6ff"), new Color("#b8dcff")];
		for (let i = 0; i < count; i++) {
			const r = 260 + rand() * 520;
			const th = rand() * Math.PI * 2;
			const ph = Math.acos(2 * rand() - 1);
			pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
			pos[i * 3 + 1] = r * Math.cos(ph) * 0.7;
			pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
			const c = palette[rand() < 0.75 ? 0 : 1 + Math.floor(rand() * 3)];
			col.set([c.r, c.g, c.b], i * 3);
			size[i] = 2 + Math.pow(rand(), 6) * 14;
			phase[i] = rand();
		}
		const geo = new BufferGeometry();
		geo.setAttribute("position", new BufferAttribute(pos, 3));
		geo.setAttribute("aColor", new BufferAttribute(col, 3));
		geo.setAttribute("aSize", new BufferAttribute(size, 1));
		geo.setAttribute("aPhase", new BufferAttribute(phase, 1));
		return new Points(geo, this.starMaterial(1));
	}

	private buildGalaxy(count: number) {
		const rand = mulberry32(42);
		const arms = 3;
		const radius = 70;
		const pos = new Float32Array(count * 3);
		const col = new Float32Array(count * 3);
		const size = new Float32Array(count);
		const phase = new Float32Array(count);
		const inner = new Color("#f2b8c8");
		const mid = new Color("#d4849a");
		const outer = new Color("#7b6cff");
		const tmp = new Color();
		for (let i = 0; i < count; i++) {
			const r = Math.pow(rand(), 1.6) * radius;
			const arm = ((i % arms) / arms) * Math.PI * 2;
			const spin = r * 0.085;
			const spread = Math.pow(rand(), 2.4) * (rand() < 0.5 ? 1 : -1) * (4 + r * 0.18);
			const spreadY = Math.pow(rand(), 3) * (rand() < 0.5 ? 1 : -1) * (2.4 + (radius - r) * 0.05);
			const spreadZ = Math.pow(rand(), 2.4) * (rand() < 0.5 ? 1 : -1) * (4 + r * 0.18);
			pos[i * 3] = Math.cos(arm + spin) * r + spread;
			pos[i * 3 + 1] = spreadY;
			pos[i * 3 + 2] = Math.sin(arm + spin) * r + spreadZ;
			const t = r / radius;
			tmp.copy(inner).lerp(mid, Math.min(t * 2.2, 1));
			if (t > 0.45) tmp.lerp(outer, (t - 0.45) / 0.55);
			col.set([tmp.r, tmp.g, tmp.b], i * 3);
			size[i] = (0.9 + rand() * 2.2) * (0.75 + t * 0.6);
			phase[i] = rand();
		}
		const geo = new BufferGeometry();
		geo.setAttribute("position", new BufferAttribute(pos, 3));
		geo.setAttribute("aColor", new BufferAttribute(col, 3));
		geo.setAttribute("aSize", new BufferAttribute(size, 1));
		geo.setAttribute("aPhase", new BufferAttribute(phase, 1));
		const pts = new Points(geo, this.starMaterial(0.35, 0.8));
		pts.rotation.x = 0.32;
		pts.rotation.z = -0.12;
		return pts;
	}

	private buildNebula() {
		const mat = new ShaderMaterial({
			vertexShader: NEBULA_VERT,
			fragmentShader: NEBULA_FRAG,
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending,
			uniforms: {
				uTime: { value: 0 },
				uRose: { value: new Color("#d4849a") },
				uLilac: { value: new Color("#5b3f9e") },
				uTeal: { value: new Color("#2fae7a") },
			},
		});
		const mesh = new Mesh(new PlaneGeometry(900, 520), mat);
		mesh.position.set(0, 10, -320);
		return mesh;
	}

	private buildSystems(specs: SystemSpec[]) {
		const rand = mulberry32(11);
		const n = specs.length;
		const linkPts: Vector3[] = [];
		specs.forEach((spec, i) => {
			// Spread the systems along an arc that sits in front of the galaxy disc.
			const a = -0.95 + (i / Math.max(n - 1, 1)) * 1.9;
			const home = new Vector3(Math.sin(a) * 36, (i % 2 === 0 ? 1 : -1) * (5 + rand() * 7), 18 - Math.cos(a) * 22);
			const group = new Group();
			group.position.copy(home);
			const color = new Color(spec.color);
			const baseScale = i === 0 ? 1.35 : 1;

			const core = new Mesh(new SphereGeometry(1.25, 24, 16), new MeshBasicMaterial({ color: color.clone().lerp(new Color("#ffffff"), 0.55) }));
			core.scale.setScalar(baseScale);
			const hit = new Mesh(new SphereGeometry(6, 8, 6), new MeshBasicMaterial({ visible: false }));
			hit.userData.slug = spec.slug;
			const halo = new Sprite(new SpriteMaterial({ map: this.glow, color, transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.9 }));
			halo.scale.setScalar(11 * baseScale);

			const rings: LineLoop[] = [];
			const moons: SystemNode["moons"] = [];
			const moonCount = Math.max(1, Math.min(spec.moons, 4));
			for (let m = 0; m < moonCount; m++) {
				const radius = 3.6 + m * 2.1;
				const tilt = (rand() - 0.5) * 0.9;
				const ringPts: number[] = [];
				for (let s = 0; s < 96; s++) {
					const t = (s / 96) * Math.PI * 2;
					ringPts.push(Math.cos(t) * radius, 0, Math.sin(t) * radius);
				}
				const ringGeo = new BufferGeometry();
				ringGeo.setAttribute("position", new BufferAttribute(new Float32Array(ringPts), 3));
				const ring = new LineLoop(ringGeo, new LineBasicMaterial({ color, transparent: true, opacity: 0.28, blending: AdditiveBlending, depthWrite: false }));
				ring.rotation.x = 1.2 + tilt;
				ring.rotation.z = tilt * 0.6;
				rings.push(ring);
				const moon = new Mesh(new SphereGeometry(0.32, 12, 8), new MeshBasicMaterial({ color: "#fff6f8" }));
				moons.push({ mesh: moon, radius, speed: 0.35 + rand() * 0.5, phase: rand() * Math.PI * 2, tilt });
				ring.add(moon);
				group.add(ring);
			}

			group.add(halo, core, hit);
			this.systemsRoot.add(group);
			// Phones: a vertical zigzag so labels never collide.
			const narrowHome = new Vector3(i % 2 === 0 ? -9 : 9, 24 - i * (48 / Math.max(n - 1, 1)), 8);
			this.nodes.push({ slug: spec.slug, group, core, hit, halo, moons, rings, home: home.clone(), wideHome: home, narrowHome, baseScale });
			linkPts.push(home.clone());
		});

		const geo = new BufferGeometry().setFromPoints(linkPts);
		return new Line(geo, new LineBasicMaterial({ color: "#d4849a", transparent: true, opacity: 0.22, blending: AdditiveBlending, depthWrite: false }));
	}

	// ── Camera ──────────────────────────────────────────────────────────────

	private restingCamera(out: Vector3) {
		// Scroll pulls the camera up and back, so the galaxy tilts away as you leave.
		const s = this.scroll;
		return this.wide ? out.set(-16, 18 + s * 30, 92 + s * 40) : out.set(0, 6 + s * 20, 66 + s * 30);
	}

	private restingLook(out: Vector3) {
		return out.set(this.wide ? -16 : 0, 0, 0);
	}

	private fly(toCam: Vector3, toLook: Vector3) {
		this.camFrom.copy(this.camera.position);
		this.lookFrom.copy(this.look);
		this.camTo.copy(toCam);
		this.lookTo.copy(toLook);
		this.flightStart = performance.now();
		this.flightDuration = this.opts.reducedMotion ? 0 : 1400;
		this.loop();
	}

	/** Fly to a system, or back to the overview with null. */
	focus(slug: string | null) {
		this.focused = slug;
		const node = slug ? this.nodes.find((n) => n.slug === slug) : undefined;
		if (!node) {
			this.fly(this.restingCamera(new Vector3()), this.restingLook(new Vector3()));
			return;
		}
		const world = node.group.getWorldPosition(new Vector3());
		// Sit off to one side so the system frames beside the info panel.
		// Frame the system just right of centre, between the intro and the panel.
		const offset = new Vector3(this.wide ? -3 : 0, 5, 34);
		this.fly(world.clone().add(offset), world.clone().add(new Vector3(this.wide ? -5 : 0, this.wide ? 0 : -10, 0)));
	}

	setScroll(progress: number) {
		const p = Math.min(Math.max(progress, 0), 1);
		if (Math.abs(p - this.scroll) < 0.001) return;
		this.scroll = p;
		if (!this.focused && performance.now() - this.flightStart > this.flightDuration) {
			this.restingCamera(this.camTo);
			this.camera.position.copy(this.camTo);
		}
		this.loop();
	}

	setHighlight(slug: string | null) {
		this.hovered = slug;
		this.loop();
	}

	// ── Events ──────────────────────────────────────────────────────────────

	private onWindowPointer = (e: PointerEvent) => {
		if (this.opts.reducedMotion) return;
		this.parallaxTarget.set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
		this.loop();
	};

	private onPointerMove = (e: PointerEvent) => {
		const rect = this.renderer.domElement.getBoundingClientRect();
		this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
		const hit = this.pick();
		if (hit !== this.hovered) {
			this.hovered = hit;
			this.renderer.domElement.style.cursor = hit ? "pointer" : "";
			this.opts.onHover?.(hit);
		}
		this.loop();
	};

	private onPointerLeave = () => {
		this.pointer.set(9, 9);
		if (this.hovered) {
			this.hovered = null;
			this.opts.onHover?.(null);
		}
		this.renderer.domElement.style.cursor = "";
	};

	private onClick = () => {
		const hit = this.pick();
		if (hit) this.opts.onSelect?.(hit);
	};

	private onVisibility = () => this.loop();

	private pick(): string | null {
		this.raycaster.setFromCamera(this.pointer, this.camera);
		const hits = this.raycaster.intersectObjects(this.nodes.map((n) => n.hit), false);
		return (hits[0]?.object.userData.slug as string | undefined) ?? null;
	}

	private applyLayout() {
		if (this.layoutWide === this.wide) return;
		this.layoutWide = this.wide;
		for (const node of this.nodes) {
			node.home.copy(this.wide ? node.wideHome : node.narrowHome);
			node.group.position.copy(node.home);
		}
		this.links.geometry.setFromPoints(this.nodes.map((n) => n.home));
		this.links.geometry.computeBoundingSphere();
	}

	// ── Frame ───────────────────────────────────────────────────────────────

	private resize() {
		const { container } = this.opts;
		const w = container.clientWidth;
		const h = container.clientHeight;
		if (w === 0 || h === 0) return;
		this.wide = w / h > 1.15 && w >= 1024;
		this.renderer.setSize(w, h, false);
		this.camera.aspect = w / h;
		this.camera.fov = this.wide ? 55 : 64;
		// On wide screens the scene sits right of the intro column.
		const shift = this.wide ? 14 : 0;
		this.systemsRoot.position.x = shift;
		this.galaxy.position.x = shift + 8;
		this.applyLayout();
		this.camera.updateProjectionMatrix();
		if (!this.focused) {
			this.restingCamera(this.camTo);
			this.restingLook(this.lookTo);
			this.camera.position.copy(this.camTo);
			this.look.copy(this.lookTo);
		}
		this.loop(true);
	}

	private loop(force = false) {
		if (this.opts.reducedMotion || force) {
			// Static scenes draw on demand; flights still finish (instantly).
			cancelAnimationFrame(this.frame);
			this.frame = requestAnimationFrame(() => this.tick());
			if (!this.opts.reducedMotion) this.running = true;
			return;
		}
		if (this.running || !this.visible || document.hidden) return;
		this.running = true;
		this.frame = requestAnimationFrame(() => this.tick());
	}

	private tick() {
		const now = performance.now();
		const t = (now - this.start) / 1000;
		const motion = !this.opts.reducedMotion;

		for (const m of [this.field.material, this.galaxy.material, this.nebula.material] as ShaderMaterial[]) {
			m.uniforms.uTime.value = t;
		}
		if (motion) {
			this.galaxy.rotation.y = t * 0.018;
			this.field.rotation.y = t * 0.004;
			this.parallax.lerp(this.parallaxTarget, 0.04);
		}

		// Camera flight
		const k = this.flightDuration === 0 ? 1 : Math.min((now - this.flightStart) / this.flightDuration, 1);
		const e = easeInOutCubic(k);
		this.camera.position.lerpVectors(this.camFrom, this.camTo, e);
		this.look.lerpVectors(this.lookFrom, this.lookTo, e);
		if (k >= 1) {
			this.camera.position.copy(this.camTo);
			this.look.copy(this.lookTo);
		}
		const drift = this.focused ? 2 : 6;
		this.camera.position.x += this.parallax.x * drift;
		this.camera.position.y -= this.parallax.y * drift * 0.6;
		this.camera.lookAt(this.look);

		// Systems
		for (const node of this.nodes) {
			const lit = node.slug === this.hovered || node.slug === this.focused;
			const target = node.baseScale * (lit ? 1.45 : 1);
			const s = node.core.scale.x + (target - node.core.scale.x) * (motion ? 0.12 : 1);
			node.core.scale.setScalar(s);
			const pulse = motion ? 1 + Math.sin(t * 1.6 + node.home.x) * 0.06 : 1;
			node.halo.scale.setScalar(11 * s * pulse * (lit ? 1.25 : 1));
			for (const r of node.rings) (r.material as LineBasicMaterial).opacity = lit ? 0.6 : 0.28;
			for (const moon of node.moons) {
				const a = moon.phase + (motion ? t * moon.speed : 0);
				moon.mesh.position.set(Math.cos(a) * moon.radius, 0, Math.sin(a) * moon.radius);
			}
			if (motion) node.group.position.y = node.home.y + Math.sin(t * 0.5 + node.home.x * 0.1) * 0.8;
		}

		this.renderer.render(this.scene, this.camera);
		this.placeLabels();

		const flying = k < 1;
		const keepGoing = motion && this.visible && !document.hidden;
		if (keepGoing || (flying && !this.opts.reducedMotion)) {
			this.frame = requestAnimationFrame(() => this.tick());
		} else {
			this.running = false;
		}
	}

	private placeLabels() {
		const canvas = this.renderer.domElement;
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		for (const node of this.nodes) {
			const el = this.opts.labels.get(node.slug);
			if (!el) continue;
			node.group.getWorldPosition(this.tmp);
			this.tmp.project(this.camera);
			const behind = this.tmp.z > 1;
			const x = (this.tmp.x * 0.5 + 0.5) * w;
			const y = (-this.tmp.y * 0.5 + 0.5) * h;
			el.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + 18).toFixed(1)}px, 0) translateX(-50%)`;
			el.dataset.offscreen = behind || x < -40 || x > w + 40 || y < -40 || y > h + 40 ? "true" : "false";
		}
	}

	dispose() {
		cancelAnimationFrame(this.frame);
		this.running = false;
		this.observer.disconnect();
		this.resizeObserver.disconnect();
		const canvas = this.renderer.domElement;
		canvas.removeEventListener("pointermove", this.onPointerMove);
		canvas.removeEventListener("pointerleave", this.onPointerLeave);
		canvas.removeEventListener("click", this.onClick);
		window.removeEventListener("pointermove", this.onWindowPointer);
		document.removeEventListener("visibilitychange", this.onVisibility);
		this.scene.traverse((obj) => {
			const o = obj as Mesh;
			o.geometry?.dispose();
			const mat = o.material as { dispose?: () => void } | undefined;
			mat?.dispose?.();
		});
		this.glow.dispose();
		this.renderer.dispose();
		canvas.remove();
	}
}

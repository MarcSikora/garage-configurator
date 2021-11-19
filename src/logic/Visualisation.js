import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import metal from '../imgs/visualization/metal.png'
import brightWood from '../imgs/visualization/brightWood.png'
import darkWood from '../imgs/visualization/darkWood.png'

class Visualisation
{
	constructor()
	{
		this.settings = null;
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.scene = null;
		this.camera = null;
		this.controls = null;
		this.garage = null;

		this.display = null;
		this.texture = null;
	}

	init(display, params)
	{
		this.display = display;
		this.settings = params;

		window.addEventListener('resize', () =>
		{
			this.resize();
		}, false);

		this.prepare();
		this.generateGarage();
		this.animate();
	}

	resize()
	{
		let containerStyle = getComputedStyle(this.display);
		this.camera.aspect = parseInt(containerStyle.width) / parseInt(containerStyle.height);
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(parseInt(containerStyle.width), parseInt(containerStyle.height));
	}

	animate()
	{
		this.controls.update();
		window.requestAnimationFrame(() => this.animate());
		this.renderer.render(this.scene, this.camera);
	}

	prepare()
	{
		this.scene = new THREE.Scene();
		this.renderer.setClearColor(0xffffff, 1);

		let containerStyle = getComputedStyle(this.display);
		this.camera = new THREE.PerspectiveCamera(75, parseInt(containerStyle.width) / parseInt(containerStyle.height), 1, 10000);
		this.camera.position.set(150, 200, 300);

		this.renderer.setSize(parseInt(containerStyle.width), parseInt(containerStyle.height));
		this.display.appendChild(this.renderer.domElement);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.target.set(0, 75, 0)

		this.resize();

		this.prepareTextures();
	}

	prepareTextures()
	{
		this.textures = {
			metal: new THREE.TextureLoader().load(metal),
			brightWood: new THREE.TextureLoader().load(brightWood),
			darkWood: new THREE.TextureLoader().load(darkWood)
		};
	}

	createWalls()
	{
		let texture = this.getTexture(this.settings.garage.materialType, this.settings.garage.material);

		let material = new THREE.MeshBasicMaterial({ color: this.getMaterialColor(this.settings.garage.materialType, this.settings.garage.material), map: texture, side: THREE.DoubleSide });

		let geometry = this.getGarageGeometry();

		let walls = new THREE.Mesh(geometry, material);
		walls.name = "walls";
		return walls;
	}

	createRoof()
	{
		let a = Math.abs(this.settings.garage.height_min * 100 - this.settings.garage.height_max * 100)
		let b;

		let roof = new THREE.Object3D();

		let geometry;
		let roofMargin = 15;

		let texture = this.getTexture(this.settings.roof.materialType, this.settings.roof.material);
		texture.repeat.set(this.settings.garage.length, 1);	

		switch (this.settings.roof.type)
		{
			case 0:
				b = this.settings.garage.width * 100;
				roof.rotateZ(a / b);
				texture.rotation = Math.PI / 2;
				geometry = new THREE.BoxGeometry(this.hypotenuseLength(a, b) + roofMargin, 2, this.settings.garage.length * 100 + roofMargin);
				break;

			case 1:
				b = this.settings.garage.width * 100;
				roof.rotateZ(-a / b);
				texture.rotation = Math.PI / 2;
				geometry = new THREE.BoxGeometry(this.hypotenuseLength(a, b) + roofMargin, 2, this.settings.garage.length * 100 + roofMargin);
				break;

			case 2:
				geometry = this.getGableGeometry();
				roof.position.set(0, this.settings.garage.height_min * 100, 0);
				break;

			case 3:
				b = this.settings.garage.length * 100;
				roof.rotateX(a / b);
				geometry = new THREE.BoxGeometry(this.settings.garage.width * 100 + roofMargin, 2, this.hypotenuseLength(a, b) + roofMargin);
				break;

			case 4:
				b = this.settings.garage.length * 100;
				roof.rotateX(-a / b);
				geometry = new THREE.BoxGeometry(this.settings.garage.width * 100 + roofMargin, 2, this.hypotenuseLength(a, b) + roofMargin);
				break;
			default:
				break;
		}

		let material = new THREE.MeshBasicMaterial({
			color: this.getMaterialColor(this.settings.roof.materialType, this.settings.roof.material), map: texture, side: THREE.DoubleSide
		});


		if (this.settings.roof.type !== 2)
		{
			roof.position.set(0, (this.settings.garage.height_max * 100 + this.settings.garage.height_min * 100) / 2, 0);
		}
		else
		{
			for (let i = 0; i < geometry.faces.length; i++)
			{
				let scale = this.settings.garage.length * 1.5;

				if (i % 2 !== 0)
					geometry.faceVertexUvs[0][i] = [
						new THREE.Vector2(0, 0),
						new THREE.Vector2(0, scale),
						new THREE.Vector2(scale, scale),

					];
				else
					geometry.faceVertexUvs[0][i] = [
						new THREE.Vector2(0, 0),
						new THREE.Vector2(scale, 0),
						new THREE.Vector2(scale, scale),

					];
			}
		}

		geometry.computeBoundingSphere();

		let metal = new THREE.Mesh(geometry, material);
		metal.name = "roofMetal";
		roof.add(metal);

		return roof;
	}

	createGate()
	{
		let thickness = 2;
		let geometry = new THREE.BoxGeometry(this.settings.gate.width * 100 - thickness * 2, this.settings.gate.height * 100 - thickness * 2, 5);

		let scale = this.settings.gate.width;

		for(let i = 0; i < geometry.faces.length; i++)
		{
			if(i % 2 === 0)
				geometry.faceVertexUvs[0][i] =[
					new THREE.Vector2(0, 0),
					new THREE.Vector2(scale, 0),
					new THREE.Vector2(0, scale),
				];
			else
				geometry.faceVertexUvs[0][i] =[
					new THREE.Vector2(scale, 0),
					new THREE.Vector2(scale, scale),
					new THREE.Vector2(0, scale),

				];
		};
		

		let texture = this.getTexture(this.settings.gate.materialType, this.settings.gate.material);
		

		let material = new THREE.MeshBasicMaterial({
			color: this.getMaterialColor(this.settings.gate.materialType, this.settings.gate.material),
			map: texture, side: THREE.DoubleSide
		});

		let sides = new THREE.BoxGeometry(thickness, this.settings.gate.height * 100 - thickness, thickness);
		let tops = new THREE.BoxGeometry(this.settings.gate.width * 100 - thickness, thickness, thickness);
		let borderMaterial = new THREE.MeshBasicMaterial({
			color: 0x111111,
			side: THREE.DoubleSide
		});

		let border = new THREE.Object3D();
		let left = new THREE.Mesh(sides, borderMaterial);
		let right = new THREE.Mesh(sides, borderMaterial);
		let top = new THREE.Mesh(tops, borderMaterial);
		let bottom = new THREE.Mesh(tops, borderMaterial);
		left.position.set(-this.settings.gate.width * 100 / 2 + thickness, 0, thickness / 2);
		right.position.set(this.settings.gate.width * 100 / 2 - thickness, 0, thickness / 2);
		top.position.set(0, this.settings.gate.height * 100 / 2 - thickness, thickness / 2);
		bottom.position.set(0, -this.settings.gate.height * 100 / 2 + thickness, thickness / 2);
		border.add(left);
		border.add(right);
		border.add(top);
		border.add(bottom);

		let handleGeo = new THREE.BoxGeometry(15, thickness, thickness);
		let handle = new THREE.Mesh(handleGeo, borderMaterial);

		if (this.settings.gate.type === 0)
		{
			handle.rotateZ(Math.PI / 2);
			handle.position.set(thickness + 5, 0, thickness);
			let center = new THREE.Mesh(sides, borderMaterial);
			center.position.set(0, 0, 2);
			border.add(center);
		}
		else
			handle.position.set(0, -this.settings.gate.height * 100 / 2 + 15, thickness);

		geometry.computeBoundingSphere();

		let gate = new THREE.Object3D();
		gate.name = "gate";

		let metal = new THREE.Mesh(geometry, material);
		metal.name = "gateMetal";
		gate.add(border);
		gate.add(metal);
		gate.add(handle);

		let offsets = [
			-this.settings.garage.width * 100 / 2 + this.settings.gate.width * 100 / 2,
			0,
			this.settings.garage.width * 100 / 2 - this.settings.gate.width * 100 / 2
		]

		gate.position.set(offsets[this.settings.gate.position], this.settings.gate.height * 100 / 2, this.settings.garage.length * 100 / 2);

		return gate;
	}

	createDoor(d, index)
	{
		let thickness = 2;
		let doorWidth = 80;
		let doorHeight = 190;

		let geometry = new THREE.BoxGeometry(doorWidth - thickness * 2, doorHeight - thickness, 5);

		let scale = doorWidth*0.01;
		let scale2 = scale*2;

		for(let i = 0; i < geometry.faces.length; i++)
		{
			if(i % 2 === 0)
				geometry.faceVertexUvs[0][i] = [
					new THREE.Vector2(0, 0),
					new THREE.Vector2(scale2, 0),
					new THREE.Vector2(0, scale)
			];
			else
				geometry.faceVertexUvs[0][i] =[
					new THREE.Vector2(scale2, 0),
					new THREE.Vector2(scale2, scale),
					new THREE.Vector2(0, scale),
				];
		}

		let texture = this.getTexture(d.materialType, d.material);
		

		let material = new THREE.MeshBasicMaterial({
			color: this.getMaterialColor(d.materialType, d.material),
			map: texture, side: THREE.DoubleSide
		});

		let sides = new THREE.BoxGeometry(thickness, doorHeight - thickness, thickness);
		let tops = new THREE.BoxGeometry(doorWidth - thickness, thickness, thickness);
		let borderMaterial = new THREE.MeshBasicMaterial({
			color: 0x111111,
			side: THREE.DoubleSide
		});

		let border = new THREE.Object3D();
		let left = new THREE.Mesh(sides, borderMaterial);
		let right = new THREE.Mesh(sides, borderMaterial);
		let top = new THREE.Mesh(tops, borderMaterial);
		let bottom = new THREE.Mesh(tops, borderMaterial);

		left.position.set(-doorWidth / 2 + thickness, 0, thickness / 2);
		right.position.set(doorWidth / 2 - thickness, 0, thickness / 2);
		top.position.set(0, doorHeight / 2 - thickness / 2, thickness / 2);
		bottom.position.set(0, -doorHeight / 2 + thickness / 2, thickness / 2);

		border.add(left);
		border.add(right);
		border.add(top);
		border.add(bottom);

		let handleGeo = new THREE.BoxGeometry(15, thickness, thickness);
		let handle = new THREE.Mesh(handleGeo, borderMaterial);

		if (d.handlePosition === 1)
			handle.position.set(doorWidth / 2 - 15, 0, thickness);
		else
			handle.position.set(-doorWidth / 2 + 15, 0, thickness);

		geometry.computeBoundingSphere();

		let door = new THREE.Object3D();

		let metal = new THREE.Mesh(geometry, material);
		metal.name = "doorMetal" + index;

		door.add(border);
		door.add(metal);
		door.add(handle);

		switch (d.wall)
		{
			case 0:
				door.rotateY(-Math.PI / 2);
				door.position.set(-this.settings.garage.width * 100 / 2, doorHeight / 2, d.position * 100 - this.settings.garage.length * 100 / 2 + doorWidth / 2);
				break;

			case 1:
				door.rotateY(Math.PI / 2);
				door.position.set(this.settings.garage.width * 100 / 2, doorHeight / 2, d.position * 100 - this.settings.garage.length * 100 / 2 + doorWidth / 2);
				break;

			case 2:
				door.position.set(d.position * 100 - this.settings.garage.width * 100 / 2 + doorWidth / 2, doorHeight / 2, this.settings.garage.length * 100 / 2);
				break;

			case 3:
				door.rotateY(Math.PI);
				door.position.set(d.position * 100 - this.settings.garage.width * 100 / 2 + doorWidth / 2, doorHeight / 2, -this.settings.garage.length * 100 / 2);
				break;
			default:
				break;
		}

		return door;
	}

	createWindow(w)
	{
		let types = [
			{
				width: 60,
				height: 40,
			},
			{
				width: 80,
				height: 50,
			},
			{
				width: 100,
				height: 50,
			}
		]
		let thickness = 2;
		let wndWidth = types[w.type].width;
		let wndHeight = types[w.type].height;

		let geometry = new THREE.BoxGeometry(wndWidth - thickness * 2, wndHeight - thickness, 5);

		let scale = 2;
		for(let i = 0; i < geometry.faces.length; i++)
		{
			geometry.faceVertexUvs[0][i] =[
				new THREE.Vector2(0, 0),
				new THREE.Vector2(scale, 0),
				new THREE.Vector2(0, scale)
			];
		};

		let material = new THREE.MeshBasicMaterial({
			color: 0xd8fbf2,
			side: THREE.DoubleSide
		});

		let sides = new THREE.BoxGeometry(thickness, wndHeight - thickness, thickness);
		let tops = new THREE.BoxGeometry(wndWidth - thickness, thickness, thickness);
		let borderMaterial = new THREE.MeshBasicMaterial({
			color: 0x111111,
			side: THREE.DoubleSide
		});

		let border = new THREE.Object3D();
		let left = new THREE.Mesh(sides, borderMaterial);
		let right = new THREE.Mesh(sides, borderMaterial);
		let top = new THREE.Mesh(tops, borderMaterial);
		let bottom = new THREE.Mesh(tops, borderMaterial);

		left.position.set(-wndWidth / 2 + thickness, 0, thickness / 2);
		right.position.set(wndWidth / 2 - thickness, 0, thickness / 2);
		top.position.set(0, wndHeight / 2 - thickness / 2, thickness / 2);
		bottom.position.set(0, -wndHeight / 2 + thickness / 2, thickness / 2);

		border.add(left);
		border.add(right);
		border.add(top);
		border.add(bottom);

		geometry.computeBoundingSphere();

		let wnd = new THREE.Object3D();
		let glass = new THREE.Mesh(geometry, material);
		wnd.add(border);
		wnd.add(glass);

		let Y = wndHeight / 2 + w.positionY * 100;

		switch (w.wall)
		{
			case 0:
				wnd.rotateY(-Math.PI / 2);
				wnd.position.set(-this.settings.garage.width * 100 / 2, Y, w.positionX * 100 - this.settings.garage.length * 100 / 2 + wndWidth / 2);
				break;

			case 1:
				wnd.rotateY(Math.PI / 2);
				wnd.position.set(this.settings.garage.width * 100 / 2, Y, w.positionX * 100 - this.settings.garage.length * 100 / 2 + wndWidth / 2);
				break;

			case 2:
				wnd.position.set(w.positionX * 100 - this.settings.garage.width * 100 / 2 + wndWidth / 2, Y, this.settings.garage.length * 100 / 2);
				break;

			case 3:
				wnd.rotateY(Math.PI);
				wnd.position.set(w.positionX * 100 - this.settings.garage.width * 100 / 2 + wndWidth / 2, Y, -this.settings.garage.length * 100 / 2);
				break;
			default:
				break;
		}
		return wnd;
	}

	generateGarage()
	{

		this.garage = new THREE.Object3D();
		this.garage.name = "garage";

		this.garage.add(this.createWalls());
		this.garage.add(this.createRoof());

		this.settings.doors.forEach((d, i) =>
		{
			this.garage.add(this.createDoor(d, i));
		})

		this.settings.windows.forEach((w) =>
		{
			this.garage.add(this.createWindow(w));
		})

		if (this.settings.gate.type !== 2)
			this.garage.add(this.createGate(0));

		this.scene.add(this.garage);
	}

	update(params)
	{
		this.settings = params;
		this.scene.remove(this.garage);
		this.generateGarage();
	}

	getTexture(type, nr)
	{
		let texture;

		if (type === 3)
		{
			if (nr === 1)
				texture = this.textures.brightWood;
			else
				texture = this.textures.darkWood;
		}
		else
			texture = this.textures.metal;

		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		return texture;
	}

	getMaterialColor(type, nr)
	{
		let codes = [
			[
				0xa1a1a1
			],
			[
				0x571820, 0x6c332a,
				0x792322, 0x485946,
				0x45484d, 0x8d4932,
				0x442f2a, 0x4d4342,
				0x111111
			],
			[
				0xd1a96c, 0x571820, 0x6c332a, 0x792322, 0x074e7a,
				0x124232, 0x485946, 0x186e3d, 0x383d41, 0x45484d,
				0xc3c5c2, 0x8d4932, 0x442f2a, 0x4d4342, 0xe1e2dd,
				0xa1a1a1, 0xfefefe
			],
			[
				0xffffff,
				0xffffff,
			]
		]

		if (type === 0)
			nr = 0;


		return codes[type][nr];
	}

	getGarageGeometry()
	{
		let geometry = new THREE.Geometry();
		const X = this.settings.garage.width * 100 / 2;
		const y = this.settings.garage.height_min * 100;
		const Y = this.settings.garage.height_max * 100;
		const Z = this.settings.garage.length * 100 / 2;

		let topVerts = this.getTopVertices();

		if (this.settings.roof.type === 2)
		{
			geometry.vertices.push(
				new THREE.Vector3(-X, 0, Z),
				new THREE.Vector3(X, 0, Z),
				new THREE.Vector3(X, 0, -Z),
				new THREE.Vector3(-X, 0, -Z),
				new THREE.Vector3(-X, y, Z),
				new THREE.Vector3(X, y, Z),
				new THREE.Vector3(X, y, -Z),
				new THREE.Vector3(-X, y, -Z),
				new THREE.Vector3(0, Y, Z),
				new THREE.Vector3(0, Y, -Z)
			);

			geometry.faces.push(
				new THREE.Face3(4, 1, 0),
				new THREE.Face3(1, 4, 5),
				new THREE.Face3(5, 2, 1),
				new THREE.Face3(2, 5, 6),
				new THREE.Face3(6, 3, 2),
				new THREE.Face3(3, 6, 7),
				new THREE.Face3(7, 0, 3),
				new THREE.Face3(0, 7, 4),
				new THREE.Face3(8, 5, 4),
				new THREE.Face3(9, 7, 6)

			);
		}
		else
		{
			geometry.vertices.push(
				new THREE.Vector3(-X, 0, Z),
				new THREE.Vector3(X, 0, Z),
				new THREE.Vector3(X, 0, -Z),
				new THREE.Vector3(-X, 0, -Z),
				new THREE.Vector3(-X, topVerts[0], Z),
				new THREE.Vector3(X, topVerts[1], Z),
				new THREE.Vector3(X, topVerts[2], -Z),
				new THREE.Vector3(-X, topVerts[3], -Z)
			);

			geometry.faces.push(
				new THREE.Face3(4, 1, 0),
				new THREE.Face3(1, 4, 5),
				new THREE.Face3(5, 2, 1),
				new THREE.Face3(2, 5, 6),
				new THREE.Face3(6, 3, 2),
				new THREE.Face3(3, 6, 7),
				new THREE.Face3(7, 0, 3),
				new THREE.Face3(0, 7, 4)
			);
		}


		if (geometry.faces.length === 8)
		{
			for(let i = 0; i < geometry.faces.length; i++)
			{
				let scale = ([0, 1, 4, 5].includes(i)) ? this.settings.garage.width : this.settings.garage.length;

				if (i % 2 === 0)
					geometry.faceVertexUvs[0][i] =[
						new THREE.Vector2(scale, 0),
						new THREE.Vector2(0, scale),
						new THREE.Vector2(0, 0),

					];
				else
					geometry.faceVertexUvs[0][i] =[
						new THREE.Vector2(0, scale),
						new THREE.Vector2(scale, 0),
						new THREE.Vector2(scale, scale)
					];
			};
		}
		else
		{
			for (let i = 0; i < 8; i++)
			{
				let scale = this.settings.garage.width;

				if (i % 2 === 0)
					geometry.faceVertexUvs[0][i] = [
						new THREE.Vector2(scale, 0),
						new THREE.Vector2(0, scale),
						new THREE.Vector2(0, 0),

					];
				else
					geometry.faceVertexUvs[0][i] = [
						new THREE.Vector2(0, scale),
						new THREE.Vector2(scale, 0),
						new THREE.Vector2(scale, scale),
					];
			}

			for (let i = 8; i < 10; i++)
			{
				let scale = 2;

				geometry.faceVertexUvs[0][i] = [

					new THREE.Vector2(scale, scale/2),
					new THREE.Vector2(0, scale),
					new THREE.Vector2(0, 0),

				];
			}

		}

		// geometry.computeFaceNormals();
		// geometry.computeVertexNormals();
		geometry.computeBoundingSphere();

		return geometry;
	}

	getTopVertices()
	{
		let h1 = this.settings.garage.height_min * 100;  //left, side, front
		let h2 = this.settings.garage.height_max * 100;  //right, top, back

		switch (this.settings.roof.type)
		{
			case 0:
				return [h1, h2, h2, h1];

			case 1:
				return [h2, h1, h1, h2];

			case 2:
				//return [h2, h1, h1, h2];
				break;

			case 3:
				return [h1, h1, h2, h2];

			case 4:
				return [h2, h2, h1, h1];
			default:
				break;
		}
	}

	hypotenuseLength(a, b)
	{
		return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	}

	getGableGeometry()
	{
		let geometry = new THREE.Geometry();
		const X = this.settings.garage.width * 100 / 2;
		const Y = this.settings.garage.height_max * 100 - this.settings.garage.height_min * 100;
		const Z = this.settings.garage.length * 100 / 2;

		// let topVerts = this.getTopVertices();
		let m = 15;

		let k = 30 / (X * 2);
		let x = k * Y;
		let g = 2 - x;

		geometry.vertices.push(
			new THREE.Vector3(-X -m, -x, Z + m),
			new THREE.Vector3(0, Y, Z + m),
			new THREE.Vector3(X + m, -x, Z + m),
			new THREE.Vector3(-X - m, -x, -Z - m),
			new THREE.Vector3(0, Y, -Z - m),
			new THREE.Vector3(X + m, -x, -Z - m),

			new THREE.Vector3(-X - m, g, Z + m),
			new THREE.Vector3(0, Y + g, Z + m),
			new THREE.Vector3(X + m, g, Z + m),
			new THREE.Vector3(-X - m, g, -Z - m),
			new THREE.Vector3(0, Y + g, -Z - m),
			new THREE.Vector3(X + m, g, -Z - m),
		);

		geometry.faces.push(
			new THREE.Face3(0, 1, 4),
			new THREE.Face3(0, 3, 4),
			new THREE.Face3(1, 2, 5),
			new THREE.Face3(1, 4, 5),

			new THREE.Face3(0, 1, 6),
			new THREE.Face3(1, 6, 7),
			new THREE.Face3(1, 2, 7),
			new THREE.Face3(2, 7, 8),

			new THREE.Face3(2, 5, 8),
			new THREE.Face3(5, 8, 11),

			new THREE.Face3(3, 4, 9),
			new THREE.Face3(4, 9, 10),
			new THREE.Face3(4, 5, 10),
			new THREE.Face3(5, 10, 11),

			new THREE.Face3(0, 3, 6),
			new THREE.Face3(3, 6, 9),

			new THREE.Face3(6, 7, 10),
			new THREE.Face3(6, 9, 10),
			new THREE.Face3(7, 8, 11),
			new THREE.Face3(7, 10, 11),
		);

		return geometry;
	}
}
export default Visualisation;
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import metal from '../imgs/visualization/metal.png'
import brightWood from '../imgs/visualization/brightWood.png'
import darkWood from '../imgs/visualization/darkWood.png'
import * as C from './Constants'

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
		this.renderer.setClearColor(C.CANVAS_BACKGROUND, 1);

		let containerStyle = getComputedStyle(this.display);
		this.camera = new THREE.PerspectiveCamera(75, parseInt(containerStyle.width) / parseInt(containerStyle.height), 1, 10000);
		this.camera.position.set(C.CAMERA_DEFAULT_POSITION.X, C.CAMERA_DEFAULT_POSITION.Y, C.CAMERA_DEFAULT_POSITION.Z);

		this.renderer.setSize(parseInt(containerStyle.width), parseInt(containerStyle.height));
		this.display.appendChild(this.renderer.domElement);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.target.set(C.ORBIT_CONTROLS_TARGET.X, C.ORBIT_CONTROLS_TARGET.Y, C.ORBIT_CONTROLS_TARGET.Z);

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
		let material = new THREE.MeshBasicMaterial({ 
			color: this.getMaterialColor(this.settings.garage.materialType, this.settings.garage.material), 
			map: texture, 
			side: THREE.DoubleSide 
		});
		let geometry = this.getGarageGeometry();

		let walls = new THREE.Mesh(geometry, material);
		return walls;
	}

	createRoof()
	{
		let roof = new THREE.Object3D();
		let texture = this.getTexture(this.settings.roof.materialType, this.settings.roof.material);
		texture.repeat.set(this.settings.garage.length, 1);	

		let a = Math.abs(this.settings.garage.height_min * 100 - this.settings.garage.height_max * 100)
		let b = 0;
		let roofMargin = C.ROOF_MARGIN;

		let geometry;

		switch (this.settings.roof.type)
		{
			case C.ROOF_TYPES.LEFT:
				b = this.settings.garage.width * 100;
				roof.rotateZ(a / b);
				texture.rotation = Math.PI / 2;
				geometry = new THREE.BoxGeometry(this.hypotenuseLength(a, b) + roofMargin, 2, this.settings.garage.length * 100 + roofMargin);
				break;

			case C.ROOF_TYPES.RIGHT:
				b = this.settings.garage.width * 100;
				roof.rotateZ(-a / b);
				texture.rotation = Math.PI / 2;
				geometry = new THREE.BoxGeometry(this.hypotenuseLength(a, b) + roofMargin, 2, this.settings.garage.length * 100 + roofMargin);
				break;

			case C.ROOF_TYPES.GABLE:
				geometry = this.getGableGeometry();
				roof.position.set(0, this.settings.garage.height_min * 100, 0);
				break;

			case C.ROOF_TYPES.FRONT:
				b = this.settings.garage.length * 100;
				roof.rotateX(a / b);
				geometry = new THREE.BoxGeometry(this.settings.garage.width * 100 + roofMargin, 2, this.hypotenuseLength(a, b) + roofMargin);
				break;

			case C.ROOF_TYPES.BACK:
				b = this.settings.garage.length * 100;
				roof.rotateX(-a / b);
				geometry = new THREE.BoxGeometry(this.settings.garage.width * 100 + roofMargin, 2, this.hypotenuseLength(a, b) + roofMargin);
				break;
			default:
				break;
		}

		let material = new THREE.MeshBasicMaterial({
			color: this.getMaterialColor(this.settings.roof.materialType, this.settings.roof.material), 
			map: texture, 
			side: THREE.DoubleSide
		});


		if (this.settings.roof.type !== C.ROOF_TYPES.GABLE)
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

		let metal = new THREE.Mesh(geometry, material);
		roof.add(metal);

		return roof;
	}

	createGate()
	{
		let geometry = new THREE.BoxGeometry(this.settings.gate.width * 100 - C.THICKNESS * 2, this.settings.gate.height * 100 - C.THICKNESS * 2, 5);

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

		let sides = new THREE.BoxGeometry(C.THICKNESS, this.settings.gate.height * 100 - C.THICKNESS, C.THICKNESS);
		let tops = new THREE.BoxGeometry(this.settings.gate.width * 100 - C.THICKNESS, C.THICKNESS, C.THICKNESS);
		let borderMaterial = new THREE.MeshBasicMaterial({
			color: C.BORDER_COLOR,
			side: THREE.DoubleSide
		});

		let border = new THREE.Object3D();
		let left = new THREE.Mesh(sides, borderMaterial);
		let right = new THREE.Mesh(sides, borderMaterial);
		let top = new THREE.Mesh(tops, borderMaterial);
		let bottom = new THREE.Mesh(tops, borderMaterial);

		left.position.set(-this.settings.gate.width * 100 / 2 + C.THICKNESS, 0, C.THICKNESS / 2);
		right.position.set(this.settings.gate.width * 100 / 2 - C.THICKNESS, 0, C.THICKNESS / 2);
		top.position.set(0, this.settings.gate.height * 100 / 2 - C.THICKNESS, C.THICKNESS / 2);
		bottom.position.set(0, -this.settings.gate.height * 100 / 2 + C.THICKNESS, C.THICKNESS / 2);
		
		border.add(left);
		border.add(right);
		border.add(top);
		border.add(bottom);

		let handleGeo = new THREE.BoxGeometry(15, C.THICKNESS, C.THICKNESS);
		let handle = new THREE.Mesh(handleGeo, borderMaterial);

		if (this.settings.gate.type === C.GATE_TYPES.DOUBLE_LEAF)
		{
			handle.rotateZ(Math.PI / 2);
			handle.position.set(C.THICKNESS + 5, 0, C.THICKNESS);
			let center = new THREE.Mesh(sides, borderMaterial);
			center.position.set(0, 0, 2);
			border.add(center);
		}
		else
			handle.position.set(0, -this.settings.gate.height * 100 / 2 + 15, C.THICKNESS);

		let gate = new THREE.Object3D();
		let metal = new THREE.Mesh(geometry, material);
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
		let doorWidth = C.DOOR_WIDTH * 100;
		let doorHeight = C.DOOR_HEIGHT * 100;

		let geometry = new THREE.BoxGeometry(doorWidth - C.THICKNESS * 2, doorHeight - C.THICKNESS, 5);

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
			map: texture, 
			side: THREE.DoubleSide
		});

		let sides = new THREE.BoxGeometry(C.THICKNESS, doorHeight - C.THICKNESS, C.THICKNESS);
		let tops = new THREE.BoxGeometry(doorWidth - C.THICKNESS, C.THICKNESS, C.THICKNESS);
		let borderMaterial = new THREE.MeshBasicMaterial({
			color: C.BORDER_COLOR,
			side: THREE.DoubleSide
		});

		let border = new THREE.Object3D();
		let left = new THREE.Mesh(sides, borderMaterial);
		let right = new THREE.Mesh(sides, borderMaterial);
		let top = new THREE.Mesh(tops, borderMaterial);
		let bottom = new THREE.Mesh(tops, borderMaterial);

		left.position.set(-doorWidth / 2 + C.THICKNESS, 0, C.THICKNESS / 2);
		right.position.set(doorWidth / 2 - C.THICKNESS, 0, C.THICKNESS / 2);
		top.position.set(0, doorHeight / 2 - C.THICKNESS / 2, C.THICKNESS / 2);
		bottom.position.set(0, -doorHeight / 2 + C.THICKNESS / 2, C.THICKNESS / 2);

		border.add(left);
		border.add(right);
		border.add(top);
		border.add(bottom);

		let handleGeo = new THREE.BoxGeometry(15, C.THICKNESS, C.THICKNESS);
		let handle = new THREE.Mesh(handleGeo, borderMaterial);

		if (d.handlePosition === 1)
			handle.position.set(doorWidth / 2 - 15, 0, C.THICKNESS);
		else
			handle.position.set(-doorWidth / 2 + 15, 0, C.THICKNESS);


		let door = new THREE.Object3D();
		let metal = new THREE.Mesh(geometry, material);

		door.add(border);
		door.add(metal);
		door.add(handle);

		switch (d.wall)
		{
			case C.WALLS.LEFT:
				door.rotateY(-Math.PI / 2);
				door.position.set(-this.settings.garage.width * 100 / 2, doorHeight / 2, d.position * 100 - this.settings.garage.length * 100 / 2 + doorWidth / 2);
				break;

			case C.WALLS.RIGHT:
				door.rotateY(Math.PI / 2);
				door.position.set(this.settings.garage.width * 100 / 2, doorHeight / 2, d.position * 100 - this.settings.garage.length * 100 / 2 + doorWidth / 2);
				break;

			case C.WALLS.FRONT:
				door.position.set(d.position * 100 - this.settings.garage.width * 100 / 2 + doorWidth / 2, doorHeight / 2, this.settings.garage.length * 100 / 2);
				break;

			case C.WALLS.BACK:
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
		let wndWidth = C.WINDOW_SIZES[w.type].WIDTH;
		let wndHeight = C.WINDOW_SIZES[w.type].HEIGHT;

		let geometry = new THREE.BoxGeometry(wndWidth - C.THICKNESS * 2, wndHeight - C.THICKNESS, 5);
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
			color: C.WINDOW_COLOR,
			side: THREE.DoubleSide
		});

		let sides = new THREE.BoxGeometry(C.THICKNESS, wndHeight - C.THICKNESS, C.THICKNESS);
		let tops = new THREE.BoxGeometry(wndWidth - C.THICKNESS, C.THICKNESS, C.THICKNESS);
		let borderMaterial = new THREE.MeshBasicMaterial({
			color: C.BORDER_COLOR,
			side: THREE.DoubleSide
		});

		let border = new THREE.Object3D();
		let left = new THREE.Mesh(sides, borderMaterial);
		let right = new THREE.Mesh(sides, borderMaterial);
		let top = new THREE.Mesh(tops, borderMaterial);
		let bottom = new THREE.Mesh(tops, borderMaterial);

		left.position.set(-wndWidth / 2 + C.THICKNESS, 0, C.THICKNESS / 2);
		right.position.set(wndWidth / 2 - C.THICKNESS, 0, C.THICKNESS / 2);
		top.position.set(0, wndHeight / 2 - C.THICKNESS / 2, C.THICKNESS / 2);
		bottom.position.set(0, -wndHeight / 2 + C.THICKNESS / 2, C.THICKNESS / 2);

		border.add(left);
		border.add(right);
		border.add(top);
		border.add(bottom);

		let wnd = new THREE.Object3D();
		let glass = new THREE.Mesh(geometry, material);
		wnd.add(border);
		wnd.add(glass);

		let Y = wndHeight / 2 + w.positionY * 100;

		switch (w.wall)
		{
			case C.WALLS.LEFT:
				wnd.rotateY(-Math.PI / 2);
				wnd.position.set(-this.settings.garage.width * 100 / 2, Y, w.positionX * 100 - this.settings.garage.length * 100 / 2 + wndWidth / 2);
				break;

			case C.WALLS.RIGHT:
				wnd.rotateY(Math.PI / 2);
				wnd.position.set(this.settings.garage.width * 100 / 2, Y, w.positionX * 100 - this.settings.garage.length * 100 / 2 + wndWidth / 2);
				break;

			case C.WALLS.FRONT:
				wnd.position.set(w.positionX * 100 - this.settings.garage.width * 100 / 2 + wndWidth / 2, Y, this.settings.garage.length * 100 / 2);
				break;

			case C.WALLS.BACK:
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

		this.garage.add(this.createWalls());
		this.garage.add(this.createRoof());

		this.settings.doors.forEach((d, i) => {
			this.garage.add(this.createDoor(d, i));
		})

		this.settings.windows.forEach((w) => {
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

		if (type === C.MATERIAL_TYPES.WOODLIKE)
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
		if (type === C.MATERIAL_TYPES.GALVANIZED)
			nr = 0;

		return C.COLORS[type][nr];
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
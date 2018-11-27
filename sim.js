var particles = [];

var mouseParticle = {
	x: 0,
	y: 0,
	type: 'l+',
	charge: 100,
};

var paused = false;

function init() {
	canvas.addEventListener('mousemove', function(event) {
		mouseParticle.x = event.clientX;
		mouseParticle.y = event.clientY;
	});

	canvas.addEventListener('contextmenu', function(event) {
		switch (mouseParticle.type) {
			case 'l+':
				mouseParticle.type = 'l-';
				break;

			case 'l-':
				mouseParticle.type = 'b+';
				break;

			case 'b+':
				mouseParticle.type = 'b-';
				break;

			case 'b-':
				mouseParticle.type = 'none';
				break;

			case 'none':
				mouseParticle.type = 'l+';
				break;
		}
		event.preventDefault();
	});

	canvas.addEventListener('click', function(event) {
		if (mouseParticle.type === 'none') {
			return;
		}
		particles.push({
			type: mouseParticle.type,
			charge: mouseParticle.charge,
			x: mouseParticle.x,
			y: mouseParticle.y,
			vx: 0,
			vy: 0,
		});
		event.preventDefault();
		event.stopPropagation();
	});

	canvas.addEventListener('wheel', function(event) {
		if (event.deltaY < 0) {
			mouseParticle.charge = Math.min(mouseParticle.charge + 10, 255);
		}
		if (event.deltaY > 0) {
			mouseParticle.charge = Math.max(mouseParticle.charge - 10, 0);
		}
	});

	document.addEventListener('keydown', function(event) {
		if (event.which === 32) {
			paused = !paused;
		}
	});

	if (window.location.search !== '') {
		particles = JSON.parse(atob(window.location.search.substr(1)));
	}

	window.requestAnimationFrame(frame);
}

function frame() {
	var context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawParticle(context, mouseParticle);

	for (var i = particles.length - 1; i >= 0; i--) {
		var particle = particles[i];

		if (particle.type[0] === 'b') {
			drawParticle(context, particle);
			continue;
		}

		if (!paused) {
			particle.x += particle.vx;
			particle.y += particle.vy;
			if (
				particle.x > canvas.width
			 || particle.y > canvas.height
			 || particle.x < 0
			 || particle.y < 0
			) {
				particles.splice(i, 1);
				continue;
			}

			var fx = 0;
			var fy = 0;

			for (var j = 0; j < particles.length; j++) {
				if (j === i) {
					continue;
				}

				var other = particles[j];
				var multiplier = particle.type[1] === other.type[1] ? 1 : -1;

				var dx = particle.x - other.x;
				var dy = particle.y - other.y;
				var charges = particle.charge * other.charge * 0.01;
				var magnitude = multiplier * charges / (dx*dx + dy*dy);
				var theta = Math.atan2(dy, dx);
				particle.vx += Math.cos(theta) * magnitude;
				particle.vy += Math.sin(theta) * magnitude;
			}

			particle.vx += fx;
			particle.vy += fy;
		}

		drawParticle(context, particle);
	}

	shareLink.href = baseURI+'?'+btoa(JSON.stringify(particles));
	window.requestAnimationFrame(frame);
}

function drawParticle(context, particle) {
	if (particle.type === 'none') {
		return;
	}

	context.beginPath();
	context.fillStyle = particle.type[1] === '+'
		? 'rgb('+particle.charge+', 0, 0)'
		: 'rgb(0, 0, '+particle.charge+')';
	var radius = particle.type[0] === 'b' ? 20 : 10;
	context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
	context.fill();
}

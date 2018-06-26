const broadcast = function (name, data, bubbles = true) {
	const rootEl = Element.prototype.isPrototypeOf(this) ? this : document.body;
	let event;

	try {
		event = new CustomEvent(name, {bubbles: bubbles, cancelable: true, detail: data});
	} catch (e) {
		event = CustomEvent.initCustomEvent(name, true, true, data);
	}
	rootEl.dispatchEvent(event);
};


class Attention {
	constructor () {
		this.totalAttentionTime = 0;
		this.startAttentionTime;
		this.endAttentionTime;
		this.hasSentEvent = false;
	}

	init () {

		//Add events for all the other Attention events
		for (let i = 0; i < ATTENTION_EVENTS.length; i++) {
			window.addEventListener(ATTENTION_EVENTS[i], ev => this.startAttention(ev));
		}

		for (let i = 0; i < UNATTENTION_EVENTS.length; i++) {
			window.addEventListener(UNATTENTION_EVENTS[i], ev => this.endAttention(ev));
		}

		// Need to wait for this to be available
		window.Origami['o-viewport'].listenTo('visibility');
		document.body.addEventListener('oViewport.visibility', ev => this.handleVisibilityChange(ev), false);

		this.addVideoEvents();

		// Add event to send data on unload
		EXIT_EVENTS.forEach(event => {
			window.addEventListener(event, () => {
				if(this.hasSentEvent) {
					return;
				}
				this.hasSentEvent = true;
				this.endAttention();
				broadcast('oTracking.event', {
					category: 'page',
					action: 'interaction',
					context: {
						attention: {
							total: this.totalAttentionTime
						}
					}
				});
			});
		});

	}

	startAttention () {
		clearTimeout(this.attentionTimeout);
		if(!this.startAttentionTime) {
			this.startAttentionTime = (new Date()).getTime();
		}
		this.attentionTimeout = setTimeout(() => this.endAttention(), ATTENTION_INTERVAL);
	}

	startConstantAttention () {
		this.constantAttentionInterval = setInterval(() => this.startAttention(), ATTENTION_INTERVAL);
	}

	endConstantAttention () {
		this.endAttention();
		clearInterval(this.constantAttentionInterval);
	}

	endAttention () {
		if(this.startAttentionTime) {
			this.endAttentionTime = (new Date()).getTime();
			this.totalAttentionTime += Math.round((this.endAttentionTime - this.startAttentionTime)/1000);
			clearTimeout(this.attentionTimeout);
			this.startAttentionTime = null;
		}
	}

	get () {
		//getter should restart attention capturing as endAttention updates the value:
		this.endAttention();
		this.startAttention();
		return this.totalAttentionTime;
	}

	addVideoEvents () {
		this.videoPlayers = document.getElementsByTagName('video');
		for (let i = 0; i < this.videoPlayers.length; i++) {
			this.videoPlayers[i].addEventListener('playing', ev => this.startConstantAttention(ev));
			this.videoPlayers[i].addEventListener('pause', ev => this.endConstantAttention(ev));
			this.videoPlayers[i].addEventListener('ended', ev => this.endConstantAttention(ev));
		}
	}

	handleVisibilityChange (ev) {
		if (ev.detail.hidden) {
			this.endAttention();
		} else {
			this.startAttention();
		}
	}

}

const fireBeacon = (contextSource, percentage) => {
	const data = {
		action: 'scrolldepth',
		category: 'page',
		meta: {
			percentagesViewed: percentage,
			attention: events.attention.get()
		},
		context: {
			product: 'next',
			source: contextSource
		}
	};
	broadcast('oTracking.event', data);
};

const scrollDepthInit = (contextSource, { percentages = [25, 50, 75, 100], selector = 'body'} = { }) => {
		if (!(contextSource && contextSource.length)) {
			throw new Error('contextSource required');
		}

		const intersectionCallback = (observer, changes) => {
			changes.forEach(change => {
				const scrollDepthMarkerEl = change.target;
				fireBeacon(contextSource, scrollDepthMarkerEl.getAttribute('data-percentage'));
				if (scrollDepthMarkerEl.parentNode) {
					scrollDepthMarkerEl.parentNode.removeChild(scrollDepthMarkerEl);
				}
				observer.unobserve(scrollDepthMarkerEl);
			});
		};


		const element = document.querySelector(selector);
		if (element && window.IntersectionObserver) {
			const observer = new IntersectionObserver(
				function (changes) {
					intersectionCallback(this, changes);
				}
			);
			percentages.forEach(percentage => {
				// add a scroll depth marker element
				const targetEl = document.createElement('div');
				targetEl.className = 'n-ui__scroll-depth-marker';
				targetEl.style.position = 'absolute';
				targetEl.style.top = `${percentage}%`;
				targetEl.style.bottom = '0';
				targetEl.style.width = '100%';
				targetEl.style.zIndex = '-1';
				targetEl.setAttribute('data-percentage', percentage);
				element.appendChild(targetEl);
				observer.observe(targetEl);
			});
		}
};

module.exports = {
	Attention,
	broadcast,
	fireBeacon,
	scrollDepthInit
};

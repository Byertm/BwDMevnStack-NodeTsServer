/*!
* BwDServer Admin v1.2.0
* Copyright 2011-2018 ByertmWeb
* SEE LICENSE FILE
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(factory());
}(this, (function () {
	'use strict';

	// if (typeof Chart === 'undefined') {
	// 	throw new Error('BwDServer Admin requires the Chart.js library in order to function properly.');
	// }

	window.BwDAdmin = window.BwDAdmin ? window.BwDAdmin : {};

	$.extend($.easing, {
		easeOutSine: function easeOutSine(x, t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		}
	});

	/**
	 * Chart.js - Line Chart with Vertical Line
	 */
	// Chart.defaults.LineWithLine = Chart.defaults.line;
	// Chart.controllers.LineWithLine = Chart.controllers.line.extend({
	// 	draw: function draw(ease) {
	// 		Chart.controllers.line.prototype.draw.call(this, ease);
	// 		if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
	// 			let activePoint = this.chart.tooltip._active[0],
	// 				ctx = this.chart.ctx,
	// 				x = activePoint.tooltipPosition().x,
	// 				topY = this.chart.scales['y-axis-0'].top,
	// 				bottomY = this.chart.scales['y-axis-0'].bottom;

	// 			// Draw the line
	// 			ctx.save();
	// 			ctx.beginPath();
	// 			ctx.moveTo(x, topY);
	// 			ctx.lineTo(x, bottomY);
	// 			ctx.lineWidth = 0.5;
	// 			ctx.strokeStyle = '#ddd';
	// 			ctx.stroke();
	// 			ctx.restore();
	// 		}
	// 	}
	// });

	const setTheme = (theme) => {
		localStorage.setItem("user-theme", theme);
		userTheme = theme;
		document.documentElement.className = theme;
	};

	const getTheme = () => {
		return localStorage.getItem("user-theme");
	};

	const toggleTheme = (e) => {
		e.preventDefault();
		const activeTheme = localStorage.getItem("user-theme");
		if (activeTheme === "light") setTheme("dark");
		else setTheme("light");
	};

	const getMediaPreference = () => {
		const hasDarkPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
		if (hasDarkPreference) return "dark";
		else return "light";
	};

	const userTheme = getTheme() || getMediaPreference();

	$(document).ready(function () {
		/**
		 * Dropdown adjustments
		 */
		let slideConfig = { duration: 270, easing: 'easeOutSine' };

		// Add dropdown animations when toggled.
		$(':not(.main-sidebar--icons-only) .dropdown').on('show.bs.dropdown', function () {
			$(this).find('.dropdown-menu').first().stop(true, true).slideDown(slideConfig);
		});

		$(':not(.main-sidebar--icons-only) .dropdown').on('hide.bs.dropdown', function () {
			$(this).find('.dropdown-menu').first().stop(true, true).slideUp(slideConfig);
		});

		/**
		 * Sidebar toggles
		 */
		$('.toggle-sidebar').click(function (_e) { $('.main-sidebar').toggleClass('open'); });

		setTheme(userTheme);

		/**
		 * Sidebar toggles
		 */
		$('.theme-switcher').click(function (e) { toggleTheme(e); });
	});
})));

'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Thermometer, Loader2 } from 'lucide-react';

// You can move this to a separate config file
const API_CONFIG = {
	// Replace with your API endpoint and key
	WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER,
	WEATHER_API_BASE_URL: 'https://api.weatherapi.com/v1/current.json'
};

export function WeatherWidget() {
	const [weather, setWeather] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const getWeatherEmoji = (condition) => {
		// Map your API's condition codes to emojis
		const conditionMap = {
			Sunny: '☀️',
			Clear: '☀️',
			'Partly cloudy': '⛅',
			Cloudy: '☁️',
			Overcast: '☁️',
			Mist: '🌫️',
			'Patchy rain possible': '🌦️',
			'Patchy snow possible': '🌨️',
			'Patchy sleet possible': '🌨️',
			'Patchy freezing drizzle possible': '🌨️',
			'Thundery outbreaks possible': '⛈️',
			Rain: '🌧️',
			Snow: '🌨️',
			Sleet: '🌨️',
			'Heavy rain': '🌧️',
			'Heavy snow': '🌨️',
			// Added chilling emoji for cold conditions
			Cold: '🥶',
			Frost: '🥶',
			Ice: '🥶',
			'Freezing fog': '🥶',
			'Light snow showers': '🥶',
			'Heavy snow showers': '🥶',
			Blizzard: '🥶'
		};
		return conditionMap[condition] || '';
	};

	useEffect(() => {
		const fetchWeather = async (latitude, longitude) => {
			try {
				const response = await fetch(
					`${API_CONFIG.WEATHER_API_BASE_URL}?key=${API_CONFIG.WEATHER_API_KEY}&q=${latitude},${longitude}`
				);

				if (!response.ok) {
					throw new Error('Weather data fetch failed');
				}

				const data = await response.json();
				setWeather({
					city: data.location.name,
					region: data.location.region,
					temperature: Math.round(data.current.temp_c),
					condition: data.current.condition.text,
					feelsLike: Math.round(data.current.feelslike_c)
				});
			} catch (err) {
				console.error('Weather fetch error:', err);
				setError('Unable to fetch weather data');
			} finally {
				setLoading(false);
			}
		};

		const handleLocationError = (err) => {
			console.error('Geolocation error:', err);
			setError('Unable to get location');
			setLoading(false);
		};

		const getUserLocation = () => {
			if (!navigator.geolocation) {
				setError('Geolocation is not supported');
				setLoading(false);
				return;
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					fetchWeather(position.coords.latitude, position.coords.longitude);
				},
				handleLocationError,
				{
					timeout: 10000,
					maximumAge: 300000 // 5 minutes
				}
			);
		};

		getUserLocation();

		// Refresh weather every 10 minutes
		const refreshInterval = setInterval(getUserLocation, 600000);
		return () => clearInterval(refreshInterval);
	}, []);

	if (error) {
		return (
			<div className='flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm'>
				<span>{error}</span>
			</div>
		);
	}

	if (loading) {
		return (
			<div className='flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-sm'>
				<Loader2 className='w-4 h-4 animate-spin' />
				<span>Getting status...</span>
			</div>
		);
	}

	return (
		<div
			className='flex-col items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm cursor-default'
			title={`Feels like ${weather.feelsLike}°C in ${weather.city}, ${weather.region}`}>
			<div className='flex'>
				<div
					className='text-lg'
					role='img'
					aria-label={weather.condition}>
					{getWeatherEmoji(weather.condition)}
				</div>
				<div className='flex items-center gap-1'>
					<Thermometer className='w-4 h-4' />
					<span>{weather.temperature}°C</span>
				</div>
			</div>
			<div className='flex items-center gap-1'>
				<MapPin className='w-4 h-4' />
				<span className='font-medium'>{weather.city}</span>
			</div>
		</div>
	);
}

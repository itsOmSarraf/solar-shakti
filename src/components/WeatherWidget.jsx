'use client';
import React, { useState, useEffect } from 'react';
import {
	MapPin,
	Thermometer,
	Loader2,
	Wind,
	Droplets,
	Sun,
	Clock
} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
const API_CONFIG = {
	WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER,
	WEATHER_API_BASE_URL: 'https://api.weatherapi.com/v1/current.json'
};

export function WeatherWidget() {
	const [weather, setWeather] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const getWeatherEmoji = (condition) => {
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
					country: data.location.country,
					temperature: Math.round(data.current.temp_c),
					condition: data.current.condition.text,
					feelsLike: Math.round(data.current.feelslike_c),
					humidity: data.current.humidity,
					windSpeed: Math.round(data.current.wind_kph),
					windDir: data.current.wind_dir,
					pressure: data.current.pressure_mb,
					visibility: data.current.vis_km,
					uv: data.current.uv,
					lastUpdated: data.current.last_updated,
					precipitation: data.current.precip_mm
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
					maximumAge: 300000
				}
			);
		};

		getUserLocation();

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
				<span>Getting weather...</span>
			</div>
		);
	}

	return (
		<>
			<div
				onClick={() => setIsOpen(true)}
				className='flex-col items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm cursor-pointer'
				title='Click for more details'>
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

			<Dialog
				open={isOpen}
				onOpenChange={setIsOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2'>
							<span>
								{weather.city}, {weather.region}
							</span>
							<span className='text-lg'>
								{getWeatherEmoji(weather.condition)}
							</span>
						</DialogTitle>
					</DialogHeader>

					<div className='grid grid-cols-2 gap-4 py-4'>
						<div className='space-y-4'>
							<div className='flex items-center gap-2'>
								<Thermometer className='w-5 h-5 text-blue-500' />
								<div>
									<p className='text-sm font-medium'>Temperature</p>
									<p className='text-2xl'>{weather.temperature}°C</p>
									<p className='text-sm text-gray-500'>
										Feels like {weather.feelsLike}°C
									</p>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<Wind className='w-5 h-5 text-blue-500' />
								<div>
									<p className='text-sm font-medium'>Wind</p>
									<p className='text-lg'>{weather.windSpeed} km/h</p>
									<p className='text-sm text-gray-500'>
										Direction: {weather.windDir}
									</p>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<Droplets className='w-5 h-5 text-blue-500' />
								<div>
									<p className='text-sm font-medium'>Humidity</p>
									<p className='text-lg'>{weather.humidity}%</p>
									<p className='text-sm text-gray-500'>
										Precipitation: {weather.precipitation}mm
									</p>
								</div>
							</div>
						</div>

						<div className='space-y-4'>
							<div className='flex items-center gap-2'>
								<Sun className='w-5 h-5 text-blue-500' />
								<div>
									<p className='text-sm font-medium'>UV Index</p>
									<p className='text-lg'>{weather.uv}</p>
									<p className='text-sm text-gray-500'>
										Visibility: {weather.visibility}km
									</p>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<MapPin className='w-5 h-5 text-blue-500' />
								<div>
									<p className='text-sm font-medium'>Location</p>
									<p className='text-lg'>{weather.city}</p>
									<p className='text-sm text-gray-500'>{weather.country}</p>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<Clock className='w-5 h-5 text-blue-500' />
								<div>
									<p className='text-sm font-medium'>Last Updated</p>
									<p className='text-sm text-gray-500'>
										{new Date(weather.lastUpdated).toLocaleString()}
									</p>
								</div>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default WeatherWidget;

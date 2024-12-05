'use client';
import { RotateCw } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell
} from 'recharts';
import {
	Tv,
	Wifi,
	Fan,
	Waves,
	Droplets,
	Microwave,
	MonitorSmartphone,
	Sun,
	Zap,
	Battery,
	Timer,
	Sparkles,
	Power,
	Loader2,
	BatteryCharging,
	BatteryFull,
	Cloud,
	CloudSun
} from 'lucide-react';

// Predefined smart schedules
const schedules = {
	ecoSaver: {
		name: 'Eco Saver',
		description: 'Minimal energy during peak hours',
		activeHours: '10:00 - 16:00',
		icon: <Power className='w-5 h-5 text-green-500' />,
		deviceStates: {
			1: { active: true, mode: 'eco' },
			2: { active: false },
			3: { active: true },
			4: { active: true },
			5: { active: false },
			6: { active: false },
			7: { active: true }
		}
	},
	solarOptimized: {
		name: 'Solar Mode',
		description: 'Maximize solar power usage',
		activeHours: '09:00 - 15:00',
		icon: <Sun className='w-5 h-5 text-amber-500' />,
		deviceStates: {
			1: { active: true, mode: 'solar' },
			2: { active: true },
			3: { active: true },
			4: { active: true },
			5: { active: true },
			6: { active: true },
			7: { active: true }
		}
	},
	nightSaver: {
		name: 'Night Saver',
		description: 'Off-peak night time usage',
		activeHours: '22:00 - 06:00',
		icon: <Timer className='w-5 h-5 text-blue-500' />,
		deviceStates: {
			1: { active: false },
			2: { active: false },
			3: { active: true },
			4: { active: false },
			5: { active: true },
			6: { active: false },
			7: { active: false }
		}
	}
};

// Generate energy data for individual device
const generateDeviceEnergyData = (devicePower, scheduleMode = null) => {
	const data = [];
	for (let i = 0; i < 24; i++) {
		const hour = i;
		let solarGeneration = 0;
		let consumption = (devicePower / 1000) * (0.8 + Math.random() * 0.4);

		if (hour >= 6 && hour <= 18) {
			const solarPeak = Math.abs(hour - 12);
			solarGeneration = Math.max(
				0,
				(3 - solarPeak * 0.5) * (1 + Math.random() * 0.2)
			);
		}

		if (scheduleMode === 'eco' && hour >= 10 && hour <= 16) {
			consumption *= 0.7;
		} else if (scheduleMode === 'solar' && solarGeneration > 0) {
			consumption = Math.min(consumption, solarGeneration);
		}

		const gridUsage = Math.max(0, consumption - solarGeneration);

		data.push({
			hour: `${String(hour).padStart(2, '0')}:00`,
			consumption: consumption.toFixed(2),
			solar: solarGeneration.toFixed(2),
			grid: gridUsage.toFixed(2)
		});
	}
	return data;
};

const SmartAppliancesPage = () => {
	const [devices, setDevices] = useState([
		{
			id: 1,
			name: 'Air Conditioner',
			icon: Waves,
			powerDraw: 1500,
			group: 'Cooling',
			status: 'active',
			temperature: 22,
			fanSpeed: 'medium'
		},
		{
			id: 2,
			name: 'Smart TV',
			icon: Tv,
			powerDraw: 100,
			group: 'Entertainment',
			status: 'idle',
			volume: 50,
			brightness: 80
		},
		{
			id: 3,
			name: 'WiFi Router',
			icon: Wifi,
			powerDraw: 20,
			group: 'Network',
			status: 'active',
			bandwidth: 100,
			connectedDevices: 5
		},
		{
			id: 4,
			name: 'Ceiling Fan',
			icon: Fan,
			powerDraw: 75,
			group: 'Cooling',
			status: 'active',
			speed: 3
		},
		{
			id: 5,
			name: 'Water Heater',
			icon: Droplets,
			powerDraw: 2000,
			group: 'Heating',
			status: 'idle',
			temperature: 40
		},
		{
			id: 6,
			name: 'Microwave',
			icon: Microwave,
			powerDraw: 1200,
			group: 'Kitchen',
			status: 'idle',
			power: 80,
			timer: 0
		},
		{
			id: 7,
			name: 'Computer',
			icon: MonitorSmartphone,
			powerDraw: 300,
			group: 'Work',
			status: 'active',
			performanceMode: 'balanced'
		}
	]);

	const [selectedDevice, setSelectedDevice] = useState(null);
	const [activeSchedule, setActiveSchedule] = useState(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [energyData, setEnergyData] = useState({});

	// Apply schedule
	const applySchedule = (scheduleKey) => {
		setIsGenerating(true);
		setTimeout(() => {
			const schedule = schedules[scheduleKey];
			const updatedDevices = devices.map((device) => ({
				...device,
				status: schedule.deviceStates[device.id]?.active ? 'active' : 'idle',
				mode: schedule.deviceStates[device.id]?.mode || null
			}));

			setDevices(updatedDevices);
			setActiveSchedule(scheduleKey);

			const newEnergyData = {};
			updatedDevices.forEach((device) => {
				newEnergyData[device.id] = generateDeviceEnergyData(
					device.powerDraw,
					schedule.deviceStates[device.id]?.mode
				);
			});
			setEnergyData(newEnergyData);
			setIsGenerating(false);
		}, 1500);
	};

	useEffect(() => {
		const initialData = {};
		devices.forEach((device) => {
			initialData[device.id] = generateDeviceEnergyData(device.powerDraw);
		});
		setEnergyData(initialData);
	}, []);

	const groupedDevices = devices.reduce((acc, device) => {
		if (!acc[device.group]) {
			acc[device.group] = [];
		}
		acc[device.group].push(device);
		return acc;
	}, {});

	const updateDeviceSettings = (deviceId, settings) => {
		setDevices(
			devices.map((device) =>
				device.id === deviceId ? { ...device, ...settings } : device
			)
		);
	};

	return (
		<div className='mb-6'>
			<h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>
				Smart Appliances
			</h2>

			{/* Schedule Selection */}
			<div className='grid grid-cols-3 gap-3 mb-6'>
				{Object.entries(schedules).map(([key, schedule]) => (
					<Button
						key={key}
						variant={activeSchedule === key ? 'default' : 'outline'}
						className={`flex flex-col items-center p-4 h-auto ${
							activeSchedule === key
								? 'border-green-500 dark:border-green-400'
								: ''
						}`}
						onClick={() => applySchedule(key)}
						disabled={isGenerating}>
						{schedule.icon}
						<span className='mt-2 text-sm font-medium'>{schedule.name}</span>
						<span className='text-xs text-gray-500 dark:text-gray-400'>
							{schedule.activeHours}
						</span>
					</Button>
				))}
			</div>

			{/* Loading State */}
			{isGenerating && (
				<div className='flex items-center justify-center py-4 text-gray-900 dark:text-gray-100'>
					<Loader2 className='w-6 h-6 animate-spin text-green-500 dark:text-green-400 mr-2' />
					<span>Optimizing schedule...</span>
				</div>
			)}

			{/* Devices List */}
			<ScrollArea className='h-[calc(100vh-320px)]'>
				{Object.entries(groupedDevices).map(([group, groupDevices]) => (
					<div
						key={group}
						className='mb-6'>
						<h2 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>
							{group}
						</h2>
						<div className='grid grid-cols-2 gap-3'>
							{groupDevices.map((device) => {
								const DeviceIcon = device.icon;
								return (
									<Dialog key={device.id}>
										<DialogTrigger asChild>
											<Card
												className={`cursor-pointer hover:shadow-lg transition-shadow ${
													device.status === 'active'
														? 'border-green-500 dark:border-green-400'
														: ''
												}`}>
												<CardContent className='p-4'>
													<div className='flex flex-col items-center'>
														<DeviceIcon className='w-8 h-8 text-gray-900 dark:text-gray-100' />
														<h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
															{device.name}
														</h3>
														<Badge
															className={`mt-2 ${
																device.status === 'active'
																	? 'bg-green-500 dark:bg-green-400'
																	: 'bg-gray-400 dark:bg-gray-600'
															}`}>
															{device.status}
														</Badge>
														<div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
															{device.powerDraw}W
															{device.mode && (
																<Badge
																	className='ml-2'
																	variant='outline'>
																	{device.mode === 'eco' ? 'ECO' : 'SOLAR'}
																</Badge>
															)}
														</div>
													</div>
												</CardContent>
											</Card>
										</DialogTrigger>

										<DialogContent className='max-w-3xl'>
											<DialogHeader>
												<DialogTitle className='flex items-center gap-2 text-gray-900 dark:text-gray-100'>
													<DeviceIcon className='w-6 h-6' />
													<span>{device.name}</span>
												</DialogTitle>
											</DialogHeader>
											<div className='mt-6'>
												<div className='space-y-4'>
													<div className='flex items-center justify-between text-gray-900 dark:text-gray-100'>
														<span>Power</span>
														<Switch
															checked={device.status === 'active'}
															onCheckedChange={(checked) => {
																updateDeviceSettings(device.id, {
																	status: checked ? 'active' : 'idle'
																});
															}}
														/>
													</div>

													{/* Device-specific controls */}
													{device.name === 'Air Conditioner' && (
														<>
															<div>
																<span className='block mb-2 text-gray-900 dark:text-gray-100'>
																	Temperature ({device.temperature}°C)
																</span>
																<Slider
																	value={[device.temperature]}
																	min={16}
																	max={30}
																	step={1}
																	onValueChange={([value]) => {
																		updateDeviceSettings(device.id, {
																			temperature: value
																		});
																	}}
																/>
															</div>
															<div>
																<span className='block mb-2 text-gray-900 dark:text-gray-100'>
																	Fan Speed
																</span>
																<div className='flex gap-2'>
																	{['low', 'medium', 'high'].map((speed) => (
																		<Button
																			key={speed}
																			variant={
																				device.fanSpeed === speed
																					? 'default'
																					: 'outline'
																			}
																			onClick={() =>
																				updateDeviceSettings(device.id, {
																					fanSpeed: speed
																				})
																			}>
																			{speed}
																		</Button>
																	))}
																</div>
															</div>
														</>
													)}

													{device.name === 'Smart TV' && (
														<>
															<div>
																<span className='block mb-2 text-gray-900 dark:text-gray-100'>
																	Volume ({device.volume}%)
																</span>
																<Slider
																	value={[device.volume]}
																	min={0}
																	max={100}
																	step={1}
																	onValueChange={([value]) => {
																		updateDeviceSettings(device.id, {
																			volume: value
																		});
																	}}
																/>
															</div>
															<div>
																<span className='block mb-2 text-gray-900 dark:text-gray-100'>
																	Brightness ({device.brightness}%)
																</span>
																<Slider
																	value={[device.brightness]}
																	min={0}
																	max={100}
																	step={1}
																	onValueChange={([value]) => {
																		updateDeviceSettings(device.id, {
																			brightness: value
																		});
																	}}
																/>
															</div>
														</>
													)}

													{device.name === 'Ceiling Fan' && (
														<div>
															<span className='block mb-2 text-gray-900 dark:text-gray-100'>
																Fan Speed ({device.speed})
															</span>
															<Slider
																value={[device.speed]}
																min={1}
																max={5}
																step={1}
																onValueChange={([value]) => {
																	updateDeviceSettings(device.id, {
																		speed: value
																	});
																}}
															/>
														</div>
													)}

													{device.name === 'Water Heater' && (
														<div>
															<span className='block mb-2 text-gray-900 dark:text-gray-100'>
																Temperature ({device.temperature}°C)
															</span>
															<Slider
																value={[device.temperature]}
																min={30}
																max={60}
																step={1}
																onValueChange={([value]) => {
																	updateDeviceSettings(device.id, {
																		temperature: value
																	});
																}}
															/>
														</div>
													)}

													{device.name === 'Computer' && (
														<div>
															<span className='block mb-2 text-gray-900 dark:text-gray-100'>
																Performance Mode
															</span>
															<div className='flex gap-2'>
																{['power-saver', 'balanced', 'performance'].map(
																	(mode) => (
																		<Button
																			key={mode}
																			variant={
																				device.performanceMode === mode
																					? 'default'
																					: 'outline'
																			}
																			onClick={() =>
																				updateDeviceSettings(device.id, {
																					performanceMode: mode
																				})
																			}>
																			{mode}
																		</Button>
																	)
																)}
															</div>
														</div>
													)}
												</div>

												<h3 className='text-sm font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100'>
													Energy Usage - Past 24 Hours
												</h3>
												<div className='h-64'>
													<ResponsiveContainer
														width='100%'
														height='100%'>
														<AreaChart data={energyData[device.id]}>
															<CartesianGrid
																strokeDasharray='3 3'
																stroke='#374151'
															/>
															<XAxis
																dataKey='hour'
																stroke='#9CA3AF'
															/>
															<YAxis stroke='#9CA3AF' />
															<Tooltip
																contentStyle={{
																	backgroundColor: '#1F2937',
																	border: 'none',
																	color: '#fff'
																}}
															/>
															<Legend />
															<Area
																type='monotone'
																dataKey='solar'
																stackId='1'
																stroke='#f59e0b'
																fill='#fcd34d'
																name='Solar'
															/>
															<Area
																type='monotone'
																dataKey='grid'
																stackId='1'
																stroke='#3b82f6'
																fill='#93c5fd'
																name='Grid'
															/>
														</AreaChart>
													</ResponsiveContainer>
												</div>
												<div className='mt-4'>
													<div className='flex items-center justify-between'>
														<div className='flex items-center gap-2 text-gray-900 dark:text-gray-100'>
															<Battery className='w-4 h-4' />
															<span className='text-lg font-bold'>
																{device.powerDraw}W
															</span>
														</div>
													</div>
													{activeSchedule && (
														<p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
															Part of {schedules[activeSchedule].name} schedule
														</p>
													)}
												</div>
											</div>
										</DialogContent>
									</Dialog>
								);
							})}
						</div>
					</div>
				))}
			</ScrollArea>
		</div>
	);
};

const SolarSystemPage = () => {
	const [solarPanels, setSolarPanels] = useState({
		totalPanels: 24,
		activePanels: 20,
		totalCapacity: 8.4,
		currentGeneration: 6.2,
		orientation: 180,
		tilt: 30,
		panels: Array(24).fill(true) // Track individual panel states
	});

	const [batterySystem, setBatterySystem] = useState({
		capacity: 13.5,
		currentCharge: 9.8,
		chargingRate: 4.2,
		mode: 'auto'
	});

	const generateSolarData = () => {
		const data = [];
		for (let i = 0; i < 24; i++) {
			const hour = i;
			let production = 0;

			if (hour >= 6 && hour <= 18) {
				const peakHour = Math.abs(hour - 12);
				production = Math.max(
					0,
					(solarPanels.totalCapacity - peakHour * 0.8) *
						(0.8 + Math.random() * 0.2)
				);
			}

			data.push({
				hour: `${String(hour).padStart(2, '0')}:00`,
				production: production.toFixed(2),
				consumption: (production * 0.7 + Math.random()).toFixed(2)
			});
		}
		return data;
	};

	const [solarData, setSolarData] = useState(generateSolarData());

	const BATTERY_MODES = [
		{
			name: 'Auto',
			icon: <BatteryCharging className='w-4 h-4' />,
			value: 'auto'
		},
		{
			name: 'Charge',
			icon: <BatteryFull className='w-4 h-4' />,
			value: 'charge'
		},
		{ name: 'Use', icon: <Zap className='w-4 h-4' />, value: 'discharge' }
	];

	const togglePanel = (index) => {
		const newPanels = [...solarPanels.panels];
		newPanels[index] = !newPanels[index];
		const activeCount = newPanels.filter((p) => p).length;

		setSolarPanels({
			...solarPanels,
			panels: newPanels,
			activePanels: activeCount,
			currentGeneration: (
				(activeCount / solarPanels.totalPanels) *
				solarPanels.totalCapacity
			).toFixed(1)
		});
	};

	const rotateToSun = () => {
		// Simulate automatic orientation adjustment
		setSolarPanels((prev) => ({
			...prev,
			orientation: 180,
			tilt: 30,
			currentGeneration: (
				(prev.activePanels / prev.totalPanels) *
				prev.totalCapacity
			).toFixed(1)
		}));
	};

	const SolarPanelGrid = () => (
		<div className='grid grid-cols-4 sm:grid-cols-6 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
			{solarPanels.panels.map((active, index) => (
				<button
					key={index}
					onClick={() => togglePanel(index)}
					className={`aspect-square rounded-lg transition-all transform hover:scale-105 ${
						active
							? 'bg-yellow-400 dark:bg-yellow-500 shadow-md'
							: 'bg-gray-300 dark:bg-gray-600'
					}`}>
					<div className='w-full h-full flex items-center justify-center'>
						<Sun
							className={`w-6 h-6 ${
								active
									? 'text-yellow-600 dark:text-yellow-200'
									: 'text-gray-500 dark:text-gray-400'
							}`}
						/>
					</div>
				</button>
			))}
		</div>
	);

	const batteryPercentage =
		(batterySystem.currentCharge / batterySystem.capacity) * 100;

	const BatteryStatus = () => (
		<Card className='p-4'>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
					Battery Status
				</h3>
				<Badge
					variant={batteryPercentage > 50 ? 'default' : 'destructive'}
					className='cursor-pointer'
					onClick={() =>
						setBatterySystem((prev) => ({
							...prev,
							currentCharge:
								prev.currentCharge + 10 > prev.capacity
									? prev.capacity
									: prev.currentCharge + 10
						}))
					}>
					{batteryPercentage.toFixed(1)}%
				</Badge>
			</div>
			<div
				className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 cursor-pointer'
				onClick={(e) => {
					const rect = e.currentTarget.getBoundingClientRect();
					const x = e.clientX - rect.left;
					const percentage = (x / rect.width) * 100;
					const newCharge = (percentage / 100) * batterySystem.capacity;
					setBatterySystem((prev) => ({
						...prev,
						currentCharge: Math.min(Math.max(newCharge, 0), prev.capacity)
					}));
				}}>
				<div
					className='bg-green-500 dark:bg-green-400 rounded-full h-4 transition-all duration-500'
					style={{ width: `${batteryPercentage}%` }}
				/>
			</div>
			<div className='grid grid-cols-3 gap-2'>
				{BATTERY_MODES.map((mode) => (
					<Button
						key={mode.value}
						variant={batterySystem.mode === mode.value ? 'default' : 'outline'}
						className='flex items-center justify-center gap-1 p-2'
						onClick={() =>
							setBatterySystem((prev) => ({ ...prev, mode: mode.value }))
						}>
						{mode.icon}
						<span className='text-xs hidden sm:inline'>{mode.name}</span>
					</Button>
				))}
			</div>
		</Card>
	);

	return (
		<div className='space-y-4 p-4'>
			<div className='flex flex-col sm:flex-row gap-4'>
				<Card className='flex-1 p-4'>
					<div className='flex justify-between items-center mb-4'>
						<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
							Solar Array
						</h3>
						<Button
							variant='outline'
							className='flex items-center gap-2'
							onClick={rotateToSun}>
							<RotateCw className='w-4 h-4' />
							<span className='hidden sm:inline'>Align to Sun</span>
						</Button>
					</div>
					<SolarPanelGrid />
					<div className='grid grid-cols-2 gap-4 mt-4'>
						<div className='bg-gray-100 dark:bg-gray-800 p-3 rounded'>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								Output
							</div>
							<div className='text-xl font-bold text-green-600 dark:text-green-400'>
								{solarPanels.currentGeneration} kW
							</div>
						</div>
						<div className='bg-gray-100 dark:bg-gray-800 p-3 rounded'>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								Active
							</div>
							<div className='text-xl font-bold text-gray-900 dark:text-gray-100'>
								{solarPanels.activePanels}/{solarPanels.totalPanels}
							</div>
						</div>
					</div>
				</Card>
				<div className='flex-1'>
					<BatteryStatus />
				</div>
			</div>

			<Card className='p-4'>
				<h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>
					Power Overview
				</h3>
				<div className='h-64'>
					<ResponsiveContainer
						width='100%'
						height='100%'>
						<AreaChart data={solarData}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='#374151'
							/>
							<XAxis
								dataKey='hour'
								stroke='#9CA3AF'
							/>
							<YAxis stroke='#9CA3AF' />
							<Tooltip
								contentStyle={{
									backgroundColor: '#1F2937',
									border: 'none',
									color: '#fff'
								}}
							/>
							<Legend />
							<Area
								type='monotone'
								dataKey='production'
								stackId='1'
								stroke='#fbbf24'
								fill='#fcd34d'
								name='Solar Production'
							/>
							<Area
								type='monotone'
								dataKey='consumption'
								stackId='2'
								stroke='#3b82f6'
								fill='#93c5fd'
								name='Home Usage'
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</Card>

			<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
				<Card className='p-4'>
					<div className='flex items-center gap-2'>
						<Sun className='w-6 h-6 text-yellow-500' />
						<div>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								Capacity
							</div>
							<div className='text-xl font-bold text-gray-900 dark:text-gray-100'>
								{solarPanels.totalCapacity} kW
							</div>
						</div>
					</div>
				</Card>
				<Card className='p-4'>
					<div className='flex items-center gap-2'>
						<BatteryCharging className='w-6 h-6 text-green-500 dark:text-green-400' />
						<div>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								Storage
							</div>
							<div className='text-xl font-bold text-gray-900 dark:text-gray-100'>
								{batterySystem.currentCharge} kWh
							</div>
						</div>
					</div>
				</Card>
				<Card className='p-4'>
					<div className='flex items-center gap-2'>
						<Zap className='w-6 h-6 text-blue-500 dark:text-blue-400' />
						<div>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								Charging
							</div>
							<div className='text-xl font-bold text-gray-900 dark:text-gray-100'>
								{batterySystem.chargingRate} kW
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
};

const SmartHomeDashboard = () => {
	return (
		<div className='min-h-screen p-4'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-3xl font-bold mb-6'>Smart Home Dashboard</h1>

				<Tabs
					defaultValue='appliances'
					className='w-full'>
					<TabsList className='mb-4'>
						<TabsTrigger value='appliances'>
							<MonitorSmartphone className='w-4 h-4 mr-2' />
							Appliances
						</TabsTrigger>
						<TabsTrigger value='solar'>
							<Sun className='w-4 h-4 mr-2' />
							Solar & Battery
						</TabsTrigger>
					</TabsList>

					<TabsContent value='appliances'>
						<SmartAppliancesPage />
					</TabsContent>

					<TabsContent value='solar'>
						<SolarSystemPage />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default SmartHomeDashboard;

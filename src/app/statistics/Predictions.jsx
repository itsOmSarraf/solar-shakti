'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	ComposedChart,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	ReferenceLine,
	Scatter
} from 'recharts';
import {
	BrainCircuit,
	Power,
	Clock,
	DollarSign,
	Zap,
	Sun,
	Battery,
	Sparkles,
	Cloud,
	CloudSun,
	ArrowDown,
	ArrowUp
} from 'lucide-react';

// Constants
const todPricing = {
	peak: { rate: 12, hours: [9, 10, 11, 18, 19, 20, 21], color: '#ef4444' },
	midPeak: { rate: 8, hours: [7, 8, 12, 13, 14, 15, 16, 17], color: '#f59e0b' },
	offPeak: { rate: 4, hours: [0, 1, 2, 3, 4, 5, 6, 22, 23], color: '#10b981' }
};

// Helper functions
const getTODPeriod = (hour) => {
	if (todPricing.peak.hours.includes(hour)) return 'peak';
	if (todPricing.midPeak.hours.includes(hour)) return 'midPeak';
	return 'offPeak';
};

const generatePredictionData = (dayCount = 1, selectedDay) => {
	const data = [];
	const baseLoad = 2 + selectedDay * 0.5; // Vary base load by day

	for (let day = 0; day < dayCount; day++) {
		for (let hour = 0; hour < 24; hour++) {
			// Add some randomization based on selected day
			const dayVariation = Math.sin((selectedDay * Math.PI) / 7);

			const solarGeneration =
				hour >= 6 && hour <= 18
					? Math.max(
							0,
							5 *
								Math.sin((Math.PI * (hour - 6)) / 12) *
								(1 + Math.random() * 0.2 + dayVariation * 0.3)
					  )
					: 0;

			const loadMultiplier =
				1 +
				(hour >= 7 && hour <= 9 ? 0.8 : 0) +
				(hour >= 18 && hour <= 21 ? 1 : 0) +
				(hour >= 12 && hour <= 14 ? 0.5 : 0) +
				dayVariation * 0.2;

			const load = baseLoad * loadMultiplier * (1 + Math.random() * 0.2);
			const todPeriod = getTODPeriod(hour);
			const rate = todPricing[todPeriod].rate;
			const gridUsage = Math.max(0, load - solarGeneration);

			data.push({
				day: day + 1,
				hour: `${String(hour).padStart(2, '0')}:00`,
				load: Number(load.toFixed(2)),
				solar: Number(solarGeneration.toFixed(2)),
				grid: Number(gridUsage.toFixed(2)),
				rate,
				todPeriod,
				optimizedLoad: Number((load * (0.85 + dayVariation * 0.05)).toFixed(2)),
				cost: Number((gridUsage * rate).toFixed(2)),
				optimizedCost: Number(
					(gridUsage * rate * (0.85 + dayVariation * 0.05)).toFixed(2)
				),
				batteryAction: hour >= 10 && hour <= 16 ? 'charge' : 'discharge',
				confidence: Math.min(95, 75 + Math.random() * 20),
				weather:
					hour >= 6 && hour <= 18
						? ['Sunny', 'Partly Cloudy', 'Cloudy'][
								Math.floor(Math.random() * 3)
						  ]
						: 'Night'
			});
		}
	}
	return data;
};

// Components
const TODPriceIndicator = ({ period, rate }) => (
	<div className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg'>
		<div className='flex items-center gap-2'>
			<div
				className={`w-3 h-3 rounded-full ${
					period === 'peak'
						? 'bg-red-500'
						: period === 'midPeak'
						? 'bg-amber-500'
						: 'bg-green-500'
				}`}
			/>
			<span className='font-medium capitalize'>
				{period.replace('P', ' P')}
			</span>
		</div>
		<span className='text-sm font-semibold'>₹{rate}/kWh</span>
	</div>
);

const MetricCard = ({ icon: Icon, label, value, subValue, trend = null }) => (
	<div className='p-4 bg-white dark:bg-gray-800 rounded-lg shadow'>
		<div className='flex justify-between items-start'>
			<div className='space-y-1'>
				<p className='text-sm text-gray-500 dark:text-gray-400'>{label}</p>
				<p className='text-xl font-bold'>{value}</p>
				{subValue && (
					<p className='text-xs text-gray-500 dark:text-gray-400'>{subValue}</p>
				)}
			</div>
			<div className='flex items-center gap-2'>
				{trend !== null && (
					<span
						className={`text-sm ${
							trend >= 0 ? 'text-green-500' : 'text-red-500'
						}`}>
						{trend >= 0 ? (
							<ArrowUp className='w-4 h-4' />
						) : (
							<ArrowDown className='w-4 h-4' />
						)}
						{Math.abs(trend)}%
					</span>
				)}
				<Icon className='w-5 h-5 text-gray-400 dark:text-gray-500' />
			</div>
		</div>
	</div>
);

const ResponsiveChart = ({ height = 300, children }) => (
	<div
		className='w-full'
		style={{ height: `${height}px`, minHeight: `${height}px` }}>
		<ResponsiveContainer>{children}</ResponsiveContainer>
	</div>
);

const LoadChart = ({ selectedDayData }) => (
	<ResponsiveChart height={300}>
		<ComposedChart
			data={selectedDayData}
			margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
			<CartesianGrid
				strokeDasharray='3 3'
				stroke='#374151'
			/>
			<XAxis
				dataKey='hour'
				tick={{ fontSize: 8, fill: '#9CA3AF' }}
				interval={3}
			/>
			<YAxis
				yAxisId='left'
				tick={{ fontSize: 12, fill: '#9CA3AF' }}
			/>
			<YAxis
				yAxisId='right'
				orientation='right'
				tick={{ fontSize: 12, fill: '#9CA3AF' }}
			/>
			<Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
			<Legend wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
			<Area
				yAxisId='left'
				type='monotone'
				dataKey='solar'
				fill='#fcd34d'
				stroke='#f59e0b'
				name='Solar'
			/>
			<Line
				yAxisId='left'
				type='monotone'
				dataKey='load'
				stroke='#3b82f6'
				name='Load'
			/>
			<Bar
				yAxisId='right'
				dataKey='grid'
				fill='#94a3b8'
				name='Grid'
			/>
		</ComposedChart>
	</ResponsiveChart>
);

const CostChart = ({ selectedDayData }) => (
	<ResponsiveChart height={300}>
		<ComposedChart
			data={selectedDayData}
			margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
			<CartesianGrid
				strokeDasharray='3 3'
				stroke='#374151'
			/>
			<XAxis
				dataKey='hour'
				tick={{ fontSize: 12, fill: '#9CA3AF' }}
				interval={3}
			/>
			<YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
			<Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
			<Legend wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
			<Bar
				dataKey='cost'
				name='Cost'
				fill={(d) => todPricing[d.todPeriod].color}
			/>
			<Line
				type='monotone'
				dataKey='optimizedCost'
				stroke='#10b981'
				name='Optimized'
			/>
		</ComposedChart>
	</ResponsiveChart>
);

const OptimizationChart = ({ selectedDayData }) => (
	<ResponsiveChart height={300}>
		<ComposedChart
			data={selectedDayData}
			margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
			<CartesianGrid
				strokeDasharray='3 3'
				stroke='#374151'
			/>
			<XAxis
				dataKey='hour'
				tick={{ fontSize: 12, fill: '#9CA3AF' }}
				interval={3}
			/>
			<YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
			<Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
			<Legend wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
			<Area
				type='monotone'
				dataKey='load'
				fill='#1e40af'
				stroke='#3b82f6'
				name='Current'
			/>
			<Line
				type='monotone'
				dataKey='optimizedLoad'
				stroke='#10b981'
				strokeWidth={2}
				name='Optimized'
			/>
			<ReferenceLine
				y={3.5}
				label={{ value: 'Peak', fontSize: 12, fill: '#9CA3AF' }}
				stroke='#ef4444'
				strokeDasharray='3 3'
			/>
		</ComposedChart>
	</ResponsiveChart>
);

const WeeklyChart = ({ predictionData }) => (
	<ResponsiveChart height={250}>
		<BarChart
			data={Array.from({ length: 7 }, (_, i) => {
				const dayData = predictionData.filter((d) => d.day === i + 1);
				return {
					day: `Day ${i + 1}`,
					currentCost: dayData.reduce((acc, curr) => acc + curr.cost, 0),
					optimizedCost: dayData.reduce(
						(acc, curr) => acc + curr.optimizedCost,
						0
					),
					savings: dayData.reduce(
						(acc, curr) => acc + (curr.cost - curr.optimizedCost),
						0
					)
				};
			})}
			margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
			<CartesianGrid
				strokeDasharray='3 3'
				stroke='#374151'
			/>
			<XAxis
				dataKey='day'
				tick={{ fontSize: 12, fill: '#9CA3AF' }}
			/>
			<YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
			<Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
			<Legend wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
			<Bar
				dataKey='currentCost'
				name='Current'
				fill='#ef4444'
			/>
			<Bar
				dataKey='optimizedCost'
				name='Optimized'
				fill='#10b981'
			/>
			<Line
				type='monotone'
				dataKey='savings'
				name='Savings'
				stroke='#6366f1'
			/>
		</BarChart>
	</ResponsiveChart>
);

const PredictionsTable = ({ selectedDayData }) => (
	<div className='min-w-max overflow-x-auto relative'>
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className='sticky left-0 z-20 bg-white dark:bg-gray-800'>
						Time
					</TableHead>
					<TableHead>Period</TableHead>
					<TableHead>Load</TableHead>
					<TableHead>Solar</TableHead>
					<TableHead>Grid</TableHead>
					<TableHead>Cost</TableHead>
					<TableHead>Weather</TableHead>
					<TableHead>Battery</TableHead>
					<TableHead>Savings</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{selectedDayData.map((hour) => (
					<TableRow key={hour.hour}>
						<TableCell className='sticky left-0 z-20 bg-white dark:bg-gray-800 font-medium whitespace-nowrap'>
							{hour.hour}
						</TableCell>
						<TableCell>
							<Badge
								variant='outline'
								className={`whitespace-nowrap ${
									hour.todPeriod === 'peak'
										? 'border-red-500'
										: hour.todPeriod === 'midPeak'
										? 'border-amber-500'
										: 'border-green-500'
								}`}>
								{hour.todPeriod.replace('P', ' P')}
							</Badge>
						</TableCell>
						<TableCell>
							<div className='flex items-center gap-2'>
								<span>{hour.load}</span>
								<span className='text-xs text-gray-500 dark:text-gray-400'>
									({hour.optimizedLoad})
								</span>
							</div>
						</TableCell>
						<TableCell>{hour.solar}</TableCell>
						<TableCell>{hour.grid}</TableCell>
						<TableCell>
							<div className='flex items-center gap-2'>
								<span>₹{hour.cost}</span>
								<ArrowDown
									className={`w-4 h-4 ${
										hour.cost > hour.optimizedCost
											? 'text-green-500'
											: 'text-gray-300 dark:text-gray-600'
									}`}
								/>
							</div>
						</TableCell>
						<TableCell>
							<div className='flex items-center gap-1'>
								{hour.weather === 'Sunny' && (
									<Sun className='w-4 h-4 text-amber-500' />
								)}
								{hour.weather === 'Partly Cloudy' && (
									<CloudSun className='w-4 h-4 text-blue-500' />
								)}
								{hour.weather === 'Cloudy' && (
									<Cloud className='w-4 h-4 text-gray-500' />
								)}
								<span className='text-sm whitespace-nowrap'>
									{hour.weather}
								</span>
							</div>
						</TableCell>
						<TableCell>
							<Badge
								variant={
									hour.batteryAction === 'charge' ? 'default' : 'outline'
								}
								className={`whitespace-nowrap ${
									hour.batteryAction === 'charge' ? 'bg-green-500' : ''
								}`}>
								{hour.batteryAction}
							</Badge>
						</TableCell>
						<TableCell>
							{hour.cost > hour.optimizedCost && (
								<span className='text-sm text-green-500'>
									₹{(hour.cost - hour.optimizedCost).toFixed(1)}
								</span>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	</div>
);

const KeyActions = () => (
	<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
		<div className='p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700'>
			<div className='flex flex-col items-center text-center space-y-2'>
				<div className='p-3 rounded-full bg-amber-100 dark:bg-amber-900'>
					<Sun className='w-6 h-6 text-amber-600 dark:text-amber-400' />
				</div>
				<h3 className='font-medium'>Solar Optimization</h3>
				<p className='text-sm text-gray-600 dark:text-gray-400'>
					Schedule high-power appliances during peak solar hours (10:00-15:00)
				</p>
			</div>
		</div>

		<div className='p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700'>
			<div className='flex flex-col items-center text-center space-y-2'>
				<div className='p-3 rounded-full bg-blue-100 dark:bg-blue-900'>
					<Clock className='w-6 h-6 text-blue-600 dark:text-blue-400' />
				</div>
				<h3 className='font-medium'>Load Shifting</h3>
				<p className='text-sm text-gray-600 dark:text-gray-400'>
					Move non-essential loads to off-peak hours for maximum savings
				</p>
			</div>
		</div>

		<div className='p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700'>
			<div className='flex flex-col items-center text-center space-y-2'>
				<div className='p-3 rounded-full bg-green-100 dark:bg-green-900'>
					<Battery className='w-6 h-6 text-green-600 dark:text-green-400' />
				</div>
				<h3 className='font-medium'>Battery Strategy</h3>
				<p className='text-sm text-gray-600 dark:text-gray-400'>
					Charge during solar peak, discharge during evening peak hours
				</p>
			</div>
		</div>
	</div>
);

const PredictionsPage = () => {
	const [selectedDay, setSelectedDay] = useState(1);
	const [predictionData, setPredictionData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const loadPredictionData = async () => {
			setIsLoading(true);
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setPredictionData(generatePredictionData(7, selectedDay));
			setIsLoading(false);
		};

		loadPredictionData();
	}, [selectedDay]);

	const selectedDayData = predictionData.filter((d) => d.day === selectedDay);

	const dailyMetrics = {
		totalLoad: selectedDayData
			.reduce((acc, curr) => acc + curr.load, 0)
			.toFixed(1),
		solarGen: selectedDayData
			.reduce((acc, curr) => acc + curr.solar, 0)
			.toFixed(1),
		totalCost: selectedDayData
			.reduce((acc, curr) => acc + curr.cost, 0)
			.toFixed(0),
		optimizedCost: selectedDayData
			.reduce((acc, curr) => acc + curr.optimizedCost, 0)
			.toFixed(0)
	};

	const savingsPercent = (
		((dailyMetrics.totalCost - dailyMetrics.optimizedCost) /
			dailyMetrics.totalCost) *
		100
	).toFixed(1);

	return (
		<div className='max-w-full space-y-4'>
			{/* Header */}
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4'>
				<h1 className='text-xl md:text-2xl font-bold'>AI Energy Predictions</h1>
				<div className='flex flex-wrap items-center gap-2'>
					<Select
						value={String(selectedDay)}
						onValueChange={(value) => {
							setSelectedDay(Number(value));
						}}>
						<SelectTrigger className='w-32 md:w-40'>
							<SelectValue placeholder='Select day' />
						</SelectTrigger>
						<SelectContent>
							{Array.from({ length: 7 }, (_, i) => (
								<SelectItem
									key={i + 1}
									value={String(i + 1)}>
									Day {i + 1}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{isLoading ? (
				<div className='flex items-center justify-center min-h-[200px]'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100'></div>
				</div>
			) : (
				<>
					{/* TOD Pricing */}
					<div className='grid grid-cols-1 gap-2'>
						{Object.entries(todPricing).map(([period, { rate }]) => (
							<TODPriceIndicator
								key={period}
								period={period}
								rate={rate}
							/>
						))}
					</div>

					{/* Metrics Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						<MetricCard
							icon={Zap}
							label='Total Load'
							value={`${dailyMetrics.totalLoad} kWh`}
							trend={-5}
						/>
						<MetricCard
							icon={Sun}
							label='Solar Generation'
							value={`${dailyMetrics.solarGen} kWh`}
							trend={12}
						/>
						<MetricCard
							icon={DollarSign}
							label='Predicted Cost'
							value={`₹${dailyMetrics.totalCost}`}
							subValue='Before optimization'
						/>
						<MetricCard
							icon={Sparkles}
							label='Potential Savings'
							value={`₹${(
								dailyMetrics.totalCost - dailyMetrics.optimizedCost
							).toFixed(0)}`}
							trend={Number(savingsPercent)}
						/>
					</div>

					{/* Charts */}
					<Card className='overflow-hidden'>
						<Tabs
							defaultValue='load'
							className='w-full'>
							<div className='px-2 pt-2'>
								<TabsList className='w-full grid grid-cols-3'>
									<TabsTrigger value='load'>Load</TabsTrigger>
									<TabsTrigger value='cost'>Cost</TabsTrigger>
									<TabsTrigger value='optimization'>Optimize</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent
								value='load'
								className='mt-2 w-full'>
								<LoadChart selectedDayData={selectedDayData} />
							</TabsContent>

							<TabsContent
								value='cost'
								className='mt-2'>
								<CostChart selectedDayData={selectedDayData} />
							</TabsContent>

							<TabsContent
								value='optimization'
								className='mt-2'>
								<OptimizationChart selectedDayData={selectedDayData} />
							</TabsContent>
						</Tabs>
					</Card>

					{/* Recommendations */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2 text-lg'>
								<Sparkles className='w-5 h-5 text-amber-500' />
								Smart Recommendations
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 gap-4'>
								<div className='flex items-start gap-3'>
									<Clock className='w-5 h-5 text-amber-500 flex-shrink-0' />
									<div>
										<h4 className='font-medium'>Load Shifting</h4>
										<p className='text-sm text-gray-600 dark:text-gray-400'>
											Shift heavy appliance usage to off-peak hours
											(22:00-06:00) to save ₹
											{(
												dailyMetrics.totalCost - dailyMetrics.optimizedCost
											).toFixed(0)}{' '}
											daily
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<Battery className='w-5 h-5 text-green-500 flex-shrink-0' />
									<div>
										<h4 className='font-medium'>Battery Usage</h4>
										<p className='text-sm text-gray-600 dark:text-gray-400'>
											Charge during solar peak (10:00-16:00) for optimal energy
											storage
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Hourly Predictions Table */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Hourly Predictions</CardTitle>
						</CardHeader>
						<CardContent className='overflow-x-auto'>
							<PredictionsTable selectedDayData={selectedDayData} />
						</CardContent>
					</Card>

					{/* Weekly Overview */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>
								Weekly Cost Optimization
							</CardTitle>
						</CardHeader>
						<CardContent>
							<WeeklyChart predictionData={predictionData} />
						</CardContent>
					</Card>

					{/* Key Actions */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Key Actions</CardTitle>
						</CardHeader>
						<CardContent>
							<KeyActions />
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
};

export default PredictionsPage;

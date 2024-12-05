'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
	RadialBarChart,
	RadialBar
} from 'recharts';
import {
	Battery,
	Sun,
	Zap,
	Leaf,
	DollarSign,
	CloudSun,
	TreeDeciduous,
	Factory,
	Timer,
	TrendingDown,
	Wind
} from 'lucide-react';

// Metric Box Component
const MetricBox = ({ icon: Icon, label, value, trend, color, subValue }) => (
	<Card>
		<CardContent className='p-4'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<div className={`p-2 rounded-lg ${color}`}>
						<Icon className='w-5 h-5 text-white' />
					</div>
					<div>
						<p className='text-sm text-gray-500 dark:text-gray-400'>{label}</p>
						<p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
							{value}
						</p>
						{subValue && (
							<p className='text-xs text-gray-500 dark:text-gray-400'>
								{subValue}
							</p>
						)}
					</div>
				</div>
				{trend && (
					<span
						className={`text-sm ${
							trend > 0
								? 'text-green-500 dark:text-green-400'
								: 'text-red-500 dark:text-red-400'
						}`}>
						{trend > 0 ? '+' : ''}
						{trend}%
					</span>
				)}
			</div>
		</CardContent>
	</Card>
);

const EnergyStatisticsExpanded = () => {
	// Generate real-time energy data
	const [liveData, setLiveData] = useState(() =>
		Array.from({ length: 24 }, (_, i) => ({
			time: `${String(i).padStart(2, '0')}:00`,
			solar: Math.max(
				0,
				50 + Math.random() * 30 * Math.sin((Math.PI * (i - 6)) / 12)
			),
			grid: 20 + Math.random() * 15,
			consumption: 30 + Math.random() * 25
		}))
	);

	// Carbon emission data (monthly)
	const carbonData = Array.from({ length: 12 }, (_, i) => ({
		month: [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		][i],
		reduced: Math.floor(500 + Math.random() * 300),
		baseline: Math.floor(800 + Math.random() * 200)
	}));

	// Cost comparison data
	const costData = [
		{ month: 'Jan', withSolar: 2500, withoutSolar: 4500 },
		{ month: 'Feb', withSolar: 2200, withoutSolar: 4200 },
		{ month: 'Mar', withSolar: 2400, withoutSolar: 4400 },
		{ month: 'Apr', withSolar: 2300, withoutSolar: 4300 },
		{ month: 'May', withSolar: 2600, withoutSolar: 4600 },
		{ month: 'Jun', withSolar: 2700, withoutSolar: 4700 },
		{ month: 'Jul', withSolar: 2800, withoutSolar: 4800 },
		{ month: 'Aug', withSolar: 2900, withoutSolar: 4900 },
		{ month: 'Sep', withSolar: 3000, withoutSolar: 5000 },
		{ month: 'Oct', withSolar: 3100, withoutSolar: 5100 },
		{ month: 'Nov', withSolar: 3200, withoutSolar: 5200 },
		{ month: 'Dec', withSolar: 3300, withoutSolar: 5300 }
	];

	// Energy source distribution
	const distributionData = [
		{ name: 'Solar', value: 45, fill: '#f59e0b' },
		{ name: 'Grid', value: 30, fill: '#3b82f6' },
		{ name: 'Battery', value: 25, fill: '#10b981' }
	];

	// Daily efficiency data
	const efficiencyData = Array.from({ length: 24 }, (_, i) => ({
		hour: `${String(i).padStart(2, '0')}:00`,
		efficiency: 60 + Math.random() * 30
	}));

	// Peak usage times
	const peakUsageData = [
		{ name: 'Morning (6-9)', value: 75, fill: '#fcd34d' },
		{ name: 'Day (9-17)', value: 95, fill: '#f59e0b' },
		{ name: 'Evening (17-22)', value: 100, fill: '#dc2626' },
		{ name: 'Night (22-6)', value: 45, fill: '#1d4ed8' }
	];

	// Weather impact data
	const weatherImpactData = [
		{ name: 'Mon', sunny: 80, cloudy: 40, rainy: 20 },
		{ name: 'Tue', sunny: 85, cloudy: 45, rainy: 25 },
		{ name: 'Wed', sunny: 90, cloudy: 50, rainy: 30 },
		{ name: 'Thu', sunny: 95, cloudy: 55, rainy: 35 },
		{ name: 'Fri', sunny: 100, cloudy: 60, rainy: 40 },
		{ name: 'Sat', sunny: 90, cloudy: 50, rainy: 30 },
		{ name: 'Sun', sunny: 80, cloudy: 40, rainy: 20 }
	];

	// Update live data
	useEffect(() => {
		const interval = setInterval(() => {
			setLiveData((prev) => {
				const newData = [...prev.slice(1)];
				const lastTime = parseInt(prev[prev.length - 1].time);
				const nextHour = (lastTime + 1) % 24;
				newData.push({
					time: `${String(nextHour).padStart(2, '0')}:00`,
					solar: Math.max(
						0,
						50 + Math.random() * 30 * Math.sin((Math.PI * (nextHour - 6)) / 12)
					),
					grid: 20 + Math.random() * 15,
					consumption: 30 + Math.random() * 25
				});
				return newData;
			});
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className='z-10'>
			<h1 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>
				Energy Analytics Dashboard
			</h1>

			{/* Live Metrics Grid */}
			<div className='mb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<MetricBox
					icon={Sun}
					label='Solar Generation'
					value='4.2 kW'
					subValue='Peak: 5.1 kW at 13:00'
					trend={12}
					color='bg-amber-500'
				/>
				<MetricBox
					icon={Leaf}
					label='Carbon Reduced'
					value='2.8 tons'
					subValue='This month'
					trend={15}
					color='bg-green-500'
				/>
				<MetricBox
					icon={DollarSign}
					label='Cost Savings'
					value='₹12,458'
					subValue='Monthly average'
					trend={8}
					color='bg-purple-500'
				/>
				<MetricBox
					icon={Battery}
					label='Battery Status'
					value='85%'
					subValue='4.2 kWh available'
					trend={5}
					color='bg-blue-500'
				/>
			</div>

			{/* Real-time Energy Flow */}
			<Card className=''>
				<CardHeader>
					<CardTitle className='text-gray-900 dark:text-gray-100'>
						Real-time Energy Flow
					</CardTitle>
				</CardHeader>
				<CardContent className='h-[400px]'>
					<ResponsiveContainer
						width='100%'
						height='100%'>
						<LineChart data={liveData}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='#e5e7eb dark:stroke-gray-700'
							/>
							<XAxis
								dataKey='time'
								stroke='#4b5563'
							/>
							<YAxis stroke='#4b5563' />
							<Tooltip
								contentStyle={{
									backgroundColor: '#fff ',
									border: '1px solid #e5e7eb'
								}}
							/>
							<Legend />
							<Line
								type='monotone'
								dataKey='solar'
								stroke='#f59e0b'
								name='Solar'
								dot={false}
							/>
							<Line
								type='monotone'
								dataKey='grid'
								stroke='#3b82f6'
								name='Grid'
								dot={false}
							/>
							<Line
								type='monotone'
								dataKey='consumption'
								stroke='#ef4444'
								name='Consumption'
								dot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Carbon Emissions Impact */}
			<Card>
				<CardHeader>
					<CardTitle className='text-gray-900 dark:text-white'>
						Carbon Emissions Reduction
					</CardTitle>
				</CardHeader>
				<CardContent className='h-[400px]'>
					<ResponsiveContainer
						width='100%'
						height='100%'>
						<AreaChart data={carbonData}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='#e5e7eb'
							/>
							<XAxis
								dataKey='month'
								stroke='#4b5563'
							/>
							<YAxis stroke='#4b5563' />
							<Tooltip
								contentStyle={{
									backgroundColor: '#fff ',
									border: '1px solid #e5e7eb '
								}}
							/>
							<Legend />
							<Area
								type='monotone'
								dataKey='baseline'
								stroke='#ef4444'
								fill='#fee2e2 '
								name='Baseline Emissions'
							/>
							<Area
								type='monotone'
								dataKey='reduced'
								stroke='#10b981'
								fill='#d1fae5 '
								name='Reduced Emissions'
							/>
						</AreaChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Cost Analysis */}
			<Card>
				<CardHeader>
					<CardTitle className='text-gray-900 dark:text-gray-100'>
						Cost Comparison
					</CardTitle>
				</CardHeader>
				<CardContent className='h-[400px]'>
					<ResponsiveContainer
						width='100%'
						height='100%'>
						<BarChart data={costData}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='#e5e7eb dark:stroke-gray-700'
							/>
							<XAxis
								dataKey='month'
								stroke='#4b5563'
							/>
							<YAxis stroke='#4b5563' />
							<Tooltip
								contentStyle={{
									backgroundColor: '#fff dark:bg-gray-800',
									border: '1px solid #e5e7eb dark:border-gray-700'
								}}
							/>
							<Legend />
							<Bar
								dataKey='withoutSolar'
								fill='#ef4444'
								name='Without Solar'
							/>
							<Bar
								dataKey='withSolar'
								fill='#10b981'
								name='With Solar'
							/>
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Energy Source Distribution and Peak Usage */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-gray-900 dark:text-gray-100'>
							Energy Source Distribution
						</CardTitle>
					</CardHeader>
					<CardContent className='h-[400px]'>
						<ResponsiveContainer
							width='100%'
							height='100%'>
							<PieChart>
								<Pie
									data={distributionData}
									cx='50%'
									cy='50%'
									innerRadius={60}
									outerRadius={80}
									paddingAngle={5}
									dataKey='value'
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: '#fff dark:bg-gray-800',
										border: '1px solid #e5e7eb dark:border-gray-700'
									}}
								/>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='text-gray-900 dark:text-gray-100'>
							Peak Usage Times
						</CardTitle>
					</CardHeader>
					<CardContent className='h-[400px]'>
						<ResponsiveContainer
							width='100%'
							height='100%'>
							<RadialBarChart
								cx='50%'
								cy='50%'
								innerRadius='20%'
								outerRadius='80%'
								data={peakUsageData}
								startAngle={180}
								endAngle={0}>
								<RadialBar
									minAngle={15}
									background
									clockWise={true}
									dataKey='value'
								/>
								<Legend />
								<Tooltip
									contentStyle={{
										backgroundColor: '#fff dark:bg-gray-800',
										border: '1px solid #e5e7eb dark:border-gray-700'
									}}
								/>
							</RadialBarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Weather Impact */}
			<Card>
				<CardHeader>
					<CardTitle className='text-gray-900 dark:text-gray-100'>
						Weather Impact on Solar Generation
					</CardTitle>
				</CardHeader>
				<CardContent className='h-[400px]'>
					<ResponsiveContainer
						width='100%'
						height='100%'>
						<BarChart data={weatherImpactData}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='#e5e7eb dark:stroke-gray-700'
							/>
							<XAxis
								dataKey='day'
								stroke='#4b5563'
							/>
							<YAxis stroke='#4b5563' />
							<Tooltip
								contentStyle={{
									backgroundColor: '#fff dark:bg-gray-800',
									border: '1px solid #e5e7eb dark:border-gray-700'
								}}
							/>
							<Legend />
							<Bar
								dataKey='sunny'
								fill='#f59e0b'
								name='Sunny'
							/>
							<Bar
								dataKey='cloudy'
								fill='#94a3b8'
								name='Cloudy'
							/>
							<Bar
								dataKey='rainy'
								fill='#3b82f6'
								name='Rainy'
							/>
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* System Efficiency */}
			<Card>
				<CardHeader>
					<CardTitle className='text-gray-900 dark:text-white'>
						24-Hour System Efficiency
					</CardTitle>
				</CardHeader>
				<CardContent className='h-[400px]'>
					<ResponsiveContainer
						width='100%'
						height='100%'>
						<AreaChart data={efficiencyData}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='#e5e7eb'
							/>
							<XAxis
								dataKey='hour'
								stroke='#4b5563'
							/>
							<YAxis stroke='#4b5563' />
							<Tooltip
								contentStyle={{
									backgroundColor: '#fff',
									border: '1px solid #e5e7eb '
								}}
							/>
							<Area
								type='monotone'
								dataKey='efficiency'
								stroke='#10b981'
								fill='#d1fae5'
								name='Efficiency %'
							/>
						</AreaChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</div>
	);
};

export default EnergyStatisticsExpanded;

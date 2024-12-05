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
	Wind,
	IndianRupee
} from 'lucide-react';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
	if (!active || !payload) return null;

	return (
		<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
			<p className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
				{label}
			</p>
			{payload.map((entry, index) => (
				<div
					key={index}
					className='flex items-center gap-2 text-sm'>
					<div
						className='w-3 h-3 rounded-full'
						style={{ backgroundColor: entry.color }}></div>
					<span className='text-gray-700 dark:text-gray-300'>
						{entry.name}:
					</span>
					<span className='font-medium text-gray-900 dark:text-gray-100'>
						{typeof entry.value === 'number'
							? entry.value.toLocaleString()
							: entry.value}
						{entry.name.toLowerCase().includes('efficiency') ? '%' : ''}
						{entry.name.toLowerCase().includes('cost') ? ' ₹' : ''}
					</span>
				</div>
			))}
		</div>
	);
};

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

// Real-time Energy Flow Component
const RealTimeEnergyFlow = ({ liveData }) => {
	const [showDetailedView, setShowDetailedView] = useState(false);
	const [activeTab, setActiveTab] = useState('daily');

	const generateDailyData = () => {
		return Array.from({ length: 24 }, (_, i) => ({
			hour: `${String(i).padStart(2, '0')}:00`,
			solar: Math.max(
				0,
				50 + Math.random() * 30 * Math.sin((Math.PI * (i - 6)) / 12)
			),
			grid: 20 + Math.random() * 15,
			consumption: 30 + Math.random() * 25
		}));
	};

	const generateWeeklyData = () => {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		return days.map((day) => ({
			day,
			solar: Math.floor(200 + Math.random() * 100),
			grid: Math.floor(150 + Math.random() * 80),
			consumption: Math.floor(300 + Math.random() * 150)
		}));
	};

	const generateMonthlyData = () => {
		return Array.from({ length: 30 }, (_, i) => ({
			date: i + 1,
			solar: Math.floor(180 + Math.random() * 120),
			grid: Math.floor(140 + Math.random() * 90),
			consumption: Math.floor(280 + Math.random() * 160)
		}));
	};

	const generateYearlyData = () => {
		const months = [
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
		];
		return months.map((month) => ({
			month,
			solar: Math.floor(2200 + Math.random() * 800),
			grid: Math.floor(1800 + Math.random() * 600),
			consumption: Math.floor(3500 + Math.random() * 1000)
		}));
	};

	const [detailedData] = useState({
		daily: generateDailyData(),
		weekly: generateWeeklyData(),
		monthly: generateMonthlyData(),
		yearly: generateYearlyData()
	});

	return (
		<>
			<Card
				className='w-full cursor-pointer'
				onClick={() => setShowDetailedView(true)}>
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
							<Tooltip content={<CustomTooltip />} />
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

			{showDetailedView && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6'>
					<div className='bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg w-full md:w-[80vw] h-[90vh] md:h-[80vh] overflow-y-auto'>
						<div className='flex justify-between mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2'>
							<h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>
								Detailed Energy Flow
							</h2>
							<button
								onClick={() => setShowDetailedView(false)}
								className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
								✕
							</button>
						</div>

						<div className='flex flex-wrap gap-2 md:gap-4 mb-4 overflow-x-auto'>
							{['daily', 'weekly', 'monthly', 'yearly'].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base whitespace-nowrap ${
										activeTab === tab
											? 'bg-blue-500 text-white'
											: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
									}`}>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							))}
						</div>

						<div className='h-[60vh] md:h-[calc(80vh-200px)]'>
							<ResponsiveContainer
								width='100%'
								height='100%'>
								<LineChart data={detailedData[activeTab]}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis
										dataKey={
											activeTab === 'daily'
												? 'hour'
												: activeTab === 'weekly'
												? 'day'
												: activeTab === 'monthly'
												? 'date'
												: 'month'
										}
									/>
									<YAxis />
									<Tooltip content={<CustomTooltip />} />
									<Legend />
									<Line
										type='monotone'
										dataKey='solar'
										stroke='#f59e0b'
										name='Solar'
									/>
									<Line
										type='monotone'
										dataKey='grid'
										stroke='#3b82f6'
										name='Grid'
									/>
									<Line
										type='monotone'
										dataKey='consumption'
										stroke='#ef4444'
										name='Consumption'
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

// Carbon Emissions Component
const CarbonEmissions = ({ carbonData }) => (
	<Card className='w-full'>
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
					<Tooltip content={<CustomTooltip />} />
					<Legend />
					<Area
						type='monotone'
						dataKey='baseline'
						stroke='#ef4444'
						fill='#fee2e2'
						name='Baseline Emissions'
					/>
					<Area
						type='monotone'
						dataKey='reduced'
						stroke='#10b981'
						fill='#d1fae5'
						name='Reduced Emissions'
					/>
				</AreaChart>
			</ResponsiveContainer>
		</CardContent>
	</Card>
);

// Cost Analysis Component
const CostAnalysis = ({ costData }) => {
	const [showDetailedView, setShowDetailedView] = useState(false);
	const [activeTab, setActiveTab] = useState('daily');

	// Generate random data for different time periods
	const generateDailyData = () => {
		return Array.from({ length: 24 }, (_, i) => ({
			time: `${String(i).padStart(2, '0')}:00`,
			withSolar: Math.floor(100 + Math.random() * 50),
			withoutSolar: Math.floor(200 + Math.random() * 100)
		}));
	};

	const generateWeeklyData = () => {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		return Array.from({ length: 7 }, (_, i) => ({
			day: days[i],
			withSolar: Math.floor(800 + Math.random() * 200),
			withoutSolar: Math.floor(1500 + Math.random() * 300)
		}));
	};

	const generateMonthlyData = () => {
		return Array.from({ length: 30 }, (_, i) => ({
			date: i + 1,
			withSolar: Math.floor(2000 + Math.random() * 500),
			withoutSolar: Math.floor(3500 + Math.random() * 1000)
		}));
	};

	const generateYearlyData = () => {
		const months = [
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
		];
		return Array.from({ length: 12 }, (_, i) => ({
			month: months[i],
			withSolar: Math.floor(25000 + Math.random() * 5000),
			withoutSolar: Math.floor(45000 + Math.random() * 10000)
		}));
	};

	const [detailedData, setDetailedData] = useState({
		daily: generateDailyData(),
		weekly: generateWeeklyData(),
		monthly: generateMonthlyData(),
		yearly: generateYearlyData()
	});

	const handleCardClick = () => {
		setShowDetailedView(true);
	};

	return (
		<>
			<Card
				className='cursor-pointer w-full'
				onClick={handleCardClick}>
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
							<Tooltip content={<CustomTooltip />} />
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

			{showDetailedView && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-0'>
					<div className='bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg w-full md:w-[80vw] h-[90vh] md:h-[80vh] overflow-y-auto'>
						<div className='flex justify-between mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2'>
							<h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>
								Detailed Cost Analysis
							</h2>
							<button
								onClick={() => setShowDetailedView(false)}
								className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2'>
								✕
							</button>
						</div>

						<div className='flex flex-wrap gap-2 md:gap-4 mb-4 overflow-x-auto'>
							{['daily', 'weekly', 'monthly', 'yearly'].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base whitespace-nowrap ${
										activeTab === tab
											? 'bg-blue-500 text-white'
											: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
									}`}>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							))}
						</div>

						<div className='h-[60vh] md:h-[calc(80vh-200px)]'>
							<ResponsiveContainer
								width='100%'
								height='100%'>
								<BarChart data={detailedData[activeTab]}>
									<CartesianGrid
										strokeDasharray='3 3'
										stroke='#e5e7eb'
									/>
									<XAxis
										dataKey={
											activeTab === 'daily'
												? 'time'
												: activeTab === 'weekly'
												? 'day'
												: activeTab === 'monthly'
												? 'date'
												: 'month'
										}
										stroke='#4b5563'
									/>
									<YAxis stroke='#4b5563' />
									<Tooltip content={<CustomTooltip />} />
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
						</div>
					</div>
				</div>
			)}
		</>
	);
};

// Weather Impact Component
const WeatherImpact = ({ weatherImpactData }) => (
	<Card className='w-full'>
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
						dataKey='name'
						stroke='#4b5563'
					/>
					<YAxis stroke='#4b5563' />
					<Tooltip content={<CustomTooltip />} />
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
);

// Energy Distribution Component
const EnergyDistribution = ({ distributionData }) => {
	const [showDetailedView, setShowDetailedView] = useState(false);
	const [activeTab, setActiveTab] = useState('daily');

	// Generate random data for different time periods
	const generateDailyData = () => {
		return Array.from({ length: 24 }, (_, i) => ({
			hour: `${String(i).padStart(2, '0')}:00`,
			solar: Math.floor(40 + Math.random() * 30),
			grid: Math.floor(20 + Math.random() * 20),
			battery: Math.floor(10 + Math.random() * 25)
		}));
	};

	const generateWeeklyData = () => {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		return days.map((day) => ({
			day,
			solar: Math.floor(35 + Math.random() * 35),
			grid: Math.floor(15 + Math.random() * 25),
			battery: Math.floor(15 + Math.random() * 20)
		}));
	};

	const generateMonthlyData = () => {
		return Array.from({ length: 30 }, (_, i) => ({
			date: `Day ${i + 1}`,
			solar: Math.floor(30 + Math.random() * 40),
			grid: Math.floor(20 + Math.random() * 20),
			battery: Math.floor(10 + Math.random() * 30)
		}));
	};

	const generateYearlyData = () => {
		const months = [
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
		];
		return months.map((month) => ({
			month,
			solar: Math.floor(25 + Math.random() * 45),
			grid: Math.floor(15 + Math.random() * 25),
			battery: Math.floor(15 + Math.random() * 25)
		}));
	};

	const detailedData = {
		daily: generateDailyData(),
		weekly: generateWeeklyData(),
		monthly: generateMonthlyData(),
		yearly: generateYearlyData()
	};

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle className='text-gray-900 dark:text-gray-100'>
					Energy Source Distribution
				</CardTitle>
			</CardHeader>
			<CardContent
				className='h-[400px] cursor-pointer'
				onClick={() => setShowDetailedView(true)}>
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
						<Tooltip content={<CustomTooltip />} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>

			{showDetailedView && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6'>
					<div className='bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg w-full md:w-[80vw] h-[90vh] md:h-[80vh] overflow-y-auto'>
						<div className='flex justify-between mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2'>
							<h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>
								Detailed Energy Distribution
							</h2>
							<button
								onClick={() => setShowDetailedView(false)}
								className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
								✕
							</button>
						</div>

						<div className='flex flex-wrap gap-2 md:gap-4 mb-4 overflow-x-auto'>
							{['daily', 'weekly', 'monthly', 'yearly'].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base whitespace-nowrap ${
										activeTab === tab
											? 'bg-blue-500 text-white'
											: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
									}`}>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							))}
						</div>

						<div className='h-[60vh] md:h-[calc(80vh-200px)]'>
							<ResponsiveContainer
								width='100%'
								height='100%'>
								<BarChart data={detailedData[activeTab]}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis
										dataKey={
											activeTab === 'daily'
												? 'hour'
												: activeTab === 'weekly'
												? 'day'
												: activeTab === 'monthly'
												? 'date'
												: 'month'
										}
									/>
									<YAxis />
									<Tooltip content={<CustomTooltip />} />
									<Legend />
									<Bar
										dataKey='solar'
										fill='#f59e0b'
										name='Solar'
									/>
									<Bar
										dataKey='grid'
										fill='#3b82f6'
										name='Grid'
									/>
									<Bar
										dataKey='battery'
										fill='#10b981'
										name='Battery'
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			)}
		</Card>
	);
};

// Peak Usage Component
const PeakUsage = ({ peakUsageData }) => (
	<Card className='w-full'>
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
					<Tooltip content={<CustomTooltip />} />
				</RadialBarChart>
			</ResponsiveContainer>
		</CardContent>
	</Card>
);

// System Efficiency Component
const SystemEfficiency = ({ efficiencyData }) => {
	const [showDetailedView, setShowDetailedView] = useState(false);
	const [activeTab, setActiveTab] = useState('daily');

	// Generate random data for different time periods
	const generateDailyData = () => {
		return Array.from({ length: 24 }, (_, i) => ({
			hour: `${String(i).padStart(2, '0')}:00`,
			efficiency: Math.floor(75 + Math.random() * 20)
		}));
	};

	const generateWeeklyData = () => {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		return Array.from({ length: 7 }, (_, i) => ({
			day: days[i],
			efficiency: Math.floor(70 + Math.random() * 25)
		}));
	};

	const generateMonthlyData = () => {
		return Array.from({ length: 30 }, (_, i) => ({
			date: i + 1,
			efficiency: Math.floor(65 + Math.random() * 30)
		}));
	};

	const generateYearlyData = () => {
		const months = [
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
		];
		return Array.from({ length: 12 }, (_, i) => ({
			month: months[i],
			efficiency: Math.floor(60 + Math.random() * 35)
		}));
	};

	const [detailedData, setDetailedData] = useState({
		daily: generateDailyData(),
		weekly: generateWeeklyData(),
		monthly: generateMonthlyData(),
		yearly: generateYearlyData()
	});

	const handleCardClick = () => {
		setShowDetailedView(true);
	};

	return (
		<>
			<Card
				className='cursor-pointer'
				onClick={handleCardClick}>
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
							<Tooltip content={<CustomTooltip />} />
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

			{showDetailedView && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-0'>
					<div className='bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg w-full md:w-[80vw] h-[90vh] md:h-[80vh] overflow-y-auto'>
						<div className='flex justify-between mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2'>
							<h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>
								Detailed System Efficiency
							</h2>
							<button
								onClick={() => setShowDetailedView(false)}
								className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2'>
								✕
							</button>
						</div>

						<div className='flex flex-wrap gap-2 md:gap-4 mb-4 overflow-x-auto'>
							{['daily', 'weekly', 'monthly', 'yearly'].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base whitespace-nowrap ${
										activeTab === tab
											? 'bg-blue-500 text-white'
											: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
									}`}>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							))}
						</div>

						<div className='h-[60vh] md:h-[calc(80vh-200px)]'>
							<ResponsiveContainer
								width='100%'
								height='100%'>
								<AreaChart
									data={detailedData[activeTab]}
									margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis
										dataKey={
											activeTab === 'daily'
												? 'hour'
												: activeTab === 'weekly'
												? 'day'
												: activeTab === 'monthly'
												? 'date'
												: 'month'
										}
										tick={{ fontSize: 12 }}
										interval={'preserveStartEnd'}
									/>
									<YAxis
										tick={{ fontSize: 12 }}
										width={30}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Area
										type='monotone'
										dataKey='efficiency'
										stroke='#10b981'
										fill='#d1fae5'
										name='Efficiency %'
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

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
			<div className='mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
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
					icon={IndianRupee}
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

			{/* Real-time and Carbon Emissions */}
			<ScrollArea className='w-full mb-8'>
				<div
					className='flex gap-4 pb-4'
					style={{ width: '200%' }}>
					<RealTimeEnergyFlow liveData={liveData} />
					<CarbonEmissions carbonData={carbonData} />
				</div>
			</ScrollArea>

			{/* Cost and Weather Impact */}
			<ScrollArea className='w-full mb-8'>
				<div
					className='flex gap-4 pb-4'
					style={{ width: '200%' }}>
					<CostAnalysis costData={costData} />
					<WeatherImpact weatherImpactData={weatherImpactData} />
				</div>
			</ScrollArea>

			{/* Distribution and Peak Usage */}
			<ScrollArea className='w-full mb-8'>
				<div
					className='flex gap-4 pb-4'
					style={{ width: '200%' }}>
					<EnergyDistribution distributionData={distributionData} />
					<PeakUsage peakUsageData={peakUsageData} />
				</div>
			</ScrollArea>

			{/* System Efficiency */}
			<SystemEfficiency efficiencyData={efficiencyData} />
		</div>
	);
};

export default EnergyStatisticsExpanded;

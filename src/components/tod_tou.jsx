'use client';
import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Sun, Play, Pause } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';

// Generate TOD data for past 24 hours
const generateTODData = (baseTime = new Date()) => {
	const data = [];
	for (let i = 23; i >= 0; i--) {
		const time = new Date(baseTime);
		time.setHours(time.getHours() - i);

		const hour = time.getHours();
		const isPeak = hour >= 9 && hour <= 17;
		const isSolar = hour >= 10 && hour <= 16;

		data.push({
			time: time.toISOString(),
			peak: isPeak ? 16.8 + Math.random() : 14.0 + Math.random(),
			solar: isSolar ? 11.2 + Math.random() : 13.5 + Math.random(),
			normal: 13.5 + Math.random()
		});
	}
	return data;
};

// Generate TOU data for past 24 hours
const generateTOUData = (baseTime = new Date()) => {
	const data = [];
	for (let i = 23; i >= 0; i--) {
		const time = new Date(baseTime);
		time.setHours(time.getHours() - i);

		const hour = time.getHours();
		data.push({
			time: time.toISOString(),
			residential: 11.4 + Math.random(),
			commercial: 13.3 + Math.random(),
			industrial: 17.4 + Math.random()
		});
	}
	return data;
};

// Function to update rates
const updateRates = (currentData, type) => {
	const currentTime = new Date();
	const newDataPoint =
		type === 'tod'
			? {
					time: currentTime.toISOString(),
					peak: 16.8 + Math.random(),
					solar: 11.2 + Math.random(),
					normal: 13.5 + Math.random()
			  }
			: {
					time: currentTime.toISOString(),
					residential: 11.4 + Math.random(),
					commercial: 13.3 + Math.random(),
					industrial: 17.4 + Math.random()
			  };

	return [...currentData.slice(1), newDataPoint];
};

const todConfig = {
	peak: {
		label: 'Peak Hours',
		color: 'hsl(0, 84%, 60%)'
	},
	solar: {
		label: 'Solar Hours',
		color: 'hsl(142, 76%, 36%)'
	},
	normal: {
		label: 'Normal Hours',
		color: 'hsl(48, 96%, 53%)'
	}
};

const touConfig = {
	residential: {
		label: 'Residential (₹/kWh)',
		color: 'hsl(271, 91%, 65%)'
	},
	commercial: {
		label: 'Commercial (₹/kWh)',
		color: 'hsl(199, 89%, 48%)'
	},
	industrial: {
		label: 'Industrial (₹/kWh)',
		color: 'hsl(339, 90%, 51%)'
	}
};

export function LiveEnergyRates() {
	const [viewMode, setViewMode] = useState('tod');
	const [isLive, setIsLive] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [todData, setTODData] = useState(generateTODData());
	const [touData, setTOUData] = useState(generateTOUData());
	const chartRef = useRef(null);

	const currentData = viewMode === 'tod' ? todData : touData;
	const currentConfig = viewMode === 'tod' ? todConfig : touConfig;

	useEffect(() => {
		let interval;
		if (isLive) {
			interval = setInterval(() => {
				setTODData((prev) => updateRates(prev, 'tod'));
				setTOUData((prev) => updateRates(prev, 'tou'));
				setCurrentTime(new Date());

				// Auto-scroll to show latest data
				if (chartRef.current) {
					const scrollWidth = chartRef.current.scrollWidth;
					chartRef.current.scrollLeft = scrollWidth;
				}
			}, 3000);
		}
		return () => clearInterval(interval);
	}, [isLive]);

	// Ensure current time is visible on component mount and view mode change
	useEffect(() => {
		if (chartRef.current) {
			const scrollWidth = chartRef.current.scrollWidth;
			chartRef.current.scrollLeft = scrollWidth;
		}
	}, [viewMode]);

	return (
		<Card className='m-2'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
				<div>
					<CardTitle className='flex items-center gap-2'>
						{viewMode === 'tod' ? 'Time of Day' : 'Time of Use'} Rates
					</CardTitle>
					<CardDescription>
						Live rates for {currentTime.toLocaleDateString()}
					</CardDescription>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='secondary'
						onClick={() => setIsLive(!isLive)}
						size='sm'
						className='flex items-center gap-2'>
						{isLive ? (
							<Pause className='h-4 w-4' />
						) : (
							<Play className='h-4 w-4' />
						)}
						{isLive ? 'Pause' : 'Live'}
					</Button>
					<Button
						variant='secondary'
						onClick={() => setViewMode(viewMode === 'tod' ? 'tou' : 'tod')}
						size='sm'>
						{viewMode === 'tod' ? 'TOU' : 'TOD'}
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div
					className='overflow-x-auto pb-4'
					ref={chartRef}>
					<ChartContainer
						config={currentConfig}
						className='min-w-[800px] h-[300px]'>
						<LineChart
							data={currentData}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 10
							}}>
							<CartesianGrid
								strokeDasharray='3 3'
								vertical={false}
								stroke='currentColor'
								opacity={0.1}
							/>
							<XAxis
								dataKey='time'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={40}
								stroke='currentColor'
								tickFormatter={(value) => {
									const date = new Date(value);
									return date.toLocaleTimeString('en-US', {
										hour: '2-digit',
										minute: '2-digit'
									});
								}}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								stroke='currentColor'
								tickFormatter={(value) => `₹${value.toFixed(1)}`}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										labelFormatter={(value) => {
											const date = new Date(value);
											return date.toLocaleTimeString('en-US', {
												hour: '2-digit',
												minute: '2-digit'
											});
										}}
									/>
								}
							/>
							{Object.keys(currentConfig).map((key) => (
								<Line
									key={key}
									type='monotone'
									dataKey={key}
									stroke={`var(--color-${key})`}
									strokeWidth={2}
									dot={false}
								/>
							))}
						</LineChart>
					</ChartContainer>
				</div>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'>
				{viewMode === 'tod' ? (
					<>
						<div className='flex gap-2 font-medium leading-none'>
							Current Time: {currentTime.toLocaleTimeString()}{' '}
							<Sun className='h-4 w-4' />
						</div>
						<div className='leading-none text-muted-foreground'>
							Rates adjust based on peak demand and solar availability
						</div>
					</>
				) : (
					<>
						<div className='flex gap-2 font-medium leading-none'>
							Current Time: {currentTime.toLocaleTimeString()}{' '}
							<TrendingUp className='h-4 w-4' />
						</div>
						<div className='leading-none text-muted-foreground'>
							Showing live TOU electricity rates in ₹/kWh
						</div>
					</>
				)}
			</CardFooter>
		</Card>
	);
}

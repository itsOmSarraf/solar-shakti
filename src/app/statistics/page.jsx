'use client';

import { useState, Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import StatisticsPage from './Statistics';
import PredictionsPage from './Predictions';
import {
	BarChart2,
	BrainCircuit,
	Activity,
	Zap,
	AlertCircle
} from 'lucide-react';

// Loading placeholder component
const PageSkeleton = () => (
	<div className='w-full p-2 space-y-4'>
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
			{[...Array(4)].map((_, i) => (
				<Card
					key={i}
					className='p-3'>
					<Skeleton className='h-4 w-28 mb-2' />
					<Skeleton className='h-8 w-36' />
				</Card>
			))}
		</div>
		<Card className='p-3'>
			<Skeleton className='h-96 w-full' />
		</Card>
	</div>
);

export default function EnergyDashboard() {
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState('statistics');

	const systemStatus = {
		status: 'optimal',
		solarEfficiency: 95,
		alerts: 0
	};

	const handleTabChange = (value) => {
		setIsLoading(true);
		setActiveTab(value);
		setTimeout(() => setIsLoading(false), 500);
	};

	return (
		<div className='bg-gray-50/50 dark:bg-gray-900/50'>
			{/* Header Section */}
			<div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
				<div className='px-3 py-2'>
					<div className='flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center max-w-[1800px] mx-auto'>
						{/* Left side */}
						<div className='flex items-center gap-2'>
							<h1 className='text-xl font-bold text-gray-900 dark:text-white'>
								Energy Dashboard
							</h1>
							<Badge
								variant={
									systemStatus.status === 'optimal' ? 'success' : 'warning'
								}
								className='flex items-center gap-1 px-2 py-0.5'>
								<Activity className='w-3.5 h-3.5' />
								{systemStatus.status === 'optimal'
									? 'System Optimal'
									: 'Needs Attention'}
							</Badge>
						</div>

						{/* Right side */}
						<div className='flex items-center gap-2 ml-auto'>
							<Badge
								variant='outline'
								className='flex items-center gap-1.5 px-2 py-0.5 dark:border-gray-600'>
								<Zap className='w-3.5 h-3.5 text-amber-500' />
								<span className='text-sm dark:text-gray-200'>
									Solar Efficiency: {systemStatus.solarEfficiency}%
								</span>
							</Badge>
							{systemStatus.alerts > 0 && (
								<Badge
									variant='destructive'
									className='flex items-center gap-1.5 px-2 py-0.5'>
									<AlertCircle className='w-3.5 h-3.5' />
									<span>{systemStatus.alerts} Alerts</span>
								</Badge>
							)}
						</div>
					</div>
				</div>

				{/* Tabs Navigation and Content */}
				<div className='w-full flex mx-auto px-3'>
					<Tabs
						defaultValue='statistics'
						className='w-full'
						onValueChange={handleTabChange}>
						<TabsList className='w-full flex h-12 justify-between bg-transparent'>
							<TabsTrigger
								value='statistics'
								className={`relative flex items-center gap-1.5 px-4 py-2 transition-all ${
									activeTab === 'statistics'
										? 'text-green-600 dark:text-green-400'
										: 'text-gray-500 dark:text-gray-400'
								}`}>
								<BarChart2 className='w-4 h-4' />
								<span className='text-sm font-medium'>Statistics</span>
								<div
									className={`absolute -bottom-px left-0 right-0 h-0.5 ${
										activeTab === 'statistics'
											? 'bg-green-600 dark:bg-green-400'
											: 'hidden'
									}`}
								/>
							</TabsTrigger>
							<TabsTrigger
								value='predictions'
								className={`relative flex items-center gap-1.5 px-4 py-2 transition-all ${
									activeTab === 'predictions'
										? 'text-blue-600 dark:text-blue-400'
										: 'text-gray-500 dark:text-gray-400'
								}`}>
								<BrainCircuit className='w-4 h-4' />
								<span className='text-sm font-medium'>AI Predictions</span>
								<div
									className={`absolute -bottom-px left-0 right-0 h-0.5 ${
										activeTab === 'predictions'
											? 'bg-blue-600 dark:bg-blue-400'
											: 'hidden'
									}`}
								/>
								<Badge
									variant='secondary'
									className='ml-1.5 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-1.5 py-0.5 text-xs'>
									AI
								</Badge>
							</TabsTrigger>
						</TabsList>

						{/* Main Content */}
						<main className='max-w-[1800px] mx-auto'>
							<Suspense fallback={<PageSkeleton />}>
								{isLoading ? (
									<PageSkeleton />
								) : (
									<div className='px-3 py-4'>
										<TabsContent
											value='statistics'
											className={`mt-0 animate-in fade-in-50 slide-in-from-left-1/4 ${
												activeTab === 'statistics' ? 'opacity-100' : 'opacity-0'
											}`}>
											<StatisticsPage />
										</TabsContent>

										<TabsContent
											value='predictions'
											className={`mt-0 animate-in fade-in-50 slide-in-from-right-1/4 ${
												activeTab === 'predictions'
													? 'opacity-100'
													: 'opacity-0'
											}`}>
											<PredictionsPage />
										</TabsContent>
									</div>
								)}
							</Suspense>
						</main>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

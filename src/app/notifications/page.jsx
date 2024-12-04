'use client';
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	AlertCircle,
	Sun,
	Battery,
	DollarSign,
	Zap,
	Trash2,
	Waves,
	BellOff,
	Check,
	Timer,
	XCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Generate random timestamps within the last 24 hours
const getRandomTimestamp = () => {
	const now = new Date();
	const hourOffset = Math.floor(Math.random() * 24);
	const minuteOffset = Math.floor(Math.random() * 60);
	now.setHours(now.getHours() - hourOffset);
	now.setMinutes(now.getMinutes() - minuteOffset);
	return now;
};

// Notification types with their respective icons and colors
const notificationTypes = {
	SOLAR_PRODUCTION: {
		icon: Sun,
		color: 'text-amber-500',
		bgColor: 'bg-amber-50'
	},
	ENERGY_USAGE: { icon: Zap, color: 'text-blue-500', bgColor: 'bg-blue-50' },
	COST_ALERT: {
		icon: DollarSign,
		color: 'text-green-500',
		bgColor: 'bg-green-50'
	},
	DEVICE_ALERT: {
		icon: AlertCircle,
		color: 'text-red-500',
		bgColor: 'bg-red-50'
	},
	BATTERY: { icon: Battery, color: 'text-purple-500', bgColor: 'bg-purple-50' },
	SCHEDULE: { icon: Timer, color: 'text-indigo-500', bgColor: 'bg-indigo-50' }
};

// Generate initial notifications
const generateNotifications = () => {
	const notifications = [
		{
			id: 1,
			type: 'SOLAR_PRODUCTION',
			title: 'Peak Solar Production',
			message:
				'Your solar panels are operating at peak efficiency. Current production: 3.2kW',
			timestamp: getRandomTimestamp(),
			isRead: false
		},
		{
			id: 2,
			type: 'ENERGY_USAGE',
			title: 'High Energy Usage Alert',
			message: 'AC consumption has increased by 30% in the last hour',
			timestamp: getRandomTimestamp(),
			isRead: false
		},
		{
			id: 3,
			type: 'COST_ALERT',
			title: 'Cost Saving Opportunity',
			message:
				'Switch to solar power now to save ₹120 on your current energy usage',
			timestamp: getRandomTimestamp(),
			isRead: true
		},
		{
			id: 4,
			type: 'DEVICE_ALERT',
			title: 'Device Maintenance Required',
			message:
				'Water heater showing unusual power consumption patterns. Inspection recommended.',
			timestamp: getRandomTimestamp(),
			isRead: false
		},
		{
			id: 5,
			type: 'BATTERY',
			title: 'Battery Storage Full',
			message:
				'Home battery at 100%. Excess solar power being redirected to grid.',
			timestamp: getRandomTimestamp(),
			isRead: false
		},
		{
			id: 6,
			type: 'SCHEDULE',
			title: 'Scheduled Task Complete',
			message: 'Washing machine cycle completed using 100% solar power',
			timestamp: getRandomTimestamp(),
			isRead: true
		}
	];

	// Sort by timestamp
	return notifications.sort((a, b) => b.timestamp - a.timestamp);
};

const NotificationCard = ({ notification, onDelete, onMarkAsRead }) => {
	const typeInfo = notificationTypes[notification.type];
	const IconComponent = typeInfo.icon;

	return (
		<Alert
			className={`mb-3 ${typeInfo.bgColor} border-l-4 ${
				notification.isRead ? 'opacity-70' : ''
			}`}
			style={{ borderLeftColor: typeInfo.color.replace('text', 'rgb') }}>
			<IconComponent className={`h-4 w-4 ${typeInfo.color}`} />
			<AlertTitle className='flex justify-between items-center'>
				<span className='font-semibold'>{notification.title}</span>
				<div className='flex items-center gap-2'>
					{!notification.isRead && (
						<Button
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() => onMarkAsRead(notification.id)}>
							<Check className='h-4 w-4' />
						</Button>
					)}
					<Button
						variant='ghost'
						size='icon'
						className='h-8 w-8 text-gray-500 hover:text-red-500'
						onClick={() => onDelete(notification.id)}>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</AlertTitle>
			<AlertDescription>
				<p className='text-sm mt-1'>{notification.message}</p>
				<p className='text-xs text-gray-500 mt-1'>
					{new Date(notification.timestamp).toLocaleString()}
				</p>
			</AlertDescription>
		</Alert>
	);
};

const NotificationsPage = () => {
	const [notifications, setNotifications] = useState(generateNotifications());

	const handleDelete = (id) => {
		setNotifications(notifications.filter((notif) => notif.id !== id));
	};

	const handleClearAll = () => {
		setNotifications([]);
	};

	const handleMarkAsRead = (id) => {
		setNotifications(
			notifications.map((notif) =>
				notif.id === id ? { ...notif, isRead: true } : notif
			)
		);
	};

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return (
		<div className='min-h-screen bg-gray-50 p-4'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-bold'>Notifications</h1>
				<div className='flex gap-2'>
					{unreadCount > 0 && (
						<Button
							variant='outline'
							size='sm'
							onClick={() =>
								setNotifications(
									notifications.map((n) => ({ ...n, isRead: true }))
								)
							}
							className='flex items-center gap-1'>
							<Check className='h-4 w-4' />
							Mark all read
						</Button>
					)}
					<Button
						variant='outline'
						size='sm'
						onClick={handleClearAll}
						className='flex items-center gap-1 text-red-500 hover:text-red-600'>
						<XCircle className='h-4 w-4' />
						Clear all
					</Button>
				</div>
			</div>

			{notifications.length === 0 ? (
				<Card className='mt-8'>
					<CardContent className='flex flex-col items-center justify-center py-8'>
						<BellOff className='h-12 w-12 text-gray-400 mb-2' />
						<p className='text-gray-500 text-center'>No notifications</p>
					</CardContent>
				</Card>
			) : (
				<ScrollArea className='h-[calc(100vh-120px)]'>
					{notifications.map((notification) => (
						<NotificationCard
							key={notification.id}
							notification={notification}
							onDelete={handleDelete}
							onMarkAsRead={handleMarkAsRead}
						/>
					))}
				</ScrollArea>
			)}
		</div>
	);
};

export default NotificationsPage;

'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	Bell,
	Moon,
	Sun,
	Smartphone,
	Settings2,
	User,
	Battery,
	DollarSign,
	Zap,
	Shield,
	HardDrive,
	Wifi,
	Languages,
	LogOut,
	ChevronRight
} from 'lucide-react';
import { useTheme } from 'next-themes';

// Settings Section Component
const SettingsSection = ({ title, children }) => (
	<div className='mb-6'>
		<h2 className='text-lg font-semibold mb-4 px-4 text-gray-900 dark:text-gray-100'>
			{title}
		</h2>
		<div className='space-y-2'>{children}</div>
	</div>
);

// Settings Item Component
const SettingsItem = ({
	icon: Icon,
	label,
	children,
	onClick,
	showArrow = false
}) => (
	<Card
		className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
		onClick={onClick}>
		<CardContent className='p-4'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<Icon className='w-5 h-5 text-gray-500 dark:text-gray-400' />
					<span className='text-gray-900 dark:text-gray-100'>{label}</span>
				</div>
				<div className='flex items-center gap-2'>
					{children}
					{showArrow && (
						<ChevronRight className='w-4 h-4 text-gray-400 dark:text-gray-500' />
					)}
				</div>
			</div>
		</CardContent>
	</Card>
);

const SettingsPage = () => {
	const { theme, setTheme } = useTheme();
	// State management for various settings
	const [notifications, setNotifications] = useState({
		push: true,
		email: false,
		usageAlerts: true,
		savingsReport: true,
		maintenance: true
	});

	const [preferences, setPreferences] = useState({
		theme: 'light',
		language: 'english',
		currency: 'inr',
		autoOptimize: true,
		offlineMode: false
	});

	const [energy, setEnergy] = useState({
		peakHourAlerts: true,
		solarPriority: true,
		batteryLimit: '85',
		gridBackup: true
	});

	const handleLogout = () => {
		// Implement logout logic
		console.log('Logging out...');
	};

	const clearCache = () => {
		// Implement cache clearing logic
		console.log('Clearing cache...');
	};

	return (
		<ScrollArea className='h-screen'>
			<div className='pb-6'>
				{/* Profile Section */}
				<div className='bg-green-50 dark:bg-green-900/20 p-4 mb-6'>
					<div className='flex items-center gap-4'>
						<div className='w-16 h-16 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center'>
							<User className='w-8 h-8 text-green-600 dark:text-green-400' />
						</div>
						<div>
							<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
								Naman Makkar
							</h2>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								naman.makkar@example.com
							</p>
							<p className='text-xs text-green-600 dark:text-green-400'>
								Premium Member
							</p>
						</div>
					</div>
				</div>

				{/* Notification Settings */}
				<SettingsSection title='Notifications'>
					<SettingsItem
						icon={Bell}
						label='Push Notifications'>
						<Switch
							checked={notifications.push}
							onCheckedChange={(checked) =>
								setNotifications((prev) => ({ ...prev, push: checked }))
							}
						/>
					</SettingsItem>
					<SettingsItem
						icon={Zap}
						label='Usage Alerts'>
						<Switch
							checked={notifications.usageAlerts}
							onCheckedChange={(checked) =>
								setNotifications((prev) => ({ ...prev, usageAlerts: checked }))
							}
						/>
					</SettingsItem>
					<SettingsItem
						icon={DollarSign}
						label='Savings Reports'>
						<Switch
							checked={notifications.savingsReport}
							onCheckedChange={(checked) =>
								setNotifications((prev) => ({
									...prev,
									savingsReport: checked
								}))
							}
						/>
					</SettingsItem>
				</SettingsSection>

				{/* Energy Preferences */}
				<SettingsSection title='Energy Management'>
					<SettingsItem
						icon={Sun}
						label='Solar Priority Mode'>
						<Switch
							checked={energy.solarPriority}
							onCheckedChange={(checked) =>
								setEnergy((prev) => ({ ...prev, solarPriority: checked }))
							}
						/>
					</SettingsItem>
					<SettingsItem
						icon={Battery}
						label='Battery Limit'>
						<Select
							value={energy.batteryLimit}
							onValueChange={(value) =>
								setEnergy((prev) => ({ ...prev, batteryLimit: value }))
							}>
							<SelectTrigger className='w-24'>
								<SelectValue placeholder='Select' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='75'>75%</SelectItem>
								<SelectItem value='85'>85%</SelectItem>
								<SelectItem value='90'>90%</SelectItem>
								<SelectItem value='95'>95%</SelectItem>
							</SelectContent>
						</Select>
					</SettingsItem>
					<SettingsItem
						icon={Zap}
						label='Grid Backup'>
						<Switch
							checked={energy.gridBackup}
							onCheckedChange={(checked) =>
								setEnergy((prev) => ({ ...prev, gridBackup: checked }))
							}
						/>
					</SettingsItem>
				</SettingsSection>

				{/* App Preferences */}
				<SettingsSection title='App Preferences'>
					<SettingsItem
						icon={Moon}
						label='Dark Mode'>
						<Switch
							checked={theme === 'dark'}
							onCheckedChange={(checked) =>
								setTheme(checked ? 'dark' : 'light')
							}
						/>
					</SettingsItem>
					<SettingsItem
						icon={Languages}
						label='Language'>
						<Select
							value={preferences.language}
							onValueChange={(value) =>
								setPreferences((prev) => ({ ...prev, language: value }))
							}>
							<SelectTrigger className='w-24'>
								<SelectValue placeholder='Select' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='english'>English</SelectItem>
								<SelectItem value='hindi'>Hindi</SelectItem>
								<SelectItem value='gujarati'>Gujarati</SelectItem>
							</SelectContent>
						</Select>
					</SettingsItem>
					<SettingsItem
						icon={Wifi}
						label='Offline Mode'>
						<Switch
							checked={preferences.offlineMode}
							onCheckedChange={(checked) =>
								setPreferences((prev) => ({ ...prev, offlineMode: checked }))
							}
						/>
					</SettingsItem>
				</SettingsSection>

				{/* Data & Security */}
				<SettingsSection title='Data & Security'>
					<SettingsItem
						icon={Shield}
						label='Security Settings'
						showArrow
						onClick={() => console.log('Navigate to security settings')}
					/>
					<SettingsItem
						icon={HardDrive}
						label='Clear Cache'
						onClick={clearCache}
						showArrow
					/>
				</SettingsSection>

				{/* Account Actions */}
				<div className='px-4'>
					<Button
						variant='destructive'
						className='w-full flex items-center gap-2'
						onClick={handleLogout}>
						<LogOut className='w-4 h-4' />
						Log Out
					</Button>
				</div>
			</div>
		</ScrollArea>
	);
};

export default SettingsPage;

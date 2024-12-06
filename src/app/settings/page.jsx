'use client';
import React, { useState, useEffect } from 'react';
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
	ChevronRight,
	Signal,
	Activity
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { saveAs } from 'file-saver';

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

	// WiFi connection state
	const [wifiDetails, setWifiDetails] = useState(null);

	// Get WiFi details from device
	useEffect(() => {
		const getWifiDetails = async () => {
			try {
				// Check if Network Information API is available
				if ('connection' in navigator) {
					const connection = navigator.connection;

					// Get WiFi details
					const details = {
						type: connection.type,
						downlink: connection.downlink, // Connection speed in Mbps
						rtt: connection.rtt, // Round trip time in ms
						effectiveType: connection.effectiveType // 4g, 3g etc
					};

					// Get network SSID if available and permitted
					if ('getNetworkInformation' in navigator) {
						try {
							const networkInfo = await navigator.getNetworkInformation();
							details.ssid = networkInfo.ssid || 'Connected'; // Use SSID if available, otherwise fallback
						} catch (e) {
							details.ssid = 'Connected'; // Fallback if SSID access denied
						}
					} else {
						details.ssid = 'Connected'; // Fallback if API not available
					}

					setWifiDetails(details);

					// Listen for connection changes
					connection.addEventListener('change', () => {
						setWifiDetails((prev) => ({
							...prev,
							type: connection.type,
							downlink: connection.downlink,
							rtt: connection.rtt,
							effectiveType: connection.effectiveType
						}));
					});
				}
			} catch (error) {
				console.error('Error getting network details:', error);
				setWifiDetails({
					type: 'unknown',
					downlink: 0,
					rtt: 0,
					effectiveType: 'unknown',
					ssid: 'Unknown Network'
				});
			}
		};

		getWifiDetails();
	}, []);

	const handleLogout = () => {
		// Implement logout logic
		console.log('Logging out...');
	};

	const clearCache = () => {
		// Implement cache clearing logic
		console.log('Clearing cache...');
	};

	const exportData = () => {
		// Export data to CSV
		const data = [
			'points,timestamp,hour,day_of_week,month,is_weekend,is_holiday,temperature,cloud_cover,solar_irradiance,humidity,precipitation_prob,wind_speed,solar_generation,panel_temp,system_efficiency,battery_level,consumption,grid_ie,peak_flag,electricity_rate',
			'1,2023-01-01 00:00:00,0,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'2,2023-01-01 01:00:00,1,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'3,2023-01-01 02:00:00,2,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'4,2023-01-01 03:00:00,3,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'5,2023-01-01 04:00:00,4,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'6,2023-01-01 05:00:00,5,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'7,2023-01-01 06:00:00,6,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'8,2023-01-01 07:00:00,7,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'9,2023-01-01 08:00:00,8,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'10,2023-01-01 09:00:00,9,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'11,2023-01-01 10:00:00,10,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'12,2023-01-01 11:00:00,11,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'13,2023-01-01 12:00:00,12,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'14,2023-01-01 13:00:00,13,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'15,2023-01-01 14:00:00,14,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'16,2023-01-01 15:00:00,15,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'17,2023-01-01 16:00:00,16,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'18,2023-01-01 17:00:00,17,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'19,2023-01-01 18:00:00,18,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5',
			'2,2023-01-01 01:00:00,1,2,1,0,0,20,0,0,60,0,5,0,20,90,60,3,0,0,8.5'
			// Add more data points here
		];
		const csv = data.join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
		saveAs(blob, 'solar_data.csv');
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

				{/* WiFi Analysis Card */}
				{wifiDetails && (
					<div className='px-4 mb-6'>
						<Card className='bg-blue-50 dark:bg-blue-900/20'>
							<CardContent className='p-4'>
								<div className='flex items-center justify-between mb-4'>
									<div className='flex items-center gap-2'>
										<Wifi className='w-5 h-5 text-blue-600 dark:text-blue-400' />
										<h3 className='font-semibold text-gray-900 dark:text-gray-100'>
											{wifiDetails.ssid || 'Connected'}
										</h3>
									</div>
									<div className='flex items-center gap-1'>
										<Signal className='w-4 h-4 text-blue-600 dark:text-blue-400' />
										<span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
											{wifiDetails.type}
										</span>
									</div>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-1'>
										<p className='text-sm text-gray-600 dark:text-gray-400'>
											Connection
										</p>
										<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
											{wifiDetails.effectiveType}
										</p>
									</div>
									<div className='space-y-1'>
										<p className='text-sm text-gray-600 dark:text-gray-400'>
											Speed
										</p>
										<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
											{wifiDetails.downlink} Mbps
										</p>
									</div>
									<div className='space-y-1'>
										<p className='text-sm text-gray-600 dark:text-gray-400'>
											Latency
										</p>
										<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
											{wifiDetails.rtt}ms
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
				<div className='px-4'>
					<Button
						variant='primary'
						className='w-full flex items-center gap-2'
						onClick={exportData}>
						<HardDrive className='w-4 h-4' />
						Export Data
					</Button>
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
						variant='primary'
						className='w-full flex items-center gap-2'
						onClick={exportData}>
						<HardDrive className='w-4 h-4' />
						Export Data
					</Button>
				</div>
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

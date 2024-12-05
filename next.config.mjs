import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
	dest: 'public'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com',
				pathname: '/**'
			}
		]
	}
};

export default withPWA(nextConfig);

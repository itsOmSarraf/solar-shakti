import { ImageResponse } from 'next/og'

// Configuration object for the image
const config = {
    runtime: 'edge',
    alt: 'Dynamic OpenGraph Image',
    size: {
        width: 1200,
        height: 630,
    },
    contentType: 'image/png',
    defaults: {
        title: 'Your App Name',
        subtitle: 'Your App Tagline',
        gradientStart: '#4CAF50',
        gradientEnd: '#45a049',
        titleSize: 60,
        subtitleSize: 36,
        padding: 40,
    }
}

export const runtime = config.runtime
export const alt = config.alt
export const size = config.size
export const contentType = config.contentType

interface ImageProps {
    title?: string
    subtitle?: string
    gradientStart?: string
    gradientEnd?: string
    titleSize?: number
    subtitleSize?: number
    padding?: number
}

export default async function Image({
    title = config.defaults.title,
    subtitle = config.defaults.subtitle,
    gradientStart = config.defaults.gradientStart,
    gradientEnd = config.defaults.gradientEnd,
    titleSize = config.defaults.titleSize,
    subtitleSize = config.defaults.subtitleSize,
    padding = config.defaults.padding,
}: ImageProps = {}) {
    return new ImageResponse(
        (
            <div
                style={{
                    background: `linear-gradient(to bottom right, ${gradientStart}, ${gradientEnd})`,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: `${padding}px`,
                }}
            >
                <div
                    style={{
                        fontSize: titleSize,
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: 20,
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: subtitleSize,
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    {subtitle}
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}

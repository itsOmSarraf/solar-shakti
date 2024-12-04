import { ImageResponse } from 'next/og'

// Configuration for the OpenGraph image
const OG_CONFIG = {
    APP_NAME: 'Your App Name',
    TAGLINE: 'Your App Tagline',
    COLORS: {
        gradientStart: '#000000', // Primary gradient color
        gradientEnd: '#111111',   // Secondary gradient color
        text: 'white',
    },
    FONTS: {
        title: 60,
        tagline: 36,
    },
}

export const runtime = 'edge'

export const alt = `${OG_CONFIG.APP_NAME} - ${OG_CONFIG.TAGLINE}`
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: `linear-gradient(to bottom right, ${OG_CONFIG.COLORS.gradientStart}, ${OG_CONFIG.COLORS.gradientEnd})`,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                }}
            >
                <div
                    style={{
                        fontSize: OG_CONFIG.FONTS.title,
                        fontWeight: 'bold',
                        color: OG_CONFIG.COLORS.text,
                        marginBottom: 20,
                    }}
                >
                    {OG_CONFIG.APP_NAME}
                </div>
                <div
                    style={{
                        fontSize: OG_CONFIG.FONTS.tagline,
                        color: OG_CONFIG.COLORS.text,
                        textAlign: 'center',
                    }}
                >
                    {OG_CONFIG.TAGLINE}
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
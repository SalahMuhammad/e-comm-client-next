import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Disable to prevent double effect invocation that breaks html5-qrcode
    turbopack: {
        resolveAlias: {
            underscore: 'lodash',
        },
        resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
};

export default withNextIntl(nextConfig);

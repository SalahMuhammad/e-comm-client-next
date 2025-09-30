import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        // Example: adding an alias and custom file extension
        resolveAlias: {
            underscore: 'lodash',
        },
        resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
    },
};
 
export default withNextIntl(nextConfig);

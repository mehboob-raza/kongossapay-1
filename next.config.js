const { withNetlify } = require('@netlify/next');

module.exports = withNetlify({
    reactStrictMode: true,
    experimental: {
        serverActions: true, // Enable if you're using server actions in Next.js 15
    },
});

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/assets/appointment' : './',
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                    @import "@/scss/variables.scss";
                    @import "@/scss/main.scss";
                `,
            },
        },
    },
    chainWebpack: (config) => {
        if (config.plugins.has('extract-css')) {
            const extractCSSPlugin = config.plugin('extract-css');
            extractCSSPlugin &&
                extractCSSPlugin.tap(() => [
                    {
                        filename: '[name].css',
                        chunkFilename: '[name].css',
                    },
                ]);
        }
    },
    configureWebpack: {
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js',
        },
    },
};

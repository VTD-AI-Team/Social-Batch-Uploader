module.exports = {
    apps: [{
        name: 'social-batch-uploader',
        script: 'node_modules/next/dist/bin/next',
        args: 'start -p 3000',
        instances: 1,
        exec_mode: 'fork',
        watch: false,
        max_memory_restart: '2G',
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_file: './logs/combined.log',
        time: true
    }]
};

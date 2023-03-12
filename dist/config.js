import * as dotenv from 'dotenv';
dotenv.config();
import convict from 'convict';
const config = convict({
    port: {
        doc: 'The port to server from',
        format: 'port',
        default: 9005,
        arg: 'port',
    },
    cnc: {
        userId: {
            doc: 'CNC user to use and return JWT for.',
            format: String,
            default: null,
            env: 'KALTURA_CNC_USER_ID', // set the user id by env var
        },
    },
    kalturaUrl: {
        doc: 'Kaltura URl',
        format: String,
        default: 'https://www.kaltura.com',
    },
    eventId: {
        doc: 'Kaltura Event Id',
        format: Number,
        default: null,
        env: 'KALTURA_EVENT_ID', // set kaltura event id by env var
    },
    partner: {
        id: {
            doc: 'Partner id',
            format: String,
            default: null,
            env: 'KALTURA_PARTNER_ID', // set partner id by env var
        },
        adminSecret: {
            doc: 'Admin secret',
            format: String,
            sensitive: true,
            default: null,
            env: 'KALTURA_ADMIN_SECRET', // set admin secret by env var
        },
        adminUserId: {
            doc: 'Admin user id',
            format: String,
            default: null,
            env: 'KALTURA_ADMIN_USER_ID', // set admin user id by env var
        },
    },
});
config.validate({ allowed: 'strict' });
export default config;

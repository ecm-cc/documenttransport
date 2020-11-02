const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const helpers = require('handlebars-helpers')(['comparison', 'object']);
const requestId = require('@ablegroup/requestid');
const tenant = require('@ablegroup/tenant')(process.env.systemBaseUri, process.env.SIGNATURE_SECRET);

const appName = 'able-documenttransport';
const basePath = `/${appName}`;
const assetBasePath = process.env.ASSET_BASE_PATH || `/${appName}/assets`;
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: `${__dirname}/views/`,
    partialsDir: `${__dirname}/views/partials/`,
    helpers: {
        helpers,
        timeStampToDate(timestamp) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat('de-DE', options).format(new Date(timestamp));
        },
    },
}));
app.set('view engine', 'hbs');

app.use(tenant);
app.use(requestId);
logger.token('tenantId', (req) => req.tenantId);
logger.token('requestId', (req) => req.requestId);

const rootRouter = require('./routes/root')(basePath);
const importRouter = require('./routes/import')(assetBasePath);
const exportRouter = require('./routes/export')(assetBasePath);
const setsRouter = require('./routes/sets')();
const configfeaturesRouter = require('./routes/configfeatures')(appName);

// eslint-disable-next-line max-len
app.use(logger('[ctx@49610 rid=":requestId" tn=":tenantId"][http@49610 method=":method" url=":url" millis=":response-time" sbytes=":res[content-length]" status=":status"] '));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(assetBasePath, express.static(path.join(__dirname, 'web')));
app.use(express.json({
    limit: '500mb',
}));

app.use(`${basePath}/`, rootRouter);
app.use(`${basePath}/import`, importRouter);
app.use(`${basePath}/export`, exportRouter);
app.use(`${basePath}/sets`, setsRouter);
app.use(`${basePath}/configfeatures`, configfeaturesRouter);

module.exports = app;

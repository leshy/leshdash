require! { lodash: { assign, defaultsDeep }: lodash }

export lodash <<< require('./lib') <<< require('./curried') <<< require('./promise') <<< { w: require './wrap' }

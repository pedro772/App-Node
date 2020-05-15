if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb://riohey:2WDBzOm53pdL7Ne3@cluster0-shard-00-00-vags6.mongodb.net:27017,cluster0-shard-00-01-vags6.mongodb.net:27017,cluster0-shard-00-02-vags6.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"};
} else {
    module.exports = {mongoURI: "mongodb://localhost/blog_app"};
}


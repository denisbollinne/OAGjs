define(['mongoose','init/redisFactory','resources/redisKeyBuilder'],function(mongoose,redisFactory,redisKeyBuilder){
/**
 * Created by JetBrains WebStorm.
 * User: Denis
 * Date: 1/04/12
 * Time: 11:12
 * To change this template use File | Settings | File Templates.
 */
    var staticClient = redisFactory().CreateClient();
    return {
          redisClient :staticClient,
         mongoose: mongoose,
         redisKeyBuilder :redisKeyBuilder
};
});
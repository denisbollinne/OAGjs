/**
 * Created with JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 8/07/12
 * Time: 17:56
 */
define('particleEffect',function(){
    return (function(x, y, z){

        var zindex = z;
        var that = this;

        var particleEffect = {
            draw : function(){},
            update : function(){},
            init : function(){}
        };

        this.getZIndex = function () {
            return z - 1;
        };

        this.update  = function(){
            if(isStarted){
                particleEffect.update(1);
            }
        };
        this.draw =  function(c){
            if(isStarted){
                particleEffect.render(c);
            }
        };

        this.start = function(){
            particleEffect.init();
            isStarted = true;
        };
        this.stop  = function(){
            isStarted = false;
        };

        var isStarted = false;

        var createHealAnimation = function(effect, x, y){
            effect.position = Vector.create( x, y );
            effect.positionRandom = Vector.create( 5, 5 );
            effect.size = 40;
            effect.sizeRandom = 5;
            effect.speed = 2;
            effect.speedRandom = 1.5;
            effect.lifeSpan = 7;
            effect.lifeSpanRandom = 10;
            effect.angle = 0;
            effect.angleRandom = 360;
            effect.gravity = Vector.create( -.1,-.1 );
            effect.startColour =       [ 0 , 0, 0,   1 ];
            effect.startColourRandom = [ 0, 0, 255, 0 ];
            effect.endColour =         [ 0, 0, 0,   0 ];
            effect.endColourRandom =   [ 255, 0, 255, 0 ];
            effect.sharpness = 40;
            effect.sharpnessRandom = 5;
            effect.duration = 15;
        };

        particleEffect = new cParticleSystem();
        createHealAnimation(particleEffect, x, y );
    });
});
